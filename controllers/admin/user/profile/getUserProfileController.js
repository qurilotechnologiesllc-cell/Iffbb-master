import User from '../../../../models/userModel.js';

const getUserProfileController = async (req, res) => {
  try {
    // 👇 comes from authenticateUser middleware
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not fetch profile',
    });
  }
};

export default getUserProfileController;
