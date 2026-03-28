import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'aud',
    },
    stripeSessionId: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'unpaid'],
      default: 'unpaid',
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Purchase = mongoose.model('Purchase', purchaseSchema);

export default Purchase;
