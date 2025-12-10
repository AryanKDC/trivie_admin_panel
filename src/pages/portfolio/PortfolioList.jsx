import React from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  EditOutlined as EditIcon,
  FilterList as FilterListIcon,
  GridView as GridViewIcon,
  Search as SearchIcon,
  TableRows as TableRowsIcon,
  VisibilityOutlined as VisibilityIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

// Mock Data matching the screenshot
const mockPortfolioData = [
  {
    id: 1,
    thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=150&h=100&fit=crop',
    title: 'Modern Minimalist Living Room',
    category: 'Residential',
    date: 'Nov 15, 2024',
  },
  {
    id: 2,
    thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=150&h=100&fit=crop',
    title: 'Luxury Boutique Hotel Lobby',
    category: 'Hospitality',
    date: 'Oct 20, 2024',
  },
  {
    id: 3,
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=150&h=100&fit=crop',
    title: 'Tech Startup Office Space',
    category: 'Office',
    date: 'Sep 5, 2024',
  },
  {
    id: 4,
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&h=100&fit=crop',
    title: 'Contemporary Fine Dining Restaurant',
    category: 'Restaurant',
    date: 'Aug 12, 2024',
  },
  {
    id: 5,
    thumbnail: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=150&h=100&fit=crop',
    title: 'Premium Fashion Retail Store',
    category: 'Retail',
    date: 'Dec 1, 2024',
  },
  {
    id: 6,
    thumbnail: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?w=150&h=100&fit=crop',
    title: 'Urban Loft Renovation',
    category: 'Residential',
    date: 'Jul 22, 2024'
  }
];

const categories = ['All Categories', 'Residential', 'Hospitality', 'Office', 'Restaurant', 'Retail'];

// Validation Schema
const validationSchema = Yup.object({
  search: Yup.string().max(50, 'Search term is too long'),
  category: Yup.string(),
});

const PortfolioList = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      search: '',
      category: 'All Categories',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log('Filters applied:', values);
    },
  });

  // Filter data based on formik values
  const filteredData = mockPortfolioData.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(formik.values.search.toLowerCase()) ||
      item.category.toLowerCase().includes(formik.values.search.toLowerCase());
    const matchesCategory = formik.values.category === 'All Categories' || item.category === formik.values.category;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Residential': return { bg: '#FFEBEB', color: '#FF4D4D' }; // Red-ish
      case 'Hospitality': return { bg: '#FFF0E6', color: '#FF8533' }; // Orange-ish
      case 'Office': return { bg: '#FFEBEB', color: '#FF4D4D' }; // Using Red/Pink per screenshot for 'Office' mostly
      case 'Restaurant': return { bg: '#FFEBEB', color: '#FF4D4D' };
      case 'Retail': return { bg: '#FFEBEB', color: '#FF4D4D' };
      default: return { bg: '#F5F5F5', color: '#666' };
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh' }}>
    {/* <Box sx={{ p: 4, minHeight: '100vh', margin: 'auto' }}> */}

      {/* Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#111827' }}>
            Portfolio Projects
          </Typography>
          <Typography variant="body2" color="text.secondary">
            6 projects
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          {/* <Box sx={{ bgcolor: 'white', borderRadius: 1, border: '1px solid #E5E7EB', display: 'flex' }}>
              <Button 
                startIcon={<GridViewIcon />} 
                sx={{ 
                    color: '#6B7280', 
                    textTransform: 'none',
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'transparent' }
                }}
              >
                  Grid
              </Button>
              <Button 
                startIcon={<TableRowsIcon />} 
                sx={{ 
                    color: '#111827', 
                    bgcolor: 'white',
                    textTransform: 'none',
                    fontWeight: 'medium',
                    boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
                    borderRadius: 1
                }}
              >
                  Table
              </Button>
           </Box> */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/portfolio/add')}
            sx={{
              backgroundColor: '#DC0000', // Red color
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: 'none',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#B30000',
                boxShadow: 'none',
              },
            }}
          >
            Add Portfolio
          </Button>
        </Stack>
      </Stack>

      {/* Filter Card */}
      <Card sx={{ p: 3, mb: 3, boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)', borderRadius: 3, border: '1px solid #E5E7EB' }}>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            {/* Search Bar */}
            <TextField
              fullWidth
              name="search"
              placeholder="Search by title, category, or description..."
              value={formik.values.search}
              onChange={formik.handleChange}
              variant="outlined"
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#9CA3AF' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, bgcolor: 'white', '& fieldset': { borderColor: '#E5E7EB' } }
                }
              }}
            />

            {/* Category Filters */}
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1.5}>
                Filter by Category
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {categories.map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    onClick={() => formik.setFieldValue('category', cat)}
                    sx={{
                      backgroundColor: formik.values.category === cat ? '#DC0000' : '#F3F4F6',
                      color: formik.values.category === cat ? 'white' : '#4B5563',
                      fontWeight: 500,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: formik.values.category === cat ? '#B30000' : '#E5E7EB',
                      },
                      border: 'none',
                      height: 32,
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </form>
      </Card>

      {/* Projects Table */}
      <TableContainer component={Card} sx={{ boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)', borderRadius: 3, border: '1px solid #E5E7EB' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F9FAFB' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Thumbnail</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  Title <FilterListIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
                </Stack>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  Category <FilterListIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
                </Stack>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  Date <FilterListIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
                </Stack>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }} align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => {
              const style = getCategoryColor(row.category);
              return (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Box
                      component="img"
                      src={row.thumbnail}
                      alt={row.title}
                      sx={{ width: 60, height: 58, objectFit: 'cover', borderRadius: 2 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#111827' }}>
                      {row.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.category}
                      size="small"
                      sx={{
                        backgroundColor: style.bg,
                        color: style.color,
                        fontWeight: 500,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        height: 24
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {row.date}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" sx={{ color: '#EF4444' }}><VisibilityIcon fontSize="small" /></IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#22C55E' }} 
                        onClick={() => navigate(`/portfolio/edit/${row.id}`)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#EF4444' }}><DeleteIcon fontSize="small" /></IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {filteredData.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography color="text.secondary">No projects found.</Typography>
          </Box>
        )}
      </TableContainer>
    {/* </Box> */}
    </Container>
  );
};

export default PortfolioList;