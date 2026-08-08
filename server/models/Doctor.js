import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, default: '' },
  phone: { type: String, default: '' },
  specialization: { type: String, default: '' },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
  departmentName: { type: String, default: '' },
  experience: { type: Number, default: 0 },
  qualifications: { type: String, default: '' },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  consultationFee: { type: Number, default: 500 },
  avatar: { type: String, default: '' },
  available: { type: Boolean, default: true },
  status: { type: String, enum: ['active', 'pending', 'suspended'], default: 'active' },
  bio: { type: String, default: '' },
  schedule: [{ day: String, startTime: String, endTime: String }],
}, { timestamps: true });

export default mongoose.model('Doctor', doctorSchema);
