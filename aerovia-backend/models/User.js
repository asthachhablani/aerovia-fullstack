import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MemoryUser } from '../data/memoryStore.js';

const useMemory = process.env.USE_MEMORY_DB === '1';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, 'Password is required'], minlength: [6, 'Password must be at least 6 characters'], select: false },
    phone: { type: String, default: '' },
    country: { type: String, default: '' },
    city: { type: String, default: '' },
    dateOfBirth: { type: String, default: '' },
    passportNumber: { type: String, default: '' },
    nationality: { type: String, default: '' },
    travelPreferences: { type: [String], default: [] },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toProfile = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    phone: this.phone,
    country: this.country,
    city: this.city,
    dateOfBirth: this.dateOfBirth,
    passportNumber: this.passportNumber,
    nationality: this.nationality,
    travelPreferences: this.travelPreferences,
    avatar: this.avatar,
    createdAt: this.createdAt.toISOString(),
  };
};

const MongoUser = mongoose.models.User || mongoose.model('User', userSchema);

export default useMemory ? MemoryUser : MongoUser;
