import mongoose from 'mongoose';

const nurseAssignmentSchema = new mongoose.Schema({
  nurseId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  nurseName: { type: String, default: '' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientName: { type: String, default: '' },
  ward: { type: String, default: 'General' },
  bedNumber: { type: String, default: '' },
  shift: { type: String, enum: ['Morning', 'Evening', 'Night'], default: 'Morning' },
  doctorName: { type: String, default: '' },
  instructions: { type: String, default: '' },
  status: { type: String, enum: ['active', 'completed', 'transferred'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('NurseAssignment', nurseAssignmentSchema);
