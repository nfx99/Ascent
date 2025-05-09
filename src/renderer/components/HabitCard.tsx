import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { format, isToday, isAfter, getDay } from 'date-fns';
import { Habit } from '../types/habit';
import { useTheme } from '../context/ThemeContext';
import { useTheme as useMuiTheme } from '@mui/material/styles';

interface HabitCardProps {
  habit: Habit;
  onToggleCompletion: (date: string, quantity?: number) => void;
  onDelete: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggleCompletion, onDelete }) => {
  const { mode } = useTheme();
  const muiTheme = useMuiTheme();
  const isSmallScreen = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [quantity, setQuantity] = useState<number | ''>('');
  const [useCheckbox, setUseCheckbox] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Define constants first
  const CELL_GAP = 1;   // Minimum gap for compact layout
  const WEEKDAY_LABEL_WIDTH = 90; // Wider width for weekday labels
  
  // Debug function to log grid information
  const debugGridInfo = useCallback((grid: Date[][]) => {
    const totalWeeks = grid.length;
    const daysInFullYear = new Date(selectedYear, 0, 0).getDate() === 366 ? 366 : 365;
    const daysInCurrentYear = grid.flat().filter(date => 
      date.getFullYear() === selectedYear
    ).length;
    
    const jan1 = grid.flat().find(date => 
      date.getFullYear() === selectedYear && date.getMonth() === 0 && date.getDate() === 1
    );
    
    const dec31 = grid.flat().find(date => 
      date.getFullYear() === selectedYear && date.getMonth() === 11 && date.getDate() === 31
    );
    
    console.log(`Grid for ${selectedYear}: ${totalWeeks} weeks × 7 days`);
    console.log(`Days in year: ${daysInFullYear}, days displayed from year: ${daysInCurrentYear}`);
    console.log(`Jan 1 present: ${!!jan1}, Dec 31 present: ${!!dec31}`);
    
    // Check if the grid is 52 or 53 weeks (standard for a year)
    const isStandardSize = totalWeeks >= 52 && totalWeeks <= 53;
    console.log(`Grid size check: ${isStandardSize ? 'PASSED' : 'FAILED'} - ${totalWeeks} weeks (should be 52-53)`);
    
    return {
      size: totalWeeks,
      daysInYear: daysInCurrentYear,
      hasJan1: !!jan1,
      hasDec31: !!dec31,
      isCorrectSize: isStandardSize
    };
  }, [selectedYear]);
  
  // Build grid: grid[col][row] = date or null
  // Col = week, Row = weekday
  const grid = useMemo(() => {
    // Get the start and end dates for the year
    const jan1 = new Date(selectedYear, 0, 1);
    const dec31 = new Date(selectedYear, 11, 31);
    
    // Find the first Sunday before or on Jan 1
    const firstDayOfGrid = new Date(jan1);
    const firstDayOfWeek = getDay(firstDayOfGrid);
    firstDayOfGrid.setDate(firstDayOfGrid.getDate() - firstDayOfWeek);
    
    // Find the last Saturday after or on Dec 31
    const lastDayOfGrid = new Date(dec31);
    const lastDayOfWeek = getDay(lastDayOfGrid);
    lastDayOfGrid.setDate(lastDayOfGrid.getDate() + (6 - lastDayOfWeek));
    
    // Calculate the total number of weeks
    const totalWeeks = Math.ceil(
      (lastDayOfGrid.getTime() - firstDayOfGrid.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    
    // Create the grid with the correct number of weeks
    const newGrid: Date[][] = [];
    
    // Start with the first day of the grid
    let currentDate = new Date(firstDayOfGrid);
    
    // Generate all weeks
    for (let week = 0; week < totalWeeks; week++) {
      const weekRow: Date[] = [];
      
      // Generate days for each week
      for (let day = 0; day < 7; day++) {
        weekRow.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      newGrid.push(weekRow);
    }
    
    // Check if December 31st is included in the grid
    const hasDec31 = newGrid.flat().some(date => 
      date.getFullYear() === selectedYear && date.getMonth() === 11 && date.getDate() === 31
    );
    
    // If December 31st is missing, add additional weeks until we include it
    if (!hasDec31) {
      console.warn(`December 31st, ${selectedYear} is missing from the grid. Extending grid.`);
      
      // Continue where we left off
      let additionalDate = new Date(currentDate);
      
      // Add up to 4 additional weeks (should be enough in all cases)
      for (let week = 0; week < 4; week++) {
        const weekRow: Date[] = [];
        
        for (let day = 0; day < 7; day++) {
          weekRow.push(new Date(additionalDate));
          additionalDate.setDate(additionalDate.getDate() + 1);
          
          // Check if we've now included December 31st
          if (additionalDate.getFullYear() === selectedYear + 1) {
            const hasDec31Now = newGrid.flat().concat(weekRow).some(date => 
              date.getFullYear() === selectedYear && date.getMonth() === 11 && date.getDate() === 31
            );
            
            if (hasDec31Now) {
              break;
            }
          }
        }
        
        newGrid.push(weekRow);
        
        // Check if December 31st is now in the grid after adding this week
        const containsDec31 = newGrid.flat().some(date => 
          date.getFullYear() === selectedYear && date.getMonth() === 11 && date.getDate() === 31
        );
        
        if (containsDec31) {
          console.log(`Grid extended. December 31st, ${selectedYear} is now included.`);
          break;
        }
      }
    }
    
    // Count days in the current year for debugging
    const daysInYear = new Date(selectedYear, 1, 29).getDate() === 29 ? 366 : 365;
    const daysInCurrentYear = newGrid.flat().filter(date => 
      date.getFullYear() === selectedYear
    ).length;
    
    // Log debug info
    console.log(`Calendar grid for ${selectedYear}: ${newGrid.length} weeks (${newGrid.length}x7), ${daysInCurrentYear}/${daysInYear} days in year`);
    console.log(`First date in grid: ${format(newGrid[0][0], 'yyyy-MM-dd')}`);
    console.log(`Last date in grid: ${format(newGrid[newGrid.length-1][6], 'yyyy-MM-dd')}`);
    
    return newGrid;
  }, [selectedYear]);

  // Define dynamic cell size based on available width
  const calculateCellSize = useCallback(() => {
    // Calculate available width, accounting for padding and labels
    const isSmallScreen = window.innerWidth < 600;
    const isMediumScreen = window.innerWidth >= 600 && window.innerWidth < 960;
    
    // Reduce padding on smaller screens to maximize space for the grid
    const containerPadding = isSmallScreen ? 20 : isMediumScreen ? 40 : 60;
    const availableWidth = Math.min(window.innerWidth - containerPadding, 1100);
    
    // Account for weekday labels
    const effectiveWidth = availableWidth - WEEKDAY_LABEL_WIDTH;
    
    // Calculate cell size based on available width and total weeks
    // We need to fit all 53 weeks (max in a year) plus gaps
    const totalWeeks = grid.length;
    const totalGaps = totalWeeks - 1;
    
    // Calculate cell size
    const cellSize = (effectiveWidth - (totalGaps * CELL_GAP)) / totalWeeks;
    
    // Clamp to reasonable size range
    return Math.max(Math.min(Math.floor(cellSize * 10) / 10, 10), 2.8);
  }, [grid]);
  
  // Calculate cell size and update on window resize
  const [CELL_SIZE, setCellSize] = useState(() => calculateCellSize());
  
  useEffect(() => {
    // Update cell size on window resize
    const handleResize = () => {
      setCellSize(calculateCellSize());
    };
    
    // Initial calculation
    setCellSize(calculateCellSize());
    
    // Debug grid information
    debugGridInfo(grid);
    
    // Add resize event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateCellSize, grid, debugGridInfo]);

  // Hardcoded month labels at fixed column intervals
  const monthLabels = useMemo(() => {
    // Use consistent 5-column spacing for each month
    return [
      { month: 'Jan', col: 2 },
      { month: 'Feb', col: 6 },
      { month: 'Mar', col: 11 },
      { month: 'Apr', col: 15 },
      { month: 'May', col: 19 },
      { month: 'Jun', col: 23 },
      { month: 'Jul', col: 28 },
      { month: 'Aug', col: 32 },
      { month: 'Sep', col: 37 },
      { month: 'Oct', col: 41 },
      { month: 'Nov', col: 45 },
      { month: 'Dec', col: 50 }
    ];
  }, []);

  const isHabitCompleted = useCallback((date: Date) => {
    return habit.completions.some(completion => completion.date === format(date, 'yyyy-MM-dd'));
  }, [habit.completions]);

  const calculateStreak = useCallback(() => {
    let streak = 0;
    const today = new Date();
    let currentDate = new Date();

    while (isHabitCompleted(currentDate) && !isAfter(currentDate, today)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }, [isHabitCompleted]);

  const handleLogSubmit = useCallback(() => {
    // For habits that track quantity, use the quantity value
    if (habit.trackQuantity) {
      if (quantity !== '') {
        onToggleCompletion(format(selectedDate, 'yyyy-MM-dd'), Number(quantity));
      }
    } else {
      // For non-quantity habits, always mark as completed
      onToggleCompletion(format(selectedDate, 'yyyy-MM-dd'));
    }
    setIsLogDialogOpen(false);
    setQuantity('');
    setUseCheckbox(true);
  }, [habit.trackQuantity, selectedDate, quantity, onToggleCompletion]);

  const handleDayClick = useCallback((day: Date) => {
    if (isAfter(day, new Date())) {
      return; // Don't allow logging future dates
    }
    setSelectedDate(day);
    setIsLogDialogOpen(true);
  }, []);

  const streak = useMemo(() => calculateStreak(), [calculateStreak]);

  const isDayCompleted = useCallback((date: Date) => {
    return habit.completions.some(completion => completion.date === format(date, 'yyyy-MM-dd'));
  }, [habit.completions]);

  const handlePrevYear = useCallback(() => {
    setSelectedYear(prev => prev - 1);
  }, []);

  const handleNextYear = useCallback(() => {
    setSelectedYear(prev => prev + 1);
  }, []);

  // Get completion for a specific date
  const getCompletion = useCallback((date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return habit.completions.find(c => c.date === dateStr);
  }, [habit.completions]);

  // Calculate color intensity based on quantity for quantity-based habits
  const getColorIntensity = useCallback((completion: any) => {
    // Base color intensity stays consistent
    const baseLight = 'cc';
    const baseDark = 'dd';
    
    if (!habit.trackQuantity || !completion || completion.quantity === undefined) {
      return { 
        light: baseLight, 
        dark: baseDark,
        bgStyle: mode === 'dark' 
          ? `${habit.color}${baseDark}`
          : `${habit.color}${baseLight}`
      };
    }
    
    // Get the highest quantity in all completions for this habit
    const maxQuantity = Math.max(
      ...habit.completions
        .filter(c => c.quantity !== undefined)
        .map(c => c.quantity as number),
      1 // Fallback to avoid division by zero
    );
    
    // Calculate opacity as a percentage of the max quantity with a narrower range (0.6 to 1.0)
    // This makes the difference less extreme
    const opacityPercentage = 0.6 + (Math.min(1, completion.quantity / maxQuantity) * 0.4);
    
    // Apply opacity to the cell - with a narrower range (70-95%)
    const opacity = Math.round(70 + (opacityPercentage * 25));
    
    // Return the standard color with a less extreme opacity range
    return { 
      light: baseLight,
      dark: baseDark,
      opacity: opacity,
      // More subtle opacity steps in a narrower range
      bgStyle: `${habit.color}${opacityPercentage < 0.7 ? 'a0' : 
                opacityPercentage < 0.8 ? 'b0' : 
                opacityPercentage < 0.9 ? 'c0' : 
                'd0'}`
    };
  }, [habit.trackQuantity, habit.completions, habit.color, mode]);

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: { xs: 1, sm: 1.5, md: 2 },
        pb: 1.5,
        mb: 3,
        bgcolor: mode === 'dark' ? 'rgba(30, 32, 40, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: mode === 'dark' ? 'rgba(50, 55, 70, 0.9)' : 'rgba(230, 235, 240, 0.95)',
        borderRadius: '10px',
        boxShadow: mode === 'dark' 
          ? '0 4px 15px rgba(0,0,0,0.4)'
          : '0 4px 15px rgba(0,0,0,0.07)',
        width: '100%',
        maxWidth: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* GitHub-style heatmap year calendar */}
      <Box sx={{ 
        width: '100%', 
        mx: 'auto', 
        mb: 1,
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'hidden'
      }}>
        
        {/* Title and controls remain the same */}
        <Typography 
          variant="h5" 
          align="center" 
          noWrap 
          title={habit.name}
          sx={{ 
            mt: 0.5,
            mb: 1.5,
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: habit.color,
            fontWeight: 600,
            letterSpacing: '0.01em',
            textShadow: mode === 'dark' 
              ? '0 2px 3px rgba(0,0,0,0.4)' 
              : '0 1px 2px rgba(0,0,0,0.15)',
            fontSize: '1.4rem',
            borderBottom: `2px solid ${habit.color}33`,
            paddingBottom: 1,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-2px',
              left: 0,
              width: '40%',
              borderBottom: `2px solid ${habit.color}90`,
            }
          }}
        >
          {habit.name}
        </Typography>
        
        {/* Controls - make more compact */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 1,
          px: 1,
        }}>
          {/* Year controls */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                size="small" 
                onClick={handlePrevYear}
                sx={{ color: 'text.primary', p: 0.7 }}
              >
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
              <Typography variant="body2" sx={{ 
                mx: 0.7, 
                fontWeight: 'bold', 
                color: 'text.primary',
                fontSize: '0.9rem'
              }}>
                {selectedYear}
              </Typography>
              <IconButton 
                size="small" 
                onClick={handleNextYear} 
                disabled={selectedYear >= new Date().getFullYear()}
                sx={{ color: 'text.primary', p: 0.7 }}
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          
          {/* Streak and action buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
            <Tooltip title={`Current streak: ${streak} days`}>
              <Typography variant="body2" color="text.secondary" sx={{ 
                display: 'flex', 
                alignItems: 'center',
                fontSize: '0.9rem'
              }}>
                🔥 <span style={{ fontWeight: 'bold', marginLeft: '3px' }}>{streak}</span>
              </Typography>
            </Tooltip>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon fontSize="small" />}
              onClick={() => {
                setSelectedDate(new Date());
                setIsLogDialogOpen(true);
              }}
              sx={{ 
                py: 0.5, 
                px: 1.5,
                minWidth: '55px',
                fontSize: '0.8rem',
                bgcolor: mode === 'dark' ? `${habit.color}e0` : `${habit.color}d8`,
                background: mode === 'dark' 
                  ? `linear-gradient(135deg, ${habit.color}e0 0%, ${habit.color}aa 100%)`
                  : `linear-gradient(135deg, ${habit.color}e8 0%, ${habit.color}b8 100%)`,
                color: '#ffffff',
                fontWeight: 600,
                border: mode === 'dark' ? `1px solid ${habit.color}60` : 'none',
                boxShadow: mode === 'dark' 
                  ? `0 2px 8px rgba(0,0,0,0.3), 0 0 10px ${habit.color}40`
                  : `0 2px 8px rgba(0,0,0,0.15), 0 0 15px ${habit.color}30`,
                '&:hover': {
                  bgcolor: mode === 'dark' ? `${habit.color}ff` : `${habit.color}e8`,
                  background: mode === 'dark' 
                    ? `linear-gradient(135deg, ${habit.color}ff 0%, ${habit.color}cc 100%)`
                    : `linear-gradient(135deg, ${habit.color}ff 0%, ${habit.color}d0 100%)`,
                  boxShadow: mode === 'dark' 
                    ? `0 3px 10px rgba(0,0,0,0.4), 0 0 15px ${habit.color}60`
                    : `0 3px 10px rgba(0,0,0,0.2), 0 0 20px ${habit.color}50`,
                }
              }}
            >
              Log
            </Button>
            <IconButton 
              size="small" 
              color="error" 
              onClick={() => setIsDeleteDialogOpen(true)}
              sx={{ p: 0.7 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Calendar Container */}
        <Box sx={{ 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Center the calendar horizontally
          position: 'relative',
          mt: 0.5,
          mb: 0.5,
          transform: `scale(${grid.length > 53 ? 0.95 : 1})`, // Slight scale down if many weeks
          transformOrigin: 'center top'
        }}>
          {/* Calendar grid with month labels */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: `${WEEKDAY_LABEL_WIDTH}px repeat(${grid.length}, ${CELL_SIZE}px)`, 
            gridTemplateRows: `30px repeat(7, ${CELL_SIZE}px)`, // Taller row for month labels
            gap: CELL_GAP, 
            mb: 0,
            maxWidth: '100%',
            justifyContent: 'center', // Center the grid horizontally
            paddingBottom: '1px',
            mt: 1 // Add margin top to separate from controls
          }}>
            {/* Month labels in first row */}
            {monthLabels.map((label) => (
              <Box
                key={label.month}
                sx={{
                  gridColumn: label.col + 2, // +2 because first column is for weekday labels
                  gridRow: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // For debugging: uncomment to see grid placement
                  // bgcolor: 'rgba(255,0,0,0.1)',
                }}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: '0.75rem',
                    color: mode === 'dark' ? 'rgba(220, 230, 255, 0.95)' : 'rgba(50, 60, 90, 0.95)',
                    fontWeight: '700',
                    whiteSpace: 'nowrap', // Prevent text wrapping 
                    textAlign: 'center',
                    transform: 'translateY(0)', // Center in row instead of moving upward
                    letterSpacing: '0.02em'
                  }}
                >
                  {label.month}
                </Typography>
              </Box>
            ))}
            
            {/* Weekday labels */}
            {[0,1,2,3,4,5,6].map((weekday) => (
              <Box key={weekday} sx={{ 
                gridColumn: 1, 
                gridRow: weekday + 2, // +2 because first row is for month labels 
                justifySelf: 'end', 
                pr: 0.3,
                width: WEEKDAY_LABEL_WIDTH - 2,
                height: CELL_SIZE,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                bgcolor: mode === 'dark' ? 'background.paper' : 'background.paper'
              }}>
                <Typography variant="caption" sx={{ 
                  fontSize: CELL_SIZE < 4 ? '0.6rem' : '0.7rem',
                  color: mode === 'dark' ? 'rgba(180, 200, 230, 0.85)' : 'rgba(60, 80, 110, 0.85)', 
                  lineHeight: 1,
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: WEEKDAY_LABEL_WIDTH - 4
                }}>
                  {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][weekday]}
                </Typography>
              </Box>
            ))}
            
            {/* Generate all cells for the entire year */}
            {grid.map((weekColumn, colIdx) => (
              weekColumn.map((day, rowIdx) => {
                // Get the date for this cell position from our grid
                const cellDate = day;
                
                // Check if this cell's date is in the current year
                const isInCurrentYear = cellDate.getFullYear() === selectedYear;
      
                // Check if this is the first day of a month
                const isFirstDayOfMonth = cellDate.getDate() === 1;
                
                const isCompleted = isDayCompleted(cellDate);
                const isFuture = isAfter(cellDate, new Date());
                const isCurrentDay = isToday(cellDate);
                
                // Get completion details for tooltip
                const completion = getCompletion(cellDate);
                
                // Get color intensity based on quantity
                const intensity = getColorIntensity(completion);
                
                // Format date for tooltip
                const formattedDate = format(cellDate, 'EEEE, MMMM d, yyyy');
                
                // Tooltip content
                const tooltipContent = isInCurrentYear 
                  ? (isCompleted 
                    ? `${formattedDate}${completion?.quantity ? ` • ${completion.quantity} ${habit.unit || 'units'}` : ' • Completed'}`
                    : formattedDate)
                  : '';
                
                // Scale cell border based on cell size
                const borderWidth = CELL_SIZE > 5 ? 1 : 0.5;
                
                return (
                  <Tooltip
                    key={`cell-${colIdx}-${rowIdx}`}
                    title={tooltipContent}
                    placement="top"
                    enterDelay={500}
                    arrow
                    disableHoverListener={!isInCurrentYear} // Always enable tooltips for cells in current year
                  >
                    <Box
                      sx={{
                        gridColumn: colIdx + 2, // +2 because first column is for weekday labels
                        gridRow: rowIdx + 2, // +2 because first row is for month labels
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        bgcolor: isCompleted && isInCurrentYear
                          ? intensity.bgStyle
                          : mode === 'dark' 
                            ? (isInCurrentYear ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0)') 
                            : (isInCurrentYear ? 'rgba(245,248,250,0.8)' : 'rgba(0,0,0,0)'),
                        opacity: isCompleted && isInCurrentYear && intensity.opacity 
                          ? (intensity.opacity / 100) 
                          : (isFuture ? 0.2 : (isInCurrentYear ? 1 : 0.15)),
                        border: isInCurrentYear 
                          ? `${borderWidth}px solid ${mode === 'dark' ? 'rgba(70,80,95,0.6)' : 'rgba(210,220,230,0.9)'}`
                          : 'none',
                        borderRadius: CELL_SIZE > 5 ? '2px' : '1px',
                        cursor: (isFuture || !isInCurrentYear) ? 'default' : 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        // Highlight current day
                        ...(isCurrentDay && {
                          boxShadow: `0 0 0 ${borderWidth + 0.5}px ${habit.color}`
                        }),
                        // Hover effect for larger cells
                        '&:hover': CELL_SIZE > 4 && isInCurrentYear && !isFuture ? {
                          transform: 'scale(1.2)',
                          zIndex: 10,
                          boxShadow: `0 2px 4px rgba(0,0,0,0.2)`,
                          bgcolor: isCompleted 
                            ? `${habit.color}${mode === 'dark' ? 'ff' : 'ee'}`
                            : mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)',
                          opacity: 1, // Full opacity on hover
                          background: undefined
                        } : {},
                        position: 'relative',
                      }}
                      onClick={() => isInCurrentYear && !isFuture && handleDayClick(cellDate)}
                      onMouseEnter={() => setHoveredDate(cellDate)}
                      onMouseLeave={() => setHoveredDate(null)}
                    />
                  </Tooltip>
                );
              })
            ))}
          </Box>
        </Box>
      </Box>

      {/* Log Dialog */}
      <Dialog 
        open={isLogDialogOpen} 
        onClose={() => setIsLogDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: '12px',
            boxShadow: mode === 'dark' 
              ? '0 8px 30px rgba(0,0,0,0.5)' 
              : '0 8px 30px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            bgcolor: 'background.paper',
          }
        }}
      >
        <DialogTitle
          sx={{ 
            borderBottom: '1px solid',
            borderColor: 'divider',
            pb: 2,
            background: `linear-gradient(45deg, ${habit.color} 30%, ${habit.color}99 90%)`,
            color: '#fff',
          }}
        >
          Log {habit.name}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'background.paper' }}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom color="text.primary">
              Date: {format(selectedDate, 'MMMM d, yyyy')}
            </Typography>
            
            {/* Only show checkbox for habits that don't track quantity */}
            {!habit.trackQuantity ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useCheckbox}
                    onChange={(e) => setUseCheckbox(e.target.checked)}
                    sx={{
                      color: habit.color,
                      '&.Mui-checked': {
                        color: habit.color,
                      }
                    }}
                  />
                }
                label={<Typography color="text.primary">Mark as completed</Typography>}
              />
            ) : (
              // For habits that track quantity, always show the quantity field
              <TextField
                fullWidth
                type="number"
                label={`Quantity${habit.unit ? ` (${habit.unit})` : ''}`}
                value={quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || (Number(val) >= 0 && Number(val) <= 1000000)) {
                    setQuantity(val === '' ? '' : Number(val));
                  }
                }}
                sx={{ 
                  mt: 1,
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: habit.color,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: habit.color,
                  },
                }}
                inputProps={{
                  min: 0,
                  max: 1000000,
                }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Button 
            onClick={() => setIsLogDialogOpen(false)}
            sx={{ borderRadius: '20px', px: 2 }}
          >
            Cancel
          </Button>
          {/* Undo button if already completed */}
          {isDayCompleted(selectedDate) && (
            <Button
              color="warning"
              onClick={() => {
                onToggleCompletion(format(selectedDate, 'yyyy-MM-dd'));
                setIsLogDialogOpen(false);
              }}
              sx={{ borderRadius: '20px', px: 2 }}
            >
              Undo
            </Button>
          )}
          <Button 
            onClick={handleLogSubmit} 
            variant="contained"
            disabled={habit.trackQuantity && quantity === ''}
            sx={{
              borderRadius: '20px',
              px: 2,
              background: `linear-gradient(45deg, ${habit.color} 30%, ${habit.color}99 90%)`,
              boxShadow: `0 3px 5px 2px ${habit.color}33`,
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: '12px',
            boxShadow: mode === 'dark' 
              ? '0 8px 30px rgba(0,0,0,0.5)' 
              : '0 8px 30px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            bgcolor: 'background.paper',
          }
        }}
      >
        <DialogTitle
          sx={{ 
            borderBottom: '1px solid',
            borderColor: 'divider',
            pb: 2,
            bgcolor: mode === 'dark' ? '#3a0505' : '#ffebee', // Dark/light red background
            color: mode === 'dark' ? '#ff5252' : '#d32f2f',
          }}
        >
          Delete Habit
        </DialogTitle>
        <DialogContent sx={{ mt: 2, bgcolor: 'background.paper' }}>
          <Typography color="text.primary">
            Are you sure you want to delete "{habit.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Button 
            onClick={() => setIsDeleteDialogOpen(false)}
            sx={{ borderRadius: '20px', px: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              onDelete();
              setIsDeleteDialogOpen(false);
            }} 
            color="error"
            variant="contained"
            sx={{ borderRadius: '20px', px: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default HabitCard; 