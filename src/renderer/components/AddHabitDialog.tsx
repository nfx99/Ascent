import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Box,
  FormControlLabel,
  Switch,
  Alert,
  IconButton,
  InputAdornment,
  Tooltip,
  Typography,
  useTheme as useMuiTheme,
} from '@mui/material';
import { Help as HelpIcon } from '@mui/icons-material';
import { useHabits } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';

interface AddHabitDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddHabitDialog: React.FC<AddHabitDialogProps> = ({ open, onClose }) => {
  const { mode } = useTheme();
  const muiTheme = useMuiTheme();
  const { addHabit, error: contextError } = useHabits();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [color, setColor] = useState('#1976d2');
  const [trackQuantity, setTrackQuantity] = useState(false);
  const [unit, setUnit] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setName('');
    setDescription('');
    setColor('#1976d2');
    setTrackQuantity(false);
    setUnit('');
    setValidationError(null);
  }, []);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        resetForm();
        setIsSubmitting(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, resetForm]);

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    onClose();
  }, [onClose, isSubmitting]);

  const validateForm = useCallback(() => {
    if (!name.trim()) {
      setValidationError('Habit name is required');
      return false;
    }

    if (name.trim().length > 50) {
      setValidationError('Habit name must be less than 50 characters');
      return false;
    }

    if (description.length > 200) {
      setValidationError('Description must be less than 200 characters');
      return false;
    }

    if (trackQuantity && !unit.trim()) {
      setValidationError('Unit is required when tracking quantity');
      return false;
    }

    if (trackQuantity && unit.trim().length > 20) {
      setValidationError('Unit must be less than 20 characters');
      return false;
    }

    setValidationError(null);
    return true;
  }, [name, description, trackQuantity, unit]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    addHabit({
      name: name.trim(),
      description: description.trim(),
      frequency,
      color,
      trackQuantity,
      unit: trackQuantity ? unit.trim() : undefined,
    });

    setTimeout(() => {
      onClose();
      setIsSubmitting(false);
    }, 50);
  }, [name, description, frequency, color, trackQuantity, unit, addHabit, onClose, validateForm, isSubmitting]);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { 
          minHeight: '50vh',
          borderRadius: '12px',
          boxShadow: mode === 'dark' 
            ? '0 8px 30px rgba(0,0,0,0.5)' 
            : '0 8px 30px rgba(0,0,0,0.12)',
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }
      }}
      TransitionProps={{
        onExited: resetForm
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ 
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2,
          background: mode === 'light'
            ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
            : 'linear-gradient(45deg, #90caf9 30%, #81deea 90%)',
          color: 'white',
        }}>
          Add New Habit
        </DialogTitle>
        <DialogContent sx={{ mt: 2, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {(validationError || contextError) && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {validationError || contextError}
              </Alert>
            )}
            
            <TextField
              label="Habit Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              error={!!validationError && validationError.includes('name')}
              helperText={`${name.length}/50 characters`}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Enter a clear, concise name for your habit">
                      <IconButton size="small">
                        <HelpIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={2}
              fullWidth
              error={!!validationError && validationError.includes('Description')}
              helperText={`${description.length}/200 characters`}
            />

            <FormControl fullWidth>
              <InputLabel shrink htmlFor="color-input">
                Color
              </InputLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <TextField
                  id="color-input"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  sx={{ width: 100 }}
                />
                <Box 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 1,
                    bgcolor: color,
                    border: '1px solid',
                    borderColor: 'divider',
                  }} 
                />
              </Box>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={trackQuantity}
                  onChange={(e) => {
                    setTrackQuantity(e.target.checked);
                    if (!e.target.checked) {
                      setUnit('');
                    }
                  }}
                />
              }
              label={
                <Box>
                  <Typography color="text.primary">Track Quantity</Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                    Enable to track numeric values for this habit
                  </Typography>
                </Box>
              }
            />

            {trackQuantity && (
              <TextField
                label="Unit (e.g., pages, minutes, km)"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                fullWidth
                placeholder="e.g., pages, minutes, km"
                error={!!validationError && validationError.includes('Unit')}
                helperText={`${unit.length}/20 characters`}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Button 
            onClick={handleClose}
            sx={{ borderRadius: '20px', px: 2 }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={!name.trim() || (trackQuantity && !unit.trim())}
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
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default React.memo(AddHabitDialog); 