import User from '../../../models/userModel.js';

const banUnbanUserController = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(404).json({ message: 'User Id Not Provided' });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }
    user.isBannedByAdmin = !user.isBannedByAdmin;
    await user.save();
    return res.json({ message: `User Is Now ${user.isBannedByAdmin ? 'Banned' : 'Unbanned'}` });
  } catch (error) {
    console.error('Cannot Change User Band Status');
    return res.status(500).json({ message: 'Cannot Change the Ban Status' });
  }
};
export default banUnbanUserController;
