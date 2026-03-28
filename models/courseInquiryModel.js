import mongoose from "mongoose";

const courseInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    termsAccepted: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "read", "resolved"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CourseInquiry", courseInquirySchema);
