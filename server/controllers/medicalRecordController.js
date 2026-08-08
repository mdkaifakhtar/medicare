import MedicalRecord from '../models/MedicalRecord.js';

export const list = async (req, res) => {
  const { patientId, type, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (patientId) filter.patient = patientId;
  if (type) filter.type = type;
  const skip = (Number(page) - 1) * Number(limit);
  const items = await MedicalRecord.find(filter).sort({ date: -1 }).skip(skip).limit(Number(limit));
  const total = await MedicalRecord.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};

export const create = async (req, res) => {
  const record = await MedicalRecord.create(req.body);
  res.status(201).json(record);
};

export const update = async (req, res) => {
  const record = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!record) return res.status(404).json({ message: 'Record not found' });
  res.json(record);
};

export const remove = async (req, res) => {
  const record = await MedicalRecord.findByIdAndDelete(req.params.id);
  if (!record) return res.status(404).json({ message: 'Record not found' });
  res.json({ message: 'Record deleted' });
};
