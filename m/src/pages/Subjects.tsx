import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
} from '@mui/material';
import {
  School as SchoolIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import './Subjects.css';

interface Subject {
  id: string;
  name: string;
  description: string;
  progress: number; // Percentage
  topics: string[];
}

const dummySubjects: Subject[] = [
  {
    id: '1',
    name: 'Mathematics',
    description: 'Algebra, Calculus, Geometry, and Statistics.',
    progress: 75,
    topics: ['Algebra', 'Calculus', 'Geometry', 'Statistics'],
  },
  {
    id: '2',
    name: 'Physics',
    description: 'Mechanics, Thermodynamics, Electromagnetism, and Optics.',
    progress: 60,
    topics: ['Mechanics', 'Thermodynamics', 'Electromagnetism'],
  },
  {
    id: '3',
    name: 'Chemistry',
    description: 'Organic, Inorganic, Physical, and Analytical Chemistry.',
    progress: 40,
    topics: ['Organic', 'Inorganic', 'Physical'],
  },
  {
    id: '4',
    name: 'Computer Science',
    description: 'Algorithms, Data Structures, and Programming Paradigms.',
    progress: 90,
    topics: ['Algorithms', 'Data Structures', 'Programming'],
  },
];

const Subjects: React.FC = () => {
  return (
    <Container maxWidth="lg" className="subjects-page">
      <Box className="subjects-header">
        <Typography variant="h4" component="h1" gutterBottom className="page-title">
          <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Your Subjects
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} className="add-subject-button">
          Add New Subject
        </Button>
      </Box>

      <Grid container spacing={3} className="subjects-grid">
        {dummySubjects.map((subject) => (
          <Grid item xs={12} md={6} lg={4} key={subject.id}>
            <Card className="subject-card">
              <CardContent>
                <Typography variant="h5" component="h2" className="subject-title">
                  {subject.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="subject-description">
                  {subject.description}
                </Typography>
                <Box className="subject-progress">
                  <Typography variant="body2">Progress: {subject.progress}%</Typography>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>
                </Box>
                <Box className="subject-topics">
                  {subject.topics.map((topic, index) => (
                    <Chip key={index} label={topic} className="topic-chip" />
                  ))}
                </Box>
                <Button variant="outlined" className="view-subject-button">
                  View Subject
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Subjects; 