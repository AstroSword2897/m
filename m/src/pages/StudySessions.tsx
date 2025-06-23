import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import './StudySessions.css';

const StudySessions: React.FC = () => {
  return (
    <Container maxWidth="lg" className="studysessions-container">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Study Sessions
        </Typography>
        <Button variant="contained" component={Link} to="/new-studysession">
          Create New Session
        </Button>
      </Box>
      <Typography>
        This is where you can manage your study sessions. A list of existing sessions will be displayed here.
      </Typography>
      {/* Placeholder for list of study sessions */}
    </Container>
  );
};

export default StudySessions; 