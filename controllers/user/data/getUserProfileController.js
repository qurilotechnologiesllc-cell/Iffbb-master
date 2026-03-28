import User from '../../../models/userModel.js';

export const getUserProfileController = async (req, res) => {
  try {
    // ✅ userId JWT token se
    const userId = req.user.userId;

    const userProfile = await User.findById(userId).select('-password');

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: userProfile,
    });
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not fetch user profile',
    });
  }
};
