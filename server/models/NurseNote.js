import mongoose from 'mongoose';

const nurseNoteSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientName: { type: String, default: '' },
  nurseId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  nurseName: { type: String, default: '' },
  note: { type: String, required: true },
  type: { type: String, enum: ['observation', 'procedure', 'medication', 'incident', 'handover'], default: 'observation' },
  severity: { type: String, enum: ['normal', 'warning', 'critical'], default: 'normal' },
}, { timestamps: true });

export default mongoose.model('NurseNote', nurseNoteSchema);
