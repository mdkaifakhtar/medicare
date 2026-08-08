import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: {
    type: String,
    required: function passwordRequired() { return this.authProvider === 'local'; },
    select: false,
  },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String, default: null, index: true },
  picture: { type: String, default: '' },
  picturePublicId: { type: String, default: null },

  role: { type: String, enum: ['super_admin', 'hospital_admin', 'doctor', 'receptionist', 'nurse', 'lab_technician', 'pharmacist', 'accountant', 'patient'], default: 'patient' },

  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  status: { type: String, enum: ['active', 'pending', 'suspended'], default: 'active' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null },
  refreshTokens: { type: [String], default: [], select: false },
  lastLogin: { type: Date, default: null },
  loginHistory: [{ at: Date, ip: String, device: String }],
}, { timestamps: true });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.password || !this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  if (!this.password) return false;
  // bcrypt hashes always start with $2; anything else is a legacy plaintext seed.
  if (this.password.startsWith('$2')) return bcrypt.compare(candidate, this.password);
  return candidate === this.password;
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  return obj;
};

export default mongoose.model('User', userSchema);
