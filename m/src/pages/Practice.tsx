import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  Chip,
  Paper,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  DoneAll as DoneAllIcon,
  Redo as RedoIcon,
  Assessment as AssessmentIcon,
  Troubleshoot as TroubleshootIcon,
} from '@mui/icons-material';
import './Practice.css';

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const dummyQuestions: Question[] = [
  {
    id: 'q1',
    questionText: 'What is the chemical symbol for water?',
    options: ['H2O', 'CO2', 'O2', 'N2'],
    correctAnswer: 'H2O',
    explanation: 'Water is a chemical compound with the chemical formula H2O.',
    subject: 'Chemistry',
    difficulty: 'easy',
  },
  {
    id: 'q2',
    questionText: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    correctAnswer: 'Paris',
    explanation: 'Paris is the capital and most populous city of France.',
    subject: 'Geography',
    difficulty: 'easy',
  },
  {
    id: 'q3',
    questionText: 'Who wrote Hamlet?',
    options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Leo Tolstoy'],
    correctAnswer: 'William Shakespeare',
    explanation: 'William Shakespeare was an English playwright, poet, and actor, widely regarded as the greatest writer in the English language.',
    subject: 'Literature',
    difficulty: 'medium',
  },
  {
    id: 'q4',
    questionText: 'What is the square root of 144?',
    options: ['10', '12', '14', '16'],
    correctAnswer: '12',
    explanation: 'The square root of 144 is 12 because 12 * 12 = 144.',
    subject: 'Mathematics',
    difficulty: 'easy',
  },
];

const Practice: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  const filteredQuestions = dummyQuestions.filter(q => {
    const subjectMatch = filterSubject === 'all' || q.subject === filterSubject;
    const difficultyMatch = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
    return subjectMatch && difficultyMatch;
  });

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizFinished(false);
    setScore(0);
  };

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(answer);
      setShowExplanation(true);
      if (answer === currentQuestion.correctAnswer) {
        setScore(prev => prev + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRetryQuiz = () => {
    handleStartQuiz(); // Simply restart with current filters
  };

  if (!quizStarted) {
    return (
      <Container maxWidth="md" className="practice-page start-screen">
        <Paper elevation={3} className="start-card">
          <Typography variant="h4" gutterBottom className="start-title">
            Start Practice Quiz
          </Typography>
          <Box className="filter-controls">
            <TextField
              select
              label="Filter by Subject"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              fullWidth
              margin="normal"
              className="filter-select"
            >
              <MenuItem value="all">All Subjects</MenuItem>
              <MenuItem value="Chemistry">Chemistry</MenuItem>
              <MenuItem value="Geography">Geography</MenuItem>
              <MenuItem value="Literature">Literature</MenuItem>
              <MenuItem value="Mathematics">Mathematics</MenuItem>
            </TextField>
            <TextField
              select
              label="Filter by Difficulty"
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              fullWidth
              margin="normal"
              className="filter-select"
            >
              <MenuItem value="all">All Difficulties</MenuItem>
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </TextField>
          </Box>
          <Button
            variant="contained"
            onClick={handleStartQuiz}
            startIcon={<PlayArrowIcon />}
            className="start-button"
          >
            Start Quiz
          </Button>
          {filteredQuestions.length === 0 && (
            <Typography variant="body2" color="error" className="no-questions-message">
              No questions found for selected filters.
            </Typography>
          )}
        </Paper>
      </Container>
    );
  }

  if (quizFinished) {
    return (
      <Container maxWidth="md" className="practice-page results-screen">
        <Paper elevation={3} className="results-card">
          <Typography variant="h4" gutterBottom className="results-title">
            Quiz Finished!
          </Typography>
          <Typography variant="h5" gutterBottom className="score-text">
            Your Score: {score} / {filteredQuestions.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(score / filteredQuestions.length) * 100}
            className="score-progress"
          />
          <Button
            variant="contained"
            onClick={handleRetryQuiz}
            startIcon={<RedoIcon />}
            className="retry-button"
          >
            Retry Quiz
          </Button>
          <Button
            variant="outlined"
            onClick={() => setQuizStarted(false)}
            startIcon={<AssessmentIcon />}
            className="back-to-filters-button"
          >
            Back to Filters
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!currentQuestion) {
    return (
      <Container maxWidth="md" className="practice-page loading-screen">
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2, color: 'var(--text-muted)' }}>
          Loading question...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="practice-page quiz-screen">
      <Paper elevation={3} className="question-card">
        <Box className="quiz-header">
          <Typography variant="h6" className="question-counter">
            Question {currentQuestionIndex + 1} / {filteredQuestions.length}
          </Typography>
          <Chip label={currentQuestion.subject} className="subject-chip" />
          <Chip label={currentQuestion.difficulty} className="difficulty-chip" />
        </Box>
        <Typography variant="h5" component="h2" gutterBottom className="question-text">
          {currentQuestion.questionText}
        </Typography>
        <Box className="options-grid">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              variant="outlined"
              onClick={() => handleAnswerSelect(option)}
              className={
                `option-button ${selectedAnswer === option ? 
                  (option === currentQuestion.correctAnswer ? 'correct' : 'incorrect') : 
                  ''}`
              }
              disabled={selectedAnswer !== null}
            >
              {option}
            </Button>
          ))}
        </Box>

        {showExplanation && (
          <Box className="explanation-box">
            <Typography variant="h6" className="explanation-title">
              <TroubleshootIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Explanation
            </Typography>
            <Typography variant="body1" className="explanation-text">
              {currentQuestion.explanation}
            </Typography>
            <Button
              variant="contained"
              onClick={handleNextQuestion}
              startIcon={<DoneAllIcon />}
              className="next-button"
            >
              {currentQuestionIndex < filteredQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Practice; 