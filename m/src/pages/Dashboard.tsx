import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Tabs,
  Tab,
  Paper,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  TextField,
  InputAdornment,
  Chip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import YouTubeIcon from '@mui/icons-material/YouTube';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [flashcards, setFlashcards] = useState(10);
  const [quizQuestions, setQuizQuestions] = useState(8);

  const handleTabChange = (_: any, newValue: number) => setTab(newValue);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 0, #2d193c 0%, #18141c 100%)', pb: 8 }}>
      {/* Top Bar */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ background: 'none', mb: 4 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <img src="/favicon.ico" alt="logo" style={{ width: 32, height: 32 }} />
            <Typography variant="h5" fontWeight={700} color="#fff">StudyFlow</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={3}>
            <Box sx={{ background: '#2d193c', borderRadius: 2, px: 2, py: 1, color: '#fff', fontWeight: 500 }}>
              Daily Goal <Chip label="0m / 30m" size="small" sx={{ ml: 1, background: '#fff', color: '#2d193c', fontWeight: 700 }} />
            </Box>
            <Avatar sx={{ bgcolor: '#7c3aed' }}><AccountCircleIcon /></Avatar>
            <Typography color="#fff" fontWeight={600}>User</Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        {/* Upload Study Material Card */}
        <Card sx={{ background: 'rgba(40, 30, 60, 0.98)', borderRadius: 4, boxShadow: 6, mb: 4 }}>
          <CardContent>
            <Typography variant="h5" fontWeight={700} color="#fff" mb={2}>
              Upload Study Material
            </Typography>
            <Tabs value={tab} onChange={handleTabChange} textColor="secondary" indicatorColor="secondary" sx={{ mb: 2 }}>
              <Tab label="File Upload" icon={<CloudUploadIcon />} iconPosition="start" />
              <Tab label="Text Input" icon={<InsertDriveFileIcon />} iconPosition="start" />
              <Tab label="YouTube" icon={<YouTubeIcon />} iconPosition="start" />
            </Tabs>
            {tab === 0 && (
              <Box>
                <TextField
                  label="Title (optional)"
                  fullWidth
                  variant="outlined"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#bbb' } }}
                />
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      label="Flashcards"
                      type="number"
                      value={flashcards}
                      onChange={e => setFlashcards(Number(e.target.value))}
                      fullWidth
                      InputProps={{ endAdornment: <InputAdornment position="end">cards</InputAdornment> }}
                      sx={{ input: { color: '#fff' }, label: { color: '#bbb' } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Quiz Questions"
                      type="number"
                      value={quizQuestions}
                      onChange={e => setQuizQuestions(Number(e.target.value))}
                      fullWidth
                      InputProps={{ endAdornment: <InputAdornment position="end">questions</InputAdornment> }}
                      sx={{ input: { color: '#fff' }, label: { color: '#bbb' } }}
                    />
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    border: '2px dashed #7c3aed',
                    borderRadius: 3,
                    background: 'rgba(60, 40, 80, 0.7)',
                    minHeight: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    p: 3
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 40, color: '#7c3aed', mb: 1 }} />
                  <Typography color="#bbb">Drop your files here</Typography>
                  <Button
                    variant="contained"
                    component="label"
                    sx={{ mt: 2, background: '#7c3aed', color: '#fff', borderRadius: 3, fontWeight: 700 }}
                  >
                    Browse Files
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                  {file && <Typography color="#fff" mt={1}>{file.name}</Typography>}
                </Box>
                <Typography variant="caption" color="#bbb">
                  Supported formats: PDF, Images (JPG, PNG), Word docs, Text files<br />
                  AI Processing: Your material will be analyzed to generate flashcards, quiz questions, mind maps, and summaries automatically.
                </Typography>
              </Box>
            )}
            {/* Add Text Input and YouTube tab content as needed */}
          </CardContent>
        </Card>

        {/* Recent Study Sessions */}
        <Card sx={{ background: 'rgba(40, 30, 60, 0.98)', borderRadius: 4, boxShadow: 6, mb: 4 }}>
          <CardContent>
            <Typography variant="h6" color="#fff" mb={2}>Recent Study Sessions</Typography>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={120}>
              <MenuBookIcon sx={{ fontSize: 40, color: '#7c3aed', mb: 1 }} />
              <Typography color="#bbb">No Study Sessions Yet</Typography>
              <Typography color="#888" variant="body2">Upload study material above to create your first AI-powered study session.</Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Study Tools for Recent Session */}
        <Card sx={{ background: 'rgba(40, 30, 60, 0.98)', borderRadius: 4, boxShadow: 6 }}>
          <CardContent>
            <Typography variant="h6" color="#fff" mb={2}>Study Tools for Recent Session</Typography>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={120}>
              <StarBorderIcon sx={{ fontSize: 40, color: '#7c3aed', mb: 1 }} />
              <Typography color="#bbb">No Completed Sessions Yet</Typography>
              <Typography color="#888" variant="body2">Upload study material above to generate AI-powered study tools.</Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Dashboard; 