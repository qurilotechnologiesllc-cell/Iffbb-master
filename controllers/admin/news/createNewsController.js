import News from "../../../models/newsModel.js";
import { uploadBufferToCloudinary } from "../../../utils/cloudinaryConfig.js";

const createNewsController = async (req, res) => {
  try {
    const { title, description, published } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and description required" });
    }

    let imageUrl = "";

    // ✅ buffer se directly upload — base64 conversion hataya
    if (req.file) {
      const result = await uploadBufferToCloudinary(req.file.buffer, {
        folder: "news_images",
        resource_type: "image",
      });
      imageUrl = result.secure_url;
    }

    const news = await News.create({
      title,
      description,
      imageUrl,
      published: published ?? false,
    });

    return res.status(201).json({ success: true, message: "News created successfully", news });

  } catch (error) {
    console.error("Create news error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to create news", error: error.message });
  }
};

export default createNewsController;