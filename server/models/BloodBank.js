import mongoose from 'mongoose';

const bloodBankSchema = new mongoose.Schema({
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  component: { type: String, enum: ['Whole Blood', 'Plasma', 'Platelets', 'RBC', 'Cryoprecipitate'], default: 'Whole Blood' },
  units: { type: Number, default: 0 },
  status: { type: String, enum: ['available', 'low', 'critical', 'out'], default: 'available' },
  expiryDate: { type: Date, default: null },
  donorName: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('BloodBank', bloodBankSchema);
