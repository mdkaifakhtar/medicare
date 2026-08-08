import Invoice from '../models/Invoice.js';

export const list = async (req, res) => {
  const { search, status, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) filter.patientName = { $regex: search, $options: 'i' };
  const skip = (Number(page) - 1) * Number(limit);
  const items = await Invoice.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await Invoice.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};

export const getById = async (req, res) => {
  const inv = await Invoice.findById(req.params.id);
  if (!inv) return res.status(404).json({ message: 'Invoice not found' });
  res.json(inv);
};

export const create = async (req, res) => {
  const inv = await Invoice.create(req.body);
  res.status(201).json(inv);
};

export const update = async (req, res) => {
  const inv = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!inv) return res.status(404).json({ message: 'Invoice not found' });
  res.json(inv);
};

export const remove = async (req, res) => {
  const inv = await Invoice.findByIdAndDelete(req.params.id);
  if (!inv) return res.status(404).json({ message: 'Invoice not found' });
  res.json({ message: 'Invoice deleted' });
};
