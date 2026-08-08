import Prescription from '../models/Prescription.js';
import Notification from '../models/Notification.js';

export const list = async (req, res) => {
  const { search, status, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) filter.patientName = { $regex: search, $options: 'i' };
  const skip = (Number(page) - 1) * Number(limit);
  const items = await Prescription.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await Prescription.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};

export const getById = async (req, res) => {
  const rx = await Prescription.findById(req.params.id);
  if (!rx) return res.status(404).json({ message: 'Prescription not found' });
  res.json(rx);
};

export const create = async (req, res) => {
  const rx = await Prescription.create(req.body);
  await Notification.create({ recipientRole: 'pharmacist', type: 'prescription', title: 'New Prescription', message: `Prescription for ${rx.patientName}`, link: '/dashboard/prescriptions' });
  res.status(201).json(rx);
};

export const update = async (req, res) => {
  const rx = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!rx) return res.status(404).json({ message: 'Prescription not found' });
  res.json(rx);
};

export const remove = async (req, res) => {
  const rx = await Prescription.findByIdAndDelete(req.params.id);
  if (!rx) return res.status(404).json({ message: 'Prescription not found' });
  res.json({ message: 'Prescription deleted' });
};
