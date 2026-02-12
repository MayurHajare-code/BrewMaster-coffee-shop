import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        _id: String,
        name: { type: String, required: true },
        price: Number,
        quantity: Number,
        image: String,
      },
    ],

    pricing: {
      subtotal: Number,
      tax: Number,
      total: Number,
    },

    customer: {
      name: String,
      phone: String,
      address: String,
    },

    deliveryDate: String,

    payment: {
      method: {
        type: String,
        enum: ["cod", "online"],
        default: "cod",
      },
      status: {
        type: String,
        enum: ["pending", "paid", "cancelled", "delivered"],
        default: "pending",
      },
    },

    cancelledBy: {
      type: String,
      enum: ["user", "admin"],
    },

    cancelledAt: Date,

    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
