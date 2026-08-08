import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String, required: true, trim: true },
  role: { type: String, enum: ['doctor', 'nurse', 'lab_technician', 'pharmacist', 'receptionist', 'accountant', 'admin', 'ward_boy', 'cleaner'], default: 'nurse' },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
  shift: { type: String, enum: ['Morning', 'Evening', 'Night'], default: 'Morning' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  salary: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'pending', 'suspended', 'resigned'], default: 'active' },
  joinedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Staff', staffSchema);
