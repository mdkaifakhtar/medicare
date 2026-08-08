import Bed from '../models/Bed.js';

export const list = async (req, res) => {
  const { status, ward, page = 1, limit = 100 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (ward) filter.ward = ward;
  const skip = (Number(page) - 1) * Number(limit);
  const items = await Bed.find(filter).sort({ bedNumber: 1 }).skip(skip).limit(Number(limit));
  const total = await Bed.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};

export const getById = async (req, res) => {
  const bed = await Bed.findById(req.params.id);
  if (!bed) return res.status(404).json({ message: 'Bed not found' });
  res.json(bed);
};

export const create = async (req, res) => {
  const bed = await Bed.create(req.body);
  res.status(201).json(bed);
};

export const update = async (req, res) => {
  const bed = await Bed.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!bed) return res.status(404).json({ message: 'Bed not found' });
  res.json(bed);
};

export const remove = async (req, res) => {
  const bed = await Bed.findByIdAndDelete(req.params.id);
  if (!bed) return res.status(404).json({ message: 'Bed not found' });
  res.json({ message: 'Bed deleted' });
};
