import Certificate from "../../../models/certificateModel.js";

const getCertificatesController = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};

    const certificates = await Certificate.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (error) {
    console.error("Get certificates error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch certificates",
    });
  }
};

export default getCertificatesController;
