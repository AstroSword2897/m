import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Insights as InsightsIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  AccessTime as AccessTimeIcon,
  DoneAll as DoneAllIcon,
  EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import './Analytics.css';

interface DailyStudyData {
  date: string;
  hours: number;
  topicsCovered: number;
}

interface SubjectPerformance {
  subject: string;
  averageScore: number;
  totalQuestionsAttempted: number;
}

const dummyDailyStudyData: DailyStudyData[] = [
  { date: 'Jan 1', hours: 3, topicsCovered: 2 },
  { date: 'Jan 2', hours: 4, topicsCovered: 3 },
  { date: 'Jan 3', hours: 2, topicsCovered: 1 },
  { date: 'Jan 4', hours: 5, topicsCovered: 4 },
  { date: 'Jan 5', hours: 3.5, topicsCovered: 2 },
  { date: 'Jan 6', hours: 4.5, topicsCovered: 3 },
  { date: 'Jan 7', hours: 2.5, topicsCovered: 1 },
];

const dummySubjectPerformance: SubjectPerformance[] = [
  { subject: 'Mathematics', averageScore: 88, totalQuestionsAttempted: 150 },
  { subject: 'Physics', averageScore: 75, totalQuestionsAttempted: 120 },
  { subject: 'Chemistry', averageScore: 82, totalQuestionsAttempted: 100 },
  { subject: 'Literature', averageScore: 90, totalQuestionsAttempted: 80 },
  { subject: 'Computer Science', averageScore: 95, totalQuestionsAttempted: 180 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF69B4'];

const Analytics: React.FC = () => {
  const totalStudyHours = dummyDailyStudyData.reduce((sum, data) => sum + data.hours, 0);
  const totalTopicsCovered = dummyDailyStudyData.reduce((sum, data) => sum + data.topicsCovered, 0);
  const overallAverageScore = dummySubjectPerformance.reduce((sum, data) => sum + data.averageScore, 0) / dummySubjectPerformance.length;

  return (
    <Container maxWidth="lg" className="analytics-page">
      <Box className="analytics-header">
        <Typography variant="h4" component="h1" gutterBottom className="page-title">
          <InsightsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Your Study Analytics
        </Typography>
      </Box>

      <Grid container spacing={3} className="summary-metrics-grid">
        <Grid item xs={12} sm={6} md={4}>
          <Card className="metric-card">
            <CardContent>
              <AccessTimeIcon className="metric-icon" />
              <Typography variant="h6" className="metric-title">Total Study Hours</Typography>
              <Typography variant="h4" className="metric-value">
                {totalStudyHours.toFixed(1)} hrs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="metric-card">
            <CardContent>
              <DoneAllIcon className="metric-icon" />
              <Typography variant="h6" className="metric-title">Total Topics Covered</Typography>
              <Typography variant="h4" className="metric-value">
                {totalTopicsCovered}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="metric-card">
            <CardContent>
              <EmojiEventsIcon className="metric-icon" />
              <Typography variant="h6" className="metric-title">Avg. Quiz Score</Typography>
              <Typography variant="h4" className="metric-value">
                {overallAverageScore.toFixed(1)}%
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
                Daily Study Hours & Topics
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={dummyDailyStudyData}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="date" stroke="var(--text-muted)" />
                  <YAxis yAxisId="left" stroke="var(--primary-pink)" label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: 'var(--primary-pink)' }} />
                  <YAxis yAxisId="right" orientation="right" stroke="var(--secondary-purple)" label={{ value: 'Topics', angle: 90, position: 'insideRight', fill: 'var(--secondary-purple)' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border-color)', color: 'var(--text-light)' }}
                    itemStyle={{ color: 'var(--text-light)' }}
                  />
                  <Legend wrapperStyle={{ color: 'var(--text-light)' }} />
                  <Line yAxisId="left" type="monotone" dataKey="hours" stroke="var(--primary-pink)" activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="topicsCovered" stroke="var(--secondary-purple)" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="chart-card">
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom className="chart-title">
                Subject Performance (Average Score)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={dummySubjectPerformance}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="subject" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border-color)', color: 'var(--text-light)' }}
                    itemStyle={{ color: 'var(--text-light)' }}
                  />
                  <Legend wrapperStyle={{ color: 'var(--text-light)' }} />
                  <Bar dataKey="averageScore" fill="var(--primary-pink)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box className="detailed-performance-section">
        <Typography variant="h5" component="h2" gutterBottom className="section-title">
          Detailed Subject Performance
        </Typography>
        <Grid container spacing={2}>
          {dummySubjectPerformance.map((subject, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card className="detail-performance-card">
                <CardContent>
                  <Typography variant="h6" className="detail-subject-title">
                    {subject.subject}
                  </Typography>
                  <Box className="detail-item">
                    <Typography variant="body2">Average Score:</Typography>
                    <Chip label={`${subject.averageScore}%`} className="detail-chip-score" />
                  </Box>
                  <Box className="detail-item">
                    <Typography variant="body2">Questions Attempted:</Typography>
                    <Chip label={subject.totalQuestionsAttempted} className="detail-chip-questions" />
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

export default Analytics; 