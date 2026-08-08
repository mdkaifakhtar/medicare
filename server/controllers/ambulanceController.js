import Ambulance from '../models/Ambulance.js';

export const list = async (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const skip = (Number(page) - 1) * Number(limit);
  const items = await Ambulance.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await Ambulance.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};

export const create = async (req, res) => {
  const item = await Ambulance.create(req.body);
  res.status(201).json(item);
};

export const update = async (req, res) => {
  const item = await Ambulance.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Ambulance not found' });
  res.json(item);
};

export const remove = async (req, res) => {
  const item = await Ambulance.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Ambulance not found' });
  res.json({ message: 'Ambulance deleted' });
};
