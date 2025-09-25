import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

const BookingFormModal = ({ open, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.firstName) {
      errors.firstName = 'First name is required';
    }
    if (!formData.lastName) {
      errors.lastName = 'Last name is required';
    }
    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    }
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      onSubmit(formData);
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={!isLoading && onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Complete your booking</Typography>
          {!isLoading && (
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FacebookIcon />}
            sx={{ mb: 2 }}
            disabled={isLoading}
          >
            Continue with Facebook
          </Button>
          
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{ mb: 3 }}
            disabled={isLoading}
          >
            Continue with Google
          </Button>

          <Divider sx={{ my: 2 }}>OR</Divider>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="email"
              label="Email address"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              sx={{ mb: 2 }}
              disabled={isLoading}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                name="firstName"
                label="First name"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
                disabled={isLoading}
              />

              <TextField
                fullWidth
                name="lastName"
                label="Last name"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
                disabled={isLoading}
              />
            </Box>

            <TextField
              fullWidth
              name="phone"
              label="Phone number"
              required
              value={formData.phone}
              onChange={handleInputChange}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
              sx={{ mb: 3 }}
              disabled={isLoading}
            />

            <TextField
              fullWidth
              name="notes"
              label="Additional notes (optional)"
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
              disabled={isLoading}
              placeholder="Any special requests or information for your appointment"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
              sx={{ height: 48 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Complete Booking'
              )}
            </Button>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BookingFormModal;