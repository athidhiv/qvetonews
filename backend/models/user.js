import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    // Preferences
    preferredLocale: { type: String, default: 'en' },
    preferredCategories: [{ type: String }], // e.g. ["tech", "sports"]

    // Track articles user has already seen
    seenArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }]
  },
  { timestamps: true }
);

// helper method
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model('User', userSchema);
export default User;
