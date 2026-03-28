import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const News = mongoose.model("News", newsSchema);
export default News;
