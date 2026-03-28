import Certificate from "../../../models/certificateModel.js";
import cloudinary from "../../../utils/cloudinaryConfig.js";

const deleteCertificateController = async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    // 🔥 FIX: DO NOT use "auto"
    await cloudinary.uploader.destroy(certificate.publicId, {
      resource_type: "raw", // ✅ FIXED
    });

    await certificate.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Certificate deleted successfully",
    });

  } catch (error) {
    console.error("Delete certificate error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete certificate",
    });
  }
};

export default deleteCertificateController;
