import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Group as GroupIcon,
  Send as SendIcon,
  Forum as ForumIcon,
} from '@mui/icons-material';
import './Collaborate.css';

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
}

const dummyMessages: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'Alice',
    message: 'Hi everyone! Ready for our study session?',
    timestamp: '10:00 AM',
  },
  {
    id: 'm2',
    sender: 'You',
    message: 'Yep, I\'m here! What topic are we starting with?',
    timestamp: '10:01 AM',
  },
  {
    id: 'm3',
    sender: 'Bob',
    message: 'Let\'s tackle linear algebra today.',
    timestamp: '10:03 AM',
  },
  {
    id: 'm4',
    sender: 'Alice',
    message: 'Sounds good! Anyone have a specific problem they want to review?',
    timestamp: '10:05 AM',
  },
];

const Collaborate: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(dummyMessages);
  const [newMessage, setNewMessage] = useState<string>('');
  const currentUser = 'You'; // This could be dynamically set based on login

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const newMsg: ChatMessage = {
        id: `m${messages.length + 1}`,
        sender: currentUser,
        message: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
    }
  };

  return (
    <Container maxWidth="md" className="collaborate-page">
      <Box className="collaborate-header">
        <Typography variant="h4" component="h1" gutterBottom className="page-title">
          <GroupIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Collaborative Study
        </Typography>
      </Box>

      <Box className="chat-window">
        <Typography variant="h5" className="chat-title">
          <ForumIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Group Chat
        </Typography>
        <List className="message-list">
          {messages.map((msg) => (
            <ListItem key={msg.id} className={`chat-message ${msg.sender === currentUser ? 'self' : 'other'}`}>
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography component="span" variant="subtitle2" className="message-sender">
                      {msg.sender === currentUser ? 'Me' : msg.sender}
                    </Typography>
                    <Typography component="span" variant="caption" className="message-timestamp">
                      {msg.timestamp}
                    </Typography>
                  </React.Fragment>
                }
                secondary={
                  <Typography component="span" variant="body1" className="message-content">
                    {msg.message}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
        <Box className="message-input-area">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSendMessage} edge="end" className="send-button">
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            className="message-input"
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Collaborate; 