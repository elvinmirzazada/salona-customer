import React, { useEffect } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { format, isToday } from 'date-fns';

// Get next 7 days starting from today
const getNextDays = () => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return {
      date,
      dayName: format(date, 'EEE'),
      dayNumber: format(date, 'd'),
      isToday: isToday(date)
    };
  });
};

const timeSlots = [
  "11:30", "11:45", "11:55", 
  "12:05", "12:15", "12:25",
  "12:35", "12:45", "12:55", 
  "13:05", "13:20"
];

const TimeSlots = ({ onDateSelect, onTimeSelect, selectedTime, selectedDate }) => {
  // Set today's date by default when component mounts
  useEffect(() => {
    if (!selectedDate) {
      const today = new Date();
      onDateSelect(today);
    }
  }, [selectedDate, onDateSelect]); // Add missing dependencies

  const handleDateClick = (date) => {
    onDateSelect(date);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Days selector */}
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 1, 
          mb: 3,
          pb: 2,
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#0D9488',
            borderRadius: '4px',
            '&:hover': {
              background: '#14B8A6',
            },
          },
        }}
      >
        {getNextDays().map(({ date, dayName, dayNumber, isToday }) => (
          <Paper
            key={date.toISOString()}
            elevation={0}
            sx={{
              minWidth: '80px',
              cursor: 'pointer',
              border: selectedDate?.toDateString() === date.toDateString()
                ? '2px solid #0D9488'
                : '1px solid #e0e0e0',
              borderRadius: 2,
              p: 1,
              textAlign: 'center',
              backgroundColor: selectedDate?.toDateString() === date.toDateString()
                ? '#E6FFFA'
                : 'white',
              '&:hover': {
                backgroundColor: '#f8f8f8'
              }
            }}
            onClick={() => handleDateClick(date)}
          >
            <Typography 
              variant="caption" 
              display="block" 
              color="text.secondary"
            >
              {dayName}
              {isToday && (
                <Typography 
                  component="span" 
                  color="primary" 
                  sx={{ ml: 0.5, fontSize: '0.75rem' }}
                >
                  (Today)
                </Typography>
              )}
            </Typography>
            <Typography variant="h6">
              {dayNumber}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Time slots */}
      {selectedDate && ( // Only show time slots if date is selected
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
            gap: 1,
          }}
        >
          {timeSlots.map((time) => (
            <Button
              key={time}
              variant={selectedTime === time ? "contained" : "outlined"}
              onClick={() => onTimeSelect(time)}
              sx={{
                color: selectedTime === time ? 'white' : '#0D9488',
                borderColor: '#0D9488',
                backgroundColor: selectedTime === time ? '#0D9488' : 'transparent',
                '&:hover': {
                  backgroundColor: selectedTime === time ? '#14B8A6' : '#E6FFFA',
                  borderColor: '#0D9488',
                },
                '&.Mui-disabled': {
                  borderColor: '#e0e0e0',
                  color: '#999'
                }
              }}
            >
              {time}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TimeSlots;