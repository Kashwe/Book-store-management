import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Paper, Grid, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent, Chip, IconButton, InputAdornment, TextField, CircularProgress, Snackbar, Alert, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// Kept for reference / original seed data — no longer used to populate the
// Dashboard directly, since books now come from the real backend (US-008).
// Left here so nothing from the original file is lost.
const DEFAULT_BOOKS = [
  {
    id: 'seed-1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    description: 'A Handbook of Agile Software Craftsmanship. Learn to write clean, self-documenting code with OOP practices.',
    price: 49.99,
    quantity: 10
  },
  {
    id: 'seed-2',
    title: 'Design Patterns',
    author: 'Erich Gamma',
    isbn: '978-0201633610',
    description: 'Elements of Reusable Object-Oriented Software. The foundation of structured architecture and software modeling.',
    price: 59.99,
    quantity: 5
  },
  {
    id: 'seed-3',
    title: 'Effective Java',
    author: 'Joshua Bloch',
    isbn: '978-0134685991',
    description: 'Best practices for the Java platform. Essential guide to functional structures, memory optimizations, and thread safety.',
    price: 45.50,
    quantity: 12
  },
  {
    id: 'seed-4',
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt & David Thomas',
    isbn: '978-0135957059',
    description: 'Your journey to mastery. Explore topics ranging from personal responsibility and career development to architectural techniques.',
    price: 42.99,
    quantity: 0
  }
];

