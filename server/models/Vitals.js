import mongoose from 'mongoose';

const vitalsSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientName: { type: String, default: '' },
  heartRate: { type: Number, default: 0 },
  bloodPressure: { type: String, default: '' },
  temperature: { type: Number, default: 0 },
  oxygenSat: { type: Number, default: 0 },
  respiratoryRate: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  recordedByName: { type: String, default: '' },
  isAbnormal: { type: Boolean, default: false },
}, { timestamps: true });

vitalsSchema.pre('save', function (next) {
  this.isAbnormal = this.heartRate > 100 || this.heartRate < 60 || this.oxygenSat < 92;
  next();
});

export default mongoose.model('Vitals', vitalsSchema);
