import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Book as BookIcon,
  VideoLibrary as VideoIcon,
  Description as DocumentIcon
} from '@mui/icons-material';
import NoteEditor from '../components/NoteEditor';
import axios from 'axios';
import './StudyMaterials.css';

interface StudyMaterial {
  id: string;
  title: string;
  content: string;
  type: 'Book' | 'Video' | 'Document' | 'Note';
  subject?: string;
  createdAt: string;
  updatedAt?: string;
}

const StudyMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/notes');
        const apiMaterials = response.data.map((note: any) => ({
          id: note.id,
          title: note.title,
          content: note.content,
          type: 'Note',
          subject: note.subject || 'General',
          createdAt: new Date(note.createdAt).toISOString().split('T')[0],
          updatedAt: note.updatedAt ? new Date(note.updatedAt).toISOString().split('T')[0] : undefined,
        }));

        // Load generated study materials from localStorage
        const savedMaterials = localStorage.getItem('studyflow_materials');
        let generatedMaterials: StudyMaterial[] = [];
        if (savedMaterials) {
          generatedMaterials = JSON.parse(savedMaterials).map((material: any) => ({
            ...material,
            createdAt: new Date(material.createdAt).toISOString().split('T')[0],
            updatedAt: material.updatedAt ? new Date(material.updatedAt).toISOString().split('T')[0] : undefined,
          }));
        }

        // Combine API materials and generated materials
        setMaterials([...generatedMaterials, ...apiMaterials]);
      } catch (error) {
        console.error('Error fetching notes:', error);
        // If API fails, still load generated materials
        const savedMaterials = localStorage.getItem('studyflow_materials');
        if (savedMaterials) {
          const generatedMaterials = JSON.parse(savedMaterials).map((material: any) => ({
            ...material,
            createdAt: new Date(material.createdAt).toISOString().split('T')[0],
            updatedAt: material.updatedAt ? new Date(material.updatedAt).toISOString().split('T')[0] : undefined,
          }));
          setMaterials(generatedMaterials);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []); // Empty dependency array to fetch only once on mount

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || material.type === selectedType;
    const matchesSubject = !selectedSubject || material.subject === selectedSubject;
    return matchesSearch && matchesType && matchesSubject;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Book':
        return <BookIcon />;
      case 'Video':
        return <VideoIcon />;
      case 'Document':
        return <DocumentIcon />;
      case 'Note':
        return <DocumentIcon />;
      default:
        return <BookIcon />;
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, materialId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedMaterial(materialId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMaterial(null);
  };

  const handleSaveNote = async (content: string) => {
    try {
      const newNote = {
        title: `Note from ${new Date().toLocaleString()}`,
        content: content,
        subject: 'General', // Default subject for now
      };
      const response = await axios.post('http://localhost:3000/api/notes', newNote);
      const savedNote: StudyMaterial = {
        id: response.data.id,
        title: response.data.title,
        content: response.data.content,
        type: 'Note',
        subject: response.data.subject || 'General',
        createdAt: new Date(response.data.createdAt).toISOString().split('T')[0],
        updatedAt: response.data.updatedAt ? new Date(response.data.updatedAt).toISOString().split('T')[0] : undefined,
      };
      setMaterials(prevMaterials => [...prevMaterials, savedNote]);
      setIsNoteEditorOpen(false); // Close the editor after saving
    } catch (error) {
      console.error('Error saving note:', error);
      // Handle error, e.g., show an error message to the user
    }
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="materials-page">
      <div className="materials-header">
        <Typography variant="h4" component="h1">
          Study Materials
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsNoteEditorOpen(true)}
        >
          Add New Note
        </Button>
      </div>

      {isNoteEditorOpen && (
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Create New Note
          </Typography>
          <NoteEditor onSave={handleSaveNote} />
          <Button onClick={() => setIsNoteEditorOpen(false)} variant="outlined" sx={{ mt: 2 }}>
            Cancel
          </Button>
        </Box>
      )}

      <div className="materials-filters">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search materials..."
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
          {['Book', 'Video', 'Document', 'Note'].map((type) => (
            <Chip
              key={type}
              icon={getTypeIcon(type)}
              label={type}
              onClick={() => setSelectedType(
                selectedType === type ? null : type
              )}
              color={selectedType === type ? 'primary' : 'default'}
              variant={selectedType === type ? 'filled' : 'outlined'}
            />
          ))}
        </div>
      </div>

      <Grid container spacing={3} className="materials-grid">
        {filteredMaterials.map((material) => (
          <Grid item xs={12} sm={6} md={4} key={material.id}>
            <Card className="material-card">
              <CardContent>
                <div className="material-header">
                  <div className="material-type">
                    {getTypeIcon(material.type)}
                    <Chip
                      label={material.type}
                      size="small"
                      className="type-chip"
                    />
                  </div>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, material.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </div>
                <Typography variant="h6" component="h2" className="material-title">
                  {material.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" className="material-description">
                  {material.content}
                </Typography>
                <div className="material-meta">
                  <Typography variant="caption" color="textSecondary">
                    Subject: {material.subject}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Created: {new Date(material.createdAt).toLocaleDateString()}
                  </Typography>
                </div>
                <div className="material-stats">
                  <div className="stat">
                    <Typography variant="body2" color="textSecondary">
                      Rating
                    </Typography>
                    <Typography variant="h6">
                      {/* Rating component would be populated here */}
                    </Typography>
                  </div>
                  <div className="stat">
                    <Typography variant="body2" color="textSecondary">
                      Views
                    </Typography>
                    <Typography variant="h6">
                      {/* Views component would be populated here */}
                    </Typography>
                  </div>
                </div>
                <div className="material-actions">
                  <Button
                    variant="outlined"
                    component={Link}
                    to={`/materials/${material.id}`}
                    fullWidth
                  >
                    View Material
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
    </div>
  );
};

export default StudyMaterials; 