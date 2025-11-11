import PDFDocument from "pdfkit";

export const generatePdfReport = (data, res) => {
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  doc.pipe(res);

  doc.fontSize(16).text("Business Report", { align: "center" });
  doc.moveDown();

  data.forEach((item) => {
    doc.fontSize(12).text(JSON.stringify(item));
    doc.moveDown();
  });

  doc.end();
};
