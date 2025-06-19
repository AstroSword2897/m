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
  Chip,
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Timer as TimerIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import './Practice.css';

interface PracticeQuestion {
  id: string;
  title: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number;
  points: number;
  completed: number;
  total: number;
  lastAttempted: string;
  successRate: number;
}

const Practice: React.FC = () => {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  // @ts-ignore
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  console.log(selectedSubject);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  useEffect(() => {
    // Load generated practice questions from localStorage
    const savedQuestions = localStorage.getItem('studyflow_practice');
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    } else {
      // Fallback to mock data if no generated data exists
      const mockQuestions: PracticeQuestion[] = [
        {
          id: '1',
          title: 'Derivatives and Integrals',
          subject: 'AP Calculus AB',
          difficulty: 'Hard',
          timeLimit: 30,
          points: 100,
          completed: 8,
          total: 10,
          lastAttempted: '2024-02-15',
          successRate: 75
        },
        {
          id: '2',
          title: 'Newton\'s Laws',
          subject: 'AP Physics 1',
          difficulty: 'Medium',
          timeLimit: 20,
          points: 80,
          completed: 5,
          total: 10,
          lastAttempted: '2024-02-14',
          successRate: 60
        },
        {
          id: '3',
          title: 'Chemical Reactions',
          subject: 'AP Chemistry',
          difficulty: 'Easy',
          timeLimit: 15,
          points: 50,
          completed: 3,
          total: 10,
          lastAttempted: '2024-02-13',
          successRate: 90
        }
      ];
      setQuestions(mockQuestions);
    }
    setLoading(false);
  }, [selectedSubject, selectedQuestion]);

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = !selectedDifficulty || question.difficulty === selectedDifficulty;
    const matchesSubject = !selectedSubject || question.subject === selectedSubject;
    return matchesSearch && matchesDifficulty && matchesSubject;
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, questionId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedQuestion(questionId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedQuestion(null);
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="practice-page">
      <div className="practice-header">
        <Typography variant="h4" component="h1">
          Practice Questions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/practice/new"
        >
          Create Question
        </Button>
      </div>

      <div className="practice-filters">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search questions..."
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
        <div className="filter-chips">
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

      <Grid container spacing={3} className="practice-grid">
        {filteredQuestions.map((question) => (
          <Grid item xs={12} sm={6} md={4} key={question.id}>
            <Card className="question-card">
              <CardContent>
                <div className="question-header">
                  <div className="question-info">
                    <Typography variant="h6" component="h2">
                      {question.title}
                    </Typography>
                    <Chip
                      label={question.difficulty}
                      size="small"
                      style={{
                        backgroundColor: getDifficultyColor(question.difficulty),
                        color: 'white'
                      }}
                    />
                  </div>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, question.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </div>
                <div className="question-meta">
                  <div className="meta-item">
                    <SchoolIcon fontSize="small" />
                    <Typography variant="body2" color="textSecondary">
                      {question.subject}
                    </Typography>
                  </div>
                  <div className="meta-item">
                    <TimerIcon fontSize="small" />
                    <Typography variant="body2" color="textSecondary">
                      {question.timeLimit} min
                    </Typography>
                  </div>
                  <div className="meta-item">
                    <TrendingUpIcon fontSize="small" />
                    <Typography variant="body2" color="textSecondary">
                      {question.points} pts
                    </Typography>
                  </div>
                </div>
                <div className="question-progress">
                  <div className="progress-header">
                    <Typography variant="body2" color="textSecondary">
                      Progress
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {question.completed}/{question.total}
                    </Typography>
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={(question.completed / question.total) * 100}
                    className="progress-bar"
                  />
                </div>
                <div className="question-stats">
                  <div className="stat">
                    <Typography variant="body2" color="textSecondary">
                      Success Rate
                    </Typography>
                    <Typography variant="h6">
                      {question.successRate}%
                    </Typography>
                  </div>
                  <div className="stat">
                    <Typography variant="body2" color="textSecondary">
                      Last Attempt
                    </Typography>
                    <Typography variant="body2">
                      {new Date(question.lastAttempted).toLocaleDateString()}
                    </Typography>
                  </div>
                </div>
                <div className="question-actions">
                  <Button
                    variant="contained"
                    component={Link}
                    to={`/practice/${question.id}`}
                    fullWidth
                  >
                    Start Practice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        <MenuItem onClick={handleMenuClose}>Share</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

export default Practice; 