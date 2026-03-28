import Gallery from "../../../models/galleryModel.js";
import cloudinary from "../../../utils/cloudinaryConfig.js";

const uploadGalleryController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "gallery",
      resource_type: "image",
    });

    const image = await Gallery.create({
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });

    res.status(201).json({
      success: true,
      message: "Gallery image uploaded successfully",
      image,
    });
  } catch (error) {
    console.error("Upload gallery error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload gallery image",
    });
  }
};

export default uploadGalleryController;
