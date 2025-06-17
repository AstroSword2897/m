import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import './Collaborate.css';

const Collaborate: React.FC = () => {
  return (
    <Container maxWidth="lg" className="collaborate-page">
      <Paper elevation={3} className="collaborate-container">
        <Box className="collaborate-header">
          <Typography variant="h4" component="h1" gutterBottom>
            Collaborative Study
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Work together, share resources, and achieve your study goals with your peers.
          </Typography>
        </Box>
        <Box className="collaborate-content">
          <Typography variant="h6" component="h2" gutterBottom>
            Coming Soon!
          </Typography>
          <Typography variant="body2" color="textSecondary">
            We're actively working on bringing you exciting collaborative features like study groups, shared notes, and real-time discussion boards.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Collaborate; 