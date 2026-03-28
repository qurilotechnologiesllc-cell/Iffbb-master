import mongoose from "mongoose";

const affiliationSchema = new mongoose.Schema(
  {
    imageUrl: String,
    publicId: String,
  },
  { timestamps: true }
);

const Affiliation = mongoose.model(
  "Affiliation",
  affiliationSchema
);

export default Affiliation; // ✅ DEFAULT EXPORT
