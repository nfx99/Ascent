import React, { useState, useCallback } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme as useMuiTheme,
} from '@mui/material';
import { 
  Add as AddIcon,
  ArrowBack as BackIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useHabits } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';
import AddHabitDialog from './AddHabitDialog';
import HabitCard from './HabitCard';

const HabitsPage: React.FC = () => {
  const { habits, toggleHabitCompletion, deleteHabit } = useHabits();
  const { mode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const handleOpenDialog = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsAddDialogOpen(true);
    // Allow transition state to reset after dialog is fully open
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning]);
  
  const handleCloseDialog = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsAddDialogOpen(false);
    // Allow transition state to reset after dialog is fully closed
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          bgcolor: 'background.paper', 
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary'
        }}
      >
        <Toolbar>
          <IconButton 
            component={Link} 
            to="/"
            color="inherit"
            edge="start"
            sx={{ mr: 2 }}
          >
            <BackIcon />
          </IconButton>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 600,
              background: mode === 'light' 
                ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                : 'linear-gradient(45deg, #90caf9 30%, #81deea 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Habit Tracker
          </Typography>
          <IconButton 
            onClick={toggleTheme} 
            color="inherit"
            sx={{ mr: 2 }}
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            disabled={isTransitioning}
            sx={{
              borderRadius: '20px',
              px: 2,
              background: mode === 'light'
                ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                : 'linear-gradient(45deg, #90caf9 30%, #81deea 90%)',
              boxShadow: mode === 'light'
                ? '0 3px 5px 2px rgba(33, 203, 243, .3)'
                : '0 3px 5px 2px rgba(144, 202, 249, .3)',
            }}
          >
            Add Habit
          </Button>
        </Toolbar>
      </AppBar>
      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: 3, 
          mb: 4, 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          p: {xs: 1, sm: 2, md: 3},
          overflow: 'hidden',
          '&::-webkit-scrollbar': { // Hide scrollbars for cleaner look
            display: 'none',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {habits.length === 0 ? (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexGrow: 1,
              textAlign: 'center',
              p: 4
            }}
          >
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No habits yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start tracking your habits by adding your first habit
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              disabled={isTransitioning}
              sx={{
                borderRadius: '20px',
                px: 3,
                py: 1,
                background: mode === 'light'
                  ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                  : 'linear-gradient(45deg, #90caf9 30%, #81deea 90%)',
                boxShadow: mode === 'light'
                  ? '0 3px 5px 2px rgba(33, 203, 243, .3)'
                  : '0 3px 5px 2px rgba(144, 202, 249, .3)',
              }}
            >
              Add Your First Habit
            </Button>
          </Box>
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 0,
              flexGrow: 1,
              width: '100%',
              overflow: 'hidden', // Prevent horizontal scrolling
              '& > div': { // Target all direct children (HabitCards)
                maxWidth: '100%',
              }
            }}
          >
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggleCompletion={(date, quantity) => toggleHabitCompletion(habit.id, date, quantity)}
                onDelete={() => deleteHabit(habit.id)}
              />
            ))}
          </Box>
        )}
      </Container>
      <AddHabitDialog
        open={isAddDialogOpen}
        onClose={handleCloseDialog}
      />
    </Box>
  );
};

export default HabitsPage; 