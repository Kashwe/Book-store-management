import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Typography, Paper, Box, Button, Grid, Chip, CircularProgress,
  Snackbar, Alert, Rating, TextField, Divider, Avatar, IconButton
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api';
import { formatCurrency } from '../utils/format';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [bookRes, reviewsRes] = await Promise.all([
        api.get(`/api/books/${id}`),
        api.get(`/api/books/${id}/reviews`)
      ]);
      setBook(bookRes.data);
      setReviews(reviewsRes.data);
      setQuantity(1);
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to load book details.', 'error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const adjustQuantity = (delta) => {
    setQuantity((prev) => Math.min(Math.max(prev + delta, 1), book.quantity || 1));
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await addToCart(book.id, quantity);
      showSnackbar(`"${book.title}" added to cart (x${quantity}).`);
      setQuantity(1);
    } catch (err) {
      console.error(err);
      showSnackbar(err.response?.data?.message || 'Failed to add book to cart.', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  // BMS-US-014 / BMS-US-015: Add Review & Rate Book
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      showSnackbar('Please provide both a rating and a comment.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const response = await api.post(`/api/books/${id}/reviews`, { rating, comment });
      setReviews((prev) => [response.data, ...prev]);
      setRating(0);
      setComment('');
      showSnackbar('Review submitted successfully.');
    } catch (err) {
      console.error(err);
      showSnackbar(err.response?.data?.message || 'Failed to submit review.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Box>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 10 }} className="fade-in">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dashboard')}
        sx={{ color: '#9ca3af', textTransform: 'none', mb: 3 }}
      >
        Back to Catalog
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper
            className="glass-panel"
            sx={{
              height: '260px',
              borderRadius: '16px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'rgba(99, 102, 241, 0.06)'
            }}
          >
            <MenuBookIcon sx={{ fontSize: '6rem', color: 'rgba(99, 102, 241, 0.25)' }} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h3" sx={{ fontFamily: 'Outfit', fontWeight: 700, color: '#f3f4f6' }}>
            {book.title}
          </Typography>
          <Typography variant="h6" sx={{ color: '#818cf8', fontWeight: 500, mt: 0.5 }}>
            by {book.author}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2 }}>
            <Rating value={averageRating} precision={0.1} readOnly />
            <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              {averageRating > 0 ? `${averageRating.toFixed(1)} (${reviews.length} review${reviews.length === 1 ? '' : 's'})` : 'No reviews yet'}
            </Typography>
          </Box>

          <Typography sx={{ color: '#cbd5e1', mt: 3, lineHeight: 1.7 }}>
            {book.description || 'No description available for this volume.'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3, flexWrap: 'wrap' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#34d399' }}>
              {formatCurrency(book.price)}
            </Typography>
            <Chip
              label={book.quantity > 0 ? `${book.quantity} in stock` : 'Out of stock'}
              sx={{
                fontWeight: 600,
                bgcolor: book.quantity > 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                color: book.quantity > 0 ? '#34d399' : '#f87171',
                border: `1px solid ${book.quantity > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
              }}
            />
          </Box>

          {user?.role !== 'ADMIN' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <IconButton onClick={() => adjustQuantity(-1)} disabled={book.quantity === 0 || quantity <= 1} sx={{ color: '#9ca3af' }}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ px: 1.5, minWidth: '28px', textAlign: 'center', color: '#f3f4f6', fontWeight: 600 }}>
                  {quantity}
                </Typography>
                <IconButton onClick={() => adjustQuantity(1)} disabled={book.quantity === 0 || quantity >= book.quantity} sx={{ color: '#9ca3af' }}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>

              <Button
                variant="contained"
                startIcon={addingToCart ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <ShoppingCartIcon />}
                disabled={book.quantity === 0 || addingToCart}
                onClick={handleAddToCart}
                sx={{ bgcolor: '#6366f1', textTransform: 'none', borderRadius: '8px', px: 3, py: 1.2, fontWeight: 600, '&:hover': { bgcolor: '#4f46e5' } }}
              >
                {book.quantity === 0 ? 'Sold Out' : 'Add to Cart'}
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>

      <Divider sx={{ my: 5, borderColor: 'var(--border-color)' }} />

      {/* BMS-US-016: View Reviews */}
      <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 700, color: '#f3f4f6', mb: 3 }}>
        Reviews & Ratings
      </Typography>

      {user?.role !== 'ADMIN' && (
        <Paper component="form" onSubmit={handleSubmitReview} className="glass-panel" sx={{ p: 3, borderRadius: '16px', mb: 4 }}>
          <Typography sx={{ color: '#f3f4f6', fontWeight: 600, mb: 1.5 }}>Write a review</Typography>
          <Rating value={rating} onChange={(e, value) => setRating(value)} sx={{ mb: 2 }} />
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder="Share your thoughts on this book..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: 'rgba(255, 255, 255, 0.03)' }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{ bgcolor: '#6366f1', textTransform: 'none', borderRadius: '8px', fontWeight: 600, '&:hover': { bgcolor: '#4f46e5' } }}
          >
            {submitting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Submit Review'}
          </Button>
        </Paper>
      )}

      {reviews.length === 0 ? (
        <Typography sx={{ color: '#9ca3af', textAlign: 'center', py: 4 }}>
          No reviews yet. Be the first to share your thoughts!
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {reviews.map((review) => (
            <Paper key={review.id} className="glass-panel" sx={{ p: 3, borderRadius: '14px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Avatar sx={{ bgcolor: '#6366f1', width: 32, height: 32, fontSize: '0.9rem' }}>
                  {review.userName?.charAt(0).toUpperCase() || '?'}
                </Avatar>
                <Box>
                  <Typography sx={{ color: '#f3f4f6', fontWeight: 600, fontSize: '0.9rem' }}>
                    {review.userName}
                  </Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
              </Box>
              <Typography sx={{ color: '#cbd5e1' }}>{review.comment}</Typography>
            </Paper>
          ))}
        </Box>
      )}

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

export default BookDetail;
