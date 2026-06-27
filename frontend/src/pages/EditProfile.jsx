import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, Button, TextField, Divider, CircularProgress, Alert, Grid, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';

const EditProfile = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.get('/api/users/profile')
      .then((res) => {
        setFormData({
          name: res.data.name,
          email: res.data.email, // read-only
          phone: res.data.phone,
          address: res.data.address
        });
      })
      .catch((err) => {
        console.error(err);
        setApiError('Failed to fetch profile details.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    if (!formData.phone.trim()) tempErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) tempErrors.address = 'Address is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      const response = await api.put('/api/users/profile', {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      });
      
      // Update global context user metadata (excl. email changes since backend rejects email updates)
      setUser(prev => ({
        ...prev,
        name: response.data.name,
        phone: response.data.phone,
        address: response.data.address
      }));

      // Persist updated metadata in localStorage
      const cachedUser = JSON.parse(localStorage.getItem('user'));
      if (cachedUser) {
        cachedUser.name = response.data.name;
        cachedUser.phone = response.data.phone;
        cachedUser.address = response.data.address;
        localStorage.setItem('user', JSON.stringify(cachedUser));
      }

      navigate('/profile');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError('Failed to update profile. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 10 }}>
      <Paper className="glass-panel fade-in" sx={{ p: 4, borderRadius: '16px' }}>
        <Typography variant="h4" sx={{ fontFamily: 'Outfit', fontWeight: 700, color: '#f3f4f6', mb: 3 }}>
          Edit Profile
        </Typography>

        <Divider sx={{ mb: 4, borderColor: 'var(--border-color)' }} />

        {apiError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '8px', bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {apiError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                disabled
                fullWidth
                id="email"
                label="Email Address (Cannot be changed)"
                name="email"
                value={formData.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#6b7280' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: '#6b7280 !important',
                  },
                  '& .MuiInputLabel-root.Mui-disabled': {
                    color: '#6b7280 !important',
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#9ca3af' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="phone"
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: '#9ca3af' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="address"
                label="Shipping Address"
                name="address"
                multiline
                rows={4}
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <HomeIcon sx={{ color: '#9ca3af' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => navigate('/profile')}
                disabled={isSubmitting}
                sx={{
                  color: '#cbd5e1',
                  borderColor: 'var(--border-color)',
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 3,
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.03)'
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={isSubmitting}
                sx={{
                  bgcolor: '#6366f1',
                  textTransform: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  px: 4,
                  '&:hover': {
                    bgcolor: '#4f46e5',
                  }
                }}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditProfile;
