import bcrypt from 'bcrypt';
import User from '../../../models/userModel.js';
import { validationResult } from 'express-validator';
import createUserAuthTokenAndSetCookie from '../../../utils/createUserAuthTokenAndSetCookie.js';

const userSignUpController = async (req, res) => {
  console.log("📩 Received signup body:", req.body);  // NEW

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("❌ Validation failed:", errors.array()); // NEW
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name } = req.body;
  console.log("➡️ Email:", email);       // NEW
  console.log("➡️ Password:", password); // NEW
  console.log("➡️ Name:", name);         // NEW

  try {
    const existingUser = await User.findOne({ email });
    console.log("🔍 Existing user:", existingUser); // NEW

    if (existingUser) {
      console.log("❌ Email already exists"); // NEW
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Hashed Password:", hashedPassword); // NEW

    const newUser = await User.create({ email, password: hashedPassword, name });
    console.log("🆕 New User Created:", newUser); // NEW

    await createUserAuthTokenAndSetCookie(String(newUser._id), newUser.email, res);
    console.log("🍪 Auth cookie set successfully"); // NEW

    return res.status(201).json({ message: 'Signed Up Successfully' });
  } catch (error) {
    console.error("🔥 Signup error:", error); // UPDATED (more clear)
    console.error("🔥 Error message:", error.message); // NEW
    console.error("🔥 Stack trace:", error.stack); // NEW

    return res.status(500).json({ success: false, message: 'Could Not Sign Up' });
  }
};

export default userSignUpController;
