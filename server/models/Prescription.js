import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientName: { type: String, default: '' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  doctorName: { type: String, default: '' },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null },
  medicines: [{
    name: String, dosage: String, frequency: String, duration: String, instructions: String,
  }],
  diagnosis: { type: String, default: '' },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['active', 'dispensed', 'completed', 'cancelled'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('Prescription', prescriptionSchema);
