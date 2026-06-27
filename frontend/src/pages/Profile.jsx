import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Grid, Box, Button, Divider, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import BadgeIcon from '@mui/icons-material/Badge';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/users/profile')
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch profile details.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 10 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
          {error}
        </Alert>
      )}

      {profile && (
        <Paper className="glass-panel fade-in" sx={{ p: 4, borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontFamily: 'Outfit', fontWeight: 700, color: '#f3f4f6' }}>
              My Profile
            </Typography>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate('/profile/edit')}
              sx={{
                bgcolor: '#6366f1',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                px: 3,
                py: 1,
                '&:hover': {
                  bgcolor: '#4f46e5',
                },
              }}
            >
              Edit Profile
            </Button>
          </Box>

          <Divider sx={{ mb: 4, borderColor: 'var(--border-color)' }} />

          <Grid container spacing={4}>
            {/* Left Side: Avatar/Summary */}
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  bgcolor: profile.role === 'ADMIN' ? 'rgba(236, 72, 153, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                  color: profile.role === 'ADMIN' ? '#f472b6' : '#818cf8',
                  border: `2px solid ${profile.role === 'ADMIN' ? '#db2777' : '#4f46e5'}`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '3rem',
                  fontWeight: 600,
                  mb: 2,
                  boxShadow: '0 0 20px rgba(99, 102, 241, 0.15)'
                }}
              >
                {profile.name.charAt(0).toUpperCase()}
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#f3f4f6', fontFamily: 'Outfit' }}>
                {profile.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af', mt: 0.5 }}>
                {profile.role === 'ADMIN' ? 'Administrator' : 'Store Customer'}
              </Typography>
            </Grid>

            {/* Right Side: Detailed Info */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <PersonIcon sx={{ color: '#6366f1', mr: 1, fontSize: '1.2rem' }} />
                    <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Full Name
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#f3f4f6', fontWeight: 500, pl: 3.5 }}>
                    {profile.name}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <EmailIcon sx={{ color: '#6366f1', mr: 1, fontSize: '1.2rem' }} />
                    <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Email Address
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#f3f4f6', fontWeight: 500, pl: 3.5 }}>
                    {profile.email}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <PhoneIcon sx={{ color: '#6366f1', mr: 1, fontSize: '1.2rem' }} />
                    <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Phone Number
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#f3f4f6', fontWeight: 500, pl: 3.5 }}>
                    {profile.phone}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <BadgeIcon sx={{ color: '#6366f1', mr: 1, fontSize: '1.2rem' }} />
                    <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Account Role
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#f3f4f6', fontWeight: 500, pl: 3.5 }}>
                    {profile.role}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <HomeIcon sx={{ color: '#6366f1', mr: 1, fontSize: '1.2rem' }} />
                    <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Registered Address
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#f3f4f6', fontWeight: 500, pl: 3.5, whiteSpace: 'pre-line' }}>
                    {profile.address}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default Profile;
