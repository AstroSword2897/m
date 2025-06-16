import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Box,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import './Subjects.css';

interface Subject {
  id: string;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  progress: number;
  materials: number;
  questions: number;
}

const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Fetch subjects from API
    const mockSubjects: Subject[] = [
      {
        id: '1',
        name: 'AP Calculus AB',
        description: 'Study of differential and integral calculus',
        difficulty: 'Hard',
        progress: 65,
        materials: 12,
        questions: 150
      },
      {
        id: '2',
        name: 'AP Physics 1',
        description: 'Algebra-based physics course',
        difficulty: 'Medium',
        progress: 45,
        materials: 8,
        questions: 120
      },
      {
        id: '3',
        name: 'AP Chemistry',
        description: 'Study of matter and its interactions',
        difficulty: 'Hard',
        progress: 30,
        materials: 15,
        questions: 200
      }
    ];
    setSubjects(mockSubjects);
    setLoading(false);
  }, []);

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         subject.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = !selectedDifficulty || subject.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return '#4caf50';
      case 'Medium':
        return '#ff9800';
      case 'Hard':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="subjects-page">
      <div className="subjects-header">
        <Typography variant="h4" component="h1">
          AP Subjects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/subjects/new"
        >
          Add Subject
        </Button>
      </div>

      <div className="subjects-filters">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search subjects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <div className="difficulty-filters">
          {['Easy', 'Medium', 'Hard'].map((difficulty) => (
            <Chip
              key={difficulty}
              label={difficulty}
              onClick={() => setSelectedDifficulty(
                selectedDifficulty === difficulty ? null : difficulty
              )}
              style={{
                backgroundColor: selectedDifficulty === difficulty ? getDifficultyColor(difficulty) : 'transparent',
                color: selectedDifficulty === difficulty ? 'white' : 'inherit',
                border: `1px solid ${getDifficultyColor(difficulty)}`
              }}
            />
          ))}
        </div>
      </div>

      <Grid container spacing={3} className="subjects-grid">
        {filteredSubjects.map((subject) => (
          <Grid item xs={12} sm={6} md={4} key={subject.id}>
            <Card className="subject-card">
              <CardContent>
                <div className="subject-header">
                  <Typography variant="h6" component="h2">
                    {subject.name}
                  </Typography>
                  <Chip
                    label={subject.difficulty}
                    size="small"
                    style={{
                      backgroundColor: getDifficultyColor(subject.difficulty),
                      color: 'white'
                    }}
                  />
                </div>
                <Typography variant="body2" color="textSecondary" className="subject-description">
                  {subject.description}
                </Typography>
                <div className="subject-stats">
                  <div className="stat">
                    <Typography variant="body2" color="textSecondary">
                      Progress
                    </Typography>
                    <Typography variant="h6">
                      {subject.progress}%
                    </Typography>
                  </div>
                  <div className="stat">
                    <Typography variant="body2" color="textSecondary">
                      Materials
                    </Typography>
                    <Typography variant="h6">
                      {subject.materials}
                    </Typography>
                  </div>
                  <div className="stat">
                    <Typography variant="body2" color="textSecondary">
                      Questions
                    </Typography>
                    <Typography variant="h6">
                      {subject.questions}
                    </Typography>
                  </div>
                </div>
                <div className="subject-actions">
                  <Button
                    variant="outlined"
                    component={Link}
                    to={`/subjects/${subject.id}`}
                    fullWidth
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Subjects; 