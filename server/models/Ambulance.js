import mongoose from 'mongoose';

const ambulanceSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true },
  type: { type: String, enum: ['Basic', 'Advanced', 'Cardiac', 'Neonatal'], default: 'Basic' },
  driver: { type: String, default: '' },
  driverPhone: { type: String, default: '' },
  status: { type: String, enum: ['available', 'on-call', 'maintenance', 'offline'], default: 'available' },
  currentLocation: { type: String, default: '' },
  lastServiceDate: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model('Ambulance', ambulanceSchema);
