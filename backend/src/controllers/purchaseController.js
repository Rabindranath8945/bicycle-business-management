import Purchase from "../models/Purchase.js";
import Product from "../models/Product.js";
import Supplier from "../models/Supplier.js";

// 📦 Create new purchase
export const createPurchase = async (req, res, next) => {
  try {
    const { supplier, items, paymentType, notes } = req.body;

    if (!supplier || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid purchase data" });
    }

    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    // Create purchase record
    const purchase = await Purchase.create({
      supplier,
      items,
      totalAmount,
      paymentType,
      notes,
    });

    // Update product stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = (product.stock || 0) + item.quantity;
        product.purchasePrice = item.purchasePrice; // update last purchase price
        await product.save();
      }
    }

    res.status(201).json({
      success: true,
      message: "Purchase recorded successfully",
      purchase,
    });
  } catch (error) {
    next(error);
  }
};

// 📋 Get all purchases
export const getAllPurchases = async (req, res, next) => {
  try {
    const purchases = await Purchase.find()
      .populate("supplier", "name contact phone")
      .populate("items.product", "name productCode stock");
    res.json(purchases);
  } catch (error) {
    next(error);
  }
};

// 🧾 Get single purchase by ID
export const getPurchaseById = async (req, res, next) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("supplier", "name phone")
      .populate("items.product", "name stock productCode");

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.json(purchase);
  } catch (error) {
    next(error);
  }
};

// 🗑️ Delete a purchase
export const deletePurchase = async (req, res, next) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Roll back stock
    for (const item of purchase.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = Math.max(0, (product.stock || 0) - item.quantity);
        await product.save();
      }
    }

    await purchase.deleteOne();
    res.json({ success: true, message: "Purchase deleted successfully" });
  } catch (error) {
    next(error);
  }
};
