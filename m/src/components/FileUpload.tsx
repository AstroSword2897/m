import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, LinearProgress, Box, Typography, Paper } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import axios from 'axios';
import './FileUpload.css';

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError(null);
    setUploadSuccess(false);
    setProgress(0);

    if (fileRejections.length > 0) {
      setError(`File is larger than 50MB`);
      setFile(null);
      return;
    }

    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const totalChunks = Math.ceil(file.size / (5 * 1024 * 1024)); // 5MB chunks
    const fileId = `${file.name}-${Date.now()}`;

    for (let i = 0; i < totalChunks; i++) {
      const start = i * (5 * 1024 * 1024);
      const end = start + (5 * 1024 * 1024);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('index', i.toString());
      formData.append('totalChunks', totalChunks.toString());
      formData.append('fileId', fileId);
      formData.append('fileName', file.name);
      
      try {
        await axios.post('http://localhost:6000/api/upload/chunk', formData);
        setProgress(Math.round(((i + 1) / totalChunks) * 100));
      } catch (err) {
        setError('Upload failed. Please try again.');
        setProgress(0);
        return;
      }
    }

    setUploadSuccess(true);
    // TODO: Call the parse endpoint after successful upload
    // await axios.post(`http://localhost:6000/api/parse/${fileId}`);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setProgress(0);
    setError(null);
    setUploadSuccess(false);
  };

  return (
    <Paper elevation={3} className="file-upload-container">
      <Typography variant="h6" gutterBottom>Upload Study Materials</Typography>
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <UploadFileIcon className="upload-icon" />
        {file ? (
          <p>{file.name}</p>
        ) : (
          <p>Drag 'n' drop a file here, or click to select a file</p>
        )}
      </div>
      {error && <Typography color="error" className="error-message"><ErrorIcon /> {error}</Typography>}
      {file && !uploadSuccess && (
        <Box className="file-actions">
          <Button variant="contained" color="primary" onClick={handleUpload} disabled={progress > 0}>
            Upload
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleRemoveFile}>
            Remove
          </Button>
        </Box>
      )}
      {progress > 0 && !uploadSuccess &&(
        <Box className="progress-bar">
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="textSecondary">{`${progress}%`}</Typography>
        </Box>
      )}
      {uploadSuccess && (
        <Typography color="primary" className="success-message">
          <CheckCircleIcon /> Upload successful!
        </Typography>
      )}
    </Paper>
  );
};

export default FileUpload; 