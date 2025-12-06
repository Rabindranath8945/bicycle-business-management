// /lib/pdf/billPdf.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

export type PdfTheme = "modern" | "blue" | "green";

export const BUSINESS = {
  name: "Mandal Cycle Store",
  address: "Tentulberia, Haldia, Purba Medinipur",
  phone: "9564751552 / 9547472839",
  email: "mandalcyclestore@gmail.com",
  gst: "19AAACH7409R1ZY",
};

function applyTheme(doc: jsPDF, theme: PdfTheme) {
  const palettes: Record<PdfTheme, { accent: string; heading: string }> = {
    modern: { accent: "#b8860b", heading: "#111827" },
    blue: { accent: "#0ea5e9", heading: "#0f172a" },
    green: { accent: "#16a34a", heading: "#0f172a" },
  };

  return palettes[theme] ?? palettes["modern"];
}

export async function generateBillPDFBuffer(
  bill: any,
  theme: PdfTheme = "modern"
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const palette = applyTheme(doc, theme);

  // ========== HEADER ==========
  doc.setFontSize(20);
  doc.setTextColor(palette.heading);
  doc.text(BUSINESS.name, 40, 45);

  doc.setFontSize(10);
  doc.setTextColor("#374151");
  doc.text(BUSINESS.address, 40, 65);
  doc.text(`Phone: ${BUSINESS.phone}`, 40, 80);
  doc.text(`Email: ${BUSINESS.email}`, 40, 95);
  doc.text(`GSTIN: ${BUSINESS.gst}`, 40, 110);

  // Bill meta (Right side)
  doc.setFontSize(11);
  doc.setTextColor("#111827");
  doc.text(`Bill No: ${bill.billNo ?? "-"}`, 420, 45);
  doc.text(
    `Date: ${bill.createdAt ? new Date(bill.createdAt).toLocaleString() : "-"}`,
    420,
    62
  );
  doc.text(`Supplier: ${bill.supplier?.name ?? "-"}`, 420, 80);

  // QR code for UPI
  try {
    const qr = await QRCode.toDataURL("upi://pay?pa=dummy@upi&pn=MandalCycle");
    doc.addImage(qr, "PNG", 420, 95, 110, 110);
  } catch {}

  // Bill No barcode fallback (text only, safe)
  doc.setFontSize(10);
  doc.text(`Bill#: ${bill.billNo}`, 40, 135);

  // ========== ITEMS TABLE ==========
  const rows =
    bill.items?.map((it: any, idx: number) => [
      String(idx + 1),
      it.product?.name ?? "-",
      it.product?.hsn ?? "",
      it.quantity ?? 0,
      (it.rate ?? 0).toFixed(2),
      `${it.tax ?? 0}%`,
      ((it.quantity ?? 0) * (it.rate ?? 0)).toFixed(2),
    ]) ?? [];

  autoTable(doc, {
    startY: 160,
    head: [["#", "Product", "HSN", "Qty", "Rate", "Tax", "Total"]],
    body: rows,
    styles: { fontSize: 10, cellPadding: 6 },
    headStyles: {
      fillColor:
        theme === "blue"
          ? "#E6F6FF"
          : theme === "green"
          ? "#ECFDF5"
          : "#FFF8E1",
      textColor: "#111",
      halign: "center",
    },
  });

  const finalY = (doc as any).lastAutoTable?.finalY ?? 260;

  // ========== TOTALS ==========
  const subtotal = Number(bill.subtotal ?? bill.totalAmount ?? 0);
  const tax = Number(bill.taxTotal ?? 0);
  const discount = Number(bill.discount ?? 0);
  const total = Number(bill.totalAmount ?? subtotal + tax - discount);
  const paid = Number(bill.paidAmount ?? 0);
  const due = total - paid;

  const halfGST = tax / 2;

  doc.setFontSize(11);
  doc.text(`CGST: ₹${halfGST.toFixed(2)}`, 40, finalY + 20);
  doc.text(`SGST: ₹${halfGST.toFixed(2)}`, 40, finalY + 35);

  doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 380, finalY + 20);
  doc.text(`Tax: ₹${tax.toFixed(2)}`, 380, finalY + 35);
  doc.text(`Discount: ₹${discount.toFixed(2)}`, 380, finalY + 50);

  doc.setFontSize(14);
  doc.text(`Grand Total: ₹${total.toFixed(2)}`, 380, finalY + 75);

  doc.setFontSize(11);
  doc.text(`Paid: ₹${paid.toFixed(2)}`, 380, finalY + 95);
  doc.text(`Due: ₹${due.toFixed(2)}`, 380, finalY + 110);

  // FOOTER
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(10);
  doc.text("Thank you for your business!", 40, pageHeight - 50);
  doc.text(
    "For help: mandalcyclestore@gmail.com | 9564751552",
    40,
    pageHeight - 35
  );

  return doc.output("arraybuffer");
}
