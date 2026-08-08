import Equipment from '../models/Equipment.js';

export const list = async (req, res) => {
  const { search, status, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) filter.name = { $regex: search, $options: 'i' };
  const skip = (Number(page) - 1) * Number(limit);
  const items = await Equipment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await Equipment.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};

export const create = async (req, res) => {
  const item = await Equipment.create(req.body);
  res.status(201).json(item);
};

export const update = async (req, res) => {
  const item = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Equipment not found' });
  res.json(item);
};

export const remove = async (req, res) => {
  const item = await Equipment.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Equipment not found' });
  res.json({ message: 'Equipment deleted' });
};
