import Affiliation from "../../../models/affiliationModel.js";
import cloudinary from "../../../utils/cloudinaryConfig.js"; // ✅ semicolon added

const uploadAffiliationController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "affiliations",
    });

    const affiliation = await Affiliation.create({
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });

    return res.status(201).json({
      message: "Affiliation image uploaded successfully",
      affiliation,
    });
  } catch (error) {
    console.error("Upload affiliation error:", error);
    return res
      .status(500)
      .json({ message: "Failed to upload affiliation image" });
  }
};

export default uploadAffiliationController;

