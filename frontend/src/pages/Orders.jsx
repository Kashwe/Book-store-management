import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Typography, Paper, Box, Button, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, CircularProgress, Snackbar, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, Divider, Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { formatCurrency } from '../utils/format';
import CancelIcon from '@mui/icons-material/Cancel';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const STATUS_STYLES = {
  PLACED: { bg: 'rgba(99, 102, 241, 0.12)', color: '#818cf8', border: 'rgba(99, 102, 241, 0.2)' },
  SHIPPED: { bg: 'rgba(16, 185, 129, 0.12)', color: '#34d399', border: 'rgba(16, 185, 129, 0.2)' },
  CANCELLED: { bg: 'rgba(239, 68, 68, 0.12)', color: '#f87171', border: 'rgba(239, 68, 68, 0.2)' },
};

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // BMS-US-012: View Order History
  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/orders');
      setOrders(response.data);
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to load your orders.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // BMS-US-013: Cancel Order
  const handleCancel = async () => {
    const orderId = confirmTarget;
    setConfirmTarget(null);
    setCancellingId(orderId);
    try {
      const response = await api.put(`/api/orders/${orderId}/cancel`);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? response.data : o)));
      showSnackbar('Order cancelled successfully.');
    } catch (err) {
      console.error(err);
      showSnackbar(err.response?.data?.message || 'Failed to cancel order.', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 10 }} className="fade-in">
      <Typography variant="h3" sx={{ fontFamily: 'Outfit', fontWeight: 700, color: '#f3f4f6', mb: 1 }}>
        My Orders
      </Typography>
      <Typography variant="body1" sx={{ color: '#9ca3af', mb: 4 }}>
        Track and manage your order history
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#6366f1' }} />
        </Box>
      ) : orders.length === 0 ? (
        <Paper className="glass-panel" sx={{ p: 6, borderRadius: '16px', textAlign: 'center' }}>
          <ReceiptLongIcon sx={{ fontSize: '3rem', color: 'rgba(99, 102, 241, 0.35)', mb: 2 }} />
          <Typography sx={{ color: '#9ca3af', mb: 3 }}>You haven't placed any orders yet.</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard')}
            sx={{ bgcolor: '#6366f1', textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#4f46e5' } }}
          >
            Browse Books
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} className="glass-panel" sx={{ borderRadius: '16px', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
              <TableRow>
                <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }}>Order ID</TableCell>
                <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }}>Items</TableCell>
                <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }} align="right">Total</TableCell>
                <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }} align="center">Payment</TableCell>
                <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }}>Shipping To</TableCell>
                <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }} align="center">Status</TableCell>
                <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }} align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.PLACED;
                return (
                <TableRow key={order.id} sx={{ borderBottom: '1px solid var(--border-color)' }}>
                  <TableCell sx={{ color: '#cbd5e1', fontFamily: 'monospace', fontSize: '0.8rem' }}>{order.id}</TableCell>
                  <TableCell sx={{ color: '#cbd5e1' }}>
                    {new Date(order.orderDate).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ color: '#f3f4f6' }}>
                    {order.items.map((item) => (
                      <Box key={item.bookId} sx={{ fontSize: '0.85rem' }}>
                        {item.title} x{item.quantity}
                      </Box>
                    ))}
                  </TableCell>
                  <TableCell sx={{ color: '#34d399', fontWeight: 600 }} align="right">
                    {formatCurrency(order.totalAmount)}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={order.paymentMethod === 'UPI' ? 'UPI' : 'COD'}
                      size="small"
                      sx={{ fontWeight: 600, fontSize: '0.7rem', bgcolor: 'rgba(255,255,255,0.06)', color: '#cbd5e1' }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#9ca3af', fontSize: '0.8rem', maxWidth: '160px' }}>
                    <Tooltip title={order.shippingAddress || ''}>
                      <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.shippingAddress || '—'}
                      </Box>
                    </Tooltip>
                    <Box sx={{ fontSize: '0.75rem', color: '#6b7280' }}>{order.shippingPhone}</Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={order.status}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        bgcolor: statusStyle.bg,
                        color: statusStyle.color,
                        border: `1px solid ${statusStyle.border}`
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {order.status === 'PLACED' ? (
                      <IconButton
                        onClick={() => setConfirmTarget(order.id)}
                        disabled={cancellingId === order.id}
                        sx={{ color: '#f87171' }}
                      >
                        {cancellingId === order.id ? <CircularProgress size={18} sx={{ color: '#f87171' }} /> : <CancelIcon fontSize="small" />}
                      </IconButton>
                    ) : (
                      <Typography sx={{ color: '#6b7280', fontSize: '0.8rem' }}>—</Typography>
                    )}
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Cancel confirmation dialog - BMS-US-013 */}
      <Dialog open={!!confirmTarget} onClose={() => setConfirmTarget(null)}>
        <DialogTitle sx={{ fontFamily: 'Outfit', fontWeight: 700 }}>Cancel this order?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#9ca3af' }}>
            This will restore the ordered items to stock. This action cannot be undone.
          </Typography>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmTarget(null)} sx={{ textTransform: 'none' }}>
            Keep Order
          </Button>
          <Button
            onClick={handleCancel}
            variant="contained"
            sx={{ bgcolor: '#dc2626', textTransform: 'none', '&:hover': { bgcolor: '#b91c1c' } }}
          >
            Cancel Order
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Orders;
