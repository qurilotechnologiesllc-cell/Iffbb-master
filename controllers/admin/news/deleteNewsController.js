import News from "../../../models/newsModel.js";
import cloudinary from "../../../utils/cloudinaryConfig.js";

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

const deleteNewsController = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ success: false, message: "News not found" });
    }

    // ✅ Pehle Cloudinary se delete karo
    if (news.imageUrl && news.imageUrl.includes('res.cloudinary.com')) {
      const publicId = extractPublicId(news.imageUrl, 'image');
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
      }
    }

    // ✅ Phir DB se delete karo
    await news.deleteOne();

    return res.status(200).json({ success: true, message: "News deleted successfully" });

  } catch (error) {
    console.error("Delete news error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to delete news", error: error.message });
  }
};

export default deleteNewsController;