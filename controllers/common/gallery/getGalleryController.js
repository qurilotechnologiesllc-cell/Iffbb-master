import Gallery from "../../../models/galleryModel.js";

const getGalleryController = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      images,
    });
  } catch (error) {
    console.error("Get gallery error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch gallery images",
    });
  }
};

export default getGalleryController;
