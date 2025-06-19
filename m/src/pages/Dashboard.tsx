import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  FlashOn as FlashOnIcon,
  LightbulbOutlined as LightbulbOutlinedIcon,
  MenuBook as MenuBookIcon,
  AccessAlarm as AccessAlarmIcon,
  BarChart as BarChartIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" className="dashboard-page">
      <Box className="welcome-section">
        <Typography variant="h3" component="h1" gutterBottom className="welcome-title">
          Welcome to StudyFlow!
        </Typography>
        <Typography variant="h6" component="p" className="welcome-subtitle">
          Your personalized platform for academic excellence.
        </Typography>
      </Box>

      <Grid container spacing={3} className="dashboard-grid">
        {/* Smart Daily Study Planner */}
        <Grid item xs={12} md={6} lg={4}>
          <Card className="dashboard-card">
            <CardContent>
              <AccessAlarmIcon className="card-icon" />
              <Typography variant="h5" component="h2" className="card-title">
                Smart Daily Study Planner
              </Typography>
              <Typography variant="body2" className="card-description">
                Organize your tasks, set reminders, and track your study time efficiently.
              </Typography>
              <Button component={Link} to="/schedule" variant="contained" className="card-button">
                Go to Planner
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Learning Pulse Check (Flashcards) */}
        <Grid item xs={12} md={6} lg={4}>
          <Card className="dashboard-card">
            <CardContent>
              <FlashOnIcon className="card-icon" />
              <Typography variant="h5" component="h2" className="card-title">
                Learning Pulse Check
              </Typography>
              <Typography variant="body2" className="card-description">
                Strengthen your memory with intelligent flashcards and spaced repetition.
              </Typography>
              <Button component={Link} to="/flashcards" variant="contained" className="card-button">
                Start Flashcards
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Study Mode (Study Materials) */}
        <Grid item xs={12} md={6} lg={4}>
          <Card className="dashboard-card">
            <CardContent>
              <MenuBookIcon className="card-icon" />
              <Typography variant="h5" component="h2" className="card-title">
                Quick Study Mode
              </Typography>
              <Typography variant="body2" className="card-description">
                Access and organize all your study materials in one place.
              </Typography>
              <Button component={Link} to="/study-materials" variant="contained" className="card-button">
                Browse Materials
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Powered Tools */}
        <Grid item xs={12} md={6} lg={4}>
          <Card className="dashboard-card">
            <CardContent>
              <LightbulbOutlinedIcon className="card-icon" />
              <Typography variant="h5" component="h2" className="card-title">
                AI Powered Tools
              </Typography>
              <Typography variant="body2" className="card-description">
                Utilize intelligent tools for summaries, problem-solving, and more.
              </Typography>
              <Button component={Link} to="/tools" variant="contained" className="card-button">
                Explore AI Tools
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Progress & Analytics */}
        <Grid item xs={12} md={6} lg={4}>
          <Card className="dashboard-card">
            <CardContent>
              <BarChartIcon className="card-icon" />
              <Typography variant="h5" component="h2" className="card-title">
                Progress & Analytics
              </Typography>
              <Typography variant="body2" className="card-description">
                Track your learning journey and visualize your academic growth.
              </Typography>
              <Button component={Link} to="/progress" variant="contained" className="card-button">
                View Progress
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Collaborative Learning */}
        <Grid item xs={12} md={6} lg={4}>
          <Card className="dashboard-card">
            <CardContent>
              <GroupIcon className="card-icon" />
              <Typography variant="h5" component="h2" className="card-title">
                Collaborative Learning
              </Typography>
              <Typography variant="body2" className="card-description">
                Connect with peers and study together in real-time.
              </Typography>
              <Button component={Link} to="/collaborate" variant="contained" className="card-button">
                Join Collaboration
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 