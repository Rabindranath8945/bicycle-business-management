import Sale from "../models/Sale.js";
import PDFDocument from "pdfkit";
import streamBuffers from "stream-buffers";

/**
 * CREATE SALE
 * POST /api/sales
 */
export const createSale = async (req, res) => {
  try {
    const saleData = req.body;

    const sale = await Sale.create(saleData);

    res.status(201).json({
      message: "Sale created successfully",
      sale,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET SINGLE SALE
 * GET /api/sales/:id
 */
export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await Sale.findById(id).populate("items.productId").lean();

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET ALL SALES
 * GET /api/sales
 */
export const listSales = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const sales = await Sale.find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GENERATE INVOICE PDF
 */
export const generateInvoicePDF = (sale) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const bufferStream = new streamBuffers.WritableStreamBuffer();

      doc.pipe(bufferStream);

      doc.fontSize(16).text("INVOICE", { align: "center" });
      doc.moveDown();

      doc.fontSize(10).text(`Invoice No: ${sale.invoiceNo}`);
      doc.text(`Date: ${new Date(sale.createdAt).toLocaleString()}`);
      doc.text(`Customer: ${sale.customerName || "N/A"}`);
      doc.text(`Phone: ${sale.phone || "N/A"}`);
      doc.moveDown();

      // Table Header
      doc.fontSize(10);
      doc.text("Item", 40, doc.y, { continued: true });
      doc.text("Qty", 200, doc.y, {
        width: 60,
        align: "right",
        continued: true,
      });
      doc.text("Price", 270, doc.y, {
        width: 60,
        align: "right",
        continued: true,
      });
      doc.text("Tax", 340, doc.y, {
        width: 60,
        align: "right",
        continued: true,
      });
      doc.text("Total", 410, doc.y, { width: 60, align: "right" });
      doc.moveDown(0.5);

      sale.items.forEach((item) => {
        doc.text(item.name, 40, doc.y, { continued: true });
        doc.text(String(item.qty), 200, doc.y, {
          width: 60,
          align: "right",
          continued: true,
        });
        doc.text(item.unitPrice.toFixed(2), 270, doc.y, {
          width: 60,
          align: "right",
          continued: true,
        });
        doc.text(item.taxAmount.toFixed(2), 340, doc.y, {
          width: 60,
          align: "right",
          continued: true,
        });
        doc.text(item.total.toFixed(2), 410, doc.y, {
          width: 60,
          align: "right",
        });
        doc.moveDown(0.4);
      });

      doc.moveDown();
      doc.text(`Subtotal: ₹${sale.subtotal.toFixed(2)}`, { align: "right" });
      doc.text(`Discount: ₹${sale.discount.toFixed(2)}`, { align: "right" });
      doc.text(`Tax: ₹${sale.tax.toFixed(2)}`, { align: "right" });
      doc.fontSize(12).text(`Grand Total: ₹${sale.grandTotal.toFixed(2)}`, {
        align: "right",
      });

      doc.end();

      bufferStream.on("finish", () => {
        resolve(bufferStream.getContents());
      });

      bufferStream.on("error", (err) => reject(err));
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * DOWNLOAD PDF
 * GET /api/sales/:id/pdf
 */
export const downloadInvoicePDF = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).lean();

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const pdfBuffer = await generateInvoicePDF(sale);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice-${sale._id}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
