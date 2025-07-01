import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export type StudySession = {
  id: string;
  time: string;
  topic: string;
  type: 'reading' | 'practice' | 'review' | 'other';
  color: string;
  notes?: string;
  completed?: boolean;
};

interface StudySessionBlockProps {
  session: StudySession;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  reading: <span role="img" aria-label="Reading">📖</span>,
  practice: <span role="img" aria-label="Practice">📝</span>,
  review: <span role="img" aria-label="Review">🔄</span>,
  other: <span role="img" aria-label="Other">⭐</span>,
};

const StudySessionBlock: React.FC<StudySessionBlockProps> = ({ session, onEdit, onDelete }) => {
  return (
    <Card sx={{ background: session.color, mb: 2, position: 'relative' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            {typeIcons[session.type]}
            <Typography variant="h6">{session.topic}</Typography>
          </Box>
          <Box>
            <IconButton onClick={() => onEdit(session.id)} size="small"><EditIcon /></IconButton>
            <IconButton onClick={() => onDelete(session.id)} size="small"><DeleteIcon /></IconButton>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">{session.time}</Typography>
        {session.notes && <Typography variant="body2">{session.notes}</Typography>}
      </CardContent>
    </Card>
  );
};

export default StudySessionBlock; 