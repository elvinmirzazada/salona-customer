import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ProfessionalSelector = ({ onProfessionalSelect }) => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedValue, setSelectedValue] = useState('any');

  // Get company_id from URL parameters
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const companyId = params.get('company_id');

  useEffect(() => {
    const fetchProfessionals = async () => {
      if (!companyId) return;

      setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/services/companies/${companyId}/users`
        );
        setProfessionals(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [companyId]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    
    if (value === 'any') {
      onProfessionalSelect({ isAnyProfessional: true, userId: null });
    } else {
      onProfessionalSelect({ isAnyProfessional: false, userId: value });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress sx={{ color: '#0D9488' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
    );
  }

  return (
    <FormControl component="fieldset">
      <RadioGroup
        aria-label="professional"
        name="professional-selector"
        value={selectedValue}
        onChange={handleChange}
      >
        <FormControlLabel 
          value="any"
          control={<Radio />}
          label="Any Professional"
          sx={{ 
            '& .MuiRadio-root': { 
              color: '#0D9488',
              '&.Mui-checked': {
                color: '#0D9488',
              }
            }
          }}
        />
        {professionals.map((professional) => (
          <FormControlLabel
            key={professional.id}
            value={professional.id.toString()}
            control={<Radio />}
            label={`${professional.first_name} ${professional.last_name}`}
            sx={{ 
              '& .MuiRadio-root': { 
                color: '#0D9488',
                '&.Mui-checked': {
                  color: '#0D9488',
                }
              }
            }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default ProfessionalSelector;
