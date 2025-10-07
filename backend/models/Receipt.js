const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileType: { type: String, enum: ['image', 'pdf'], required: true },
  extractedData: {
    merchantName: String,
    date: Date,
    totalAmount: Number,
    items: [{ description: String, quantity: Number, price: Number }],
    rawText: String
  },
  processed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Receipt', receiptSchema);
