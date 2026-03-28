const adminLogOutController = async (req, res) => {
  res.clearCookie('admin-auth-token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });

  return res.status(200).json({ message: 'Logged out successfully' });
};

export default adminLogOutController;
