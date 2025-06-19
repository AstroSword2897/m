import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  MenuBook as MenuBookIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import './StudyMaterials.css';

interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  type: 'note' | 'pdf' | 'link' | 'image';
  subject: string;
  tags: string[];
  url?: string; // For links and PDFs
}

const dummyMaterials: StudyMaterial[] = [
  {
    id: 'sm1',
    title: 'Algebra Basics Notes',
    description: 'Comprehensive notes on fundamental algebra concepts.',
    type: 'note',
    subject: 'Mathematics',
    tags: ['algebra', 'notes', 'math'],
  },
  {
    id: 'sm2',
    title: 'Physics Kinematics PDF',
    description: 'PDF document covering kinematics and motion.',
    type: 'pdf',
    subject: 'Physics',
    tags: ['physics', 'kinematics', 'pdf'],
    url: '#',
  },
  {
    id: 'sm3',
    title: 'Chemistry Periodic Table Link',
    description: 'Interactive periodic table resource.',
    type: 'link',
    subject: 'Chemistry',
    tags: ['chemistry', 'periodic table', 'link'],
    url: 'https://www.ptable.com/',
  },
  {
    id: 'sm4',
    title: 'Biology Cell Diagram',
    description: 'Image illustrating the structure of an animal cell.',
    type: 'image',
    subject: 'Biology',
    tags: ['biology', 'cells', 'image'],
    url: '#',
  },
];

const StudyMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>(dummyMaterials);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || material.type === filterType;
    const matchesSubject = filterSubject === 'all' || material.subject === filterSubject;
    return matchesSearch && matchesType && matchesSubject;
  });

  const handleDelete = (id: string) => {
    setMaterials(materials.filter(mat => mat.id !== id));
    alert(`Material with ID ${id} deleted.`);
  };

  return (
    <Container maxWidth="lg" className="study-materials-page">
      <Box className="materials-header">
        <Typography variant="h4" component="h1" gutterBottom className="page-title">
          <MenuBookIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Study Materials
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} className="add-material-button">
          Add New Material
        </Button>
      </Box>

      <Box className="materials-filters">
        <TextField
          label="Search Materials"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mr: 2, mb: 2, flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          className="search-input"
        />
        <TextField
          select
          label="Filter by Type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          sx={{ mr: 2, mb: 2, minWidth: 150 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterListIcon />
              </InputAdornment>
            ),
          }}
          className="filter-select"
        >
          <MenuItem value="all">All Types</MenuItem>
          <MenuItem value="note">Note</MenuItem>
          <MenuItem value="pdf">PDF</MenuItem>
          <MenuItem value="link">Link</MenuItem>
          <MenuItem value="image">Image</MenuItem>
        </TextField>
        <TextField
          select
          label="Filter by Subject"
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          sx={{ mb: 2, minWidth: 150 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterListIcon />
              </InputAdornment>
            ),
          }}
          className="filter-select"
        >
          <MenuItem value="all">All Subjects</MenuItem>
          <MenuItem value="Mathematics">Mathematics</MenuItem>
          <MenuItem value="Physics">Physics</MenuItem>
          <MenuItem value="Chemistry">Chemistry</MenuItem>
          <MenuItem value="Biology">Biology</MenuItem>
          <MenuItem value="Computer Science">Computer Science</MenuItem>
        </TextField>
      </Box>

      <Grid container spacing={3} className="materials-grid">
        {filteredMaterials.map((material) => (
          <Grid item xs={12} sm={6} md={4} key={material.id}>
            <Card className="material-card">
              <CardContent>
                <Typography variant="h6" component="h2" className="material-title">
                  {material.title}
                </Typography>
                <Typography variant="body2" className="material-description">
                  {material.description}
                </Typography>
                <Box className="material-info">
                  <Chip label={material.type} className="material-type-chip" />
                  <Chip label={material.subject} className="material-subject-chip" />
                </Box>
                <Box className="material-tags">
                  {material.tags.map((tag, index) => (
                    <Chip key={index} label={tag} className="material-tag-chip" />
                  ))}
                </Box>
                <Box className="material-actions">
                  {material.url && (
                    <Button 
                      variant="text" 
                      size="small" 
                      href={material.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="material-action-button"
                    >
                      View
                    </Button>
                  )}
                  <Button 
                    variant="text" 
                    size="small" 
                    startIcon={<EditIcon />} 
                    className="material-action-button"
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="text" 
                    size="small" 
                    color="error" 
                    startIcon={<DeleteIcon />} 
                    onClick={() => handleDelete(material.id)}
                    className="material-action-button"
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {filteredMaterials.length === 0 && (
        <Typography variant="h6" align="center" className="no-materials-message">
          No study materials found.
        </Typography>
      )}
    </Container>
  );
};

export default StudyMaterials; 