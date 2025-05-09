import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, useTheme as useMuiTheme } from '@mui/material';
import { HabitProvider } from './context/HabitContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import HomePage from './components/HomePage';
import HabitsPage from './components/HabitsPage';
import JournalPage from './components/JournalPage';

const AppContent: React.FC = () => {
  const { mode } = useTheme();
  const muiTheme = useMuiTheme();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'background.default',
      color: 'text.primary'
    }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/habits" element={<HabitsPage />} />
        <Route path="/journal" element={<JournalPage />} />
      </Routes>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <HabitProvider>
          <AppContent />
        </HabitProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
