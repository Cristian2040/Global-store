const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    country: String,
    state: String,
    municipality: String,
    neighborhood: String,
    street: String,
    number: String,
    notes: String,
  },
  { _id: false }
);

const customerOrderItemSchema = new mongoose.Schema(
  {
    // Producto específico de la tienda (precio/stock de la tienda)
    storeProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StoreProduct",
      required: true,
      index: true,
    },

    // referencia opcional al producto base (para reporting)
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      index: true,
    },

    // snapshots (muy recomendado)
    nameSnapshot: { type: String, trim: true },
    unitSnapshot: { type: String, trim: true },
    companySnapshot: { type: String, trim: true },
    categorySnapshot: { type: String, trim: true },

    quantity: { type: Number, required: true, min: 1 },

    // precio FINAL de la tienda al momento de compra (centavos)
    unitPriceCents: { type: Number, required: true, min: 0 },
    subtotalCents: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const customerOrderSchema = new mongoose.Schema(
  {
    // quién compra
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // a qué tienda compra
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },

    tenantId: { type: String, index: true },

    folio: { type: String, unique: true, sparse: true, trim: true },

    status: {
      type: String,
      enum: [
        "CREADA",
        "PENDIENTE_PAGO",
        "PAGADA",
        "EN_PREPARACION",
        "LISTA_PARA_RECOGER",
        "EN_CAMINO",
        "ENTREGADA",
        "CANCELADA",
        "REEMBOLSADA",
      ],
      default: "CREADA",
      index: true,
    },

    items: {
      type: [customerOrderItemSchema],
      validate: [
        (arr) => Array.isArray(arr) && arr.length > 0,
        "El pedido debe tener al menos un producto",
      ],
    },

    totals: {
      subtotalCents: { type: Number, required: true, min: 0 },
      taxCents: { type: Number, default: 0, min: 0 },
      deliveryFeeCents: { type: Number, default: 0, min: 0 },
      discountCents: { type: Number, default: 0, min: 0 },
      totalCents: { type: Number, required: true, min: 0 },
    },

    fulfillment: {
      type: {
        type: String,
        enum: ["PICKUP", "DELIVERY"],
        default: "PICKUP",
      },

      address: addressSchema, // solo si DELIVERY
      requestedTime: { type: Date },
      estimatedTime: { type: Date },
      deliveredAt: { type: Date },
      notes: { type: String, trim: true },
    },

    payment: {
      method: {
        type: String,
        enum: ["CASH", "CARD", "TRANSFER", "OTHER"],
        default: "CASH",
      },
      status: {
        type: String,
        enum: ["UNPAID", "PAID", "FAILED", "REFUNDED"],
        default: "UNPAID",
      },
      reference: { type: String, trim: true },
      paidAt: { type: Date },
    },

    notes: { type: String, trim: true },

    history: [
      {
        status: { type: String, required: true },
        at: { type: Date, default: Date.now },
        byUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reason: { type: String, trim: true },
      },
    ],
  },
  { timestamps: true }
);

customerOrderSchema.index({ customerId: 1, createdAt: -1 });
customerOrderSchema.index({ storeId: 1, createdAt: -1 });
customerOrderSchema.index({ tenantId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("CustomerOrder", customerOrderSchema);
