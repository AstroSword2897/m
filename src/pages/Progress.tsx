import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { ChangeEvent } from 'react';
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
  LinearProgress,
  Select,
  MenuItem as SelectMenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import './Progress.css';

interface SubjectProgress {
  id: string;
  subject: string;
  overallScore: number;
  practiceScore: number;
  quizScore: number;
  examScore: number;
  studyHours: number;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
}

const Progress: React.FC = () => {
  const [progress, setProgress] = useState<SubjectProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('week');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProgress, setSelectedProgress] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Fetch progress data from API
    const mockProgress: SubjectProgress[] = [
      {
        id: '1',
        subject: 'AP Calculus AB',
        overallScore: 85,
        practiceScore: 90,
        quizScore: 80,
        examScore: 85,
        studyHours: 25,
        lastUpdated: '2024-02-20',
        trend: 'up'
      },
      {
        id: '2',
        subject: 'AP Physics 1',
        overallScore: 75,
        practiceScore: 70,
        quizScore: 80,
        examScore: 75,
        studyHours: 20,
        lastUpdated: '2024-02-20',
        trend: 'stable'
      },
      {
        id: '3',
        subject: 'AP Chemistry',
        overallScore: 90,
        practiceScore: 95,
        quizScore: 85,
        examScore: 90,
        studyHours: 30,
        lastUpdated: '2024-02-20',
        trend: 'up'
      }
    ];
    setProgress(mockProgress);
    setLoading(false);
  }, [selectedProgress]);

  const filteredProgress = progress.filter(item => {
    const matchesSearch = item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !selectedSubject || item.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return '#4caf50';
      case 'down':
        return '#f44336';
      case 'stable':
        return '#ff9800';
      default:
        return '#757575';
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, progressId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedProgress(progressId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProgress(null);
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="progress-page">
      <div className="progress-header">
        <Typography variant="h4" component="h1">
          Study Progress
        </Typography>
        <FormControl variant="outlined" size="small">
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e: SelectChangeEvent<string>) => setTimeRange(e.target.value)}
            label="Time Range"
          >
            <SelectMenuItem value="week">This Week</SelectMenuItem>
            <SelectMenuItem value="month">This Month</SelectMenuItem>
            <SelectMenuItem value="semester">This Semester</SelectMenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="progress-filters">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search subjects..."
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <div className="filter-chips">
          {['AP Calculus AB', 'AP Physics 1', 'AP Chemistry'].map((subject) => (
            <Chip
              key={subject}
              icon={<SchoolIcon />}
              label={subject}
              onClick={() => setSelectedSubject(
                selectedSubject === subject ? null : subject
              )}
              color={selectedSubject === subject ? 'primary' : 'default'}
              variant={selectedSubject === subject ? 'filled' : 'outlined'}
            />
          ))}
        </div>
      </div>

      <Grid container spacing={3} className="progress-grid">
        {filteredProgress.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card className="progress-card">
              <CardContent>
                <div className="progress-header">
                  <div className="progress-info">
                    <Typography variant="h6" component="h2">
                      {item.subject}
                    </Typography>
                    <Chip
                      icon={<TrendingUpIcon />}
                      label={`${item.trend === 'up' ? '+' : item.trend === 'down' ? '-' : '='} ${item.overallScore}%`}
                      size="small"
                      style={{
                        backgroundColor: getTrendColor(item.trend),
                        color: 'white'
                      }}
                    />
                  </div>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, item.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </div>
                <div className="progress-scores">
                  <div className="score-item">
                    <Typography variant="body2" color="textSecondary">
                      Practice
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={item.practiceScore}
                      className="score-bar"
                    />
                    <Typography variant="body2">
                      {item.practiceScore}%
                    </Typography>
                  </div>
                  <div className="score-item">
                    <Typography variant="body2" color="textSecondary">
                      Quizzes
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={item.quizScore}
                      className="score-bar"
                    />
                    <Typography variant="body2">
                      {item.quizScore}%
                    </Typography>
                  </div>
                  <div className="score-item">
                    <Typography variant="body2" color="textSecondary">
                      Exams
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={item.examScore}
                      className="score-bar"
                    />
                    <Typography variant="body2">
                      {item.examScore}%
                    </Typography>
                  </div>
                </div>
                <div className="progress-meta">
                  <div className="meta-item">
                    <TimelineIcon fontSize="small" />
                    <Typography variant="body2" color="textSecondary">
                      Study Hours: {item.studyHours}
                    </Typography>
                  </div>
                  <div className="meta-item">
                    <AssessmentIcon fontSize="small" />
                    <Typography variant="body2" color="textSecondary">
                      Last Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                    </Typography>
                  </div>
                </div>
                <div className="progress-actions">
                  <Button
                    variant="contained"
                    component={Link}
                    to={`/progress/${item.id}`}
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

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleMenuClose()}
      >
        <MenuItem onClick={() => handleMenuClose()}>View History</MenuItem>
        <MenuItem onClick={() => handleMenuClose()}>Export Data</MenuItem>
        <MenuItem onClick={() => handleMenuClose()}>Share Progress</MenuItem>
      </Menu>
    </div>
  );
};

export default Progress; 