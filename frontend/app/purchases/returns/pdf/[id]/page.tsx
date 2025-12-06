"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { fetcher } from "@/lib/api";
import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";

const safeNum = (v: any) => Number(v ?? 0);

async function fetchImageDataUrl(url: string): Promise<string | null> {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    const blob = await r.blob();
    return await new Promise((res) => {
      const fr = new FileReader();
      fr.onload = () => res(String(fr.result));
      fr.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn("Image fetch failed", err);
    return null;
  }
}

// barcode image via remote service
function barcodeUrlFor(text: string) {
  return `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(
    text
  )}&code=Code128&translate-esc=false`;
}

export default function ReturnPDFPage() {
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (id) generatePDF();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function generatePDF() {
    try {
      const ret: any = await fetcher(`/api/purchase-returns/${id}`);
      if (!ret) throw new Error("Return not found");

      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header (logo text)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("Mandal Cycle Store", 14, 18);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Haldia, Purba Medinipur · West Bengal", 14, 26);
      doc.text("GSTIN: 19XXXXXXXXXX | +91 XXXXX XXXXX", 14, 31);

      // right badge
      doc.setFillColor(255, 193, 7);
      doc.roundedRect(pageWidth - 72, 10, 64, 20, 3, 3, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.text("PURCHASE RETURN", pageWidth - 66, 24);
      doc.setTextColor(0, 0, 0);

      // Barcode (fetch and embed)
      const bcUrl = barcodeUrlFor(ret.returnNo || ret._id || "RTN");
      const bcDataUrl = await fetchImageDataUrl(bcUrl);
      if (bcDataUrl) doc.addImage(bcDataUrl, "PNG", pageWidth - 70, 34, 60, 18);

      // return info
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`Return No: ${ret.returnNo}`, 14, 46);
      doc.setFont("helvetica", "normal");
      doc.text(`Date: ${new Date(ret.createdAt).toLocaleString()}`, 14, 52);
      doc.text(`Linked Purchase: ${ret.purchase || "—"}`, 14, 58);

      // Supplier box
      doc.setFont("helvetica", "bold");
      doc.text("Supplier", 14, 70);
      doc.roundedRect(14, 73, pageWidth - 28, 25, 3, 3);
      doc.setFont("helvetica", "normal");
      doc.text(ret.supplier?.name || "—", 18, 85);

      // items table
      const items = (ret.items || []) as any[];
      const body: RowInput[] = items.map((it) => [
        it.product?.name || "—",
        String(safeNum(it.qty)),
        `₹${safeNum(it.rate).toFixed(2)}`,
        `${safeNum(it.tax)}%`,
        `₹${(safeNum(it.qty) * safeNum(it.rate)).toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: 100,
        head: [["Product", "Qty", "Rate", "Tax%", "Total"]],
        body,
        headStyles: { fillColor: [40, 40, 40], textColor: 255 },
        styles: { fontSize: 10 },
      });

      const lastTable: any = (doc as any).lastAutoTable;
      const endY = lastTable && lastTable.finalY ? lastTable.finalY : 120;

      // GST split (CGST + SGST)
      const totalAmount = safeNum(ret.totalAmount);
      const subtotal = items.reduce(
        (s, it) => s + safeNum(it.qty) * safeNum(it.rate),
        0
      );
      const gst = +(totalAmount - subtotal).toFixed(2);
      const cgst = +(gst / 2).toFixed(2);
      const sgst = +(gst / 2).toFixed(2);

      // summary box
      const sumY = endY + 12;
      doc.setFont("helvetica", "bold");
      doc.text("Return Summary", 14, sumY);
      doc.roundedRect(14, sumY + 3, pageWidth - 28, 40, 3, 3);

      doc.setFont("helvetica", "normal");
      doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 18, sumY + 14);
      doc.text(`CGST: ₹${cgst.toFixed(2)}`, 18, sumY + 20);
      doc.text(`SGST: ₹${sgst.toFixed(2)}`, 18, sumY + 26);

      doc.setFont("helvetica", "bold");
      doc.text(
        `Total Return: ₹${totalAmount.toFixed(2)}`,
        pageWidth - 70,
        sumY + 16
      );

      // footer
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(
        "Mandal Cycle Store — Quality cycles & spare parts",
        pageWidth / 2,
        288,
        { align: "center" }
      );
      doc.text("This is a system generated return note.", pageWidth / 2, 293, {
        align: "center",
      });

      // open PDF in new tab
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Failed to generate return PDF", err);
      alert("Failed to generate PDF");
    }
  }

  return (
    <div className="p-6 text-center text-gray-500">Generating Return PDF…</div>
  );
}
