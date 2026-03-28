const userLogoutController = async (req, res) => {
  try {
    res.clearCookie('user-auth-token', {
      httpOnly: true,
      secure: true,      // Render / HTTPS
      sameSite: 'none',
      path: '/',
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('User logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not log out',
    });
  }
};

export default userLogoutController;
