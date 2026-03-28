import News from "../../../models/newsModel.js";
import cloudinary from "../../../utils/cloudinaryConfig.js";

const updateNewsController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, published } = req.body;

    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    let imageUrl = news.imageUrl;

    // 🔥 If new image uploaded → replace
    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "news_images",
        }
      );

      imageUrl = result.secure_url;
    }

    news.title = title ?? news.title;
    news.description = description ?? news.description;
    news.published = published ?? news.published;
    news.imageUrl = imageUrl;

    await news.save();

    res.status(200).json({
      success: true,
      message: "News updated successfully",
      news,
    });
  } catch (error) {
    console.error("Update news error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update news",
      error: error.message,
    });
  }
};

export default updateNewsController;
