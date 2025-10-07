const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');

exports.createTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { type, amount, category, description, date, receiptId } = req.body;
    const tx = await Transaction.create({
      user: req.user._id,
      type,
      amount,
      category,
      description,
      date: date ? new Date(date) : Date.now(),
      receiptId
    });
    res.status(201).json({ success: true, data: tx });
  } catch (err) { next(err); }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const { startDate, endDate, page = 1, limit = 20, type, category } = req.query;
    const query = { user: req.user._id };
    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Transaction.find(query).sort({ date: -1 }).skip(skip).limit(Number(limit)),
      Transaction.countDocuments(query)
    ]);

    res.json({ success: true, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)), data: items });
  } catch (err) { next(err); }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const tx = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!tx) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: tx });
  } catch (err) { next(err); }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const updates = req.body;
    const tx = await Transaction.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, updates, { new: true, runValidators: true });
    if (!tx) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: tx });
  } catch (err) { next(err); }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const tx = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!tx) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { next(err); }
};
