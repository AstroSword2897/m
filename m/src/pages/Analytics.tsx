import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Lightbulb as LightbulbIcon,
  Stars as StarsIcon,
} from '@mui/icons-material';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Analytics.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface StudyData {
  labels: string[];
  datasets: { label: string; data: number[]; borderColor?: string; backgroundColor?: string; }[];
}

interface PerformanceMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
}

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [studyHoursData, setStudyHoursData] = useState<StudyData>({
    labels: [],
    datasets: [],
  });
  const [quizScoresData, setQuizScoresData] = useState<StudyData>({
    labels: [],
    datasets: [],
  });
  const [subjectDistributionData, setSubjectDistributionData] = useState<StudyData>({
    labels: [],
    datasets: [],
  });
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // TODO: Fetch real analytics data from API
    const mockStudyHours: StudyData = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        { label: 'Total Study Hours', data: [15, 18, 20, 22], borderColor: '#4CAF50', backgroundColor: 'rgba(76, 175, 80, 0.2)' },
      ],
    };

    const mockQuizScores: StudyData = {
      labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4'],
      datasets: [
        { label: 'AP Calculus AB', data: [75, 80, 85, 90], borderColor: '#2196F3', backgroundColor: 'rgba(33, 150, 243, 0.2)' },
        { label: 'AP Physics 1', data: [65, 70, 72, 75], borderColor: '#FFC107', backgroundColor: 'rgba(255, 193, 7, 0.2)' },
      ],
    };

    const mockSubjectDistribution: StudyData = {
      labels: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History'],
      datasets: [
        { data: [30, 25, 20, 15, 10], backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#F44336', '#9C27B0'] },
      ],
    };

    const mockPerformanceMetrics: PerformanceMetric[] = [
      { label: 'Overall Score', value: '82%', trend: 'up', icon: TrendingUpIcon },
      { label: 'Avg Study Hours', value: '19.5', trend: 'stable', icon: BarChartIcon },
      { label: 'Quizzes Taken', value: '15', trend: 'up', icon: PieChartIcon },
    ];

    const mockInsights: string[] = [
      'You are consistently increasing your study hours, leading to better performance.',
      'Focus more on practice questions for AP Physics 1 to improve your scores.',
      'Your strongest subject is AP Chemistry; consider helping peers or exploring advanced topics.',
    ];

    const mockRecommendations: string[] = [
      'Review flashcards for Calculus Chapter 3.',
      'Attempt 5 new practice problems in Physics magnetism.',
      'Read additional materials on World War II history.',
    ];

    setStudyHoursData(mockStudyHours);
    setQuizScoresData(mockQuizScores);
    setSubjectDistributionData(mockSubjectDistribution);
    setPerformanceMetrics(mockPerformanceMetrics);
    setInsights(mockInsights);
    setRecommendations(mockRecommendations);
    setLoading(false);
  }, [timeRange]);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#4caf50';
      case 'down': return '#f44336';
      case 'stable': return '#ff9800';
      default: return '#757575';
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
    <Container maxWidth="lg" className="analytics-page">
      <Box className="analytics-header">
        <Typography variant="h4" component="h1" gutterBottom>
          Study Analytics
        </Typography>
        <FormControl variant="outlined" size="small">
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as string)}
            label="Time Range"
          >
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="semester">This Semester</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3} className="metrics-grid">
        {performanceMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={2} className="metric-card">
              <Box className="metric-icon" sx={{ color: getTrendColor(metric.trend) }}>
                <metric.icon />
              </Box>
              <Box className="metric-content">
                <Typography variant="h6" component="div">
                  {metric.value}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {metric.label}
                </Typography>
              </Box>
              <Chip
                label={metric.trend.charAt(0).toUpperCase() + metric.trend.slice(1)}
                size="small"
                style={{ backgroundColor: getTrendColor(metric.trend), color: 'white' }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} className="charts-grid">
        <Grid item xs={12} md={6}>
          <Paper elevation={2} className="chart-card">
            <Typography variant="h6" component="h2" gutterBottom>Study Hours Trend</Typography>
            <Line data={studyHoursData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} className="chart-card">
            <Typography variant="h6" component="h2" gutterBottom>Quiz Scores Over Time</Typography>
            <Bar data={quizScoresData} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={2} className="chart-card">
            <Typography variant="h6" component="h2" gutterBottom>Subject Study Distribution</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Pie data={subjectDistributionData} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} className="insights-recommendations-grid">
        <Grid item xs={12} md={6}>
          <Paper elevation={2} className="info-card">
            <Typography variant="h5" component="h2" gutterBottom>
              <LightbulbIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Learning Insights
            </Typography>
            <ul>
              {insights.map((insight, index) => (
                <li key={index}><Typography variant="body1">{insight}</Typography></li>
              ))}
            </ul>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} className="info-card">
            <Typography variant="h5" component="h2" gutterBottom>
              <StarsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Personalized Recommendations
            </Typography>
            <ul>
              {recommendations.map((rec, index) => (
                <li key={index}><Typography variant="body1">{rec}</Typography></li>
              ))}
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Analytics; 