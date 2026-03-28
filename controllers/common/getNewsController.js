import News from "../../models/newsModel.js";

const getNewsController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      News.find({ published: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      News.countDocuments({ published: true }),
    ]);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      count: news.length,
      data: news,
    });

  } catch (error) {
    console.error("Get news error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch news",
    });
  }
};

export default getNewsController;
