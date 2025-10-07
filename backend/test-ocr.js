// backend/test-ocr.js
const path = require('path');
const fs = require('fs');
const { extractText, findLikelyAmount } = require('./utils/ocrParser');

async function runTest(filePath) {
  console.log('Test OCR: filePath =', filePath);
  console.log('Exists:', fs.existsSync(filePath), 'size:', fs.existsSync(filePath) ? fs.statSync(filePath).size : 0);
  try {
    const text = await extractText(filePath);
    console.log('Test OCR: extracted text length =', text ? text.length : 0);
    console.log('---- excerpt ----');
    console.log(text ? text.slice(0, 800) : '<empty>');
    console.log('---- end excerpt ----');
    console.log('Likely amount:', findLikelyAmount(text));
  } catch (err) {
    console.error('Test OCR: error ->', err && (err.message || err));
  }
}

const fileToTest = process.argv[2] || path.join(__dirname, 'uploads', '1759847242950-892391922.jpg'); 
// replace file name above if needed, or pass path via CLI

runTest(fileToTest).then(() => process.exit(0));
