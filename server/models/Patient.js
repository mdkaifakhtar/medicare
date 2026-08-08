import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String, required: true, trim: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
  age: { type: Number, default: 0 },
  bloodGroup: { type: String, default: 'Unknown' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  emergencyContact: { type: String, default: '' },
  allergies: [String],
  chronicConditions: [String],
  insurance: { provider: String, policyNumber: String, coverageAmount: Number },
  avatar: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive', 'admitted', 'discharged'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('Patient', patientSchema);
