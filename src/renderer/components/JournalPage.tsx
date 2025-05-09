import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

interface JournalEntry {
  title: string;
  content: string;
  date: Date;
}

// Common styles
const styles = {
  paperStyles: (mode: string) => ({
    border: '1px solid',
    borderColor: mode === 'dark' ? 'rgba(50, 55, 70, 0.9)' : 'rgba(210, 215, 225, 0.95)',
    boxShadow: mode === 'dark' 
      ? '0 4px 15px rgba(0,0,0,0.3)'
      : '0 4px 15px rgba(0,0,0,0.04)',
    bgcolor: 'background.paper',
    borderRadius: 2,
  }),
  heading: {
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  gradientText: (mode: string) => ({
    background: mode === 'light' 
      ? 'linear-gradient(45deg, #455A64 30%, #263238 90%)'
      : 'linear-gradient(45deg, #90A4AE 30%, #78909C 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  })
};

const JournalPage: React.FC = () => {
  const { mode } = useTheme();
  
  // Sample initial entries
  const initialEntries: JournalEntry[] = [
    {
      title: "Started new workout program",
      content: "Today I started my new fitness routine. Feeling motivated!",
      date: new Date(Date.now() - 86400000 * 2) // 2 days ago
    },
    {
      title: "Monthly goals assessment",
      content: "Reflected on my goals for the month. Making progress but need to focus more.",
      date: new Date(Date.now() - 86400000 * 5) // 5 days ago
    },
    {
      title: "Side project progress",
      content: "Had a productive day working on my side project.",
      date: new Date(Date.now() - 86400000 * 7) // 7 days ago
    }
  ];
  
  // State
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isViewingEntry, setIsViewingEntry] = useState(false);

  // Handlers
  const handleAddEntry = () => {
    if (newEntryTitle.trim() && newEntryContent.trim()) {
      const newEntry = {
        title: newEntryTitle,
        content: newEntryContent,
        date: new Date()
      };
      setEntries([newEntry, ...entries]);
      setNewEntryTitle('');
      setNewEntryContent('');
    }
  };

  const handleDeleteEntry = (index: number, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
    
    if (isViewingEntry) {
      setIsViewingEntry(false);
      setSelectedEntry(null);
    }
  };

  const handleViewEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsViewingEntry(true);
  };

  const handleBackToList = () => {
    setIsViewingEntry(false);
    setSelectedEntry(null);
  };

  // Format date helper
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 6 }}>
      {/* Header */}
      <Paper 
        elevation={0}
        sx={{ 
          py: 2, px: 3, mb: 4, 
          borderRadius: 0,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton component={Link} to="/" color="inherit" sx={{ mr: 2 }}>
            <BackIcon />
          </IconButton>
          <Typography 
            variant="h5" 
            component="h1" 
            sx={{ 
              ...styles.heading,
              ...styles.gradientText(mode),
              flexGrow: 1,
            }}
          >
            Journal
          </Typography>
        </Box>
      </Paper>

      <Container maxWidth="md">
        {!isViewingEntry ? (
          <>
            {/* New Entry Form */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, mb: 4,
                ...styles.paperStyles(mode),
              }}
            >
              <Typography variant="h6" gutterBottom sx={styles.heading}>
                New Entry
              </Typography>
              
              <TextField
                fullWidth
                variant="outlined"
                label="Title"
                placeholder="Entry title"
                value={newEntryTitle}
                onChange={(e) => setNewEntryTitle(e.target.value)}
                sx={{ mb: 2 }}
                InputLabelProps={{ style: { fontWeight: 500 } }}
              />
              
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                label="Content"
                placeholder="What's on your mind today?"
                value={newEntryContent}
                onChange={(e) => setNewEntryContent(e.target.value)}
                sx={{ mb: 2 }}
                InputLabelProps={{ style: { fontWeight: 500 } }}
              />
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddEntry}
                disabled={!newEntryTitle.trim() || !newEntryContent.trim()}
                sx={{
                  borderRadius: '4px',
                  px: 3, py: 1,
                  background: mode === 'light'
                    ? 'linear-gradient(45deg, #455A64 30%, #263238 90%)'
                    : 'linear-gradient(45deg, #78909C 30%, #90A4AE 90%)',
                  boxShadow: mode === 'light'
                    ? '0 3px 5px 2px rgba(38, 50, 56, .3)'
                    : '0 3px 5px 2px rgba(120, 144, 156, .3)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                Add Entry
              </Button>
            </Paper>

            {/* Entries List Header */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ ...styles.heading, px: 1 }}>
                Entries
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
              </Typography>
            </Box>

            {/* Entries List */}
            {entries.length > 0 ? (
              <List sx={{ width: '100%' }}>
                {entries.map((entry, index) => (
                  <Paper 
                    key={index}
                    elevation={0}
                    sx={{ 
                      mb: 2,
                      ...styles.paperStyles(mode),
                      overflow: 'hidden',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: mode === 'dark' 
                          ? '0 4px 12px rgba(0,0,0,0.3)'
                          : '0 4px 12px rgba(0,0,0,0.07)',
                      }
                    }}
                  >
                    <ListItem
                      button
                      onClick={() => handleViewEntry(entry)}
                      secondaryAction={
                        <IconButton edge="end" onClick={(e) => handleDeleteEntry(index, e)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {entry.title}
                          </Typography>
                        }
                        secondary={
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ display: 'block', fontWeight: 500 }}
                          >
                            {formatDate(entry.date)}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </Paper>
                ))}
              </List>
            ) : (
              <Box 
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  No journal entries yet. Add your first entry above.
                </Typography>
              </Box>
            )}
          </>
        ) : (
          /* Entry Detail View */
          selectedEntry && (
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, mb: 4,
                ...styles.paperStyles(mode),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={handleBackToList} sx={{ mr: 2 }}>
                  <BackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1 }}>
                  {selectedEntry.title}
                </Typography>
              </Box>
              
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
                {formatDate(selectedEntry.date)}
              </Typography>
              
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {selectedEntry.content}
              </Typography>
            </Paper>
          )
        )}
      </Container>
    </Box>
  );
};

export default JournalPage; 