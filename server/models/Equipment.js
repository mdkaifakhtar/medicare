import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'General' },
  department: { type: String, default: '' },
  serialNumber: { type: String, default: '' },
  manufacturer: { type: String, default: '' },
  purchaseDate: { type: Date, default: null },
  purchaseCost: { type: Number, default: 0 },
  status: { type: String, enum: ['operational', 'maintenance', 'broken', 'retired'], default: 'operational' },
  lastServiceDate: { type: Date, default: null },
  nextServiceDate: { type: Date, default: null },
  location: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Equipment', equipmentSchema);
