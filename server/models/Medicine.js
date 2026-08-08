import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, default: 'General' },
  manufacturer: { type: String, default: '' },
  stock: { type: Number, default: 0 },
  unit: { type: String, default: 'strip' },
  price: { type: Number, default: 0 },
  costPrice: { type: Number, default: 0 },
  batchNumber: { type: String, default: '' },
  expiryDate: { type: Date, default: null },
  reorderLevel: { type: Number, default: 20 },
  description: { type: String, default: '' },
  status: { type: String, enum: ['in-stock', 'low-stock', 'out-of-stock'], default: 'in-stock' },
}, { timestamps: true });

export default mongoose.model('Medicine', medicineSchema);
