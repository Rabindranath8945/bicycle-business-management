"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetcher } from "@/lib/api";
import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";

const safe = (v: any) => Number(v ?? 0);

export default function BillPDFPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const hasGenerated = useRef(false);
  const [error, setError] = useState<string | null>(null);

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

  const getQRCodeImg = async (text: string): Promise<string> => {
    try {
      return await QRCode.toDataURL(text, { margin: 1, width: 200 });
    } catch (err) {
      console.error("QR Error", err);
      return "";
    }
  };

  async function generatePDF() {
    try {
      const bill = await fetcher(`/api/purchases/${id}`);
      if (!bill) throw new Error("Bill data missing");

      const barcodeData = await getBarcodeImg(bill.billNo || "PENDING");
      const qrData = await getQRCodeImg(
        `upi://pay?pa=mandalcycle@upi&am=${safe(bill.totalAmount)}`
      );

      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();

      // --- 1. CORPORATE HEADER ---
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

      // --- 2. DOCUMENT LABEL ---
      doc.setFillColor(245, 158, 11);
      doc.roundedRect(pageWidth - 65, 12, 55, 12, 2, 2, "F");
      doc.setTextColor(30, 27, 75);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("PURCHASE BILL", pageWidth - 60, 20);

      // --- 3. BARCODE & INFO ---
      doc.setTextColor(0, 0, 0);
      doc.addImage(barcodeData, "PNG", pageWidth - 65, 45, 55, 12);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`Reference No: ${bill.billNo || "N/A"}`, 14, 52);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Date: ${
          bill.createdAt ? new Date(bill.createdAt).toLocaleString() : "N/A"
        }`,
        14,
        58
      );
      doc.text(`Linked GRN: ${bill.grn || "Direct Billing"}`, 14, 64);

      // --- 4. SUPPLIER BOX ---
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(14, 75, 90, 25, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.text("SUPPLIER (BILL FROM)", 18, 82);
      doc.setFont("helvetica", "normal");
      doc.text(bill.supplier?.name ?? "General Supplier", 18, 88);

      // --- 5. ITEMS TABLE ---
      const tableBody: RowInput[] = (bill.items || []).map((it: any) => [
        {
          content: it.product?.name ?? it.productName ?? "—",
          styles: { fontStyle: "bold" },
        },
        String(safe(it.quantity)),
        `₹${safe(it.rate).toLocaleString("en-IN")}`,
        `${safe(it.tax)}%`,
        `₹${(
          safe(it.quantity) *
          safe(it.rate) *
          (1 + safe(it.tax) / 100)
        ).toLocaleString("en-IN")}`,
      ]);

      autoTable(doc, {
        startY: 110,
        head: [["Item Description", "Qty", "Rate", "Tax", "Amount"]],
        body: tableBody,
        theme: "striped",
        headStyles: { fillColor: [30, 27, 75], textColor: 255 },
        styles: { fontSize: 9 },
      });

      const endY = (doc as any).lastAutoTable.finalY || 150;

      // --- 6. FINANCIAL SUMMARY GRID ---
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(pageWidth - 95, endY + 10, 85, 55, 2, 2, "F");

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text("Untaxed Subtotal:", pageWidth - 90, endY + 20);
      doc.text(
        `₹${safe(bill.subtotal).toLocaleString("en-IN")}`,
        pageWidth - 20,
        endY + 20,
        { align: "right" }
      );

      doc.text("Total GST (Combined):", pageWidth - 90, endY + 27);
      doc.text(
        `₹${safe(bill.taxTotal).toLocaleString("en-IN")}`,
        pageWidth - 20,
        endY + 27,
        { align: "right" }
      );

      doc.setDrawColor(229, 231, 235);
      doc.line(pageWidth - 90, endY + 32, pageWidth - 20, endY + 32);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("GRAND TOTAL:", pageWidth - 90, endY + 41);
      doc.text(
        `₹${safe(bill.totalAmount).toLocaleString("en-IN")}`,
        pageWidth - 20,
        endY + 41,
        { align: "right" }
      );

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(16, 185, 129);
      doc.text("Paid Amount:", pageWidth - 90, endY + 50);
      doc.text(
        `- ₹${safe(bill.paidAmount).toLocaleString("en-IN")}`,
        pageWidth - 20,
        endY + 50,
        { align: "right" }
      );

      doc.setTextColor(239, 68, 68);
      doc.text("Balance Due:", pageWidth - 90, endY + 57);
      doc.text(
        `₹${safe(bill.dueAmount).toLocaleString("en-IN")}`,
        pageWidth - 20,
        endY + 57,
        { align: "right" }
      );

      // --- 7. QR CODE & SIGNATURE ---
      doc.setTextColor(0, 0, 0);
      if (qrData) {
        doc.addImage(qrData, "PNG", 14, endY + 15, 35, 35);
        doc.setFontSize(8);
        doc.text("Digital Settlement QR (UPI)", 14, endY + 55);
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("Authorized Signatory", pageWidth - 50, endY + 85);
      doc.line(pageWidth - 60, endY + 80, pageWidth - 14, endY + 80);

      // --- 8. FOOTER ---
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        "Computer generated document. No signature required for validation.",
        pageWidth / 2,
        285,
        { align: "center" }
      );
      doc.text(
        "Generated via Mandal Cycle Enterprise ERP v2026",
        pageWidth / 2,
        290,
        { align: "center" }
      );

      const blobURL = doc.output("bloburl");
      window.location.replace(blobURL.toString());
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate PDF");
    }
  }

  if (error)
    return (
      <div className="p-10 text-center space-y-4 bg-gray-50 min-h-screen">
        <p className="text-rose-600 font-bold uppercase">Critical Error</p>
        <p className="text-sm text-gray-500">{error}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold"
        >
          GO BACK TO BILL
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-gray-50">
      {/* Navigation Header */}
      <div className="fixed top-0 left-0 right-0 p-4 flex justify-start">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-white border border-gray-200 text-indigo-900 rounded-md shadow-sm text-xs font-bold hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          ← GO BACK TO BILL
        </button>
      </div>

      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">
        Compiling Enterprise Invoice...
      </p>
    </div>
  );
}
