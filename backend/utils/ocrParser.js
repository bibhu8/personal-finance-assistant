// backend/utils/ocrParser.js
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

let cliAvailable = false;
let nodeTesseract = null;
try {
  // require lazily so module not required until installed
  nodeTesseract = require('node-tesseract-ocr');
  cliAvailable = true;
} catch (err) {
  cliAvailable = false;
}

/**
 * Try to extract text from a PDF using pdf-parse (works for text-based PDFs).
 */
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    if (data && data.text && data.text.trim().length > 0) {
      return data.text;
    }
    return '';
  } catch (err) {
    console.warn('pdf-parse failed:', err && err.message);
    return '';
  }
}

/**
 * Use system tesseract via node-tesseract-ocr to perform OCR on images (or pdf pages).
 * Requires the tesseract binary installed and node-tesseract-ocr npm package installed.
 */
async function extractTextWithTesseractCli(filePath) {
  if (!cliAvailable) {
    console.warn('Tesseract CLI wrapper not available (node-tesseract-ocr not installed).');
    return '';
  }

  const config = {
    lang: 'eng',
    oem: 1,
    psm: 3
  };

  try {
    const text = await nodeTesseract.recognize(filePath, config);
    return text || '';
  } catch (err) {
    console.warn('Tesseract CLI error:', err && err.message);
    return '';
  }
}

/**
 * Main exported function:
 * - If PDF: first try pdf-parse (searchable PDF). If empty, try tesseract CLI on the PDF file.
 *   (Note: system tesseract may be able to read embedded images in a PDF; for best results
 *    convert PDF pages to images using pdftoppm if available.)
 * - If image: run tesseract CLI on image.
 */
async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    const textFromPdf = await extractTextFromPDF(filePath);
    if (textFromPdf && textFromPdf.trim().length > 0) {
      console.log('OCR: extracted text from searchable PDF via pdf-parse');
      return textFromPdf;
    }

    console.log('OCR: pdf-parse empty. Trying Tesseract CLI on PDF (may work for some scanned PDFs).');
    const cliText = await extractTextWithTesseractCli(filePath);
    return cliText || '';
  } else {
    // image file
    const cliText = await extractTextWithTesseractCli(filePath);
    return cliText || '';
  }
}

/**
 * findLikelyAmount: very simple heuristic to find numbers that look like totals
 */
function findLikelyAmount(text) {
  if (!text) return null;
  const matches = text.match(/\d{1,3}(?:[,\.\s]\d{3})*(?:[,\.\s]\d{1,2})?/g);
  if (!matches) return null;
  const normalized = matches
    .map(m => m.replace(/[,\s]+/g, ''))
    .map(m => {
      const n = Number(m);
      return isNaN(n) ? null : n;
    })
    .filter(n => n !== null);
  if (!normalized.length) return null;
  return Math.max(...normalized);
}

function detectCategoryFromText(rawText = '') {
  const text = rawText.toLowerCase();

  if (text.includes('walmart') || text.includes('big bazaar') || text.includes('supermarket') || text.includes('grocery')) {
    return 'Grocery';
  }
  if (text.includes('restaurant') || text.includes('food') || text.includes('cafe') || text.includes('burger') || text.includes('pizza')) {
    return 'Food & Dining';
  }
  if (text.includes('electric') || text.includes('water bill') || text.includes('internet') || text.includes('utility')) {
    return 'Utilities';
  }
  if (text.includes('petrol') || text.includes('fuel') || text.includes('gas station')) {
    return 'Transportation';
  }
  if (text.includes('movie') || text.includes('ticket') || text.includes('entertainment')) {
    return 'Entertainment';
  }
  if (text.includes('medicine') || text.includes('pharmacy') || text.includes('hospital')) {
    return 'Health & Medical';
  }

  return 'Others';
}

module.exports = { extractText, findLikelyAmount, detectCategoryFromText };

