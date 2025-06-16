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

  useEffect(() => {
    // TODO: Fetch flashcard sets from API
    const mockSets: FlashcardSet[] = [
      {
        id: '1',
        title: 'Calculus Formulas',
        subject: 'AP Calculus AB',
        description: 'Essential formulas and theorems',
        cardCount: 50,
        lastStudied: '2024-02-15',
        mastery: 75,
        isStarred: true
      },
      {
        id: '2',
        title: 'Physics Equations',
        subject: 'AP Physics 1',
        description: 'Key equations and constants',
        cardCount: 30,
        lastStudied: '2024-02-14',
        mastery: 60,
        isStarred: false
      },
      {
        id: '3',
        title: 'Chemistry Elements',
        subject: 'AP Chemistry',
        description: 'Periodic table and properties',
        cardCount: 118,
        lastStudied: '2024-02-13',
        mastery: 90,
        isStarred: true
      }
    ];
    setSets(mockSets);
    setLoading(false);
  }, []);

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

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="flashcards-page">
      <div className="flashcards-header">
        <Typography variant="h4" component="h1">
          Flashcard Sets
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateDialogOpen}
        >
          Create Set
        </Button>
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
        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
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
          />
          <TextField
            fullWidth
            label="Subject"
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Description"
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

export default Flashcards; 