
import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // Expected amount at checkout creation; confirmed amount
    // will be updated after payment verification.
    amountPaid: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      lowercase: true,
      default: "aud",
    },

    // Stripe fields saved when Checkout Session is created.
    stripeSessionId: {
      type: String,
      required: true,
      unique: true,
    },

    customerDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    paymentMethodTypes: {
      type: [String],
      default: [],
    },

    paymentStatus: {
      type: String,
      default: "unpaid",
      index: true,
    },

    checkoutStatus: {
      type: String,
      default: "open",
      index: true,
    },

    // Complete Stripe response saved after payment processing.
    stripeResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // Existing enrollment tracking.
    enrollmentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    confirmationEmailSent: {
      type: Boolean,
      default: false,
    },

    purchasedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;
