import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Collapse,
} from '@mui/material';
import {
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  EditOutlined as EditIcon,
  LocalOfferOutlined as CategoryIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Validation Schema
const categoryValidationSchema = Yup.object({
  name: Yup.string().required('Category Name is required'),
  description: Yup.string(),
});

// Mock Data
const mockCategories = [
  { id: 1, name: 'Residential', description: 'Home and apartment interior designs', date: 'Jan 1, 2024' },
  { id: 2, name: 'Commercial', description: 'Business and commercial spaces', date: 'Jan 1, 2024' },
  { id: 3, name: 'Hospitality', description: 'Hotels, resorts, and lodging spaces', date: 'Jan 1, 2024' },
  { id: 4, name: 'Office', description: 'Corporate and office environments', date: 'Jan 1, 2024' },
  { id: 5, name: 'Retail', description: 'Shops and retail stores', date: 'Jan 1, 2024' },
  { id: 6, name: 'Restaurant', description: 'Dining and food service spaces', date: 'Jan 1, 2024' },
  { id: 7, name: 'Healthcare', description: 'Medical and healthcare facilities', date: 'Jan 1, 2024' },
  { id: 8, name: 'Educational', description: 'Schools and educational institutions', date: 'Jan 1, 2024' },
];

const CategoryList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Handle Edit Click
  const handleEditClick = (category) => {
    setEditingCategory(category);
    setShowAddForm(true);
  };

  // Handle Form Cancel
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingCategory(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh' }}>
      
      {/* Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#111827' }}>
            Category Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {mockCategories.length} categories
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={(showAddForm && !editingCategory) ? <CloseIcon /> : <AddIcon />}
          onClick={() => {
            if (showAddForm && !editingCategory) {
              handleCancel();
            } else {
              setEditingCategory(null);
              setShowAddForm(true);
            }
          }}
          sx={{
            backgroundColor: '#DC0000', // Red color
            color: 'white',
            textTransform: 'none',
            py: 1.5,
            fontWeight: 600,
            boxShadow: 'none',
            borderRadius: 2,
            minWidth: 150,
            '&:hover': {
              backgroundColor: '#B30000',
              boxShadow: 'none',
            },
          }}
        >
          {(showAddForm && !editingCategory) ? 'Cancel' : 'Add Category'}
        </Button>
      </Stack>

      {/* Add/Edit Category Form - Expandable */}
      <Collapse in={showAddForm}>
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)', border: '1px solid #E5E7EB' }}>
            <CardContent sx={{ p: 4 }}>
                <Typography variant="body1" fontWeight={500} color="text.secondary" mb={3}>
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                </Typography>
                <Formik
                    enableReinitialize
                    initialValues={{
                        name: editingCategory ? editingCategory.name : '',
                        description: editingCategory ? editingCategory.description : '',
                    }}
                    validationSchema={categoryValidationSchema}
                    onSubmit={(values, { resetForm }) => {
                        if (editingCategory) {
                            console.log('Updated Category Data:', values);
                            alert('Category updated! check console');
                        } else {
                            console.log('New Category Data:', values);
                            alert('Category added! check console');
                        }
                        resetForm();
                        handleCancel();
                    }}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="body2" fontWeight={500} mb={1}>
                                        Category Name <span style={{ color: '#DC0000' }}>*</span>
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="e.g., Residential, Commercial"
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.name && Boolean(errors.name)}
                                        helperText={touched.name && errors.name}
                                        variant="outlined"
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="body2" fontWeight={500} mb={1}>
                                        Description
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        placeholder="Brief description of this category"
                                        name="description"
                                        value={values.description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.description && Boolean(errors.description)}
                                        helperText={touched.description && errors.description}
                                        variant="outlined"
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                                    />
                                </Box>
                                
                                <Stack direction="row" spacing={2} pt={1}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            bgcolor: '#DC0000',
                                            color: 'white',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            height: 48,
                                            borderRadius: 2,
                                            boxShadow: 'none',
                                            '&:hover': { bgcolor: '#b30000', boxShadow: 'none' },
                                        }}
                                    >
                                        {editingCategory ? 'Update Category' : 'Add Category'}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={handleCancel}
                                        sx={{
                                            borderColor: '#E5E7EB',
                                            color: '#374151',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            minWidth: 100,
                                            height: 48,
                                            borderRadius: 2,
                                            '&:hover': { borderColor: '#D1D5DB', bgcolor: '#f9fafb' },
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Stack>
                            </Stack>
                        </form>
                    )}
                </Formik>
            </CardContent>
        </Card>
      </Collapse>

      {/* Categories Table */}
      <TableContainer component={Card} sx={{ boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)', borderRadius: 3, border: '1px solid #E5E7EB' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F9FAFB' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Category Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Date Created</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }} align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockCategories.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: '#FFF5F5', // Light red background
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#DC0000', // Red icon
                      }}
                    >
                      <CategoryIcon fontSize="small" />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#111827' }}>
                      {row.name}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {row.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {row.date}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton size="small" sx={{ color: '#22C55E' }} onClick={() => handleEditClick(row)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" sx={{ color: '#EF4444' }}><DeleteIcon fontSize="small" /></IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CategoryList;