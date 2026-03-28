import User from '../../../models/userModel.js';
import bcrypt from 'bcrypt';

import { validationResult } from 'express-validator';
import createUserAuthTokenAndSetCookie from '../../../utils/createUserAuthTokenAndSetCookie.js';

const userLoginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  try {
    const isExistingUser = await User.findOne({ email });
    if (!isExistingUser) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, isExistingUser.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
    if (isExistingUser.isBannedByAdmin) {
      return res.status(400).json({ message: 'You are banned' });
    }
    const token = await createUserAuthTokenAndSetCookie(
      String(isExistingUser._id),
      isExistingUser.email,
      res,
    );

    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Could not log in' });
  }
};

export default userLoginController;
