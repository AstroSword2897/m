import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Book as BookIcon,
  VideoLibrary as VideoIcon,
  Description as DocumentIcon
} from '@mui/icons-material';
import './StudyMaterials.css';

interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  type: 'Book' | 'Video' | 'Document';
  subject: string;
  createdAt: string;
  author: string;
  rating: number;
  views: number;
}

const StudyMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Fetch materials from API
    const mockMaterials: StudyMaterial[] = [
      {
        id: '1',
        title: 'Calculus Fundamentals',
        description: 'Comprehensive guide to calculus basics',
        type: 'Book',
        subject: 'AP Calculus AB',
        createdAt: '2024-02-15',
        author: 'Dr. Smith',
        rating: 4.5,
        views: 1200
      },
      {
        id: '2',
        title: 'Physics Problem Solving',
        description: 'Video series on solving complex physics problems',
        type: 'Video',
        subject: 'AP Physics 1',
        createdAt: '2024-02-10',
        author: 'Prof. Johnson',
        rating: 4.8,
        views: 2500
      },
      {
        id: '3',
        title: 'Chemistry Lab Guide',
        description: 'Detailed lab procedures and safety guidelines',
        type: 'Document',
        subject: 'AP Chemistry',
        createdAt: '2024-02-05',
        author: 'Dr. Brown',
        rating: 4.2,
        views: 800
      }
    ];
    setMaterials(mockMaterials);
    setLoading(false);
  }, []);

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase());
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
      default:
        return null;
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
          component={Link}
          to="/materials/new"
        >
          Add Material
        </Button>
      </div>

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
          {['Book', 'Video', 'Document'].map((type) => (
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
                  {material.description}
                </Typography>
                <div className="material-meta">
                  <Typography variant="caption" color="textSecondary">
                    Subject: {material.subject}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Author: {material.author}
                  </Typography>
                </div>
                <div className="material-stats">
                  <div className="stat">
                    <Typography variant="body2" color="textSecondary">
                      Rating
                    </Typography>
                    <Typography variant="h6">
                      {material.rating}/5
                    </Typography>
                  </div>
                  <div className="stat">
                    <Typography variant="body2" color="textSecondary">
                      Views
                    </Typography>
                    <Typography variant="h6">
                      {material.views}
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