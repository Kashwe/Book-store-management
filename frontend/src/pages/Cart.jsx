import React, { useState } from 'react';
import {
  Container, Typography, Paper, Box, Button, Divider, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const Cart = () => {
  const { cart, loading, removeFromCart, placeOrder, refreshCart } = useCart();
  const navigate = useNavigate();

  const [removingId, setRemovingId] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const handleRemove = async (bookId) => {
    setRemovingId(bookId);
    setErrorMsg('');
    try {
      await removeFromCart(bookId);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to remove item.');
    } finally {
      setRemovingId(null);
    }
  };

  // BMS-US-011: Place Order
  const handlePlaceOrder = async () => {
    setPlacing(true);
    setErrorMsg('');
    try {
      const order = await placeOrder();
      setConfirmedOrder(order);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to place order. Please try again.');
      refreshCart();
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Container>
    );
  }

  const items = cart?.items || [];

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 10 }} className="fade-in">
      <Typography variant="h3" sx={{ fontFamily: 'Outfit', fontWeight: 700, color: '#f3f4f6', mb: 1 }}>
        Your Cart
      </Typography>
      <Typography variant="body1" sx={{ color: '#9ca3af', mb: 4 }}>
        Review your selections before checking out
      </Typography>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
          {errorMsg}
        </Alert>
      )}

      {items.length === 0 ? (
        <Paper className="glass-panel" sx={{ p: 6, borderRadius: '16px', textAlign: 'center' }}>
          <ShoppingCartIcon sx={{ fontSize: '3rem', color: 'rgba(99, 102, 241, 0.35)', mb: 2 }} />
          <Typography sx={{ color: '#9ca3af', mb: 3 }}>Your cart is empty.</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard')}
            sx={{ bgcolor: '#6366f1', textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#4f46e5' } }}
          >
            Browse Books
          </Button>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper} className="glass-panel" sx={{ borderRadius: '16px', overflow: 'hidden', mb: 4 }}>
            <Table>
              <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
                <TableRow>
                  <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }}>Book</TableCell>
                  <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }} align="right">Price</TableCell>
                  <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }} align="center">Qty</TableCell>
                  <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }} align="right">Subtotal</TableCell>
                  <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }} align="center">Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.bookId} sx={{ borderBottom: '1px solid var(--border-color)' }}>
                    <TableCell sx={{ color: '#f3f4f6', fontWeight: 500 }}>{item.title}</TableCell>
                    <TableCell sx={{ color: '#cbd5e1' }} align="right">${item.price.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <Chip label={item.quantity} size="small" sx={{ bgcolor: 'rgba(99, 102, 241, 0.12)', color: '#818cf8', fontWeight: 600 }} />
                    </TableCell>
                    <TableCell sx={{ color: '#34d399', fontWeight: 600 }} align="right">${item.subtotal.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleRemove(item.bookId)}
                        disabled={removingId === item.bookId}
                        sx={{ color: '#f87171' }}
                      >
                        {removingId === item.bookId ? <CircularProgress size={18} sx={{ color: '#f87171' }} /> : <DeleteIcon fontSize="small" />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Paper className="glass-panel" sx={{ p: 3, borderRadius: '16px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#f3f4f6' }}>Total</Typography>
              <Typography variant="h5" sx={{ color: '#34d399', fontWeight: 700 }}>
                ${cart.totalAmount.toFixed(2)}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2, borderColor: 'var(--border-color)' }} />
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={placing ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <ReceiptLongIcon />}
              disabled={placing}
              onClick={handlePlaceOrder}
              sx={{
                bgcolor: '#6366f1',
                textTransform: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                py: 1.5,
                '&:hover': { bgcolor: '#4f46e5' }
              }}
            >
              {placing ? 'Placing Order...' : 'Place Order'}
            </Button>
          </Paper>
        </>
      )}

      {/* Order confirmation dialog - BMS-US-011 */}
      <Dialog open={!!confirmedOrder} onClose={() => { setConfirmedOrder(null); navigate('/dashboard'); }}>
        <DialogTitle sx={{ fontFamily: 'Outfit', fontWeight: 700 }}>Order Placed Successfully</DialogTitle>
        <DialogContent>
          {confirmedOrder && (
            <>
              <Typography sx={{ color: '#9ca3af', mb: 2 }}>
                Order #{confirmedOrder.id} has been confirmed.
              </Typography>
              {confirmedOrder.items.map((item) => (
                <Box key={item.bookId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{item.title} x{item.quantity}</Typography>
                  <Typography variant="body2">${item.subtotal.toFixed(2)}</Typography>
                </Box>
              ))}
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography sx={{ fontWeight: 700, color: '#34d399' }}>${confirmedOrder.totalAmount.toFixed(2)}</Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => { setConfirmedOrder(null); navigate('/dashboard'); }} sx={{ textTransform: 'none' }}>
            Continue Shopping
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart;