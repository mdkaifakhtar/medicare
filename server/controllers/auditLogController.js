import AuditLog from '../models/AuditLog.js';

export const list = async (req, res) => {
  const { search, action, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (action) filter.action = action;
  if (search) filter.userName = { $regex: search, $options: 'i' };
  const skip = (Number(page) - 1) * Number(limit);
  const items = await AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await AuditLog.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};

export const create = async (req, res) => {
  const log = await AuditLog.create(req.body);
  res.status(201).json(log);
};
