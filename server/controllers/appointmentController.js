import Appointment from '../models/Appointment.js';
import Notification from '../models/Notification.js';

export const list = async (req, res) => {
  const { search, status, date, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (date) {
    const d = new Date(date);
    filter.date = { $gte: new Date(d.setHours(0, 0, 0)), $lt: new Date(d.setHours(23, 59, 59)) };
  }
  if (search) filter.patientName = { $regex: search, $options: 'i' };
  const skip = (Number(page) - 1) * Number(limit);
  const items = await Appointment.find(filter).sort({ date: 1, createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await Appointment.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};

export const getById = async (req, res) => {
  const appt = await Appointment.findById(req.params.id);
  if (!appt) return res.status(404).json({ message: 'Appointment not found' });
  res.json(appt);
};

export const create = async (req, res) => {
  const appt = await Appointment.create(req.body);
  await Notification.create({ recipientRole: 'doctor', recipientId: appt.doctor, type: 'appointment', title: 'New Appointment', message: `New appointment with ${appt.patientName}`, link: '/dashboard/appointments' });
  res.status(201).json(appt);
};

export const update = async (req, res) => {
  const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!appt) return res.status(404).json({ message: 'Appointment not found' });
  res.json(appt);
};

export const remove = async (req, res) => {
  const appt = await Appointment.findByIdAndDelete(req.params.id);
  if (!appt) return res.status(404).json({ message: 'Appointment not found' });
  res.json({ message: 'Appointment deleted' });
};
