"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetcher } from "@/lib/api";
import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
import JsBarcode from "jsbarcode";

const safeNum = (v: any) => Number(v ?? 0);

export default function ReturnPDFPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const hasGenerated = useRef(false);

  useEffect(() => {
    if (id && !hasGenerated.current) {
      hasGenerated.current = true;
      generatePDF();
    }
  }, [id]);

  const getBarcodeImg = (text: string): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, text, {
        format: "CODE128",
        width: 1.5,
        height: 40,
        displayValue: false,
        lineColor: "#1e1b4b",
      });
      resolve(canvas.toDataURL("image/png"));
    });
  };

  async function generatePDF() {
    try {
      const ret: any = await fetcher(`/api/purchase-returns/${id}`);
      if (!ret) throw new Error("Return data missing");

      const barcodeData = await getBarcodeImg(ret.returnNo || "RTN-PENDING");
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();

      // --- 1. CORPORATE HEADER (Indigo Theme) ---
      doc.setFillColor(30, 27, 75);
      doc.rect(0, 0, pageWidth, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("MANDAL CYCLE STORE", 14, 18);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Haldia, Purba Medinipur, West Bengal - 721607", 14, 25);
      doc.text("GSTIN: 19XXXXXXXXXX | contact@mandalcycle.com", 14, 30);

      // --- 2. DOCUMENT LABEL (Amber Theme) ---
      doc.setFillColor(245, 158, 11);
      doc.roundedRect(pageWidth - 70, 12, 60, 12, 2, 2, "F");
      doc.setTextColor(30, 27, 75);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("PURCHASE RETURN", pageWidth - 65, 20);

      // --- 3. BARCODE & REFERENCE ---
      doc.setTextColor(0, 0, 0);
      doc.addImage(barcodeData, "PNG", pageWidth - 65, 45, 55, 12);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`Return No: ${ret.returnNo || "N/A"}`, 14, 52);
      doc.setFont("helvetica", "normal");
      doc.text(`Date: ${new Date(ret.createdAt).toLocaleString()}`, 14, 58);
      doc.text(`Linked Bill: ${ret.purchase || "Direct Return"}`, 14, 64);

      // --- 4. SUPPLIER BOX ---
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(14, 75, 90, 25, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.text("RETURN TO (SUPPLIER)", 18, 82);
      doc.setFont("helvetica", "normal");
      doc.text(ret.supplier?.name || "General Supplier", 18, 88);

      // --- 5. ITEMS TABLE ---
      const items = (ret.items || []) as any[];
      const tableBody: RowInput[] = items.map((it) => [
        {
          content: it.product?.name || "—",
          styles: { fontStyle: "bold" },
        },
        String(safeNum(it.qty)),
        `₹${safeNum(it.rate).toLocaleString("en-IN")}`,
        `${safeNum(it.tax)}%`,
        `₹${(
          safeNum(it.qty) *
          safeNum(it.rate) *
          (1 + safeNum(it.tax) / 100)
        ).toLocaleString("en-IN")}`,
      ]);

      autoTable(doc, {
        startY: 110,
        head: [["Description", "Qty", "Rate", "Tax", "Amount"]],
        body: tableBody,
        theme: "striped",
        headStyles: { fillColor: [30, 27, 75], textColor: 255 },
        styles: { fontSize: 9 },
      });

      const endY = (doc as any).lastAutoTable.finalY || 150;

      // --- 6. FINANCIAL CALCULATIONS ---
      const totalAmount = safeNum(ret.totalAmount);
      const subtotal = items.reduce(
        (s, it) => s + safeNum(it.qty) * safeNum(it.rate),
        0
      );
      const taxTotal = totalAmount - subtotal;

      // Summary Box
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(pageWidth - 95, endY + 10, 85, 45, 2, 2, "F");

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Untaxed Subtotal:", pageWidth - 90, endY + 20);
      doc.text(
        `₹${subtotal.toLocaleString("en-IN")}`,
        pageWidth - 20,
        endY + 20,
        { align: "right" }
      );

      doc.text("CGST (9%):", pageWidth - 90, endY + 27);
      doc.text(
        `₹${(taxTotal / 2).toLocaleString("en-IN")}`,
        pageWidth - 20,
        endY + 27,
        { align: "right" }
      );

      doc.text("SGST (9%):", pageWidth - 90, endY + 34);
      doc.text(
        `₹${(taxTotal / 2).toLocaleString("en-IN")}`,
        pageWidth - 20,
        endY + 34,
        { align: "right" }
      );

      doc.setDrawColor(229, 231, 235);
      doc.line(pageWidth - 90, endY + 38, pageWidth - 20, endY + 38);

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("NET RETURN VALUE:", pageWidth - 90, endY + 46);
      doc.text(
        `₹${totalAmount.toLocaleString("en-IN")}`,
        pageWidth - 20,
        endY + 46,
        { align: "right" }
      );

      // --- 7. FOOTER ---
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        "Mandal Cycle Enterprise ERP v2026 — Official Return Document",
        pageWidth / 2,
        285,
        { align: "center" }
      );
      doc.text(
        "This is a computer generated debit note. No physical signature required.",
        pageWidth / 2,
        290,
        { align: "center" }
      );

      // Render PDF in same tab
      const blobURL = doc.output("bloburl");
      window.location.replace(blobURL.toString());
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-gray-50">
      <div className="fixed top-0 left-0 right-0 p-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-white border border-gray-200 text-indigo-900 rounded-md shadow-sm text-xs font-bold hover:bg-gray-50 flex items-center gap-2"
        >
          ← EXIT TO LIST
        </button>
      </div>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">
        Generating Debit Note 2026...
      </p>
    </div>
  );
}
