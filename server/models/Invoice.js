import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientName: { type: String, default: '' },
  items: [{ description: String, quantity: Number, unitPrice: Number, total: Number, category: String }],
  subtotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'partial', 'paid', 'overdue', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, default: '' },
  dueDate: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);
