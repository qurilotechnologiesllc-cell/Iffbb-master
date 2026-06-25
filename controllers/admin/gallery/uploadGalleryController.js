import Gallery from "../../../models/galleryModel.js";
import { uploadBufferToCloudinary } from "../../../utils/cloudinaryConfig.js";

const uploadGalleryController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    // ✅ buffer se upload
    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "gallery",
      resource_type: "image",
    });

    const image = await Gallery.create({
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });

    return res.status(201).json({ success: true, message: "Gallery image uploaded successfully", image });

  } catch (error) {
    console.error("Upload gallery error:", error);
    return res.status(500).json({ success: false, message: "Failed to upload gallery image" });
  }
};

export default uploadGalleryController;