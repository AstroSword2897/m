import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
} from '@mui/material';
import {
  Book,
  Edit,
  Style,
  Event,
  TrendingUp,
  Group,
  CloudUpload,
} from '@mui/icons-material';
import './Dashboard.css';
import FileUpload from '../components/FileUpload';

const Dashboard: React.FC = () => {
  const features = [
    {
      title: 'Study Sessions',
      icon: <Book />,
      path: '/studysessions',
      description: 'Create, manage, and review your study sessions.',
    },
    {
      title: 'Collaborate',
      icon: <Group />,
      path: '/collaborate',
      description: 'Chat and collaborate with other students.',
    },
  ];

  return (
    <Container maxWidth="lg" className="dashboard-container">
      <Typography variant="h4" gutterBottom>
        Welcome to your Dashboard
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', mt: 4 }}>
        {features.map((feature) => (
          <Card className="feature-card" key={feature.title} sx={{ flex: '1 1 300px', maxWidth: '350px' }}>
            <CardContent>
              {feature.icon}
              <Typography variant="h6">{feature.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
                {feature.description}
              </Typography>
              <Button variant="contained" href={feature.path}>
                Go to {feature.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Box sx={{ mt: 4, p: 2, border: '1px dashed grey', borderRadius: '4px' }}>
        <FileUpload />
      </Box>
    </Container>
  );
};

export default Dashboard; 