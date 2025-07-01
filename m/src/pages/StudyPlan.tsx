import React, { useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import StudySessionBlock, { StudySession } from '../components/StudySessionBlock';
import EditSessionModal from '../components/EditSessionModal';

const StudyPlan: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | undefined>(undefined);

  const handleAdd = () => {
    setEditingSession(undefined);
    setModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const session = sessions.find((s) => s.id === id);
    setEditingSession(session);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSave = (session: StudySession) => {
    setSessions((prev) => {
      const exists = prev.some((s) => s.id === session.id);
      if (exists) {
        return prev.map((s) => (s.id === session.id ? session : s));
      } else {
        return [...prev, session];
      }
    });
    setModalOpen(false);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        My Study Plan
      </Typography>
      <Box
        sx={{
          minHeight: '300px',
          border: '2px dashed #ccc',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: sessions.length === 0 ? 'center' : 'flex-start',
          marginBottom: '2rem',
          p: 2,
        }}
      >
        {sessions.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            Your study sessions will appear here.
          </Typography>
        ) : (
          sessions.map((session) => (
            <StudySessionBlock
              key={session.id}
              session={session}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </Box>
      <Button variant="contained" color="primary" onClick={handleAdd}>
        Add Session
      </Button>
      <EditSessionModal
        open={modalOpen}
        initialData={editingSession}
        onSave={handleSave}
        onClose={() => setModalOpen(false)}
      />
    </Container>
  );
};

export default StudyPlan; 