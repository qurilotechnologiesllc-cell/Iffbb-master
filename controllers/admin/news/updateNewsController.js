import News from "../../../models/newsModel.js";
import cloudinary, { uploadBufferToCloudinary } from "../../../utils/cloudinaryConfig.js";

const extractPublicId = (url, resourceType = 'image') => {
  try {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return null;
    let publicId = url.substring(uploadIndex + 8);
    publicId = publicId.replace(/^v\d+\//, '');
    if (resourceType !== 'raw') {
      publicId = publicId.replace(/\.[^/.]+$/, '');
    }
    return publicId;
  } catch {
    return null;
  }
};

const updateNewsController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, published } = req.body;

    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ success: false, message: "News not found" });
    }

    // ✅ New image aaya — purani delete karo, nayi upload karo
    if (req.file) {
      if (news.imageUrl && news.imageUrl.includes('res.cloudinary.com')) {
        const publicId = extractPublicId(news.imageUrl, 'image');
        if (publicId) {
          await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
        }
      }

      const result = await uploadBufferToCloudinary(req.file.buffer, {
        folder: "news_images",
        resource_type: "image",
      });

      news.imageUrl = result.secure_url;
    }

    news.title = title ?? news.title;
    news.description = description ?? news.description;
    news.published = published ?? news.published;

    await news.save();

    return res.status(200).json({ success: true, message: "News updated successfully", news });

  } catch (error) {
    console.error("Update news error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to update news", error: error.message });
  }
};

export default updateNewsController;