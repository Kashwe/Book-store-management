import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Box, Button, TextField, Divider, CircularProgress,
  Alert, Grid, InputAdornment, Radio, RadioGroup, FormControlLabel, FormControl,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api';
import { formatCurrency } from '../utils/format';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const Checkout = () => {
  const { cart, loading, placeOrder } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ phone: '', address: '', paymentMethod: 'COD' });
  const [errors, setErrors] = useState({});
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [placing, setPlacing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Pre-fill phone/address from profile if already saved there — still editable
  useEffect(() => {
    api.get('/api/users/profile')
      .then((res) => {
        setFormData((prev) => ({
          ...prev,
          phone: res.data.phone || '',
          address: res.data.address || ''
        }));
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.phone.trim()) tempErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) tempErrors.address = 'Shipping address is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // BMS-US-011: Place Order — with shipping details + payment method
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setPlacing(true);
    setErrorMsg('');
    try {
      const order = await placeOrder({
        phone: formData.phone,
        address: formData.address,
        paymentMethod: formData.paymentMethod
      });
      setConfirmedOrder(order);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const items = cart?.items || [];

  if (loading || loadingProfile) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Container>
    );
  }

  if (items.length === 0 && !confirmedOrder) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, mb: 10 }}>
        <Paper className="glass-panel" sx={{ p: 6, borderRadius: '16px', textAlign: 'center' }}>
          <Typography sx={{ color: '#9ca3af', mb: 3 }}>Your cart is empty — nothing to check out.</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard')}
            sx={{ bgcolor: '#6366f1', textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#4f46e5' } }}
          >
            Browse Books
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 10 }} className="fade-in">
      <Typography variant="h3" sx={{ fontFamily: 'Outfit', fontWeight: 700, color: '#f3f4f6', mb: 1 }}>
        Checkout
      </Typography>
      <Typography variant="body1" sx={{ color: '#9ca3af', mb: 4 }}>
        Confirm shipping details and payment method to place your order
      </Typography>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
          {errorMsg}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper component="form" onSubmit={handleSubmit} className="glass-panel" sx={{ p: 3, borderRadius: '16px' }}>
            <Typography sx={{ color: '#f3f4f6', fontWeight: 600, mb: 2 }}>Shipping Details</Typography>
            <TextField
              fullWidth
              required
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
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              required
              multiline
              rows={3}
              label="Shipping Address"
              name="address"
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
              sx={{ mb: 3 }}
            />

            <Typography sx={{ color: '#f3f4f6', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaymentIcon fontSize="small" /> Payment Method
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <FormControlLabel value="COD" control={<Radio />} label="Cash on Delivery" />
                <FormControlLabel value="UPI" control={<Radio />} label="UPI" />
              </RadioGroup>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={placing}
              startIcon={placing ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <ReceiptLongIcon />}
              sx={{ mt: 3, bgcolor: '#6366f1', textTransform: 'none', borderRadius: '8px', fontWeight: 600, py: 1.5, '&:hover': { bgcolor: '#4f46e5' } }}
            >
              {placing ? 'Placing Order...' : 'Place Order'}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper className="glass-panel" sx={{ p: 3, borderRadius: '16px' }}>
            <Typography sx={{ color: '#f3f4f6', fontWeight: 600, mb: 2 }}>Order Summary</Typography>
            {items.map((item) => (
              <Box key={item.bookId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#cbd5e1' }}>{item.title} x{item.quantity}</Typography>
                <Typography variant="body2" sx={{ color: '#f3f4f6' }}>{formatCurrency(item.subtotal)}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2, borderColor: 'var(--border-color)' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 700, color: '#f3f4f6' }}>Total</Typography>
              <Typography sx={{ fontWeight: 700, color: '#34d399' }}>{formatCurrency(cart.totalAmount)}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Order confirmation dialog */}
      <Dialog open={!!confirmedOrder} onClose={() => navigate('/orders')}>
        <DialogTitle sx={{ fontFamily: 'Outfit', fontWeight: 700 }}>Order Placed Successfully</DialogTitle>
        <DialogContent>
          {confirmedOrder && (
            <>
              <Typography sx={{ color: '#9ca3af', mb: 2 }}>
                Order #{confirmedOrder.id} has been confirmed and will ship soon.
              </Typography>
              {confirmedOrder.items.map((item) => (
                <Box key={item.bookId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{item.title} x{item.quantity}</Typography>
                  <Typography variant="body2">{formatCurrency(item.subtotal)}</Typography>
                </Box>
              ))}
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography sx={{ fontWeight: 700, color: '#34d399' }}>{formatCurrency(confirmedOrder.totalAmount)}</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#9ca3af', mt: 1 }}>
                Paying via {confirmedOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : 'UPI'}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => navigate('/orders')} variant="contained" sx={{ bgcolor: '#6366f1', textTransform: 'none', '&:hover': { bgcolor: '#4f46e5' } }}>
            View My Orders
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Checkout;
