import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, InputLabel, Select, FormControl } from '@mui/material';
import { StudySession } from './StudySessionBlock';
import type { SelectChangeEvent } from '@mui/material/Select';

interface EditSessionModalProps {
  open: boolean;
  initialData?: StudySession;
  onSave: (session: StudySession) => void;
  onClose: () => void;
}

const sessionTypes = [
  { value: 'reading', label: 'Reading' },
  { value: 'practice', label: 'Practice' },
  { value: 'review', label: 'Review' },
  { value: 'other', label: 'Other' },
];

const EditSessionModal: React.FC<EditSessionModalProps> = ({ open, initialData, onSave, onClose }) => {
  const [session, setSession] = useState<StudySession>(
    initialData || {
      id: '',
      time: '',
      topic: '',
      type: 'reading',
      color: '#fff',
      notes: '',
    }
  );

  useEffect(() => {
    setSession(initialData || {
      id: '',
      time: '',
      topic: '',
      type: 'reading',
      color: '#fff',
      notes: '',
    });
  }, [initialData, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSession((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setSession((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleSave = () => {
    if (session.topic && session.time) {
      onSave({ ...session, id: session.id || Date.now().toString() });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Edit Session' : 'Add Session'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Topic"
          name="topic"
          value={session.topic}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Time"
          name="time"
          value={session.time}
          onChange={handleInputChange}
          fullWidth
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Type</InputLabel>
          <Select
            name="type"
            value={session.type}
            onChange={handleSelectChange}
            label="Type"
          >
            {sessionTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Color"
          name="color"
          type="color"
          value={session.color}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Notes"
          name="notes"
          value={session.notes}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={2}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSessionModal; 