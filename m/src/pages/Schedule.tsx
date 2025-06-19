import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  MenuItem,
} from '@mui/material';
import {
  CalendarToday as CalendarTodayIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  EventNote as EventNoteIcon,
} from '@mui/icons-material';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import './Schedule.css';

interface ScheduleItem {
  id: string;
  title: string;
  description?: string;
  date: Dayjs;
  time: Dayjs;
  subject?: string;
  type: 'study' | 'meeting' | 'exam' | 'other';
}

const dummySchedule: ScheduleItem[] = [
  {
    id: 's1',
    title: 'Math Homework',
    description: 'Complete Chapter 3 exercises.',
    date: dayjs().add(1, 'day'),
    time: dayjs().set('hour', 10).set('minute', 0),
    subject: 'Mathematics',
    type: 'study',
  },
  {
    id: 's2',
    title: 'Physics Exam Review',
    description: 'Review kinematics and dynamics.',
    date: dayjs().add(3, 'day'),
    time: dayjs().set('hour', 14).set('minute', 30),
    subject: 'Physics',
    type: 'exam',
  },
  {
    id: 's3',
    title: 'Team Meeting',
    description: 'Discuss project progress.',
    date: dayjs().add(2, 'day'),
    time: dayjs().set('hour', 9).set('minute', 0),
    type: 'meeting',
  },
];

const Schedule: React.FC = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(dummySchedule);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<ScheduleItem>>({
    id: '',
    title: '',
    description: '',
    date: dayjs(),
    time: dayjs(),
    subject: '',
    type: 'study',
  });

  const handleOpenAddDialog = () => {
    setIsEditing(false);
    setCurrentItem({
      id: '',
      title: '',
      description: '',
      date: dayjs(),
      time: dayjs(),
      subject: '',
      type: 'study',
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (item: ScheduleItem) => {
    setIsEditing(true);
    setCurrentItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveItem = () => {
    if (currentItem.title && currentItem.date && currentItem.time && currentItem.type) {
      if (isEditing) {
        setScheduleItems(prev =>
          prev.map(item => (item.id === currentItem.id ? currentItem as ScheduleItem : item))
        );
      } else {
        const newItem: ScheduleItem = {
          ...currentItem as ScheduleItem,
          id: `s${scheduleItems.length + 1}`,
        };
        setScheduleItems(prev => [...prev, newItem]);
      }
      handleCloseDialog();
    } else {
      alert('Please fill in all required fields.');
    }
  };

  const handleDeleteItem = (id: string) => {
    setScheduleItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" className="schedule-page">
        <Box className="schedule-header">
          <Typography variant="h4" component="h1" gutterBottom className="page-title">
            <CalendarTodayIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Study Schedule
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            className="add-schedule-button"
          >
            Add New Event
          </Button>
        </Box>

        <Box className="schedule-list-container">
          {scheduleItems.length === 0 ? (
            <Typography variant="h6" align="center" className="no-events-message">
              No events scheduled. Add one to get started!
            </Typography>
          ) : (
            <List className="schedule-list">
              {scheduleItems.map((item) => (
                <ListItem key={item.id} className="schedule-list-item">
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Typography component="span" variant="h6" className="item-title">
                          {item.title}
                        </Typography>
                        <Chip label={item.type} className={`type-chip type-${item.type}`} />
                        {item.subject && (
                          <Chip label={item.subject} className="subject-chip" />
                        )}
                      </React.Fragment>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography component="span" variant="body2" className="item-datetime">
                          {item.date.format('MMMM D, YYYY')} at {item.time.format('h:mm A')}
                        </Typography>
                        {item.description && (
                          <Typography variant="body2" className="item-description">
                            {item.description}
                          </Typography>
                        )}
                      </React.Fragment>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpenEditDialog(item)} className="action-button">
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteItem(item.id)} className="action-button delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ className: 'add-edit-dialog-paper' }}>
          <DialogTitle className="add-edit-dialog-title">
            {isEditing ? 'Edit Event' : 'Add New Event'}
          </DialogTitle>
          <DialogContent className="add-edit-dialog-content">
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              value={currentItem.title}
              onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
              className="dialog-text-field"
            />
            <TextField
              margin="dense"
              label="Description (Optional)"
              type="text"
              fullWidth
              multiline
              rows={2}
              value={currentItem.description}
              onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
              className="dialog-text-field"
            />
            <TextField
              margin="dense"
              label="Subject (Optional)"
              type="text"
              fullWidth
              value={currentItem.subject}
              onChange={(e) => setCurrentItem({ ...currentItem, subject: e.target.value })}
              className="dialog-text-field"
            />
            <TextField
              select
              margin="dense"
              label="Event Type"
              fullWidth
              value={currentItem.type}
              onChange={(e) => setCurrentItem({ ...currentItem, type: e.target.value as ScheduleItem['type'] })}
              className="dialog-text-field"
            >
              <MenuItem value="study">Study</MenuItem>
              <MenuItem value="meeting">Meeting</MenuItem>
              <MenuItem value="exam">Exam</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
            <DatePicker
              label="Date"
              value={currentItem.date}
              onChange={(newValue) => setCurrentItem({ ...currentItem, date: newValue || dayjs() })}
              slotProps={{ textField: { fullWidth: true, margin: 'dense', className: 'dialog-text-field' } }}
            />
            <TimePicker
              label="Time"
              value={currentItem.time}
              onChange={(newValue) => setCurrentItem({ ...currentItem, time: newValue || dayjs() })}
              slotProps={{ textField: { fullWidth: true, margin: 'dense', className: 'dialog-text-field' } }}
            />
          </DialogContent>
          <DialogActions className="add-edit-dialog-actions">
            <Button onClick={handleCloseDialog} className="dialog-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleSaveItem} className="dialog-save-button">
              {isEditing ? 'Save Changes' : 'Add Event'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default Schedule; 