import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import createAdminAuthTokenAndSetCookie from '../../../utils/createAdminTokenAndSetCookie.js';
import Admin from '../../../models/adminModel.js';

const adminLoginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const isExistingUser = await Admin.findOne({ email });
    if (!isExistingUser) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, isExistingUser.password);
    if (!isPasswordValid) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    const token = await createAdminAuthTokenAndSetCookie(
      String(isExistingUser._id),
      isExistingUser.email,
      res,
    );

    return res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Could not log in' });
  }
};

export default adminLoginController;
