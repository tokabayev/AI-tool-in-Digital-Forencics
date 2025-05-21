import React, { useState, useRef } from 'react';
import { uploadFile, analyzeFile, downloadReport, downloadJsonReport } from '../api/api';
import { UploadCloud, Loader2, CheckCircle, Download } from 'lucide-react';

function Upload() {
  const [file, setFile] = useState(null);
  const [reportId, setReportId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFileSelect = (f) => {
    const maxSizeMB = 25;
    if (!f) return;
  
    if (!f.type.match(/audio|video/)) {
      alert('Only audio and video files are supported.');
      return;
    }
  
    if (f.size > maxSizeMB * 1024 * 1024) {
      alert(`File too big. Maximum size — ${maxSizeMB} МБ.`);
      return;
    }
  
    setFile(f);
    setReportId(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const uploadResponse = await uploadFile(file, token);
      const uploadData = await uploadResponse.json();
      const analyzeResponse = await analyzeFile(uploadData.file_id, token);
      const analyzeData = await analyzeResponse.json();
      const historyResponse = await fetch('http://127.0.0.1:8000/user/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const historyData = await historyResponse.json();
      const latestRequest = historyData.find(req => req.file_id === uploadData.file_id);
      setReportId(latestRequest.id);
    } catch (err) {
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const fileBlob = await downloadReport(requestId, token);
      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${requestId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download report. Please try again.');
    }
  };

  const handleDownloadJsonReport = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const fileBlob = await downloadJsonReport(requestId, token);
      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${requestId}.json`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download JSON report. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl bg-gray-50 rounded-2xl shadow-xl p-10 text-center border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Upload Your Media
        </h1>
        <p className="text-gray-500 mb-8 text-sm md:text-base">
          Drag and drop your audio or video file here, or select it manually. Supported formats: MP3, WAV, MP4, AVI.
          Maximum file size 25 MB.
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`transition-all duration-200 border-2 border-dashed rounded-xl p-10 cursor-pointer ${
            dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
          }`}
          onClick={() => inputRef.current.click()}
        >
          <UploadCloud className="mx-auto mb-4 text-blue-500 w-12 h-12" />
          <p className="text-gray-600 mb-2">
            {file ? (
              <span className="font-medium text-blue-600">{file.name}</span>
            ) : (
              'Click to select or drag file here'
            )}
          </p>
          <input
            type="file"
            accept=".mp3,.wav,.mp4,.avi"
            className="hidden"
            ref={inputRef}
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="mt-8 w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin cursor-pointer" />
              Analyzing...
            </>
          ) : (
            'Analyze File'
          )}
        </button>

        {reportId && (
          <div className="mt-6 text-center">
            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Analysis complete:</p>
            <div className="flex justify-center gap-4 mt-2">
              <button
                onClick={() => handleDownloadReport(reportId)}
                className="text-blue-600 hover:underline font-medium cursor-pointer flex items-center gap-1"
              >
                <Download size={16} /> PDF
              </button>
              <button
                onClick={() => handleDownloadJsonReport(reportId)}
                className="text-blue-600 hover:underline font-medium cursor-pointer flex items-center gap-1"
              >
                <Download size={16} /> JSON
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;