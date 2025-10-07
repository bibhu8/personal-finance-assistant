const errorHandler = (err, req, res, next) => {
    console.error(err);
    let error = { message: err.message || 'Server Error' };
    if (err.name === 'ValidationError') {
      error.message = Object.values(err.errors).map(v => v.message).join(', ');
      return res.status(400).json({ success: false, message: error.message });
    }
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Duplicate field value' });
    }
    res.status(err.statusCode || 500).json({ success: false, message: error.message });
  };
  
  module.exports = errorHandler;
  