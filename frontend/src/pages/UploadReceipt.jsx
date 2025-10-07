import React, { useState } from 'react';
import { receiptAPI } from '../api/axios';
import { Upload, CheckCircle } from 'lucide-react';

const UploadReceipt = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await receiptAPI.upload(formData);
      setResult(response.data.data);
      setFile(null);

      // 🔔 tell the app that data changed so Dashboard refreshes
      window.dispatchEvent(new Event('dataChanged'));
    } catch (error) {
      alert(error.response?.data?.message || 'Error uploading receipt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Upload Receipt</h1>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-300 mb-2">
                {file ? file.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-sm text-slate-500">PNG, JPG or PDF (MAX. 10MB)</p>
            </label>
          </div>

          {file && (
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg"
            >
              {loading ? 'Processing...' : 'Upload & Extract Data'}
            </button>
          )}
        </form>
      </div>

      {result && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Receipt Processed Successfully!</h2>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-400">Filename</p>
              <p className="text-white">{result.originalName}</p>
            </div>

            {result.extractedData?.totalAmount && (
              <div>
                <p className="text-sm text-slate-400">Extracted Amount</p>
                <p className="text-2xl font-bold text-primary-400">
                  ${Number(result.extractedData.totalAmount).toFixed(2)}
                </p>
              </div>
            )}

            {result.extractedData?.rawText && (
              <div>
                <p className="text-sm text-slate-400 mb-2">Extracted Text</p>
                <div className="bg-slate-900 p-4 rounded-lg max-h-64 overflow-y-auto">
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap">
                    {result.extractedData.rawText}
                  </pre>
                </div>
              </div>
            )}

            <p className="text-sm text-slate-400 mt-4">
              ✓ Transaction created automatically
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadReceipt;
