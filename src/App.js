import React, { useState, useCallback } from 'react';
import { Container, Box, Typography, ThemeProvider, Button, Stepper, Step, StepLabel, Paper, CircularProgress } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import ServiceList from './components/Services/ServiceList';
import ProfessionalList from './components/Professionals/ProfessionalList';
import TimeSlots from './components/Calendar/TimeSlots';
import { theme } from './styles/theme';
import BookingFormModal from './components/Booking/BookingFormModal';
import { createBooking } from './services/api';

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [isAnyProfessional, setIsAnyProfessional] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Add loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const steps = ['Select Services', 'Choose Professional & Time', 'Review Booking'];

  const handleNext = async () => {
    if (activeStep === 0) {
      try {
        setIsLoading(true);
        setError(null);
        // Reset professional and time selections when going to step 2
        setSelectedProfessional(null);
        setIsAnyProfessional(false);
        setSelectedTime(null);
        setActiveStep((prevStep) => prevStep + 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  }, []); // No dependencies needed as setState functions are stable

  const renderBookingSummary = () => {
    const totalPrice = selectedServices.reduce((sum, service) => {
      return sum + parseInt(service.price.replace('€', ''));
    }, 0);

    return (
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Booking Summary</Typography>
        
        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>Selected Services:</Typography>
        {selectedServices.map((service) => (
          <Box key={service.id} sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
            <Typography>{service.title}</Typography>
            <Typography>{service.price}</Typography>
          </Box>
        ))}
        
        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>Professional:</Typography>
        <Typography>{isAnyProfessional ? 'Any Professional' : selectedProfessional?.name}</Typography>

        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>Date & Time:</Typography>
        <Typography>
          {selectedDate?.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Typography>
        <Typography>{selectedTime}</Typography>
        
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
          <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total Price:</span>
            <span>€{totalPrice}</span>
          </Typography>
        </Box>
      </Paper>
    );
  };

  const handleBookingComplete = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Add validation
      if (!selectedServices.length || (!selectedProfessional && !isAnyProfessional) || !selectedDate || !selectedTime) {
        throw new Error('Please fill in all required fields');
      }

      // Format date and time for API - Use the proper time parsing
      // selectedTime format from TimeSlots is "HH:mm" (e.g., "14:00")
      const timeComponents = selectedTime.split(':');
      if (timeComponents.length !== 2) {
        throw new Error('Invalid time format');
      }

      const hours = parseInt(timeComponents[0], 10); // Use base 10 to handle leading zeros correctly
      const minutes = parseInt(timeComponents[1], 10);

      // Create a new Date object to avoid modifying the original selectedDate
      const bookingDateTime = new Date(selectedDate);

      // Fix timezone issue by using UTC methods instead of local time methods
      const year = bookingDateTime.getFullYear();
      const month = bookingDateTime.getMonth();
      const day = bookingDateTime.getDate();

      // Create UTC date with the selected time
      const utcBookingDateTime = new Date(Date.UTC(year, month, day, hours, minutes, 0, 0));
      const isoDateTime = utcBookingDateTime.toISOString();

      console.log(`Time selected: ${selectedTime}, Parsed: ${hours}:${minutes}`);
      console.log(`Date: ${year}-${month+1}-${day}, ISO: ${isoDateTime}`);

      // Prepare service items for the booking
      const serviceItems = selectedServices.map(service => ({
        category_service_id: service.id, // Changed from category_service_id to company_service_id
        user_id: isAnyProfessional ? null : selectedProfessional?.id,
        notes: ""
      }));

      // Create booking payload with the correct format
      const bookingPayload = {
        company_id: "fad78242-ba41-4acf-a14d-8dc59f6e8338",
        start_time: isoDateTime,
        customer_info: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          phone: userData.phone
        },
        services: serviceItems,
        notes: userData.notes || ""
      };

      // Send API request
      const response = await createBooking(bookingPayload);

      console.log('Booking completed with data:', bookingPayload);
      console.log('API response:', response);

      // Show success message
      alert('Your booking has been successfully completed!');

      // Close modal and reset form
      setIsBookingModalOpen(false);
      setActiveStep(0);
      setSelectedServices([]);
      setSelectedProfessional(null);
      setIsAnyProfessional(false);
      setSelectedDate(new Date());
      setSelectedTime(null);

    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to complete booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfessionalSelect = (professional) => {
    setError(null);
    if (professional.id === 'any') {
      setIsAnyProfessional(true);
      setSelectedProfessional(null);
    } else {
      setIsAnyProfessional(false);
      setSelectedProfessional(professional);
    }
    // Reset time selection when changing professional
    setSelectedTime(null);
  };

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && (
              <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
                <Typography>{error}</Typography>
              </Box>
            )}

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : activeStep === 0 ? (
              <>
                <Typography variant="h4" gutterBottom>
                  Services
                </Typography>
                <ServiceList
                  selectedServices={selectedServices}
                  onServiceSelect={setSelectedServices}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={selectedServices.length === 0}
                  >
                    Next
                  </Button>
                </Box>
              </>
            ) : activeStep === 1 ? (
              <>
                <Typography variant="h4" gutterBottom>
                  Select professional
                </Typography>

                <ProfessionalList
                  onProfessionalSelect={handleProfessionalSelect}
                  selectedProfessional={selectedProfessional}
                  isAnyProfessional={isAnyProfessional} // Pass isAnyProfessional state
                />

                <Typography variant="h4" sx={{ mt: 4 }} gutterBottom>
                  Select time
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TimeSlots
                    onDateSelect={handleDateSelect}
                    onTimeSelect={setSelectedTime}
                    selectedTime={selectedTime}
                    selectedDate={selectedDate}
                    userId={selectedProfessional?.id}
                    isAnyProfessional={isAnyProfessional}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={(!selectedProfessional && !isAnyProfessional) || !selectedDate || !selectedTime || isLoading}
                  >
                    Next
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h4" gutterBottom>
                  Review Your Booking
                </Typography>
                {renderBookingSummary()}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsBookingModalOpen(true)}
                  >
                    Book Appointment
                  </Button>
                </Box>
              </>
            )}
          </Box>

          <BookingFormModal
            open={isBookingModalOpen}
            onClose={() => !isLoading && setIsBookingModalOpen(false)}
            onSubmit={handleBookingComplete}
            isLoading={isLoading}
          />
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;
