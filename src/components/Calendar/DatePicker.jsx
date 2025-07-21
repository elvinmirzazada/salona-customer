import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { format } from 'date-fns';

const DatePicker = ({ onDateSelect, selectedDate }) => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {days.map((date) => (
        <Button
          key={date.toISOString()}
          variant={selectedDate?.toDateString() === date.toDateString() ? "contained" : "outlined"}
          onClick={() => onDateSelect(date)}
          sx={{ flexDirection: 'column', minWidth: 80 }}
        >
          <Typography variant="caption">{format(date, 'EEE')}</Typography>
          <Typography>{format(date, 'd')}</Typography>
        </Button>
      ))}
    </Box>
  );
};

export default DatePicker;