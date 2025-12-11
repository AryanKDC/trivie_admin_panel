import React, { useState, useEffect } from 'react';
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
  TablePagination,
  Pagination,
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
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, fetchCategories, updateCategory, deleteCategory, setPage } from '../../store/slices/categorySlice';

// Validation Schema
const categoryValidationSchema = Yup.object({
  name: Yup.string().required('Category Name is required'),
  description: Yup.string(),
});

const CategoryList = () => {
  const dispatch = useDispatch();
  const { items: categories, status, pagination } = useSelector((state) => state.category);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch, pagination.page]); // Re-fetch when page changes

  const handleChangePage = (event, newPage) => {
    dispatch(setPage(newPage + 1)); // Material UI is 0-indexed, API usually 1-indexed
  };

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

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
        const res = await dispatch(deleteCategory(id));
        if (res.meta.requestStatus === 'fulfilled') {
            alert('Category deleted successfully');
        } else {
            alert(`Failed to delete category: ${res.payload?.message || 'Unknown error'}`);
        }
    }
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
            {categories.length} categories
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
                    onSubmit={async (values, { resetForm }) => {
                        if (editingCategory) {
                            // Dispatch updateCategory action
                            const res = await dispatch(updateCategory({ id: editingCategory._id, data: values }));

                            if (res.meta.requestStatus === 'fulfilled') {
                                alert('Category updated successfully!');
                                // Optionally refresh list if update doesn't return updated item, or trust reducer
                                dispatch(fetchCategories()); 
                                resetForm();
                                handleCancel();
                            } else {
                                alert(`Failed to update category: ${res.payload?.message || 'Unknown error'}`);
                            }
                        } else {
                            // Dispatch addCategory action
                            const res = await dispatch(addCategory(values));
                            
                            if (res.meta.requestStatus === 'fulfilled') {
                                alert('Category added successfully!');
                                dispatch(fetchCategories()); // Refresh list
                                resetForm();
                                handleCancel();
                            } else {
                                alert(`Failed to add category: ${res.payload?.message || 'Unknown error'}`);
                            }
                        }
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
            {categories.map((row) => (
              <TableRow key={row._id || row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton size="small" sx={{ color: '#22C55E' }} onClick={() => handleEditClick(row)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" sx={{ color: '#EF4444' }} onClick={() => handleDelete(row._id || row.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
             {categories.length === 0 && status !== 'loading' && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">No categories found</Typography>
                  </TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
        {/* <TablePagination
        sx={{ mt: 2 }}
          component="div"
          count={pagination.total}
          page={pagination.page - 1}
          onPageChange={handleChangePage}
          rowsPerPage={pagination.limit}
          rowsPerPageOptions={[10]}
        /> */}

        <Stack alignItems="center" py={3}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={(event, value) => dispatch(setPage(value))}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            siblingCount={1}       
            boundaryCount={1}
            sx={{
                '& .MuiPaginationItem-root': {
                    '&.Mui-selected': {
                        backgroundColor: '#DC0000',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#B30000',
                        },
                    },
                },
            }}
          />
        </Stack>
      </TableContainer>
    </Container>
  );
};

export default CategoryList;