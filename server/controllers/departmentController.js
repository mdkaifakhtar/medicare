import Department from '../models/Department.js';

export const list = async (req, res) => {
  const { search, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (search) filter.name = { $regex: search, $options: 'i' };
  const skip = (Number(page) - 1) * Number(limit);
  const items = await Department.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await Department.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};

export const getById = async (req, res) => {
  const dept = await Department.findById(req.params.id);
  if (!dept) return res.status(404).json({ message: 'Department not found' });
  res.json(dept);
};

export const create = async (req, res) => {
  const dept = await Department.create(req.body);
  res.status(201).json(dept);
};

export const update = async (req, res) => {
  const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!dept) return res.status(404).json({ message: 'Department not found' });
  res.json(dept);
};

export const remove = async (req, res) => {
  const dept = await Department.findByIdAndDelete(req.params.id);
  if (!dept) return res.status(404).json({ message: 'Department not found' });
  res.json({ message: 'Department deleted' });
};
