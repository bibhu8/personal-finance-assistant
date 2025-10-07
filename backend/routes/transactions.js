const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const tc = require('../controllers/transactionController');

router.use(protect);

router.post('/', [
  body('type').isIn(['income', 'expense']),
  body('amount').isNumeric(),
  body('category').notEmpty()
], tc.createTransaction);

router.get('/', tc.getTransactions);
router.get('/:id', tc.getTransaction);
router.put('/:id', tc.updateTransaction);
router.delete('/:id', tc.deleteTransaction);

module.exports = router;
