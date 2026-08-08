import mongoose from 'mongoose';

const emergencyCaseSchema = new mongoose.Schema({
  caseNumber: { type: String, required: true, unique: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null },
  patientName: { type: String, required: true },
  patientAge: { type: Number, default: 0 },
  patientGender: { type: String, default: 'Unknown' },
  contactPhone: { type: String, default: '' },
  chiefComplaint: { type: String, required: true },
  traumaLevel: { type: String, enum: ['Level 1 - Critical', 'Level 2 - Emergent', 'Level 3 - Urgent', 'Level 4 - Semi-Urgent', 'Level 5 - Non-Urgent'], default: 'Level 3 - Urgent' },
  vitals: {
    heartRate: { type: Number, default: 0 },
    bloodPressure: { type: String, default: '' },
    temperature: { type: Number, default: 0 },
    oxygenSat: { type: Number, default: 0 },
    respiratoryRate: { type: Number, default: 0 },
    gcs: { type: Number, default: 15 },
  },
  arrivalMode: { type: String, enum: ['Walk-in', 'Ambulance', 'Referred', 'Police', 'Air Ambulance'], default: 'Walk-in' },
  ambulance: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance', default: null },
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null },
  assignedDoctorName: { type: String, default: '' },
  assignedBed: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed', default: null },
  assignedBedNumber: { type: String, default: '' },
  status: { type: String, enum: ['waiting', 'triaged', 'under-treatment', 'admitted', 'discharged', 'transferred', 'deceased'], default: 'waiting' },
  disposition: { type: String, enum: ['admitted', 'discharged', 'transferred', 'deceased', 'left-ama', ''], default: '' },
  notes: [{ text: String, by: String, at: { type: Date, default: Date.now } }],
  arrivedAt: { type: Date, default: Date.now },
  triagedAt: { type: Date, default: null },
  treatedAt: { type: Date, default: null },
  dispositionAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model('EmergencyCase', emergencyCaseSchema);
