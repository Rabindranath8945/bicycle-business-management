// src/utils/inventory.js
import Product from "../models/Product.js";

/**
 * Add received quantity as a batch (FIFO)
 * grnItem = { product, receivedQty, cost, batchNo, expiry, supplierId }
 */
async function addBatch(prod, grnItem) {
  prod.batches = prod.batches || [];

  const batch = {
    batchNo: grnItem.batchNo || `B-${Date.now()}`,
    qty: grnItem.receivedQty || 0,
    cost: grnItem.cost || prod.costPrice || 0,
    expiry: grnItem.expiry || null,
    receivedAt: new Date(),
    supplierId: grnItem.supplierId || null,
  };

  prod.batches.push(batch);
  prod.stock = (prod.stock || 0) + batch.qty;

  // Weighted average cost
  const totalQty = prod.batches.reduce((s, b) => s + (b.qty || 0), 0);
  const totalValue = prod.batches.reduce(
    (s, b) => s + (b.qty || 0) * (b.cost || 0),
    0
  );

  if (totalQty > 0) {
    prod.costPrice = totalValue / totalQty;
  }
}

/**
 * NON-SESSION VERSION (Simple)
 */
export async function addBatchToProduct(grnItem) {
  const prod = await Product.findById(grnItem.product);

  if (!prod) throw new Error("Product not found: " + grnItem.product);

  await addBatch(prod, grnItem);
  await prod.save();

  return prod;
}

/**
 * SESSION VERSION (Used in transactional GRN)
 */
export async function addBatchToProductWithSession(grnItem, session = null) {
  const prod = await Product.findById(grnItem.product).session(session);

  if (!prod) throw new Error("Product not found: " + grnItem.product);

  await addBatch(prod, grnItem);
  await prod.save({ session });

  return prod;
}

/**
 * FIFO Stock Consumption (no session)
 */
export async function consumeStockFIFO(productId, qtyToConsume) {
  const prod = await Product.findById(productId);
  if (!prod) throw new Error("Product not found: " + productId);

  return await consumeFIFO(prod, qtyToConsume, null);
}

/**
 * FIFO Stock Consumption (with session)
 */
export async function consumeStockFIFOWithSession(
  productId,
  qtyToConsume,
  session = null
) {
  const prod = await Product.findById(productId).session(session);
  if (!prod) throw new Error("Product not found: " + productId);

  return await consumeFIFO(prod, qtyToConsume, session);
}

/**
 * Internal FIFO function
 */
async function consumeFIFO(prod, qtyToConsume, session = null) {
  prod.batches = prod.batches || [];

  let remaining = qtyToConsume;
  const consumed = [];

  // FIFO → oldest first
  prod.batches.sort((a, b) => new Date(a.receivedAt) - new Date(b.receivedAt));

  for (let batch of prod.batches) {
    if (remaining <= 0) break;

    const take = Math.min(batch.qty, remaining);
    if (take <= 0) continue;

    batch.qty -= take;
    consumed.push({
      batchNo: batch.batchNo,
      consumedQty: take,
      cost: batch.cost,
    });

    remaining -= take;
  }

  // Remove empty batches
  prod.batches = prod.batches.filter((b) => b.qty > 0);

  const used = qtyToConsume - remaining;
  prod.stock = Math.max(0, (prod.stock || 0) - used);

  await prod.save({ session });

  return consumed;
}

/**
 * Stock Valuation = Σ (batch.qty × batch.cost)
 */
export async function calculateStockValuation(productId) {
  const prod = await Product.findById(productId);
  if (!prod) return 0;

  return (prod.batches || []).reduce((s, b) => s + b.qty * b.cost, 0);
}
