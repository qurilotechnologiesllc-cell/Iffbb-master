import News from "../../../models/newsModel.js";
import cloudinary from "../../../utils/cloudinaryConfig.js";

const createNewsController = async (req, res) => {
  try {
    const { title, description, published } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description required",
      });
    }

    let imageUrl = "";

    // 🔥 Upload image to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "news_images",
        }
      );

      imageUrl = result.secure_url;
    }

    const news = await News.create({
      title,
      description,
      imageUrl,
      published: published ?? false,
    });

    res.status(201).json({
      success: true,
      message: "News created successfully",
      news,
    });
  } catch (error) {
    console.error("Create news error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create news",
      error: error.message,
    });
  }
};

export default createNewsController;
