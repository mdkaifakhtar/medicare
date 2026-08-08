import Patient from '../models/Patient.js';

export const list = async (req, res) => {
  const { search, status, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (search) filter.name = { $regex: search, $options: 'i' };
  if (status) filter.status = status;
  const skip = (Number(page) - 1) * Number(limit);
  const items = await Patient.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await Patient.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};

export const getById = async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  res.json(patient);
};

export const create = async (req, res) => {
  const patient = await Patient.create(req.body);
  res.status(201).json(patient);
};

export const update = async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  res.json(patient);
};

export const remove = async (req, res) => {
  const patient = await Patient.findByIdAndDelete(req.params.id);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  res.json({ message: 'Patient deleted' });
};
