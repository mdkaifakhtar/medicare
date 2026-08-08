import LabTest from '../models/LabTest.js';
import Notification from '../models/Notification.js';

export const list = async (req, res) => {
  const { search, status, category, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (search) filter.patientName = { $regex: search, $options: 'i' };
  const skip = (Number(page) - 1) * Number(limit);
  const items = await LabTest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await LabTest.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};

export const getById = async (req, res) => {
  const test = await LabTest.findById(req.params.id);
  if (!test) return res.status(404).json({ message: 'Lab test not found' });
  res.json(test);
};

export const create = async (req, res) => {
  const test = await LabTest.create(req.body);
  await Notification.create({ recipientRole: 'lab_technician', type: 'lab', title: 'New Lab Test', message: `Lab test ordered for ${test.patientName}`, link: '/dashboard/lab' });
  res.status(201).json(test);
};

export const update = async (req, res) => {
  const test = await LabTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!test) return res.status(404).json({ message: 'Lab test not found' });
  if (req.body.status === 'completed' && !test.completedAt) test.completedAt = new Date();
  if (req.body.status === 'verified' && !test.verifiedAt) test.verifiedAt = new Date();
  await test.save();
  res.json(test);
};

export const remove = async (req, res) => {
  const test = await LabTest.findByIdAndDelete(req.params.id);
  if (!test) return res.status(404).json({ message: 'Lab test not found' });
  res.json({ message: 'Lab test deleted' });
};
