import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  DoneAll as DoneAllIcon,
  EmojiEvents as EmojiEventsIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './Progress.css';

interface SubjectProgress {
  subject: string;
  completedTopics: number;
  totalTopics: number;
  averageScore: number;
  timeSpent: number; // in hours
}

const dummyProgress: SubjectProgress[] = [
  {
    subject: 'Mathematics',
    completedTopics: 10,
    totalTopics: 15,
    averageScore: 85,
    timeSpent: 120,
  },
  {
    subject: 'Physics',
    completedTopics: 7,
    totalTopics: 12,
    averageScore: 78,
    timeSpent: 90,
  },
  {
    subject: 'Chemistry',
    completedTopics: 5,
    totalTopics: 10,
    averageScore: 70,
    timeSpent: 75,
  },
  {
    subject: 'Literature',
    completedTopics: 8,
    totalTopics: 10,
    averageScore: 92,
    timeSpent: 60,
  },
];

const overallProgress = dummyProgress.reduce(
  (acc, curr) => {
    acc.completedTopics += curr.completedTopics;
    acc.totalTopics += curr.totalTopics;
    acc.totalScore += curr.averageScore * curr.completedTopics; // Weighted average
    acc.totalTimeSpent += curr.timeSpent;
    return acc;
  },
  { completedTopics: 0, totalTopics: 0, totalScore: 0, totalTimeSpent: 0 }
);

const overallPercentage = overallProgress.totalTopics > 0
  ? (overallProgress.completedTopics / overallProgress.totalTopics) * 100
  : 0;

const overallAverageScore = overallProgress.completedTopics > 0
  ? overallProgress.totalScore / overallProgress.completedTopics
  : 0;

const pieChartData = dummyProgress.map(data => ({
  name: data.subject,
  value: data.timeSpent,
}));

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF69B4'];

const Progress: React.FC = () => {
  return (
    <Container maxWidth="lg" className="progress-page">
      <Box className="progress-header">
        <Typography variant="h4" component="h1" gutterBottom className="page-title">
          <TrendingUpIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Your Progress & Analytics
        </Typography>
      </Box>

      <Grid container spacing={3} className="summary-cards-grid">
        <Grid item xs={12} sm={6} md={3}>
          <Card className="summary-card">
            <CardContent>
              <DoneAllIcon className="summary-icon" />
              <Typography variant="h6" className="summary-title">Topics Completed</Typography>
              <Typography variant="h4" className="summary-value">
                {overallProgress.completedTopics} / {overallProgress.totalTopics}
              </Typography>
              <LinearProgress variant="determinate" value={overallPercentage} className="summary-progress-bar" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="summary-card">
            <CardContent>
              <EmojiEventsIcon className="summary-icon" />
              <Typography variant="h6" className="summary-title">Average Score</Typography>
              <Typography variant="h4" className="summary-value">
                {overallAverageScore.toFixed(1)}%
              </Typography>
              <LinearProgress variant="determinate" value={overallAverageScore} className="summary-progress-bar" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="summary-card">
            <CardContent>
              <HourglassEmptyIcon className="summary-icon" />
              <Typography variant="h6" className="summary-title">Time Spent (Hours)</Typography>
              <Typography variant="h4" className="summary-value">
                {overallProgress.totalTimeSpent.toFixed(0)}
              </Typography>
              <LinearProgress variant="determinate" value={Math.min(overallProgress.totalTimeSpent / 2, 100)} className="summary-progress-bar" /> {/* Assuming 200 hours as max for progress bar */}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="summary-card overall-percentage-card">
            <CardContent>
              <Typography variant="h6" className="summary-title">Overall Progress</Typography>
              <Typography variant="h3" className="overall-percentage-value">
                {overallPercentage.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} className="charts-grid">
        <Grid item xs={12} md={6}>
          <Card className="chart-card">
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom className="chart-title">
                Topics Completed by Subject
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={dummyProgress.map(data => ({ name: data.subject, completed: data.completedTopics }))}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border-color)', color: 'var(--text-light)' }}
                    itemStyle={{ color: 'var(--text-light)' }}
                  />
                  <Bar dataKey="completed" fill="var(--primary-pink)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="chart-card">
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom className="chart-title">
                Time Spent by Subject
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border-color)', color: 'var(--text-light)' }}
                    itemStyle={{ color: 'var(--text-light)' }}
                  />
                  <Legend wrapperStyle={{ color: 'var(--text-light)' }} formatter={(value, entry) => <span style={{ color: 'var(--text-light)' }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box className="subject-details-section">
        <Typography variant="h5" component="h2" gutterBottom className="section-title">
          Subject-wise Breakdown
        </Typography>
        <Grid container spacing={2}>
          {dummyProgress.map((subject, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card className="subject-detail-card">
                <CardContent>
                  <Typography variant="h6" className="subject-detail-title">
                    {subject.subject}
                  </Typography>
                  <Box className="detail-item">
                    <Typography variant="body2">Completed Topics:</Typography>
                    <Chip label={`${subject.completedTopics} / ${subject.totalTopics}`} className="detail-chip" />
                  </Box>
                  <Box className="detail-item">
                    <Typography variant="body2">Average Score:</Typography>
                    <Chip label={`${subject.averageScore}%`} className="detail-chip" />
                  </Box>
                  <Box className="detail-item">
                    <Typography variant="body2">Time Spent:</Typography>
                    <Chip label={`${subject.timeSpent} hrs`} className="detail-chip" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Progress; 