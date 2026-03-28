import Course from '../../../models/courseModel.js';
import Purchase from '../../../models/purchaseModel.js';
import User from '../../../models/userModel.js';

export const adminAnalyticsController = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments({});
    const recentCourses = await Course.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .sort({ createdAt: 1 });
    const totalUsers = await User.countDocuments({});
    const totalPurchases = await Course.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$purchasedByHowMany' },
        },
      },
    ]);
    const totalPurchasesCount = totalPurchases[0]?.total || 0;
    // Static Now
    const totalRevenuResult = await Purchase.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: null,
          total: { $sum: '$amountPaid' },
        },
      },
    ]);
    const totalRevenue = totalRevenuResult[0]?.total || 0;
    const averageRatingResult = await Course.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]);
    const averageRating = averageRatingResult[0]?.avgRating || 0;
    const topPerformers = await Course.aggregate([
      { $match: { purchasedByHowMuch: { $gte: 1 } } },
      { $sort: { purchasedByHowMuch: -1 } },
      { $limit: 3 },
    ]);
    const stats = {
      totalCourses,
      recentCourses,
      totalUsers,
      totalRevenue,
      averageRating,
      topPerformers,
      totalPurchasesCount,
    };
    return res.json({ stats });
  } catch (error) {}
};
