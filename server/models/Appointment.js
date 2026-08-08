import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientName: { type: String, default: '' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  doctorName: { type: String, default: '' },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
  departmentName: { type: String, default: '' },
  date: { type: Date, required: true },
  time: { type: String, default: '10:00' },
  type: { type: String, enum: ['Consultation', 'Follow-up', 'Walk-in', 'Emergency'], default: 'Consultation' },
  status: { type: String, enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'], default: 'scheduled' },
  reason: { type: String, default: '' },
  notes: { type: String, default: '' },
  token: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);
