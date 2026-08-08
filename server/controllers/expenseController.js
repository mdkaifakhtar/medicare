import Expense from '../models/Expense.js';

export const list = async (req, res) => {
  const { search, category, status, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (search) filter.description = { $regex: search, $options: 'i' };
  const skip = (Number(page) - 1) * Number(limit);
  const items = await Expense.find(filter).sort({ date: -1 }).skip(skip).limit(Number(limit));
  const total = await Expense.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};

export const create = async (req, res) => {
  const item = await Expense.create(req.body);
  res.status(201).json(item);
};

export const update = async (req, res) => {
  const item = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Expense not found' });
  res.json(item);
};

export const remove = async (req, res) => {
  const item = await Expense.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Expense not found' });
  res.json({ message: 'Expense deleted' });
};
