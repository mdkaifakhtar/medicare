import mongoose from 'mongoose';

const labTestSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientName: { type: String, default: '' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null },
  doctorName: { type: String, default: '' },
  testName: { type: String, required: true },
  category: { type: String, default: 'Pathology' },
  sampleType: { type: String, default: 'Blood' },
  priority: { type: String, enum: ['routine', 'urgent', 'stat'], default: 'routine' },
  status: { type: String, enum: ['pending', 'sample-collected', 'processing', 'completed', 'verified', 'approved', 'rejected'], default: 'pending' },
  result: { type: String, default: '' },
  referenceRange: { type: String, default: '' },
  notes: { type: String, default: '' },
  reportUrl: { type: String, default: '' },
  collectedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  verifiedAt: { type: Date, default: null },
  labTechnician: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('LabTest', labTestSchema);
