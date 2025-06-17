import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  FormControlLabel,
  Switch,
  Slider,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Schedule as ScheduleIcon,
  Storage as StorageIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import './Settings.css';

interface SettingsState {
  theme: 'light' | 'dark';
  enableNotifications: boolean;
  notificationSound: boolean;
  studyReminderInterval: number; // in minutes
  preferredStudyTime: string; // e.g., "morning", "afternoon", "evening"
  syncGoogleCalendar: boolean;
  syncOutlookCalendar: boolean;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    theme: 'light',
    enableNotifications: true,
    notificationSound: true,
    studyReminderInterval: 30,
    preferredStudyTime: 'morning',
    syncGoogleCalendar: false,
    syncOutlookCalendar: false,
  });

  const handleSettingChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>, type: string) => {
    if (type === 'switch') {
      setSettings(prev => ({
        ...prev,
        [event.target.name as keyof SettingsState]: (event.target as HTMLInputElement).checked,
      }));
    } else if (type === 'slider') {
      setSettings(prev => ({
        ...prev,
        studyReminderInterval: event as unknown as number,
      }));
    } else if (type === 'select') {
      setSettings(prev => ({
        ...prev,
        [event.target.name as keyof SettingsState]: event.target.value as string,
      }));
    } else {
      const { name, value } = event.target as HTMLInputElement | HTMLTextAreaElement;
      setSettings(prev => ({ ...prev, [name as keyof SettingsState]: value }));
    }
  };

  const handleSaveSettings = () => {
    // TODO: Implement save settings functionality (API call)
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <Container maxWidth="lg" className="settings-page">
      <Paper elevation={3} className="settings-container">
        <Typography variant="h4" component="h1" gutterBottom className="settings-header">
          Settings
        </Typography>

        <Box className="settings-section">
          <Typography variant="h5" component="h2" gutterBottom>
            <PaletteIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Theme Preferences
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="theme-select-label">Application Theme</InputLabel>
            <Select
              labelId="theme-select-label"
              id="theme-select"
              name="theme"
              value={settings.theme}
              onChange={(e) => handleSettingChange(e, 'select')}
              label="Application Theme"
            >
              <MenuItem value="light">Light Mode</MenuItem>
              <MenuItem value="dark">Dark Mode</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box className="settings-section">
          <Typography variant="h5" component="h2" gutterBottom>
            <NotificationsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Notification Settings
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={settings.enableNotifications}
                onChange={(e) => handleSettingChange(e, 'switch')}
                name="enableNotifications"
              />
            }
            label="Enable Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.notificationSound}
                onChange={(e) => handleSettingChange(e, 'switch')}
                name="notificationSound"
              />
            }
            label="Notification Sound"
          />
          <Typography gutterBottom sx={{ mt: 2 }}>Study Reminder Interval (minutes)</Typography>
          <Slider
            value={settings.studyReminderInterval}
            onChange={(e, val) => handleSettingChange(val, 'slider')}
            aria-labelledby="study-reminder-interval-slider"
            valueLabelDisplay="auto"
            step={10}
            marks
            min={10}
            max={120}
          />
        </Box>

        <Box className="settings-section">
          <Typography variant="h5" component="h2" gutterBottom>
            <ScheduleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Study Schedule Preferences
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="preferred-study-time-label">Preferred Study Time</InputLabel>
            <Select
              labelId="preferred-study-time-label"
              id="preferred-study-time-select"
              name="preferredStudyTime"
              value={settings.preferredStudyTime}
              onChange={(e) => handleSettingChange(e, 'select')}
              label="Preferred Study Time"
            >
              <MenuItem value="morning">Morning (6 AM - 12 PM)</MenuItem>
              <MenuItem value="afternoon">Afternoon (12 PM - 6 PM)</MenuItem>
              <MenuItem value="evening">Evening (6 PM - 12 AM)</MenuItem>
              <MenuItem value="night">Night (12 AM - 6 AM)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box className="settings-section">
          <Typography variant="h5" component="h2" gutterBottom>
            <StorageIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Integration Settings
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={settings.syncGoogleCalendar}
                onChange={(e) => handleSettingChange(e, 'switch')}
                name="syncGoogleCalendar"
              />
            }
            label="Sync with Google Calendar"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.syncOutlookCalendar}
                onChange={(e) => handleSettingChange(e, 'switch')}
                name="syncOutlookCalendar"
              />
            }
            label="Sync with Outlook Calendar"
          />
        </Box>

        <Box className="settings-actions">
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
          >
            Save Settings
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings; 