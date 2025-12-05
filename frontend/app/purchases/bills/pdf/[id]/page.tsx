"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { fetcher } from "@/lib/api";
import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
import JsBarcode from "jsbarcode";

// Safe number converter
const safe = (v: any) => Number(v ?? 0);

// Create base64 barcode
function generateBarcodeBase64(text: string) {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, text, { format: "CODE128", width: 1.2, height: 40 });
  return canvas.toDataURL("image/png");
}

// Dummy QR for UPI
const dummyQR =
  "https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=mandalcycle@upi";

export default function BillPDFPage() {
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (id) generatePDF();
  }, [id]);

  async function generatePDF() {
    try {
      const bill = await fetcher(`/api/purchases/${id}`);

      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();

      // HEADER
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("MANDAL CYCLE STORE", 14, 18);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Haldia, Purba Medinipur · West Bengal", 14, 26);
      doc.text("GSTIN: 19XXXXXXXXXX | +91 XXXXX XXXXX", 14, 31);

      // Highlight Box
      doc.setFillColor(255, 193, 7);
      doc.roundedRect(pageWidth - 70, 10, 60, 20, 3, 3, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.text("PURCHASE BILL", pageWidth - 63, 23);
      doc.setTextColor(0, 0, 0);

      // Barcode
      const barcodeBase64 = generateBarcodeBase64(bill.billNo);
      doc.addImage(barcodeBase64, "PNG", pageWidth - 65, 35, 55, 20);

      // Bill Info
      doc.setFontSize(11);
      doc.text(`Bill No: ${bill.billNo}`, 14, 46);
      doc.text(`Date: ${new Date(bill.createdAt).toLocaleString()}`, 14, 52);
      doc.text(`GRN Linked: ${bill.grn || "—"}`, 14, 58);

      // Supplier Box
      doc.setFont("helvetica", "bold");
      doc.text("Supplier Details", 14, 70);
      doc.roundedRect(14, 73, pageWidth - 28, 25, 3, 3);
      doc.setFont("helvetica", "normal");
      doc.text(bill.supplier?.name ?? "Supplier", 18, 85);

      // Items Table
      const tableBody: RowInput[] = bill.items.map((it: any) => [
        it.product?.name ?? "—",
        String(safe(it.quantity)),
        `₹${safe(it.rate).toFixed(2)}`,
        `${safe(it.tax)}%`,
        `₹${(safe(it.quantity) * safe(it.rate)).toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: 105,
        head: [["Product", "Qty", "Rate", "Tax%", "Total"]],
        body: tableBody,
        headStyles: { fillColor: [40, 40, 40], textColor: 255 },
        styles: { fontSize: 10 },
      });

      const endY = (doc as any).lastAutoTable.finalY;

      // TAX SPLIT (CGST/SGST)
      const gst = safe(bill.taxTotal);
      const halfGST = (gst / 2).toFixed(2);

      doc.setFont("helvetica", "bold");
      doc.text("Tax Summary", 14, endY + 12);
      doc.roundedRect(14, endY + 15, pageWidth - 28, 28, 3, 3);

      doc.setFont("helvetica", "normal");
      doc.text(`CGST (50%): ₹${halfGST}`, 18, endY + 25);
      doc.text(`SGST (50%): ₹${halfGST}`, 18, endY + 32);

      // Bill Summary
      const y2 = endY + 55;
      doc.setFont("helvetica", "bold");
      doc.text("Bill Summary", 14, y2);

      doc.roundedRect(14, y2 + 3, pageWidth - 28, 32, 3, 3);

      doc.setFont("helvetica", "normal");
      doc.text(`Subtotal: ₹${safe(bill.subtotal).toFixed(2)}`, 18, y2 + 15);
      doc.text(`Discount: ₹${safe(bill.discount).toFixed(2)}`, 18, y2 + 22);
      doc.text(`Total: ₹${safe(bill.totalAmount).toFixed(2)}`, 18, y2 + 29);

      doc.text(
        `Paid: ₹${safe(bill.paidAmount).toFixed(2)}`,
        pageWidth - 70,
        y2 + 15
      );
      doc.text(
        `Due: ₹${safe(bill.dueAmount).toFixed(2)}`,
        pageWidth - 70,
        y2 + 22
      );

      // QR Code (UPI)
      doc.addImage(dummyQR, "PNG", pageWidth - 55, y2 + 40, 40, 40);
      doc.text("Scan to Pay (UPI)", pageWidth - 55, y2 + 85);

      // Footer
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(
        "Thank you for doing business with Mandal Cycle Store",
        pageWidth / 2,
        290,
        { align: "center" }
      );

      // Open new tab
      const blob = doc.output("blob");
      window.open(URL.createObjectURL(blob), "_blank");
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF");
    }
  }

  return (
    <div className="p-6 text-center text-gray-500">
      Generating Premium Invoice PDF…
    </div>
  );
}
