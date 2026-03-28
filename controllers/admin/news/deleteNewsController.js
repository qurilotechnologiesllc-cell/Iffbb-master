import News from "../../../models/newsModel.js";

const deleteNewsController = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByIdAndDelete(id);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    console.error("Delete news error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete news",
      error: error.message,
    });
  }
};

export default deleteNewsController;
