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
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  School as SchoolIcon,
  Collections as CollectionsIcon,
  Star as StarIcon
} from '@mui/icons-material';
import './Flashcards.css';

interface FlashcardSet {
  id: string;
  title: string;
  subject: string;
  description: string;
  cardCount: number;
  lastStudied: string;
  mastery: number;
  isStarred: boolean;
}

const Flashcards: React.FC = () => {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newSetTitle, setNewSetTitle] = useState('');
  const [newSetSubject, setNewSetSubject] = useState('');
  const [newSetDescription, setNewSetDescription] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    // Load generated flashcards from localStorage
    const savedFlashcards = localStorage.getItem('studyflow_flashcards');
    if (savedFlashcards) {
      setSets(JSON.parse(savedFlashcards));
    } else {
      // Fallback to mock data if no generated data exists
      const mockSets: FlashcardSet[] = [
        {
          id: '1',
          title: 'AP Biology - Cell Structure',
          subject: 'AP Biology',
          description: 'Learn about cell organelles and their functions',
          cardCount: 15,
          lastStudied: '2024-02-15',
          mastery: 75,
          isStarred: false
        },
        {
          id: '2',
          title: 'AP Calculus - Derivatives',
          subject: 'AP Calculus AB',
          description: 'Master derivative rules and applications',
          cardCount: 20,
          lastStudied: '2024-02-14',
          mastery: 60,
          isStarred: true
        },
        {
          id: '3',
          title: 'AP Chemistry - Chemical Reactions',
          subject: 'AP Chemistry',
          description: 'Understand reaction types and balancing equations',
          cardCount: 18,
          lastStudied: '2024-02-13',
          mastery: 45,
          isStarred: false
        }
      ];
      setSets(mockSets);
    }
    setLoading(false);
  }, [selectedSubject]);

  const filteredSets = sets.filter(set => {
    const matchesSearch = set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         set.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !selectedSubject || set.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, setId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedSet(setId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSet(null);
  };

  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  const handleCreateSet = () => {
    if (!newSetTitle.trim() || !newSetSubject.trim()) {
      setFeedback('Please enter a title and subject!');
      return;
    }
    const newSet: FlashcardSet = {
      id: (Math.random() * 100000).toFixed(0),
      title: newSetTitle,
      subject: newSetSubject,
      description: newSetDescription,
      cardCount: 0,
      lastStudied: new Date().toISOString(),
      mastery: 0,
      isStarred: false
    };
    setSets(prev => [newSet, ...prev]);
    setCreateDialogOpen(false);
    setNewSetTitle('');
    setNewSetSubject('');
    setNewSetDescription('');
    setFeedback('Set created! 🎉');
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleToggleStar = (id: string) => {
    setSets(prev => prev.map(set => set.id === id ? { ...set, isStarred: !set.isStarred } : set));
  };

  const handleDeleteSet = () => {
    if (selectedSet) {
      setSets(prev => prev.filter(set => set.id !== selectedSet));
      setFeedback('Set deleted.');
      setTimeout(() => setFeedback(null), 2000);
    }
    setAnchorEl(null);
    setSelectedSet(null);
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="flashcards-page">
      {feedback && <div className="flashcards-feedback">{feedback}</div>}
      <div className="flashcards-header">
        <Typography variant="h4" component="h1">
          🧠 Smart Spaced Repetition
        </Typography>
        <div className="spaced-rep-banner">
          <span role="img" aria-label="alarm">⏰</span> Never forget what you learn! <b>StudyFlow</b> schedules reviews right before you're about to forget — for max retention and less stress.
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className="create-set-btn"
          onClick={handleCreateDialogOpen}
        >
          ✨ Start a New Set!
        </Button>
      </div>

      <div className="why-spaced-rep-card">
        <h3>Why Spaced Repetition?</h3>
        <p>
          Your brain learns best with smart, spaced reviews—not cramming! StudyFlow reminds you to review cards just before you're about to forget them. That means less time studying, more knowledge remembered. <span role="img" aria-label="brain">🧠</span>
        </p>
      </div>

      <div className="streaks-badges-card">
        <h3>🔥 Streaks & Badges <span className="coming-soon">(Coming Soon!)</span></h3>
        <p>
          Keep your study streak alive and earn badges for milestones like "3-day streak" or "Mastered 100 cards!" Motivation, unlocked. <span role="img" aria-label="trophy">🏆</span>
        </p>
      </div>

      <div className="flashcards-filters">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search flashcard sets..."
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
          {['AP Calculus AB', 'AP Physics 1', 'AP Chemistry'].map((subject) => (
            <Chip
              key={subject}
              icon={<SchoolIcon />}
              label={subject}
              onClick={() => setSelectedSubject(
                selectedSubject === subject ? null : subject
              )}
              color={selectedSubject === subject ? 'primary' : 'default'}
              variant={selectedSubject === subject ? 'filled' : 'outlined'}
            />
          ))}
        </div>
      </div>

      <Grid container spacing={3} className="flashcards-grid">
        {filteredSets.map((set) => (
          <Grid item xs={12} sm={6} md={4} key={set.id}>
            <Card className="flashcard-set-card">
              <CardContent>
                <div className="set-header">
                  <div className="set-info">
                    <Typography variant="h6" component="h2">
                      {set.title}
                    </Typography>
                    <Chip
                      icon={<SchoolIcon />}
                      label={set.subject}
                      size="small"
                      className="subject-chip"
                    />
                  </div>
                  <div className="set-actions">
                    <IconButton
                      size="small"
                      color={set.isStarred ? 'primary' : 'default'}
                      onClick={() => handleToggleStar(set.id)}
                      aria-label={set.isStarred ? 'Unstar' : 'Star'}
                    >
                      <StarIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, set.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </div>
                </div>
                <Typography variant="body2" color="textSecondary" className="set-description">
                  {set.description}
                </Typography>
                <div className="set-stats">
                  <div className="stat">
                    <CollectionsIcon fontSize="small" />
                    <Typography variant="body2" color="textSecondary">
                      {set.cardCount} cards
                    </Typography>
                  </div>
                  <div className="stat">
                    <Typography variant="body2" color="textSecondary">
                      Mastery
                    </Typography>
                    <Typography variant="h6">
                      {set.mastery}%
                    </Typography>
                  </div>
                </div>
                <div className="set-meta">
                  <Typography variant="caption" color="textSecondary">
                    Last studied: {new Date(set.lastStudied).toLocaleDateString()}
                  </Typography>
                </div>
                <div className="set-actions">
                  <Button
                    variant="contained"
                    component={Link}
                    to={`/flashcards/${set.id}`}
                    fullWidth
                  >
                    Study Set
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
        <MenuItem onClick={handleMenuClose}>Share</MenuItem>
        <MenuItem onClick={handleDeleteSet}>Delete</MenuItem>
      </Menu>

      <Dialog
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Flashcard Set</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            margin="normal"
            variant="outlined"
            value={newSetTitle}
            onChange={e => setNewSetTitle(e.target.value)}
          />
          <TextField
            fullWidth
            label="Subject"
            margin="normal"
            variant="outlined"
            value={newSetSubject}
            onChange={e => setNewSetSubject(e.target.value)}
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
            value={newSetDescription}
            onChange={e => setNewSetDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateSet}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Flashcards; 