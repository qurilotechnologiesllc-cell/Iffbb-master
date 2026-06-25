import Certificate from "../../../models/certificateModel.js";
import { uploadBufferToCloudinary } from "../../../utils/cloudinaryConfig.js";

const uploadCertificateController = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ success: false, message: "Category is required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Certificate file is required" });
    }

    // ✅ buffer se upload — disk touch nahi hoga
    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: `certificates/${category}`,
      resource_type: "auto",
    });

    const certificate = await Certificate.create({
      category,
      fileUrl: result.secure_url,
      publicId: result.public_id,
    });

    return res.status(201).json({
      success: true,
      message: "Certificate uploaded successfully",
      certificate,
    });

  } catch (error) {
    console.error("Upload certificate error:", error);
    return res.status(500).json({ success: false, message: "Failed to upload certificate" });
  }
};

export default uploadCertificateController;