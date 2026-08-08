import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  icon: { type: String, default: 'Stethoscope' },
  description: { type: String, default: '' },
  floor: { type: String, default: '' },
  head: { type: String, default: '' },
  phone: { type: String, default: '' },
  color: { type: String, default: 'primary' },
  established: { type: Number, default: new Date().getFullYear() },
  emergency: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Department', departmentSchema);
