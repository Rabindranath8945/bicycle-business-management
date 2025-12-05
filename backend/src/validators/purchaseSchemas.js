// src/validators/purchaseSchemas.js
import Joi from "joi";
import { Types } from "mongoose";

const objectId = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .message("Invalid ObjectId");

export const createPO = Joi.object({
  supplier: objectId.required(),
  items: Joi.array()
    .items(
      Joi.object({
        product: objectId.required(),
        productName: Joi.string().allow(""),
        qtyOrdered: Joi.number().min(0).required(),
        cost: Joi.number().min(0).required(),
        tax: Joi.number().min(0).default(0),
      })
    )
    .min(1)
    .required(),
  expectedDate: Joi.date().optional(),
  notes: Joi.string().allow("").optional(),
});

export const createGRN = Joi.object({
  purchaseOrder: objectId.optional().allow(null, ""),
  supplier: objectId.required(),
  items: Joi.array()
    .items(
      Joi.object({
        product: objectId.required(),
        receivedQty: Joi.number().min(1).required(),
        cost: Joi.number().min(0).required(),
        tax: Joi.number().min(0).default(0),
        batchNo: Joi.string().allow("").optional(),
        expiry: Joi.date().optional(),
      })
    )
    .min(1)
    .required(),
  notes: Joi.string().allow("").optional(),
});

export const createPurchase = Joi.object({
  supplier: objectId.required(),
  purchaseOrder: objectId.optional().allow(null, ""),
  grn: objectId.optional().allow(null, ""),
  items: Joi.array()
    .items(
      Joi.object({
        product: objectId.required(),
        productName: Joi.string().allow(""),
        quantity: Joi.number().min(1).required(),
        rate: Joi.number().min(0).required(),
        tax: Joi.number().min(0).default(0),
        batchNo: Joi.string().allow("").optional(),
        expiry: Joi.date().optional(),
      })
    )
    .min(1)
    .required(),
  paidAmount: Joi.number().min(0).default(0),
  discount: Joi.number().min(0).default(0),
  paymentType: Joi.string().valid("cash", "bank", "credit").default("cash"),
  notes: Joi.string().allow("").optional(),
});

export const createPurchaseReturn = Joi.object({
  supplier: objectId.required(),
  purchase: objectId.optional().allow(null, ""),
  items: Joi.array()
    .items(
      Joi.object({
        product: objectId.required(),
        qty: Joi.number().min(1).required(),
        rate: Joi.number().min(0).required(),
        tax: Joi.number().min(0).default(0),
      })
    )
    .min(1)
    .required(),
  reason: Joi.string().allow("").optional(),
});
