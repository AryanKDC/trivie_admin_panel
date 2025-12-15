import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, addUser, updateUser, deleteUser } from '../../store/slices/userSlice';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
  Avatar,
  MenuItem,
  FormHelperText,
  Collapse,
} from '@mui/material';
import {
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  EditOutlined as EditIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

// Validation Schema Generator
const getValidationSchema = (isEditing) => Yup.object({
  user_name: Yup.string().required('User Name is required'),
  email: Yup.string().email('Invalid email address').required('Email Address is required'),
  password: isEditing
    ? Yup.string().min(6, 'Password must be at least 6 characters') // Optional on edit
    : Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'), // Required on add
  role_id: Yup.string().required('Role is required'),
});



const roles = ['admin', 'editor'];

const ListUsers = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.user);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setShowAddForm(true);
    window.scrollTo({ top: 20, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingUser(null);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete User?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC0000',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteUser(id)).unwrap();
        Swal.fire({
          title: 'Deleted!',
          text: 'User has been deleted.',
          icon: 'success',
          confirmButtonColor: '#DC0000',
        });
      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: err?.message || err || 'Failed to delete user',
          icon: 'error',
          confirmButtonColor: '#DC0000',
        });
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh' }}>

      {/* Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#111827' }}>
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {users.length} users
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={(showAddForm && !editingUser) ? <CloseIcon /> : <AddIcon />}
          onClick={() => {
            if (showAddForm && !editingUser) {
              handleCancel();
            } else {
              setEditingUser(null);
              setShowAddForm(true);
            }
          }}
          size="small"
          sx={{
            backgroundColor: '#DC0000',
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
          {(showAddForm && !editingUser) ? 'Cancel' : 'Add User'}
        </Button>
      </Stack>

      {/* Add/Edit User Form - Expandable */}
      <Collapse in={showAddForm}>
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)', border: '1px solid #E5E7EB' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="body1" fontWeight={500} color="text.secondary" mb={3}>
              {editingUser ? 'Edit User' : 'Add New User'}
            </Typography>
            <Formik
              enableReinitialize
              initialValues={{
                user_name: editingUser ? (editingUser.user_name || editingUser.name) : '',
                email: editingUser ? editingUser.email : '',
                password: '',
                role_id: editingUser ? (editingUser.role_id || editingUser.role) : 'editor',
              }}
              validationSchema={getValidationSchema(!!editingUser)}
              onSubmit={async (values, { resetForm }) => {
                if (editingUser) {
                  try {
                    await dispatch(updateUser({ id: editingUser._id, data: values })).unwrap();
                    await Swal.fire({
                      title: 'Success!',
                      text: 'User updated successfully!',
                      icon: 'success',
                      confirmButtonColor: '#DC0000',
                    });
                    setShowAddForm(false);
                    setEditingUser(null);
                    resetForm();
                  } catch (err) {
                    await Swal.fire({
                      title: 'Error!',
                      text: err?.message || err || 'Failed to update user',
                      icon: 'error',
                      confirmButtonColor: '#DC0000',
                    });
                  }
                } else {
                  try {
                    await dispatch(addUser(values)).unwrap();
                    await Swal.fire({
                      title: 'Success!',
                      text: 'User added successfully!',
                      icon: 'success',
                      confirmButtonColor: '#DC0000',
                    });
                    setShowAddForm(false);
                    resetForm();
                  } catch (err) {
                    await Swal.fire({
                      title: 'Error!',
                      text: err?.message || err || 'Failed to add user',
                      icon: 'error',
                      confirmButtonColor: '#DC0000',
                    });
                  }
                }
              }}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="body2" fontWeight={500} mb={1}>
                        User Name <span style={{ color: '#DC0000' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Enter user name"
                        name="user_name"
                        value={values.user_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.user_name && Boolean(errors.user_name)}
                        helperText={touched.user_name && errors.user_name}
                        variant="outlined"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="body2" fontWeight={500} mb={1}>
                        Email Address <span style={{ color: '#DC0000' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Enter email address"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        variant="outlined"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="body2" fontWeight={500} mb={1}>
                        Password <span style={{ color: '#DC0000' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"}
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        variant="outlined"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="body2" fontWeight={500} mb={1}>
                        Role <span style={{ color: '#DC0000' }}>*</span>
                      </Typography>
                      <TextField
                        select
                        fullWidth
                        name="role_id"
                        value={values.role_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.role_id && Boolean(errors.role_id)}
                        helperText={touched.role_id && errors.role_id}
                        variant="outlined"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                      >

                        {roles.map((role) => (
                          <MenuItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </MenuItem>
                        ))}
                      </TextField>
                      <FormHelperText sx={{ ml: 0 }}>
                        Admins have full access, Editors can manage portfolios
                      </FormHelperText>
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
                        {editingUser ? 'Update User' : 'Add User'}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={async () => {
                          const result = await Swal.fire({
                            title: editingUser ? 'Cancel Edit?' : 'Cancel?',
                            text: "All unsaved changes will be lost!",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#DC0000',
                            cancelButtonColor: '#6B7280',
                            confirmButtonText: 'Yes, cancel',
                            cancelButtonText: 'Continue',
                          });
                          if (result.isConfirmed) {
                            handleCancel();
                          }
                        }}
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

      {/* Users Table */}
      <TableContainer component={Card} sx={{ boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)', borderRadius: 3, border: '1px solid #E5E7EB' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F9FAFB' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>User</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Date Added</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }} align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => (
              <TableRow key={row._id || row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#F3F4F6', color: '#6B7280', fontSize: '1rem' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#111827' }}>
                      {row.user_name || row.name}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {row.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.role_id || row.role}
                    size="small"
                    icon={<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#9333EA', ml: 0.5 }} />}
                    sx={{
                      backgroundColor: '#F3E8FF',
                      color: '#9333EA',
                      fontWeight: 500,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      height: 24,
                      '& .MuiChip-icon': { margin: '0 4px 0 6px' }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : row.date}
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
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ListUsers;