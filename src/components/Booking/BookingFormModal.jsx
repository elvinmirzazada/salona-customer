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
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

const BookingFormModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Complete your booking</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FacebookIcon />}
            sx={{ mb: 2 }}
          >
            Continue with Facebook
          </Button>
          
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{ mb: 3 }}
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
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              name="name"
              label="Full name"
              required
              value={formData.name}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              name="phone"
              label="Phone number"
              required
              value={formData.phone}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                bgcolor: '#0D9488',
                '&:hover': {
                  bgcolor: '#0F766E'
                }
              }}
            >
              Complete Booking
            </Button>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BookingFormModal;