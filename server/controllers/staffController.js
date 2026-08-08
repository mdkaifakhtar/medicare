import Staff from '../models/Staff.js';

export const list = async (req, res) => {
  const { search, role, status, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;
  if (search) filter.name = { $regex: search, $options: 'i' };
  const skip = (Number(page) - 1) * Number(limit);
  const items = await Staff.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await Staff.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};

export const create = async (req, res) => {
  const staff = await Staff.create(req.body);
  res.status(201).json(staff);
};

export const update = async (req, res) => {
  const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!staff) return res.status(404).json({ message: 'Staff member not found' });
  res.json(staff);
};

export const remove = async (req, res) => {
  const staff = await Staff.findByIdAndDelete(req.params.id);
  if (!staff) return res.status(404).json({ message: 'Staff member not found' });
  res.json({ message: 'Staff member deleted' });
};
