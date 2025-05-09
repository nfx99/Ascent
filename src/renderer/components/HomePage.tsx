import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardActionArea,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Assignment as JournalIcon,
  CalendarMonth as HabitsIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';

// Common styles that can be reused
const commonStyles = {
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2,
    overflow: 'hidden',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  },
  cardHover: (mode: string) => ({
    transform: 'translateY(-5px)',
    boxShadow: mode === 'dark' 
      ? '0 8px 20px rgba(0,0,0,0.5)'
      : '0 8px 20px rgba(0,0,0,0.15)',
  }),
  heading: {
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  }
};

const HomePage: React.FC = () => {
  const { mode } = useTheme();

  // Generate color based on mode
  const getColor = (lightColor: string, darkColor: string) => 
    mode === 'dark' ? darkColor : lightColor;
    
  // Generate gradient based on mode
  const getGradient = (light1: string, light2: string, dark1: string, dark2: string) =>
    mode === 'light'
      ? `linear-gradient(45deg, ${light1} 30%, ${light2} 90%)`
      : `linear-gradient(45deg, ${dark1} 30%, ${dark2} 90%)`;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Hero Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 3, md: 6 },
          mb: 6,
          borderRadius: 2,
          background: mode === 'dark' 
            ? 'linear-gradient(135deg, rgba(40, 44, 52, 0.9) 0%, rgba(25, 28, 36, 0.95) 100%)' 
            : 'linear-gradient(135deg, rgba(235, 240, 245, 0.9) 0%, rgba(220, 225, 235, 0.95) 100%)',
          border: '1px solid',
          borderColor: getColor('rgba(210, 215, 225, 0.95)', 'rgba(50, 55, 70, 0.9)'),
          boxShadow: getColor('0 4px 15px rgba(0,0,0,0.1)', '0 4px 15px rgba(0,0,0,0.4)'),
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            ...commonStyles.heading,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            background: getGradient('#1565C0', '#0D47A1', '#64B5F6', '#42A5F5'),
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          ASCENT
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          paragraph
          sx={{ 
            maxWidth: '800px',
            mb: 3,
            fontWeight: 400,
            letterSpacing: '0.01em',
          }}
        >
          Push your limits. Track your progress. Achieve your goals.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button 
            variant="contained" 
            component={Link} 
            to="/habits"
            size="large"
            sx={{ 
              px: 3,
              py: 1.5,
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              background: getGradient('#1565C0', '#0D47A1', '#64B5F6', '#42A5F5'),
              boxShadow: getColor(
                '0 3px 5px 2px rgba(13, 71, 161, .3)',
                '0 3px 5px 2px rgba(66, 165, 245, .3)'
              ),
              '&:hover': {
                background: getGradient('#0D47A1', '#1565C0', '#42A5F5', '#64B5F6'),
              }
            }}
          >
            GET STARTED
          </Button>
        </Box>
      </Paper>

      {/* Features Section */}
      <Typography 
        variant="h4" 
        component="h2" 
        sx={{ 
          ...commonStyles.heading,
          mb: 4, 
          textAlign: 'center',
          letterSpacing: '0.05em',
        }}
      >
        Features
      </Typography>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {/* Feature Cards */}
        {[
          {
            title: 'Habit Tracker',
            description: 'Build and maintain positive habits with our visual tracker. Track your progress and build streaks to maximize performance.',
            icon: <HabitsIcon sx={{ fontSize: 80, color: getColor('#1565C0', '#64B5F6') }} />,
            link: '/habits',
            background: getColor(
              'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
              'linear-gradient(135deg, #303F9F 0%, #1A237E 100%)'
            ),
            linkText: 'Track Habits'
          },
          {
            title: 'Journal',
            description: 'Document your thoughts, training notes, and reflections. Record your insights to track mental progress.',
            icon: <JournalIcon sx={{ fontSize: 80, color: getColor('#455A64', '#90A4AE') }} />,
            link: '/journal',
            background: getColor(
              'linear-gradient(135deg, #ECEFF1 0%, #CFD8DC 100%)',
              'linear-gradient(135deg, #424242 0%, #212121 100%)'
            ),
            linkText: 'Start Journaling'
          }
        ].map((feature, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card 
              elevation={0}
              sx={{ 
                ...commonStyles.card,
                border: '1px solid',
                borderColor: getColor('rgba(210, 215, 225, 0.95)', 'rgba(50, 55, 70, 0.9)'),
                '&:hover': commonStyles.cardHover(mode),
              }}
            >
              <CardActionArea 
                component={Link} 
                to={feature.link}
                sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'stretch',
                  height: '100%'
                }}
              >
                <Box 
                  sx={{ 
                    height: 180, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: feature.background,
                  }}
                >
                  {feature.icon}
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography gutterBottom variant="h5" component="h2" sx={commonStyles.heading}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {feature.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2 }}>
                    <Typography variant="body2" color="primary" sx={{ mr: 1, fontWeight: 600, textTransform: 'uppercase' }}>
                      {feature.linkText}
                    </Typography>
                    <ArrowIcon color="primary" fontSize="small" />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage; 