import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Casino as CasinoIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Flip as FlipIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  HighlightOff as HighlightOffIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import './Flashcards.css';

// Dummy SM2 algorithm implementation
interface Sm2Flashcard {
  id: string;
  front: string;
  back: string;
  deck: string;
  difficulty: number; // 1-5, 1=easy, 5=hard
  repetitions: number;
  interval: number; // in days
  easeFactor: number; // typically 2.5
  nextReview: Date;
  lastReviewed: Date;
  tags?: string[];
}

const sm2Algorithm = (card: Sm2Flashcard, quality: number): Sm2Flashcard => {
  let newEaseFactor = card.easeFactor;
  let newRepetitions = card.repetitions;
  let newInterval = card.interval;

  if (quality >= 3) {
    // Correct answer
    newRepetitions++;
    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(card.interval * newEaseFactor);
    }
  } else {
    // Incorrect answer
    newRepetitions = 0;
    newInterval = 1;
  }

  newEaseFactor = newEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }

  const newNextReview = new Date();
  newNextReview.setDate(newNextReview.getDate() + newInterval);

  return {
    ...card,
    repetitions: newRepetitions,
    interval: newInterval,
    easeFactor: newEaseFactor,
    nextReview: newNextReview,
    lastReviewed: new Date(),
  };
};

const dummyFlashcards: Sm2Flashcard[] = [
  {
    id: 'f1',
    front: 'What is the capital of Japan?',
    back: 'Tokyo',
    deck: 'Geography',
    difficulty: 3,
    repetitions: 0,
    interval: 0,
    easeFactor: 2.5,
    nextReview: new Date(new Date().setDate(new Date().getDate() - 5)), // Due 5 days ago
    lastReviewed: new Date(new Date().setDate(new Date().getDate() - 6)),
    tags: ['asia', 'cities'],
  },
  {
    id: 'f2',
    front: 'Who painted the Mona Lisa?',
    back: 'Leonardo da Vinci',
    deck: 'Art History',
    difficulty: 2,
    repetitions: 1,
    interval: 1,
    easeFactor: 2.5,
    nextReview: new Date(new Date().setDate(new Date().getDate() - 1)), // Due yesterday
    lastReviewed: new Date(new Date().setDate(new Date().getDate() - 2)),
    tags: ['renaissance', 'paintings'],
  },
  {
    id: 'f3',
    front: 'What is the chemical symbol for gold?',
    back: 'Au',
    deck: 'Chemistry',
    difficulty: 4,
    repetitions: 2,
    interval: 6,
    easeFactor: 2.5,
    nextReview: new Date(new Date().setDate(new Date().getDate() + 2)), // Due in 2 days
    lastReviewed: new Date(),
    tags: ['elements', 'metals'],
  },
  {
    id: 'f4',
    front: 'What is the largest planet in our solar system?',
    back: 'Jupiter',
    deck: 'Astronomy',
    difficulty: 1,
    repetitions: 0,
    interval: 0,
    easeFactor: 2.5,
    nextReview: new Date(), // Due today
    lastReviewed: new Date(new Date().setDate(new Date().getDate() - 1)),
    tags: ['planets', 'space'],
  },
];

