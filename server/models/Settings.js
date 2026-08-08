import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, default: 'MedCare Multispecialty Hospital' },
  tagline: { type: String, default: 'Compassion. Innovation. Excellence.' },
  address: { type: String, default: '214 Wellness Avenue, Medical District, Bengaluru 560001' },
  phone: { type: String, default: '+91 80 4000 8000' },
  emergency: { type: String, default: '1066' },
  email: { type: String, default: 'care@medcare.health' },
  website: { type: String, default: 'https://medcare.health' },
  established: { type: Number, default: 1998 },
  registrationNo: { type: String, default: 'KMC-1998-0421' },
  gstin: { type: String, default: '29AABCM1234L1Z5' },
  taxRate: { type: Number, default: 18 },
  currency: { type: String, default: 'INR' },
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
