import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["Trainer","Advance","Master"],
    },
    fileUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", certificateSchema);
