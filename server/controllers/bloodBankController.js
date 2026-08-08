import BloodBank from '../models/BloodBank.js';

export const list = async (req, res) => {
  const { bloodGroup, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (bloodGroup) filter.bloodGroup = bloodGroup;
  const skip = (Number(page) - 1) * Number(limit);
  const items = await BloodBank.find(filter).sort({ bloodGroup: 1 }).skip(skip).limit(Number(limit));
  const total = await BloodBank.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};

export const create = async (req, res) => {
  const item = await BloodBank.create(req.body);
  res.status(201).json(item);
};

export const update = async (req, res) => {
  const item = await BloodBank.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Blood bank entry not found' });
  res.json(item);
};

export const remove = async (req, res) => {
  const item = await BloodBank.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Blood bank entry not found' });
  res.json({ message: 'Entry deleted' });
};
