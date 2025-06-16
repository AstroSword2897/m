import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem as SelectMenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  School as SchoolIcon,
  AccessTime as TimeIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import './Schedule.css';

interface StudySession {
  id: string;
  title: string;
  subject: string;
  startTime: string;
  endTime: string;
  date: string;
  type: 'Lecture' | 'Practice' | 'Review' | 'Exam';
  status: 'Scheduled' | 'In Progress' | 'Completed';
  location: string;
  notes: string;
}

const Schedule: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    // TODO: Fetch study sessions from API
    const mockSessions: StudySession[] = [
      {
        id: '1',
        title: 'Calculus Review',
        subject: 'AP Calculus AB',
        startTime: '09:00',
        endTime: '10:30',
        date: '2024-02-20',
        type: 'Review',
        status: 'Scheduled',
        location: 'Room 101',
        notes: 'Review derivatives and integrals'
      },
      {
        id: '2',
        title: 'Physics Lab',
        subject: 'AP Physics 1',
        startTime: '11:00',
        endTime: '12:30',
        date: '2024-02-20',
        type: 'Practice',
        status: 'In Progress',
        location: 'Lab 203',
        notes: 'Experiment with Newton\'s laws'
      },
      {
        id: '3',
        title: 'Chemistry Exam',
        subject: 'AP Chemistry',
        startTime: '14:00',
        endTime: '16:00',
        date: '2024-02-20',
        type: 'Exam',
        status: 'Scheduled',
        location: 'Room 305',
        notes: 'Final exam preparation'
      }
    ];
    setSessions(mockSessions);
    setLoading(false);
  }, []);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || session.type === selectedType;
    const matchesStatus = !selectedStatus || session.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Lecture':
        return '#2196f3';
      case 'Practice':
        return '#4caf50';
      case 'Review':
        return '#ff9800';
      case 'Exam':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return '#2196f3';
      case 'In Progress':
        return '#ff9800';
      case 'Completed':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, sessionId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedSession(sessionId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSession(null);
  };

  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="schedule-page">
      <div className="schedule-header">
        <Typography variant="h4" component="h1">
          Study Schedule
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateDialogOpen}
        >
          Add Session
        </Button>
      </div>

      <div className="schedule-filters">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search sessions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <div className="filter-chips">
          {['Lecture', 'Practice', 'Review', 'Exam'].map((type) => (
            <Chip
              key={type}
              label={type}
              onClick={() => setSelectedType(
                selectedType === type ? null : type
              )}
              style={{
                backgroundColor: selectedType === type ? getTypeColor(type) : 'transparent',
                color: selectedType === type ? 'white' : 'inherit',
                border: `1px solid ${getTypeColor(type)}`
              }}
            />
          ))}
        </div>
        <div className="filter-chips">
          {['Scheduled', 'In Progress', 'Completed'].map((status) => (
            <Chip
              key={status}
              label={status}
              onClick={() => setSelectedStatus(
                selectedStatus === status ? null : status
              )}
              style={{
                backgroundColor: selectedStatus === status ? getStatusColor(status) : 'transparent',
                color: selectedStatus === status ? 'white' : 'inherit',
                border: `1px solid ${getStatusColor(status)}`
              }}
            />
          ))}
        </div>
      </div>

      <Grid container spacing={3} className="schedule-grid">
        {filteredSessions.map((session) => (
          <Grid item xs={12} sm={6} md={4} key={session.id}>
            <Card className="session-card">
              <CardContent>
                <div className="session-header">
                  <div className="session-info">
                    <Typography variant="h6" component="h2">
                      {session.title}
                    </Typography>
                    <div className="session-chips">
                      <Chip
                        label={session.type}
                        size="small"
                        style={{
                          backgroundColor: getTypeColor(session.type),
                          color: 'white'
                        }}
                      />
                      <Chip
                        label={session.status}
                        size="small"
                        style={{
                          backgroundColor: getStatusColor(session.status),
                          color: 'white'
                        }}
                      />
                    </div>
                  </div>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, session.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </div>
                <div className="session-meta">
                  <div className="meta-item">
                    <SchoolIcon fontSize="small" />
                    <Typography variant="body2" color="textSecondary">
                      {session.subject}
                    </Typography>
                  </div>
                  <div className="meta-item">
                    <TimeIcon fontSize="small" />
                    <Typography variant="body2" color="textSecondary">
                      {session.startTime} - {session.endTime}
                    </Typography>
                  </div>
                  <div className="meta-item">
                    <EventIcon fontSize="small" />
                    <Typography variant="body2" color="textSecondary">
                      {new Date(session.date).toLocaleDateString()}
                    </Typography>
                  </div>
                </div>
                <Typography variant="body2" color="textSecondary" className="session-notes">
                  {session.notes}
                </Typography>
                <div className="session-actions">
                  <Button
                    variant="contained"
                    component={Link}
                    to={`/schedule/${session.id}`}
                    fullWidth
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        <MenuItem onClick={handleMenuClose}>Mark as Completed</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
      </Menu>

      <Dialog
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Study Session</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            margin="normal"
            variant="outlined"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Subject</InputLabel>
            <Select label="Subject">
              <SelectMenuItem value="AP Calculus AB">AP Calculus AB</SelectMenuItem>
              <SelectMenuItem value="AP Physics 1">AP Physics 1</SelectMenuItem>
              <SelectMenuItem value="AP Chemistry">AP Chemistry</SelectMenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select label="Type">
              <SelectMenuItem value="Lecture">Lecture</SelectMenuItem>
              <SelectMenuItem value="Practice">Practice</SelectMenuItem>
              <SelectMenuItem value="Review">Review</SelectMenuItem>
              <SelectMenuItem value="Exam">Exam</SelectMenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Start Time"
            type="time"
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="End Time"
            type="time"
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Location"
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Notes"
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateDialogClose}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Schedule; 