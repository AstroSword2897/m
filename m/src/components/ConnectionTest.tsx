import React, { useState } from 'react';
import { Button, Paper, Typography, Box, Alert } from '@mui/material';
import axios from 'axios';

const ConnectionTest = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult('Testing connection...');
    
    try {
      console.log('Testing backend connection...');
      const response = await axios.get('http://127.0.0.1:6000/health');
      console.log('Backend response:', response);
      setTestResult(`✅ SUCCESS: Backend is reachable!\nStatus: ${response.status}\nData: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      console.error('Connection test failed:', error);
      let errorMessage = '❌ FAILED: ';
      
      if (error.response) {
        errorMessage += `Server responded with status ${error.response.status}\nData: ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        errorMessage += 'No response received from server\nThis usually means the backend is not running or there is a CORS issue.';
      } else {
        errorMessage += `Error: ${error.message}`;
      }
      
      setTestResult(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const testUpload = async () => {
    setIsLoading(true);
    setTestResult('Testing upload...');
    
    try {
      console.log('Testing upload endpoint...');
      const response = await axios.post('http://127.0.0.1:6000/api/upload/text', { 
        text: 'Test upload from frontend' 
      });
      console.log('Upload response:', response);
      setTestResult(`✅ UPLOAD SUCCESS!\nStatus: ${response.status}\nData: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      console.error('Upload test failed:', error);
      let errorMessage = '❌ UPLOAD FAILED: ';
      
      if (error.response) {
        errorMessage += `Server responded with status ${error.response.status}\nData: ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        errorMessage += 'No response received from server';
      } else {
        errorMessage += `Error: ${error.message}`;
      }
      
      setTestResult(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Backend Connection Test</Typography>
      
      <Box sx={{ mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={testConnection} 
          disabled={isLoading}
          sx={{ mr: 1 }}
        >
          Test Health Check
        </Button>
        <Button 
          variant="outlined" 
          onClick={testUpload} 
          disabled={isLoading}
        >
          Test Upload
        </Button>
      </Box>

      {testResult && (
        <Alert severity={testResult.includes('✅') ? 'success' : 'error'} sx={{ whiteSpace: 'pre-line' }}>
          {testResult}
        </Alert>
      )}

      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
        This will help us identify if the issue is with the connection or the upload functionality.
      </Typography>
    </Paper>
  );
};

export default ConnectionTest; 