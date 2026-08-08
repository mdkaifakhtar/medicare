import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  description: { type: String, default: '' },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  paymentMethod: { type: String, default: 'Bank Transfer' },
  vendor: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'paid', 'rejected'], default: 'pending' },
  approvedBy: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
