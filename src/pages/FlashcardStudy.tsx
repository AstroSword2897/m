import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Typography, Box } from '@mui/material';

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

const FlashcardStudy: React.FC = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const [set, setSet] = useState<FlashcardSet | null>(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [cards, setCards] = useState<string[]>([]);

  useEffect(() => {
    const savedSets = localStorage.getItem('studyflow_flashcards');
    if (savedSets) {
      const sets: FlashcardSet[] = JSON.parse(savedSets);
      const found = sets.find(s => s.id === setId);
      setSet(found || null);
      // For demo, generate placeholder cards
      if (found) {
        const fakeCards = Array.from({ length: found.cardCount }, (_, i) => `Card ${i + 1}: Example content for ${found.title}`);
        setCards(fakeCards);
      }
    }
  }, [setId]);

  if (!set) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)' }}>
        <Typography variant="h5">Flashcard set not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Card sx={{ minWidth: 340, maxWidth: 400, p: 3, borderRadius: 3, boxShadow: 4, mb: 3, background: '#fff' }}>
        <Typography variant="h5" gutterBottom>{set.title}</Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>{set.subject}</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>{set.description}</Typography>
        <Box sx={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Typography variant="h6">{cards[currentCard]}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button variant="outlined" disabled={currentCard === 0} onClick={() => setCurrentCard(c => c - 1)}>Previous</Button>
          <Typography variant="caption">{currentCard + 1} / {cards.length}</Typography>
          <Button variant="contained" disabled={currentCard === cards.length - 1} onClick={() => setCurrentCard(c => c + 1)}>Next</Button>
        </Box>
      </Card>
      <Button variant="text" onClick={() => navigate('/flashcards')}>Back to Flashcards</Button>
    </Box>
  );
};

export default FlashcardStudy; 