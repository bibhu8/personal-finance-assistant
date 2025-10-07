require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const receiptRoutes = require('./routes/receipts');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

// ensure uploads dir exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// connect DB
connectDB();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(`/${UPLOAD_DIR}`, express.static(path.join(__dirname, UPLOAD_DIR)));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/receipts', receiptRoutes);

app.get('/', (req, res) => res.send('Personal Finance Assistant Backend'));

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
