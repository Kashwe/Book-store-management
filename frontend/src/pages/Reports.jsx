import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Typography, Paper, Grid, Box, CircularProgress, Snackbar, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import api from '../api';
import { formatCurrency } from '../utils/format';
import PaidIcon from '@mui/icons-material/Paid';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CancelIcon from '@mui/icons-material/Cancel';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const StatCard = ({ icon, label, value, color }) => (
  <Paper className="glass-panel" sx={{ p: 3, borderRadius: '16px', display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box sx={{ bgcolor: `${color}20`, color, borderRadius: '12px', p: 1.5, display: 'flex' }}>
      {icon}
    </Box>
    <Box>
      <Typography sx={{ color: '#9ca3af', fontSize: '0.85rem' }}>{label}</Typography>
      <Typography sx={{ color: '#f3f4f6', fontWeight: 700, fontSize: '1.4rem', fontFamily: 'Outfit' }}>{value}</Typography>
    </Box>
  </Paper>
);

const Reports = () => {
  const [sales, setSales] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // BMS-US-017 / BMS-US-018: Sales & Inventory Reports
  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const [salesRes, inventoryRes] = await Promise.all([
        api.get('/api/reports/sales'),
        api.get('/api/reports/inventory')
      ]);
      setSales(salesRes.data);
      setInventory(inventoryRes.data);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to load reports.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 10 }} className="fade-in">
      <Typography variant="h3" sx={{ fontFamily: 'Outfit', fontWeight: 700, color: '#f3f4f6', mb: 1 }}>
        Reports
      </Typography>
      <Typography variant="body1" sx={{ color: '#9ca3af', mb: 4 }}>
        Sales performance and inventory health at a glance
      </Typography>

      <Typography variant="h6" sx={{ color: '#f3f4f6', fontWeight: 600, mb: 2 }}>Sales</Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<PaidIcon />} label="Total Revenue" value={formatCurrency(sales.totalRevenue)} color="#34d399" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<ShoppingBagIcon />} label="Orders Placed" value={sales.totalOrders} color="#6366f1" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<CancelIcon />} label="Orders Cancelled" value={sales.totalCancelledOrders} color="#f87171" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<MenuBookIcon />} label="Books Sold" value={sales.totalBooksSold} color="#818cf8" />
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ color: '#f3f4f6', fontWeight: 600, mb: 2 }}>Top Selling Books</Typography>
      <TableContainer component={Paper} className="glass-panel" sx={{ borderRadius: '16px', overflow: 'hidden', mb: 5 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
            <TableRow>
              <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }} align="right">Units Sold</TableCell>
              <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }} align="right">Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.topSellingBooks.map((book) => (
              <TableRow key={book.bookId} sx={{ borderBottom: '1px solid var(--border-color)' }}>
                <TableCell sx={{ color: '#f3f4f6' }}>{book.title}</TableCell>
                <TableCell sx={{ color: '#cbd5e1' }} align="right">{book.quantitySold}</TableCell>
                <TableCell sx={{ color: '#34d399', fontWeight: 600 }} align="right">{formatCurrency(book.revenue)}</TableCell>
              </TableRow>
            ))}
            {sales.topSellingBooks.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ color: '#9ca3af', py: 4 }}>
                  No sales recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" sx={{ color: '#f3f4f6', fontWeight: 600, mb: 2 }}>Inventory</Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={<MenuBookIcon />} label="Total Titles" value={inventory.totalTitles} color="#6366f1" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={<Inventory2Icon />} label="Units In Stock" value={inventory.totalUnitsInStock} color="#818cf8" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={<PaidIcon />} label="Inventory Value" value={formatCurrency(inventory.totalInventoryValue)} color="#34d399" />
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ color: '#f3f4f6', fontWeight: 600, mb: 2 }}>Low Stock Alerts</Typography>
      <TableContainer component={Paper} className="glass-panel" sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
            <TableRow>
              <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }} align="right">Quantity Remaining</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.lowStockBooks.map((book) => (
              <TableRow key={book.bookId} sx={{ borderBottom: '1px solid var(--border-color)' }}>
                <TableCell sx={{ color: '#f3f4f6' }}>{book.title}</TableCell>
                <TableCell align="right">
                  <Chip
                    icon={<WarningAmberIcon sx={{ fontSize: '1rem !important' }} />}
                    label={book.quantity}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      bgcolor: 'rgba(239, 68, 68, 0.12)',
                      color: '#f87171',
                      border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {inventory.lowStockBooks.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ color: '#9ca3af', py: 4 }}>
                  All titles are well stocked.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

export default Reports;
