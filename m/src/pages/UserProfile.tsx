import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Slider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Avatar,
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Favorite as FavoriteIcon,
  EventNote as EventNoteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import './UserProfile.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const UserProfile: React.FC = () => {
  const [value, setValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Passionate student focusing on STEM subjects and aspiring to become a software engineer.',
    profilePicture: '/src/assets/react.svg',
  });
  const [preferences, setPreferences] = useState({
    darkMode: false,
    notifications: true,
    studyReminderTime: 60,
    preferredSubject: 'Physics',
  });
  const [studyGoals, setStudyGoals] = useState({
    weeklyHours: 20,
    subjectsToMaster: ['Calculus', 'Chemistry'],
    examTargets: {
      'AP Calculus AB': 90,
      'AP Physics 1': 85,
    },
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>, type: string) => {
    if (type === 'switch') {
      setPreferences(prev => ({ ...prev, [event.target.name as string]: (event.target as HTMLInputElement).checked }));
    } else if (type === 'slider') {
      setPreferences(prev => ({ ...prev, studyReminderTime: event as unknown as number }));
    } else if (type === 'select') {
      setPreferences(prev => ({ ...prev, preferredSubject: event.target.value as string }));
    } else {
      const { name, value } = event.target as HTMLInputElement | HTMLTextAreaElement;
      setPreferences(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleStudyGoalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStudyGoals(prev => ({ ...prev, [name]: value }));
  };

  const handleExamTargetChange = (subject: string, score: number) => {
    setStudyGoals(prev => ({
      ...prev,
      examTargets: {
        ...prev.examTargets,
        [subject]: score,
      },
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality (API call)
    setIsEditing(false);
  };

  const handleCancel = () => {
    // TODO: Revert changes if necessary (fetch original data)
    setIsEditing(false);
  };

  return (
    <Container maxWidth="lg" className="user-profile-page">
      <Paper elevation={3} className="profile-container">
        <Box sx={{ flexGrow: 1, display: 'flex', height: 600 }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="User profile tabs"
            sx={{ borderRight: 1, borderColor: 'divider' }}
            className="profile-tabs"
          >
            <Tab icon={<AccountCircleIcon />} label="Profile" {...a11yProps(0)} />
            <Tab icon={<SettingsIcon />} label="Preferences" {...a11yProps(1)} />
            <Tab icon={<EventNoteIcon />} label="Study Goals" {...a11yProps(2)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <Box className="tab-content">
              <Typography variant="h5" component="h2" gutterBottom>Profile Information</Typography>
              <Box className="profile-header-section">
                <Avatar src={profile.profilePicture} alt={profile.name} sx={{ width: 100, height: 100 }} />
                <Typography variant="h6" component="h3">{profile.name}</Typography>
                <Typography variant="body2" color="textSecondary">{profile.email}</Typography>
              </Box>
              <Grid container spacing={2} className="profile-details-grid">
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    fullWidth
                    margin="normal"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    fullWidth
                    margin="normal"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Bio"
                    name="bio"
                    value={profile.bio}
                    onChange={handleProfileChange}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>
              <Box className="profile-actions">
                {!isEditing ? (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      sx={{ mr: 2 }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Box className="tab-content">
              <Typography variant="h5" component="h2" gutterBottom>Preferences</Typography>
              <Box className="preference-item">
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.darkMode}
                      onChange={(e) => handlePreferenceChange(e, 'switch')}
                      name="darkMode"
                    />
                  }
                  label="Dark Mode"
                />
              </Box>
              <Box className="preference-item">
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifications}
                      onChange={(e) => handlePreferenceChange(e, 'switch')}
                      name="notifications"
                    />
                  }
                  label="Enable Notifications"
                />
              </Box>
              <Box className="preference-item">
                <Typography gutterBottom>Study Reminder Time (minutes)</Typography>
                <Slider
                  value={preferences.studyReminderTime}
                  onChange={(e, val) => handlePreferenceChange(val, 'slider')}
                  aria-labelledby="study-reminder-time-slider"
                  valueLabelDisplay="auto"
                  step={10}
                  marks
                  min={0}
                  max={120}
                />
              </Box>
              <Box className="preference-item">
                <FormControl fullWidth margin="normal">
                  <InputLabel id="preferred-subject-label">Preferred Study Subject</InputLabel>
                  <Select
                    labelId="preferred-subject-label"
                    id="preferred-subject-select"
                    value={preferences.preferredSubject}
                    onChange={(e) => handlePreferenceChange(e, 'select')}
                    label="Preferred Study Subject"
                  >
                    <MenuItem value="Mathematics">Mathematics</MenuItem>
                    <MenuItem value="Physics">Physics</MenuItem>
                    <MenuItem value="Chemistry">Chemistry</MenuItem>
                    <MenuItem value="Biology">Biology</MenuItem>
                    <MenuItem value="History">History</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Box className="tab-content">
              <Typography variant="h5" component="h2" gutterBottom>Study Goals</Typography>
              <TextField
                label="Weekly Study Hours Goal"
                name="weeklyHours"
                type="number"
                value={studyGoals.weeklyHours}
                onChange={handleStudyGoalChange}
                fullWidth
                margin="normal"
              />
              <Typography variant="h6" component="h3" sx={{ mt: 3, mb: 1 }}>Subjects to Master</Typography>
              <TextField
                label="Subjects (comma-separated)"
                name="subjectsToMaster"
                value={studyGoals.subjectsToMaster.join(', ')}
                onChange={handleStudyGoalChange}
                fullWidth
                margin="normal"
              />
              <Typography variant="h6" component="h3" sx={{ mt: 3, mb: 1 }}>Exam Targets</Typography>
              <Grid container spacing={2}>
                {Object.entries(studyGoals.examTargets).map(([subject, score]) => (
                  <Grid item xs={12} sm={6} key={subject}>
                    <TextField
                      label={`${subject} Target Score`}
                      type="number"
                      value={score}
                      onChange={(e) => handleExamTargetChange(subject, parseInt(e.target.value))}
                      fullWidth
                      margin="normal"
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserProfile; 