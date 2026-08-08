import mongoose from 'mongoose';

const insuranceClaimSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientName: { type: String, default: '' },
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', default: null },
  invoiceNo: { type: String, default: '' },
  provider: { type: String, required: true },
  policyNo: { type: String, default: '' },
  claimAmount: { type: Number, required: true },
  approvedAmount: { type: Number, default: null },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'settled'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date, default: null },
  approvedBy: { type: String, default: '' },
  rejectionReason: { type: String, default: '' },
  documents: [String],
}, { timestamps: true });

export default mongoose.model('InsuranceClaim', insuranceClaimSchema);
