import mongoose from 'mongoose';

const bedSchema = new mongoose.Schema({
  bedNumber: { type: String, required: true },
  ward: { type: String, default: 'General' },
  type: { type: String, enum: ['General', 'Private', 'ICU', 'NICU', 'Deluxe'], default: 'General' },
  floor: { type: Number, default: 1 },
  status: { type: String, enum: ['available', 'occupied', 'maintenance', 'reserved'], default: 'available' },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null },
  patientName: { type: String, default: '' },
  dailyRate: { type: Number, default: 2000 },
  assignedAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model('Bed', bedSchema);
