import mongoose, { Schema } from "mongoose";

const AdminSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    image: {
      type: String, // Cloudinary image URL
      default: null,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;
