import Medicine from '../models/Medicine.js';

export const list = async (req, res) => {
  const { search, category, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (search) filter.name = { $regex: search, $options: 'i' };
  if (category) filter.category = category;
  const skip = (Number(page) - 1) * Number(limit);
  const items = await Medicine.find(filter).sort({ name: 1 }).skip(skip).limit(Number(limit));
  const total = await Medicine.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};

export const getById = async (req, res) => {
  const med = await Medicine.findById(req.params.id);
  if (!med) return res.status(404).json({ message: 'Medicine not found' });
  res.json(med);
};

export const create = async (req, res) => {
  const med = await Medicine.create(req.body);
  res.status(201).json(med);
};

export const update = async (req, res) => {
  const med = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!med) return res.status(404).json({ message: 'Medicine not found' });
  res.json(med);
};

export const remove = async (req, res) => {
  const med = await Medicine.findByIdAndDelete(req.params.id);
  if (!med) return res.status(404).json({ message: 'Medicine not found' });
  res.json({ message: 'Medicine deleted' });
};