const Flashcards: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Sm2Flashcard[]>(dummyFlashcards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newCard, setNewCard] = useState<Partial<Sm2Flashcard>>({
    front: '',
    back: '',
    deck: '',
    tags: [],
  });

  const dueFlashcards = flashcards.filter(card => new Date() >= new Date(card.nextReview));

  useEffect(() => {
    if (reviewMode && dueFlashcards.length === 0) {
      alert('No flashcards due for review! Try adding more or wait for next review.');
      setReviewMode(false);
    }
  }, [reviewMode, dueFlashcards.length]);

  const handleStartReview = () => {
    if (dueFlashcards.length > 0) {
      setReviewMode(true);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    } else {
      alert('No flashcards due for review!');
    }
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReviewQuality = (quality: number) => {
    if (!reviewMode || dueFlashcards.length === 0) return;

    const updatedCard = sm2Algorithm(dueFlashcards[currentCardIndex], quality);
    setFlashcards(prevCards =>
      prevCards.map(card => (card.id === updatedCard.id ? updatedCard : card))
    );

    // Move to next card or end review
    if (currentCardIndex < dueFlashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      alert('Review session completed!');
      setReviewMode(false);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  };

  const handleAddCard = () => {
    if (newCard.front && newCard.back && newCard.deck) {
      const id = `f${flashcards.length + 1}`;
      const cardToAdd: Sm2Flashcard = {
        id,
        front: newCard.front,
        back: newCard.back,
        deck: newCard.deck,
        difficulty: 3, // Default difficulty
        repetitions: 0,
        interval: 0,
        easeFactor: 2.5,
        nextReview: new Date(),
        lastReviewed: new Date(),
        tags: newCard.tags || [],
      };
      setFlashcards(prevCards => [...prevCards, cardToAdd]);
      setNewCard({ front: '', back: '', deck: '', tags: [] });
      setOpenAddDialog(false);
    } else {
      alert('Please fill in all required fields (Front, Back, Deck).');
    }
  };

  const currentReviewCard = dueFlashcards[currentCardIndex];

  return (
    <Container maxWidth="lg" className="flashcards-page">
      <Box className="flashcards-header">
        <Typography variant="h4" component="h1" gutterBottom className="page-title">
          <CasinoIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Flashcards
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
          className="add-flashcard-button"
        >
          Add New Card
        </Button>
      </Box>

      {!reviewMode && (dueFlashcards.length > 0 || flashcards.length > 0) && (
        <Box className="flashcard-summary">
          <Typography variant="h6" className="summary-text">
            Flashcards due for review: <span className="due-count">{dueFlashcards.length}</span>
          </Typography>
          <Button
            variant="contained"
            onClick={handleStartReview}
            startIcon={<PlayArrowIcon />}
            className="start-review-button"
            disabled={dueFlashcards.length === 0}
          >
            Start Review
          </Button>
        </Box>
      )}

      {reviewMode && currentReviewCard ? (
        <Box className="flashcard-review-area">
          <Typography variant="h6" className="review-counter">
            Reviewing Card {currentCardIndex + 1} / {dueFlashcards.length}
          </Typography>
          <Box className={`flashcard-card ${isFlipped ? 'flipped' : ''}`}>
            <div className="flashcard-front">
              <Typography variant="h5" className="card-content-text">
                {currentReviewCard.front}
              </Typography>
              <Button
                variant="outlined"
                onClick={handleFlipCard}
                startIcon={<FlipIcon />}
                className="flip-button"
              >
                Flip Card
              </Button>
            </div>
            <div className="flashcard-back">
              <Typography variant="h5" className="card-content-text">
                {currentReviewCard.back}
              </Typography>
              <Typography variant="body2" className="card-info-text">
                Deck: {currentReviewCard.deck} | Ease: {currentReviewCard.easeFactor.toFixed(2)}
              </Typography>
              <Box className="review-quality-buttons">
                <Button
                  variant="contained"
                  className="quality-button bad"
                  onClick={() => handleReviewQuality(0)}
                >
                  Again (0)
                </Button>
                <Button
                  variant="contained"
                  className="quality-button hard"
                  onClick={() => handleReviewQuality(2)}
                >
                  Hard (2)
                </Button>
                <Button
                  variant="contained"
                  className="quality-button good"
                  onClick={() => handleReviewQuality(4)}
                >
                  Good (4)
                </Button>
                <Button
                  variant="contained"
                  className="quality-button easy"
                  onClick={() => handleReviewQuality(5)}
                >
                  Easy (5)
                </Button>
              </Box>
            </div>
          </Box>
        </Box>
      ) : reviewMode ? (
        <Box className="loading-indicator">
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2, color: 'var(--text-muted)' }}>
            Loading next card...
          </Typography>
        </Box>
      ) : (
        <Box className="all-flashcards-section">
          <Typography variant="h5" gutterBottom className="section-title">
            All Flashcards
          </Typography>
          <Grid container spacing={2}>
            {flashcards.length === 0 ? (
              <Typography variant="body1" className="no-cards-message">
                No flashcards added yet. Add some to get started!
              </Typography>
            ) : (
              flashcards.map((card) => (
                <Grid item xs={12} sm={6} md={4} key={card.id}>
                  <Card className="flashcard-list-item">
                    <CardContent>
                      <Typography variant="h6" className="list-card-front">
                        {card.front}
                      </Typography>
                      <Typography variant="body2" className="list-card-back">
                        {card.back}
                      </Typography>
                      <Box className="list-card-details">
                        <Chip label={card.deck} className="list-chip-deck" />
                        <Chip label={`Next Review: ${new Date(card.nextReview).toLocaleDateString()}`} className="list-chip-review" />
                        {card.tags && card.tags.map((tag, index) => (
                          <Chip key={index} label={tag} className="list-chip-tag" />
                        ))}
                      </Box>
                      <Box className="list-card-actions">
                        <Button size="small" startIcon={<EditIcon />} className="list-action-button">
                          Edit
                        </Button>
                        <Button size="small" startIcon={<DeleteIcon />} className="list-action-button delete"
                          onClick={() => setFlashcards(prev => prev.filter(f => f.id !== card.id))}
                        >
                          Delete
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      )}

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} PaperProps={{ className: 'add-flashcard-dialog-paper' }}>
        <DialogTitle className="add-flashcard-dialog-title">Add New Flashcard</DialogTitle>
        <DialogContent className="add-flashcard-dialog-content">
          <TextField
            autoFocus
            margin="dense"
            label="Front of Card"
            type="text"
            fullWidth
            value={newCard.front}
            onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
            className="dialog-text-field"
          />
          <TextField
            margin="dense"
            label="Back of Card"
            type="text"
            fullWidth
            value={newCard.back}
            onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
            className="dialog-text-field"
          />
          <TextField
            margin="dense"
            label="Deck (e.g., 'Math', 'History')"
            type="text"
            fullWidth
            value={newCard.deck}
            onChange={(e) => setNewCard({ ...newCard, deck: e.target.value })}
            className="dialog-text-field"
          />
          <TextField
            margin="dense"
            label="Tags (comma-separated)"
            type="text"
            fullWidth
            value={newCard.tags ? newCard.tags.join(', ') : ''}
            onChange={(e) => setNewCard({ ...newCard, tags: e.target.value.split(',').map(tag => tag.trim()) })}
            className="dialog-text-field"
          />
        </DialogContent>
        <DialogActions className="add-flashcard-dialog-actions">
          <Button onClick={() => setOpenAddDialog(false)} className="dialog-cancel-button">
            Cancel
          </Button>
          <Button onClick={handleAddCard} className="dialog-add-button">
            Add Card
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Flashcards; 