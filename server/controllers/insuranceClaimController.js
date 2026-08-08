import InsuranceClaim from '../models/InsuranceClaim.js';

export const list = async (req, res) => {
  const { search, status, patientId, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (patientId) filter.patient = patientId;
  if (search) filter.patientName = { $regex: search, $options: 'i' };
  const skip = (Number(page) - 1) * Number(limit);
  const items = await InsuranceClaim.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await InsuranceClaim.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};

export const create = async (req, res) => {
  const item = await InsuranceClaim.create(req.body);
  res.status(201).json(item);
};

export const update = async (req, res) => {
  const item = await InsuranceClaim.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Insurance claim not found' });
  res.json(item);
};

export const remove = async (req, res) => {
  const item = await InsuranceClaim.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Insurance claim not found' });
  res.json({ message: 'Insurance claim deleted' });
};
