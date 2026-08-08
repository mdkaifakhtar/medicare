import Notification from '../models/Notification.js';

export const listForUser = async (req, res) => {
  const { role, userId } = req.query;
  const filter = {
    $or: [
      { recipientRole: role, recipientId: null },
      { recipientId: userId },
      { recipientRole: 'all', recipientId: null },
    ],
  };
  const items = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);
  const total = items.length;
  res.json({ items, total, page: 1, limit: 50, totalPages: 1 });
};

export const markRead = async (req, res) => {
  const n = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!n) return res.status(404).json({ message: 'Notification not found' });
  res.json(n);
};

export const markAllRead = async (req, res) => {
  const { role, userId } = req.query;
  await Notification.updateMany(
    { $or: [{ recipientRole: role, recipientId: null }, { recipientId: userId }], read: false },
    { $set: { read: true } }
  );
  res.json({ message: 'All notifications marked as read' });
};

export const create = async (req, res) => {
  const n = await Notification.create(req.body);
  res.status(201).json(n);
};