const Dashboard = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // BMS-US-008: View Books — pulls the real catalog from the backend
  const loadBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/books');
      setBooks(response.data);
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to load books from the server.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // BMS-US-009: Search Books — client-side filtering over the fetched list
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (book.isbn || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // BMS-US-007: Delete Book
  const handleDelete = async (id) => {
    setDeleteTargetId(id);
    try {
      await api.delete(`/api/books/${id}`);
      setBooks((prev) => prev.filter((book) => book.id !== id));
      showSnackbar('Book removed from inventory.');
    } catch (err) {
      console.error(err);
      showSnackbar(err.response?.data?.message || 'Failed to delete book.', 'error');
    } finally {
      setDeleteTargetId(null);
    }
  };

  // BMS-US-010: Add to Cart
  const handleAddToCart = async (book) => {
    setAddingId(book.id);
    try {
      await addToCart(book.id, 1);
      showSnackbar(`"${book.title}" added to cart.`);
    } catch (err) {
      console.error(err);
      showSnackbar(err.response?.data?.message || 'Failed to add book to cart.', 'error');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 10 }} className="fade-in">
      {/* Header section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontFamily: 'Outfit', fontWeight: 700, color: '#f3f4f6' }}>
            {user?.role === 'ADMIN' ? 'Book Management' : 'Book Catalog'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#9ca3af', mt: 0.5 }}>
            {user?.role === 'ADMIN' 
              ? 'Update stock quantities, add releases, and manage details' 
              : 'Browse our collection of handpicked premium programming books'}
          </Typography>
        </Box>

        {user?.role === 'ADMIN' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/add-book')}
            sx={{
              bgcolor: '#6366f1',
              textTransform: 'none',
              borderRadius: '8px',
              px: 3,
              py: 1.2,
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#4f46e5',
              }
            }}
          >
            Add Book
          </Button>
        )}
      </Box>

      {/* Search Input bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search books by title, author, or ISBN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#9ca3af' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: '500px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              bgcolor: 'rgba(255, 255, 255, 0.03)'
            }
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#6366f1' }} />
        </Box>
      ) : user?.role === 'ADMIN' ? (
        /* ADMIN INVENTORY TABLE VIEW */
        <TableContainer component={Paper} className="glass-panel" sx={{ borderRadius: '16px', overflow: 'hidden' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--border-color)' }}>
              <TableRow>
                <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }}>Author</TableCell>
                <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }}>ISBN</TableCell>
                <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }} align="right">Price</TableCell>
                <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }} align="right">Stock Quantity</TableCell>
                <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow 
                  key={book.id} 
                  sx={{ 
                    borderBottom: '1px solid var(--border-color)',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.01)' } 
                  }}
                >
                  <TableCell sx={{ color: '#f3f4f6', fontWeight: 500 }}>{book.title}</TableCell>
                  <TableCell sx={{ color: '#cbd5e1' }}>{book.author}</TableCell>
                  <TableCell sx={{ color: '#cbd5e1', fontFamily: 'monospace' }}>{book.isbn}</TableCell>
                  <TableCell sx={{ color: '#34d399', fontWeight: 600 }} align="right">
                    ${book.price.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    <Chip 
                      label={book.quantity > 0 ? `${book.quantity} left` : 'Out of stock'} 
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: '24px',
                        bgcolor: book.quantity > 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        color: book.quantity > 0 ? '#34d399' : '#f87171',
                        border: `1px solid ${book.quantity > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit book">
                      <IconButton 
                        onClick={() => navigate(`/edit-book/${book.id}`)}
                        sx={{ 
                          color: '#6366f1', 
                          '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.08)' } 
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete book">
                      <span>
                        <IconButton
                          onClick={() => handleDelete(book.id)}
                          disabled={deleteTargetId === book.id}
                          sx={{ color: '#f87171', '&:hover': { bgcolor: 'rgba(248, 113, 113, 0.08)' } }}
                        >
                          {deleteTargetId === book.id ? (
                            <CircularProgress size={18} sx={{ color: '#f87171' }} />
                          ) : (
                            <DeleteIcon fontSize="small" />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filteredBooks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: '#9ca3af', py: 4 }}>
                    No books found. Add a book or adjust your search filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        /* CUSTOMER SHOP CATALOG GRID VIEW */
        <Grid container spacing={3}>
          {filteredBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card 
                className="glass-panel" 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  borderRadius: '16px',
                  boxShadow: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    height: '140px', 
                    bgcolor: 'rgba(99, 102, 241, 0.06)', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    borderBottom: '1px solid var(--border-color)',
                    position: 'relative'
                  }}
                >
                  <MenuBookIcon sx={{ fontSize: '4.5rem', color: 'rgba(99, 102, 241, 0.25)' }} />
                  <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 1 }}>
                    <Chip
                      label={book.quantity > 0 ? 'Available' : 'Sold Out'}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        bgcolor: book.quantity > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: book.quantity > 0 ? '#34d399' : '#f87171',
                        border: `1px solid ${book.quantity > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                      }}
                    />
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: '#f3f4f6', fontFamily: 'Outfit', mb: 0.5, lineHeight: 1.3 }}>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#818cf8', mb: 2, fontWeight: 500 }}>
                    by {book.author}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '60px' }}>
                    {book.description || 'No description available for this volume.'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center' }}>
                      ${book.price.toFixed(2)}
                    </Typography>
                    
                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={addingId === book.id ? <CircularProgress size={14} /> : <ShoppingCartIcon />}
                      disabled={book.quantity === 0 || addingId === book.id}
                      onClick={() => handleAddToCart(book)}
                      sx={{ 
                        textTransform: 'none', 
                        borderRadius: '6px',
                        borderColor: 'rgba(99, 102, 241, 0.3)',
                        color: '#818cf8',
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: '#6366f1',
                          bgcolor: 'rgba(99, 102, 241, 0.08)'
                        }
                      }}
                    >
                      {book.quantity === 0 ? 'Sold Out' : 'Add to Cart'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {filteredBooks.length === 0 && (
            <Grid item xs={12}>
              <Typography align="center" sx={{ color: '#9ca3af', py: 6 }}>
                No books match your search criteria.
              </Typography>
            </Grid>
          )}
        </Grid>
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

export default Dashboard;
export { DEFAULT_BOOKS };
