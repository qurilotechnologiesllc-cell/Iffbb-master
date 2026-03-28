import Affiliation from "../../../models/affiliationModel.js";

const getAffiliationsController = async (req, res) => {
  try {
    const affiliations = await Affiliation.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: affiliations.length,
      data: affiliations,
    });
  } catch (error) {
    console.error("Get affiliations error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch affiliations" });
  }
};

export default getAffiliationsController;
