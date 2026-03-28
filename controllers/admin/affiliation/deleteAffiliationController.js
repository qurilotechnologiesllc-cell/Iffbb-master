import Affiliation from "../../../models/affiliationModel.js";
import cloudinary from "../../../utils/cloudinaryConfig.js";

const deleteAffiliationController = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find affiliation
    const affiliation = await Affiliation.findById(id);
    if (!affiliation) {
      return res.status(404).json({
        success: false,
        message: "Affiliation not found",
      });
    }

    // 2️⃣ Delete image from Cloudinary
    if (affiliation.publicId) {
      await cloudinary.uploader.destroy(affiliation.publicId);
    }

    // 3️⃣ Delete from DB
    await affiliation.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Affiliation deleted successfully",
    });

  } catch (error) {
    console.error("Delete affiliation error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete affiliation",
    });
  }
};

export default deleteAffiliationController;
