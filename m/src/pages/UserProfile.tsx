import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Star as StarIcon,
  Subject as SubjectIcon,
  EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';
import './UserProfile.css';
import axios from 'axios';
import Grid from '@mui/material/Grid';

interface UserProfileData {
  name: string;
  email: string;
  bio: string;
  studyGoals: string[];
  preferredSubjects: string[];
  totalStudyHours: number;
  achievements: string[];
  studyGoal?: string;
  preferredTime?: string;
  subjects?: { name: string; difficulty: string; hours: number; topics?: string[] }[];
}

const dummyUserProfile: UserProfileData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  bio: 'Passionate learner specializing in STEM fields. Always eager to explore new concepts and share knowledge.',
  studyGoals: ['Master Calculus', 'Learn Python', 'Prepare for Physics Olympiad'],
  preferredSubjects: ['Mathematics', 'Physics', 'Computer Science'],
  totalStudyHours: 1250,
  achievements: ['Top Scorer in Algebra Exam', 'Completed Advanced Calculus Course', 'Won Regional Science Fair'],
  studyGoal: 'Master Calculus',
  preferredTime: '3 hours/week',
  subjects: [
    { name: 'Mathematics', difficulty: 'Hard', hours: 3 },
    { name: 'Physics', difficulty: 'Medium', hours: 2 },
    { name: 'Computer Science', difficulty: 'Easy', hours: 1 },
  ],
};

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileData>(dummyUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfileData>({ ...dummyUserProfile });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');
        const response = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setEditedProfile(response.data);
      } catch (err: any) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      const response = await axios.put('/api/users/profile', { name: editedProfile.name }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(prev => ({ ...prev, name: editedProfile.name }));
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedProfile({ ...profile }); // Revert changes
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field: keyof UserProfileData, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(item => item !== ''),
    }));
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <Container maxWidth="lg" className="user-profile-page">
      <Paper elevation={3} className="profile-container">
        <Box className="profile-header">
          <Avatar sx={{ width: 100, height: 100, mb: 2 }} className="profile-avatar">
            <AccountCircleIcon sx={{ fontSize: 80 }} />
          </Avatar>
          <Typography variant="h4" component="h1" className="user-name">
            {profile.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" className="user-email">
            <EmailIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.2rem' }} />
            {profile.email}
          </Typography>
          <Button
            variant="contained"
            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
            onClick={isEditing ? handleSaveClick : handleEditClick}
            className="edit-save-button"
          >
            {isEditing ? 'Save Profile' : 'Edit Profile'}
          </Button>
          {isEditing && (
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancelClick}
              sx={{ ml: 2 }}
              className="cancel-button"
            >
              Cancel
            </Button>
          )}
        </Box>

        <Box className="profile-section">
          <Typography variant="h5" component="h2" gutterBottom className="section-title">
            About Me
          </Typography>
          {isEditing ? (
            <TextField
              name="bio"
              label="Bio"
              multiline
              rows={4}
              fullWidth
              value={editedProfile.bio}
              onChange={handleChange}
              className="profile-text-field"
            />
          ) : (
            <Typography variant="body1" className="profile-bio">
              {profile.bio}
            </Typography>
          )}
        </Box>

        <Box className="profile-section">
          <Typography variant="h5" component="h2" gutterBottom className="section-title">
            Study Plan Info
          </Typography>
          <Typography variant="subtitle1"><b>Main Study Goal:</b> {profile.studyGoal || 'Not set'}</Typography>
          <Typography variant="subtitle1"><b>Preferred Study Time:</b> {profile.preferredTime || 'Not set'}</Typography>
          <Box mt={2}>
            <Typography variant="subtitle1"><b>Subjects:</b></Typography>
            {profile.subjects && profile.subjects.length > 0 ? (
              <List>
                {profile.subjects.map((subject, idx) => (
                  <ListItem key={idx} alignItems="flex-start">
                    <ListItemText
                      primary={`${subject.name} (Difficulty: ${subject.difficulty}, Hours/week: ${subject.hours})`}
                      secondary={subject.topics && subject.topics.length > 0 ? `Topics: ${subject.topics.join(', ')}` : 'No topics'}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2">No subjects added yet.</Typography>
            )}
          </Box>
        </Box>

        <Grid container spacing={3} className="profile-details-grid">
          <Grid item xs={12} md={6}>
            <Box className="profile-section">
              <Typography variant="h5" component="h2" gutterBottom className="section-title">
                <StarIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Study Goals
              </Typography>
              {isEditing ? (
                <TextField
                  name="studyGoals"
                  label="Study Goals (comma-separated)"
                  fullWidth
                  value={editedProfile.studyGoals.join(', ')}
                  onChange={(e) => handleArrayChange('studyGoals', e.target.value)}
                  className="profile-text-field"
                />
              ) : (
                <List>
                  {profile.studyGoals.length === 0 ? (
                    <Typography variant="body2" className="no-items-message">No goals set yet.</Typography>
                  ) : (
                    profile.studyGoals.map((goal, index) => (
                      <ListItem key={index} className="profile-list-item">
                        <ListItemText primary={goal} />
                      </ListItem>
                    ))
                  )}
                </List>
              )}
            </Box>

            <Box className="profile-section">
              <Typography variant="h5" component="h2" gutterBottom className="section-title">
                <SubjectIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Preferred Subjects
              </Typography>
              {isEditing ? (
                <TextField
                  name="preferredSubjects"
                  label="Preferred Subjects (comma-separated)"
                  fullWidth
                  value={editedProfile.preferredSubjects.join(', ')}
                  onChange={(e) => handleArrayChange('preferredSubjects', e.target.value)}
                  className="profile-text-field"
                />
              ) : (
                <Box className="profile-chips">
                  {profile.preferredSubjects.length === 0 ? (
                    <Typography variant="body2" className="no-items-message">No preferred subjects yet.</Typography>
                  ) : (
                    profile.preferredSubjects.map((subject, index) => (
                      <Chip key={index} label={subject} className="profile-chip" />
                    ))
                  )}
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box className="profile-section">
              <Typography variant="h5" component="h2" gutterBottom className="section-title">
                Study Statistics
              </Typography>
              <List>
                <ListItem className="profile-list-item">
                  <ListItemText primary="Total Study Hours:" />
                  {isEditing ? (
                    <TextField
                      name="totalStudyHours"
                      type="number"
                      value={editedProfile.totalStudyHours}
                      onChange={handleChange}
                      sx={{ maxWidth: 100 }}
                      className="profile-text-field"
                    />
                  ) : (
                    <Typography variant="body1" className="stat-value">
                      {profile.totalStudyHours}
                    </Typography>
                  )}
                </ListItem>
              </List>
            </Box>

            <Box className="profile-section">
              <Typography variant="h5" component="h2" gutterBottom className="section-title">
                <EmojiEventsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Achievements
              </Typography>
              {isEditing ? (
                <TextField
                  name="achievements"
                  label="Achievements (comma-separated)"
                  fullWidth
                  multiline
                  rows={3}
                  value={editedProfile.achievements.join(', ')}
                  onChange={(e) => handleArrayChange('achievements', e.target.value)}
                  className="profile-text-field"
                />
              ) : (
                <List>
                  {profile.achievements.length === 0 ? (
                    <Typography variant="body2" className="no-items-message">No achievements yet.</Typography>
                  ) : (
                    profile.achievements.map((achievement, index) => (
                      <ListItem key={index} className="profile-list-item">
                        <ListItemText primary={achievement} />
                      </ListItem>
                    ))
                  )}
                </List>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UserProfile; 