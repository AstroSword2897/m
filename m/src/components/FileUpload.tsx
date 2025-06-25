import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, LinearProgress, Box, Typography, Paper, TextField, Alert, Collapse } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import BugReportIcon from '@mui/icons-material/BugReport';
import axios from 'axios';
import './FileUpload.css';

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [text, setText] = useState('');
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  const addDebugInfo = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[DEBUG] ${message}`);
  };

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError(null);
    setUploadSuccess(false);
    setProgress(0);
    addDebugInfo(`Drop event triggered - ${acceptedFiles.length} accepted, ${fileRejections.length} rejected`);

    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      addDebugInfo(`File rejected: ${rejection.file.name} - ${rejection.errors.map((e: any) => e.message).join(', ')}`);
      setError(`File is larger than 50MB`);
      setFile(null);
      return;
    }

    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      addDebugInfo(`File selected: ${selectedFile.name} (${selectedFile.size} bytes)`);
      setFile(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
  });

  const testBackendConnection = async () => {
    addDebugInfo('Testing backend connection...');
    try {
      const response = await axios.get('http://127.0.0.1:6000/health');
      addDebugInfo(`Backend health check: ${response.status} - ${JSON.stringify(response.data)}`);
      return true;
    } catch (err: any) {
      addDebugInfo(`Backend health check failed: ${err.message}`);
      if (err.response) {
        addDebugInfo(`Response status: ${err.response.status}`);
        addDebugInfo(`Response data: ${JSON.stringify(err.response.data)}`);
      }
      return false;
    }
  };

  const handleUpload = async () => {
    setError(null);
    setUploadSuccess(false);
    setProgress(0);
    addDebugInfo('Starting upload process...');

    // Test backend connection first
    const backendOk = await testBackendConnection();
    if (!backendOk) {
      setError('Cannot connect to backend server. Please check if the backend is running on port 6000.');
      return;
    }

    if (text.trim()) {
      // Upload text as a note/document
      try {
        addDebugInfo(`Attempting text upload: "${text.substring(0, 50)}..."`);
        const response = await axios.post('http://127.0.0.1:6000/api/upload/text', { text });
        addDebugInfo(`Text upload successful: ${JSON.stringify(response.data)}`);
        setUploadSuccess(true);
        setText('');
      } catch (err: any) {
        addDebugInfo(`Text upload error: ${err.message}`);
        if (err.response) {
          addDebugInfo(`Response status: ${err.response.status}`);
          addDebugInfo(`Response data: ${JSON.stringify(err.response.data)}`);
          setError(`Upload failed: ${err.response.data?.error || err.response.statusText}`);
        } else if (err.request) {
          addDebugInfo('No response received from server');
          setError('No response from server. Please check if the backend is running.');
        } else {
          setError(`Upload failed: ${err.message}`);
        }
      }
      return;
    }

    if (!file) {
      setError('Please select a file to upload or enter text.');
      return;
    }

    addDebugInfo(`Starting file upload: ${file.name} (${file.size} bytes)`);
    const totalChunks = Math.ceil(file.size / (5 * 1024 * 1024)); // 5MB chunks
    const fileId = `${file.name}-${Date.now()}`;
    addDebugInfo(`File will be split into ${totalChunks} chunks`);

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
        addDebugInfo(`Uploading chunk ${i + 1}/${totalChunks} (${chunk.size} bytes)`);
        const response = await axios.post('http://127.0.0.1:6000/api/upload/chunk', formData);
        addDebugInfo(`Chunk ${i + 1} response: ${JSON.stringify(response.data)}`);
        setProgress(Math.round(((i + 1) / totalChunks) * 100));
      } catch (err: any) {
        addDebugInfo(`Chunk ${i + 1} upload error: ${err.message}`);
        if (err.response) {
          addDebugInfo(`Response status: ${err.response.status}`);
          addDebugInfo(`Response data: ${JSON.stringify(err.response.data)}`);
          setError(`Upload failed: ${err.response.data?.error || err.response.statusText}`);
        } else if (err.request) {
          addDebugInfo('No response received from server');
          setError('No response from server. Please check if the backend is running.');
        } else {
          setError(`Upload failed: ${err.message}`);
        }
        setProgress(0);
        return;
      }
    }

    addDebugInfo('All chunks uploaded successfully');
    setUploadSuccess(true);
    // TODO: Call the parse endpoint after successful upload
    // await axios.post(`http://localhost:6000/api/parse/${fileId}`);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setProgress(0);
    setError(null);
    setUploadSuccess(false);
    addDebugInfo('File removed');
  };

  const clearDebugInfo = () => {
    setDebugInfo([]);
  };

  return (
    <Paper elevation={3} className="file-upload-container">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Upload Study Materials</Typography>
        <Button
          startIcon={<BugReportIcon />}
          onClick={() => setShowDebug(!showDebug)}
          size="small"
        >
          {showDebug ? 'Hide' : 'Show'} Debug
        </Button>
      </Box>

      <TextField
        label="Or enter text to upload as a note"
        multiline
        minRows={3}
        fullWidth
        value={text}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
        sx={{ mb: 2 }}
      />

      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <UploadFileIcon className="upload-icon" />
        {file ? (
          <p>{file.name}</p>
        ) : (
          <p>Drag 'n' drop a file here, or click to select a file</p>
        )}
      </div>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <ErrorIcon /> {error}
        </Alert>
      )}

      <Box className="file-actions" sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={progress > 0 || (!file && !text.trim())}
        >
          Upload
        </Button>
        {file && (
          <Button variant="outlined" color="secondary" onClick={handleRemoveFile}>
            Remove
          </Button>
        )}
      </Box>

      {progress > 0 && !uploadSuccess && (
        <Box className="progress-bar" sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="textSecondary">{`${progress}%`}</Typography>
        </Box>
      )}

      {uploadSuccess && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <CheckCircleIcon /> Upload successful!
        </Alert>
      )}

      <Collapse in={showDebug}>
        <Paper elevation={1} sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle2">Debug Information</Typography>
            <Button size="small" onClick={clearDebugInfo}>Clear</Button>
          </Box>
          <Box sx={{ maxHeight: 200, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.8rem' }}>
            {debugInfo.length === 0 ? (
              <Typography variant="body2" color="textSecondary">No debug information yet...</Typography>
            ) : (
              debugInfo.map((info, index) => (
                <div key={index} style={{ marginBottom: '4px' }}>{info}</div>
              ))
            )}
          </Box>
        </Paper>
      </Collapse>
    </Paper>
  );
};

export default FileUpload; 