const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Receipt = require('../models/Receipt');
const Transaction = require('../models/Transaction');
const { extractText, findLikelyAmount } = require('../utils/ocrParser');

// Get upload directory from env or default to 'uploads'
const uploadDir = process.env.UPLOAD_DIR || 'uploads';

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

// File filter - only allow images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, JPG, PNG) and PDF files are allowed!'));
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// Export middleware for single file upload with field name 'file'
exports.uploadMiddleware = upload.single('file');

// Upload receipt controller
exports.uploadReceipt = async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File required. Please upload a receipt image or PDF.'
      });
    }

    // Determine file type
    const fileType = req.file.mimetype.includes('pdf') ? 'pdf' : 'image';
    const localPath = req.file.path;

    // Create receipt entry in database
    const receipt = await Receipt.create({
      user: req.user._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: localPath,
      fileType,
      extractedData: { rawText: null },
      processed: false
    });

    // Perform OCR extraction (best-effort)
    try {
      const rawText = await extractText(localPath);
      const likelyAmount = findLikelyAmount(rawText);

      // Update receipt with extracted data
      receipt.extractedData.rawText = rawText;
      
      if (likelyAmount) {
        receipt.extractedData.totalAmount = likelyAmount;
      }

      receipt.processed = true;
      await receipt.save();

      // Optionally create a transaction from the extracted amount
      const { detectCategoryFromText } = require('../utils/ocrParser');
const detectedCategory = detectCategoryFromText(rawText);

if (likelyAmount && likelyAmount > 0) {
  await Transaction.create({
    user: req.user._id,
    type: 'expense',
    amount: likelyAmount,
    category: detectedCategory,
    description: `Expense from receipt: ${req.file.originalname}`,
    date: new Date(),
    receiptId: receipt._id
  });
  console.log('💰 Created transaction with category:', detectedCategory);
}


      res.status(201).json({
        success: true,
        message: 'Receipt uploaded and processed successfully',
        data: receipt
      });

    } catch (ocrError) {
      // If OCR fails, still save the receipt but mark as not fully processed
      console.error('OCR Error:', ocrError);
      receipt.extractedData.rawText = 'OCR processing failed';
      receipt.processed = false;
      await receipt.save();

      res.status(201).json({
        success: true,
        message: 'Receipt uploaded but OCR processing failed',
        data: receipt,
        warning: 'Text extraction was unsuccessful'
      });
    }

  } catch (err) {
    // Clean up uploaded file if database save fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(err);
  }
};

// Get all receipts for logged-in user
exports.getReceipts = async (req, res, next) => {
  try {
    const receipts = await Receipt.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: receipts.length,
      data: receipts
    });
  } catch (err) {
    next(err);
  }
};

// Get single receipt by ID
exports.getReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    res.status(200).json({
      success: true,
      data: receipt
    });
  } catch (err) {
    next(err);
  }
};

// Delete receipt
exports.deleteReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    // Delete file from filesystem
    if (fs.existsSync(receipt.filePath)) {
      fs.unlinkSync(receipt.filePath);
    }

    // Delete receipt from database
    await receipt.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Receipt deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};