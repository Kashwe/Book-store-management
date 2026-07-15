import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Chip, Avatar, Tooltip, Badge, IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AssessmentIcon from '@mui/icons-material/Assessment';

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navBtnStyle = (path) => ({
    mx: 1,
    color: isActive(path) ? '#818cf8' : '#cbd5e1',
    fontWeight: isActive(path) ? 600 : 400,
    textTransform: 'none',
    fontSize: '0.95rem',
    borderRadius: '8px',
    padding: '6px 16px',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(99, 102, 241, 0.08)',
      color: '#a5b4fc',
    },
  });

  return (
    <AppBar position="sticky" elevation={0} className="glass-navbar" sx={{ zIndex: 1201 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: '70px' }}>
          {/* Logo Section */}
          <MenuBookIcon sx={{ display: 'flex', mr: 1.5, color: '#6366f1', fontSize: '1.8rem' }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: 'flex',
              flexGrow: 1,
              fontFamily: 'Outfit',
              fontWeight: 700,
              letterSpacing: '.5px',
              color: '#f3f4f6',
              textDecoration: 'none',
              fontSize: '1.4rem',
            }}
          >
            Book<span style={{ color: '#6366f1' }}>Store</span>
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user ? (
              <>
                <Button
                  component={RouterLink}
                  to="/dashboard"
                  startIcon={<DashboardIcon />}
                  sx={navBtnStyle('/dashboard')}
                >
                  Dashboard
                </Button>

                {user.role === 'ADMIN' && (
                  <Button
                    component={RouterLink}
                    to="/add-book"
                    startIcon={<AddIcon />}
                    sx={navBtnStyle('/add-book')}
                  >
                    Add Book
                  </Button>
                )}

                {/* BMS-US-017 / 018: Reports access, admin only */}
                {user.role === 'ADMIN' && (
                  <Button
                    component={RouterLink}
                    to="/reports"
                    startIcon={<AssessmentIcon />}
                    sx={navBtnStyle('/reports')}
                  >
                    Reports
                  </Button>
                )}

                {/* BMS-US-010 / 011: Cart access, available to all logged-in users */}
                <Tooltip title="Cart">
                  <IconButton
                    component={RouterLink}
                    to="/cart"
                    sx={{ mx: 0.5, color: isActive('/cart') ? '#818cf8' : '#cbd5e1' }}
                  >
                    <Badge badgeContent={itemCount} color="secondary">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* BMS-US-012 / 013: Order History access, available to all logged-in users */}
                <Button
                  component={RouterLink}
                  to="/orders"
                  startIcon={<ReceiptLongIcon />}
                  sx={navBtnStyle('/orders')}
                >
                  My Orders
                </Button>

                <Button
                  component={RouterLink}
                  to="/profile"
                  startIcon={<AccountCircleIcon />}
                  sx={navBtnStyle('/profile')}
                >
                  Profile
                </Button>

                {/* User Role Badge & Avatar */}
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, mr: 1 }}>
                  <Chip
                    label={user.role}
                    color={user.role === 'ADMIN' ? 'secondary' : 'primary'}
                    size="small"
                    sx={{
                      mr: 1.5,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: '24px',
                      backgroundColor: user.role === 'ADMIN' ? 'rgba(236, 72, 153, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                      color: user.role === 'ADMIN' ? '#f472b6' : '#818cf8',
                      border: `1px solid ${user.role === 'ADMIN' ? 'rgba(236, 72, 153, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                    }}
                  />
                  <Tooltip title={`${user.name} (${user.email})`}>
                    <Avatar
                      sx={{
                        width: 34,
                        height: 34,
                        bgcolor: user.role === 'ADMIN' ? '#db2777' : '#4f46e5',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        border: '1.5px solid rgba(255,255,255,0.1)'
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </Tooltip>
                </Box>

                <Button
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{
                    ml: 1,
                    color: '#f87171',
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: '8px',
                    padding: '6px 14px',
                    '&:hover': {
                      backgroundColor: 'rgba(248, 113, 113, 0.08)',
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={navBtnStyle('/login')}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  sx={{
                    ml: 2,
                    bgcolor: '#6366f1',
                    color: '#fff',
                    textTransform: 'none',
                    borderRadius: '8px',
                    padding: '6px 18px',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: '#4f46e5',
                    },
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavigationBar;
