import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Box, Button, Typography, CircularProgress, Collapse } from '@mui/material';
import { format, isToday, parseISO, addDays, startOfToday, addMinutes, startOfWeek } from 'date-fns';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const TimeSlots = ({ onDateSelect, onTimeSelect, selectedTime, selectedDate, userId, isAnyProfessional }) => {
  const [weeklyAvailability, setWeeklyAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get company_id from URL parameters
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const companyId = params.get('company_id');

  // Generate a stable list of days for the current week (Monday to Sunday)
  const weekDays = useMemo(() => {
    const today = startOfToday();
    // Get the start of the week (Monday)
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    // Create an array of 7 days (Monday to Sunday)
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      return {
        date,
        dayName: format(date, 'EEE'),
        dayNumber: format(date, 'd'),
        isToday: isToday(date)
      };
    });
  }, []); // Empty dependency array means this will be calculated once and remain stable

  // Fetch availability data from the API
  const fetchAvailability = useCallback(async (date, profId, isAny) => {
    if (!date || (!profId && !isAny) || !companyId) return;

    try {
      setLoading(true);
      setError(null);

      const dateStr = format(date, 'yyyy-MM-dd');
      let endpoint;

      // Ensure companyId is properly formatted
      const formattedCompanyId = companyId.includes('-') ? companyId : companyId;

      if (isAny) {
        endpoint = `http://127.0.0.1:8000/api/v1/companies/${formattedCompanyId}/availabilities`;
      } else {
        endpoint = `http://127.0.0.1:8000/api/v1/companies/${formattedCompanyId}/users/${profId}/availability`;
      }

      const response = await axios.get(endpoint, {
        params: {
          date_from: dateStr,
          availability_type: 'weekly'
        }
      });

      console.log('API Response:', response.data);

      if (response.data.success === false && response.data.message) {
        throw new Error(response.data.message);
      }

      setWeeklyAvailability(response.data);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Failed to fetch availability');
      setWeeklyAvailability(null);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  // Initialize with today's date if not selected
  useEffect(() => {
    if (!selectedDate && onDateSelect) {
      onDateSelect(weekDays[0].date);
    }
  }, [selectedDate, onDateSelect, weekDays]);

  // Track the last professional ID to detect changes
  const [lastProfId, setLastProfId] = useState(null);
  const [lastIsAny, setLastIsAny] = useState(false);

  // Fetch availability when professional changes
  useEffect(() => {
    // Check if professional selection changed
    const profChanged = lastProfId !== userId || lastIsAny !== isAnyProfessional;

    if (selectedDate && (userId || isAnyProfessional) && (profChanged || !weeklyAvailability)) {
      fetchAvailability(selectedDate, userId, isAnyProfessional);
      setLastProfId(userId);
      setLastIsAny(isAnyProfessional);
    }
  }, [userId, isAnyProfessional, selectedDate, fetchAvailability, lastProfId, lastIsAny, weeklyAvailability]);

  // Clear availability when professional is deselected
  useEffect(() => {
    if (!userId && !isAnyProfessional) {
      setWeeklyAvailability(null);
    }
  }, [userId, isAnyProfessional]);

  // Handle date selection
  const handleDateClick = (date) => {
    if (date.toDateString() !== selectedDate?.toDateString()) {
      onDateSelect(date);
      onTimeSelect(null);
    }
  };

  // Get time slots for the selected date from weekly availability
  const availableSlots = useMemo(() => {
    if (!weeklyAvailability || !selectedDate) return [];

    try {
      // Extract the relevant data structure based on the API response format
      let dailySlots;

      if (isAnyProfessional) {
        // For "Any Professional" endpoint
        dailySlots = weeklyAvailability.data;
      } else {
        // For specific professional endpoint
        dailySlots = weeklyAvailability.data?.weekly?.daily_slots || [];
      }

      if (!dailySlots || !Array.isArray(dailySlots)) {
        console.log('Invalid daily slots format:', dailySlots);
        return [];
      }

      // Find slots for the selected date
      const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
      const selectedDaySlots = dailySlots.find(slot => slot.date === selectedDateStr);

      if (!selectedDaySlots?.time_slots || !Array.isArray(selectedDaySlots.time_slots)) {
        console.log('No time slots found for date:', selectedDateStr);
        return [];
      }

      // Generate 30-minute interval slots
      const slots = [];

      selectedDaySlots.time_slots.forEach(slot => {
        if (!slot.is_available) return;

        try {
          const startTime = parseISO(`${selectedDateStr}T${slot.start_time}`);
          const endTime = parseISO(`${selectedDateStr}T${slot.end_time}`);

          let currentTime = startTime;

          // Create 30-minute intervals
          while (currentTime < endTime) {
            // Format as just the start time (e.g., "12:00", "12:30")
            const slotStart = format(currentTime, 'HH:mm');

            slots.push({
              id: slotStart,
              display: slotStart,
              startTime: slotStart,
              dateTime: currentTime.toISOString()
            });

            // Move to next 30-min slot
            currentTime = addMinutes(currentTime, 30);
          }
        } catch (err) {
          console.error('Error processing time slot:', err);
        }
      });

      // Sort slots by time in ascending order
      slots.sort((a, b) => {
        return parseISO(`${selectedDateStr}T${a.startTime}`).getTime() -
               parseISO(`${selectedDateStr}T${b.startTime}`).getTime();
      });

      return slots;
    } catch (err) {
      console.error('Error processing availability data:', err);
      return [];
    }
  }, [weeklyAvailability, selectedDate, isAnyProfessional]);

  // Determine if a professional has been selected (either specific or "Any Professional")
  const isProfessionalSelected = !!(userId || isAnyProfessional);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Message when no professional is selected */}
      {!isProfessionalSelected && (
        <Typography
          color="text.secondary"
          textAlign="center"
          sx={{
            py: 4,
            bgcolor: 'grey.50',
            borderRadius: 1,
            border: '1px dashed',
            borderColor: 'grey.300'
          }}
        >
          Please select a professional to view available dates and times
        </Typography>
      )}

      {/* Days selector - only visible when a professional is selected */}
      <Collapse in={isProfessionalSelected}>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            my: 3,
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
          {weekDays.map(({ date, dayName, dayNumber, isToday }) => {
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            return (
              <Button
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                variant={isSelected ? 'contained' : 'outlined'}
                sx={{
                  minWidth: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 1,
                  bgcolor: isSelected ? 'primary.main' : 'grey.100',
                  color: isSelected ? 'white' : 'text.secondary',
                  borderColor: isSelected ? 'primary.main' : 'grey.300',
                  '&:hover': {
                    bgcolor: isSelected ? 'primary.dark' : 'grey.200',
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s',
                  },
                  transition: 'all 0.2s',
                }}
              >
                <Typography variant="caption" color={isSelected ? 'inherit' : 'text.secondary'}>
                  {dayName}
                </Typography>
                <Typography color={isSelected ? 'inherit' : 'text.primary'}>
                  {dayNumber}
                </Typography>
                {isToday && (
                  <Typography variant="caption" color={isSelected ? 'inherit' : 'primary.main'}>
                    Today
                  </Typography>
                )}
              </Button>
            );
          })}
        </Box>
      </Collapse>

      {/* Time slots - only visible when a professional and date are selected */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress sx={{ color: '#0D9488' }} />
        </Box>
      ) : error ? (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      ) : isProfessionalSelected ? (
        <Collapse in={selectedDate != null}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: 1,
              opacity: selectedTime ? 1 : 0.85, // Slightly dimmed when no time is selected
            }}
          >
            {availableSlots.length > 0 ? availableSlots.map((slot) => (
              <Button
                key={slot.id}
                onClick={() => onTimeSelect(slot.display)}
                variant={selectedTime === slot.display ? 'contained' : 'outlined'}
                sx={{
                  py: 1,
                  bgcolor: selectedTime === slot.display ? 'primary.main' : 'grey.100',
                  color: selectedTime === slot.display ? 'white' : 'text.secondary',
                  borderColor: selectedTime === slot.display ? 'primary.main' : 'grey.300',
                  '&:hover': {
                    bgcolor: selectedTime === slot.display ? 'primary.dark' : 'grey.200',
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s',
                  },
                  transition: 'all 0.2s',
                }}
              >
                {slot.display}
              </Button>
            )) : (
              <Typography color="text.secondary" sx={{ gridColumn: '1/-1', textAlign: 'center', py: 2 }}>
                No available time slots for this date
              </Typography>
            )}
          </Box>
        </Collapse>
      ) : null}
    </Box>
  );
};

export default TimeSlots;
