import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, TextField, FormControl, InputLabel, Select, MenuItem, Paper, Typography, Box, Chip, Card, CardContent, CardActions, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import './StudyFlowSetup.css';

const steps = ['Study Goals', 'Subjects & Topics', 'Study Preferences', 'Generate Your Study Plan'];

interface Subject {
  name: string;
  difficulty: string;
  hours: number;
  topics: string[];
}

const StudyFlowSetup = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [studyGoal, setStudyGoal] = useState('');
  const [preferredTime, setPreferredTime] = useState('');

  // Step 2 State
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [currentSubjectName, setCurrentSubjectName] = useState('');
  const [currentSubjectDifficulty, setCurrentSubjectDifficulty] = useState('Medium');
  const [currentSubjectHours, setCurrentSubjectHours] = useState(5);
  const [currentTopic, setCurrentTopic] = useState('');
  const [currentTopicsList, setCurrentTopicsList] = useState<string[]>([]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAddTopic = () => {
    if (currentTopic && !currentTopicsList.includes(currentTopic)) {
      setCurrentTopicsList([...currentTopicsList, currentTopic]);
      setCurrentTopic('');
    }
  };

  const handleDeleteTopic = (topicToDelete: string) => {
    setCurrentTopicsList(currentTopicsList.filter(topic => topic !== topicToDelete));
  };
  
  const handleAddSubject = () => {
    if (currentSubjectName && currentTopicsList.length > 0) {
      const newSubject: Subject = {
        name: currentSubjectName,
        difficulty: currentSubjectDifficulty,
        hours: currentSubjectHours,
        topics: currentTopicsList,
      };
      setSubjects([...subjects, newSubject]);
      // Reset fields for next subject
      setCurrentSubjectName('');
      setCurrentSubjectDifficulty('Medium');
      setCurrentSubjectHours(5);
      setCurrentTopicsList([]);
      setCurrentTopic('');
    }
  };

  const handleDeleteSubject = (subjectIndex: number) => {
    setSubjects(subjects.filter((_, index) => index !== subjectIndex));
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Typography variant="h5" gutterBottom>What's your main study goal?</Typography>
            <TextField
              label="Describe your study goal"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={studyGoal}
              onChange={(e) => setStudyGoal(e.target.value)}
              placeholder="e.g., Ace my AP exams"
            />
            <Box mt={4}>
              <Typography variant="h5" gutterBottom>When do you prefer to study?</Typography>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Preferred Study Time</InputLabel>
                <Select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  label="Preferred Study Time"
                >
                  <MenuItem value="morning">Morning (6 AM - 12 PM)</MenuItem>
                  <MenuItem value="afternoon">Afternoon (12 PM - 5 PM)</MenuItem>
                  <MenuItem value="evening">Evening (5 PM - 10 PM)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="h5" gutterBottom>Add your subjects and topics</Typography>
            <Card variant="outlined" className="add-subject-card">
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField label="Subject Name" variant="outlined" fullWidth value={currentSubjectName} onChange={(e) => setCurrentSubjectName(e.target.value)} placeholder="e.g., AP Biology" />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Difficulty</InputLabel>
                      <Select value={currentSubjectDifficulty} onChange={(e) => setCurrentSubjectDifficulty(e.target.value)} label="Difficulty">
                        <MenuItem value="Easy">Easy</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Hard">Hard</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField label="Hours per week" type="number" variant="outlined" fullWidth value={currentSubjectHours} onChange={(e) => setCurrentSubjectHours(parseInt(e.target.value, 10))} />
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <TextField label="Add Topic" variant="outlined" fullWidth value={currentTopic} onChange={(e) => setCurrentTopic(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddTopic()} />
                      <Button variant="contained" onClick={handleAddTopic} startIcon={<AddIcon />}>Add Topic</Button>
                    </Box>
                    <Box className="topic-chips" mt={1}>
                      {currentTopicsList.map(topic => (
                        <Chip key={topic} label={topic} onDelete={() => handleDeleteTopic(topic)} />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Button fullWidth variant="contained" color="secondary" onClick={handleAddSubject} disabled={!currentSubjectName || currentTopicsList.length === 0}>Add Subject</Button>
              </CardActions>
            </Card>

            <Box mt={4}>
              {subjects.map((subject, index) => (
                <Card key={index} variant="outlined" className="subject-display-card">
                  <CardContent>
                    <Typography variant="h6">{subject.name}</Typography>
                    <Typography color="textSecondary">Difficulty: {subject.difficulty} | Hours/week: {subject.hours}</Typography>
                    <Box className="topic-chips" mt={1}>
                      {subject.topics.map(topic => (
                        <Chip key={topic} label={topic} variant="outlined" />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => handleDeleteSubject(index)}><DeleteIcon /></IconButton>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </>
        );
      case 2:
        return <Typography>Step 3: Study Preferences</Typography>;
      case 3:
        return <Typography>Step 4: Generate</Typography>;
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Paper elevation={3} className="study-flow-setup-container">
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        <span role="img" aria-label="target">🎯</span> Set Up Your StudyFlow
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel className="stepper">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box className="step-content">
        {getStepContent(activeStep)}
      </Box>
      <Box className="navigation-buttons">
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleNext}>
          {activeStep === steps.length - 1 ? 'Create My Study Plan' : 'Next'}
        </Button>
      </Box>
    </Paper>
  );
};

export default StudyFlowSetup; 