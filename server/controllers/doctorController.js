import Doctor from '../models/Doctor.js';

export const list = async (req, res) => {
  const { search, department, available, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (search) filter.name = { $regex: search, $options: 'i' };
  if (department) filter.department = department;
  if (available !== undefined) filter.available = available === 'true';
  const skip = (Number(page) - 1) * Number(limit);
  const items = await Doctor.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await Doctor.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};

export const getById = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  res.json(doctor);
};

export const create = async (req, res) => {
  const doctor = await Doctor.create(req.body);
  res.status(201).json(doctor);
};

export const update = async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  res.json(doctor);
};

export const remove = async (req, res) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  res.json({ message: 'Doctor deleted' });
};
