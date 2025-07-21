import React, { useState, useCallback } from 'react';
import { Container, Box, Typography, ThemeProvider, Button, Stepper, Step, StepLabel, Paper } from '@mui/material';
import ServiceList from './components/Services/ServiceList';
import ProfessionalList from './components/Professionals/ProfessionalList';
import TimeSlots from './components/Calendar/TimeSlots';
import { theme } from './styles/theme';
import BookingFormModal from './components/Booking/BookingFormModal';

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with today's date
  const [selectedTime, setSelectedTime] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const steps = ['Select Services', 'Choose Professional & Time', 'Review Booking'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
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
        <Typography>{selectedProfessional?.name}</Typography>
        
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

  const handleBookingComplete = (userData) => {
    console.log('Booking completed with data:', {
      services: selectedServices,
      professional: selectedProfessional,
      date: selectedDate,
      time: selectedTime,
      user: userData
    });
    setIsBookingModalOpen(false);
    // Add your booking submission logic here
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 ? (
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
                onProfessionalSelect={setSelectedProfessional}
                selectedProfessional={selectedProfessional}
              />
              
              <Typography variant="h4" sx={{ mt: 4 }} gutterBottom>
                Select time
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TimeSlots
                  onDateSelect={handleDateSelect} // Add this prop
                  onTimeSelect={setSelectedTime}
                  selectedTime={selectedTime}
                  selectedDate={selectedDate}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button onClick={handleBack}>
                  Back
                </Button>
                <Button 
                  variant="contained"
                  onClick={handleNext}
                  disabled={!selectedProfessional || !selectedDate || !selectedTime}
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
          onClose={() => setIsBookingModalOpen(false)}
          onSubmit={handleBookingComplete}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;