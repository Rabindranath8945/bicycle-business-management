import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import PDFDocument from "pdfkit";
import streamBuffers from "stream-buffers";

// ================================
// Generate Next Invoice Number
// ================================
export const generateInvoiceNo = async () => {
  const last = await Sale.findOne().sort({ createdAt: -1 });

  if (!last || !last.invoiceNo) {
    return "INV-0001";
  }

  const match = last.invoiceNo.match(/(\d+)$/);
  const next = match
    ? String(Number(match[1]) + 1).padStart(4, "0")
    : Date.now();

  return `INV-${next}`;
};

// ================================
// Create PDF (Base64)
// ================================
const createInvoicePDF = (sale) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 });
      const buffer = new streamBuffers.WritableStreamBuffer();

      doc.pipe(buffer);

      // Header
      doc.fontSize(18).text("INVOICE", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Invoice: ${sale.invoiceNo}`);
      doc.text(`Date: ${new Date(sale.createdAt).toLocaleString()}`);
      if (sale.customerName) doc.text(`Customer: ${sale.customerName}`);
      if (sale.phone) doc.text(`Phone: ${sale.phone}`);
      doc.moveDown();

      // Table Header
      doc.fontSize(10).text("Item", 40, doc.y, { continued: true });
      doc.text("Qty", 220, doc.y, { continued: true });
      doc.text("Price", 260, doc.y, { continued: true });
      doc.text("Tax", 320, doc.y, { continued: true });
      doc.text("Total", 380, doc.y);
      doc.moveDown(0.5);

      // Items
      sale.items.forEach((item) => {
        doc.text(item.name, 40, doc.y, { continued: true });
        doc.text(String(item.qty), 220, doc.y, { continued: true });
        doc.text(item.unitPrice.toFixed(2), 260, doc.y, { continued: true });
        doc.text(item.taxAmount.toFixed(2), 320, doc.y, { continued: true });
        doc.text(item.total.toFixed(2), 380, doc.y);
        doc.moveDown(0.3);
      });

      doc.moveDown();
      doc.text(`Subtotal: ₹${sale.subtotal}`, { align: "right" });
      doc.text(`Discount: ₹${sale.discount}`, { align: "right" });
      doc.text(`Tax: ₹${sale.tax}`, { align: "right" });
      doc
        .fontSize(13)
        .text(`Grand Total: ₹${sale.grandTotal}`, { align: "right" });

      doc.end();

      buffer.on("finish", () => {
        const pdfBytes = buffer.getContents();
        resolve(pdfBytes.toString("base64"));
      });
    } catch (error) {
      reject(error);
    }
  });
};

// ================================
// Create New Sale
// ================================
export const createSale = async (req, res) => {
  try {
    const { customerName, phone, discount, paymentMode, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let subtotal = 0;
    let totalTax = 0;

    const finalItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error("Product not found");

        const qty = Number(item.qty || 1);
        const unitPrice = Number(product.salePrice);
        const taxPercent = Number(product.taxPercent || 0);

        const lineSubtotal = qty * unitPrice;
        const taxAmount = (lineSubtotal * taxPercent) / 100;

        subtotal += lineSubtotal;
        totalTax += taxAmount;

        return {
          productId: product._id,
          name: product.name,
          hsn: product.hsn || "",
          qty,
          unitPrice,
          taxPercent,
          taxAmount,
          total: lineSubtotal + taxAmount,
        };
      })
    );

    const grandTotal = subtotal + totalTax - Number(discount || 0);
    const invoiceNo = await generateInvoiceNo();

    // SAVE SALE
    const newSale = await Sale.create({
      invoiceNo,
      customerName,
      phone,
      items: finalItems,
      subtotal: subtotal.toFixed(2),
      discount: Number(discount || 0),
      tax: totalTax.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      paymentMode: paymentMode || "Cash",
    });

    // STOCK UPDATE
    await Promise.all(
      finalItems.map(async (item) => {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.qty },
        });
      })
    );

    // ⭐ CUSTOMER AUTO SAVE + SALES HISTORY
    if (phone) {
      let customer = await Customer.findOne({ phone });

      if (!customer) {
        customer = await Customer.create({
          name: customerName || "Walk-in Customer",
          phone,
          sales: [],
        });
      }

      customer.sales.push(newSale._id);
      await customer.save();
    }

    const pdfBase64 = await createInvoicePDF(newSale);

    res.status(201).json({
      message: "Sale completed successfully",
      sale: newSale,
      pdfBase64,
    });
  } catch (error) {
    console.error("Create sale error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================================
// Get Single Sale
// ================================
export const getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================================
// List All Sales
// ================================
export const listSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================================
// Get By Barcode
// ================================

export const getByBarcode = async (req, res) => {
  try {
    const p = await Product.findOne({ barcode: req.params.code });
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json(p);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};
