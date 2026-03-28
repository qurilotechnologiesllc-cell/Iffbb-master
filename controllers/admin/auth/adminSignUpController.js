import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import createAdminAuthTokenAndSetCookie from '../../../utils/createAdminTokenAndSetCookie.js';
import Admin from '../../../models/adminModel.js';
import argon from 'argon2';
const adminSignUpController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  try {
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'Email already in use' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Admin.create({ email, password: hashedPassword });

    await createAdminAuthTokenAndSetCookie(String(newUser._id), newUser.email, res);

    res.status(201).json({ message: 'Signed Up Successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Could Not Sign Up' });
  }
};

export default adminSignUpController;
