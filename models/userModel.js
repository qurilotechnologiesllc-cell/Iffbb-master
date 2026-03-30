import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ["Active", "Offline"] },
    purchasedCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    isBannedByAdmin: { type: Boolean, default: false },
    logintime: { type: Date, default: null }
  },
  { timestamps: true },
);

const User = mongoose.model('User', UserSchema);
export default User;
