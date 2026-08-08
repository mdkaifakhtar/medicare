import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientName: { type: String, default: '' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null },
  doctorName: { type: String, default: '' },
  type: { type: String, enum: ['diagnosis', 'prescription', 'lab-result', 'imaging', 'procedure', 'admission', 'discharge', 'note'], default: 'diagnosis' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  attachments: [String],
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('MedicalRecord', medicalRecordSchema);
