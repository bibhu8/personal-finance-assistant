const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const rc = require('../controllers/receiptController');

// Upload receipt (with file)
router.post('/', protect, rc.uploadMiddleware, rc.uploadReceipt);

// Get all receipts for logged-in user
router.get('/', protect, rc.getReceipts);

// Get single receipt by ID
router.get('/:id', protect, rc.getReceipt);

// Delete receipt by ID
router.delete('/:id', protect, rc.deleteReceipt);

module.exports = router;