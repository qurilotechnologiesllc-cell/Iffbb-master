import Gallery from "../../../models/galleryModel.js";
import cloudinary from "../../../utils/cloudinaryConfig.js";

const deleteGalleryController = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Gallery.findById(id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found",
      });
    }

    await cloudinary.uploader.destroy(image.publicId);
    await image.deleteOne();

    res.status(200).json({
      success: true,
      message: "Gallery image deleted successfully",
    });
  } catch (error) {
    console.error("Delete gallery error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete gallery image",
    });
  }
};

export default deleteGalleryController;
