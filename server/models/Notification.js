import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientRole: { type: String, default: 'all' },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  type: { type: String, default: 'info' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String, default: '' },
  read: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'normal', 'high', 'critical'], default: 'normal' },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
