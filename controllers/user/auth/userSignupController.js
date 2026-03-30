import bcrypt from 'bcrypt';
import User from '../../../models/userModel.js';
import { validationResult } from 'express-validator';
import createUserAuthTokenAndSetCookie from '../../../utils/createUserAuthTokenAndSetCookie.js';

const userSignUpController = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("❌ Validation failed:", errors.array()); // NEW
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("❌ Email already exists"); // NEW
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ email, password: hashedPassword, name, status: "Active" });

    const token = await createUserAuthTokenAndSetCookie({ userId: String(newUser._id), email: newUser.email, name: newUser.name }, res);
    console.log("🍪 Auth cookie set successfully"); // NEW

    return res.status(201).json({ message: 'Signed Up Successfully', token });
  } catch (error) {
    console.error("🔥 Signup error:", error); // UPDATED (more clear)

    return res.status(500).json({ success: false, message: 'Could Not Sign Up' });
  }
};

export default userSignUpController;
