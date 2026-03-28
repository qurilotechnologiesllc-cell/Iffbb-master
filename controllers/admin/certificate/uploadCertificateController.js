import Certificate from "../../../models/certificateModel.js";
import cloudinary from "../../../utils/cloudinaryConfig.js";

const uploadCertificateController = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Certificate file is required",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `certificates/${category}`,
      resource_type: "auto",
    });

    const certificate = await Certificate.create({
      category,
      fileUrl: result.secure_url,
      publicId: result.public_id,
    });

    res.status(201).json({
      success: true,
      message: "Certificate uploaded successfully",
      certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upload certificate",
    });
  }
};


export default uploadCertificateController;
