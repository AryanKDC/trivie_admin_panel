import React, { useState } from 'react';
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

// Validation Schema Generator
const getValidationSchema = (isEditing) => Yup.object({
  fullName: Yup.string().required('Full Name is required'),
  email: Yup.string().email('Invalid email address').required('Email Address is required'),
  password: isEditing 
    ? Yup.string().min(6, 'Password must be at least 6 characters') // Optional on edit
    : Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'), // Required on add
  role: Yup.string().required('Role is required'),
});

// Mock Data
const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Admin',
    date: 'Jan 1, 2024',
  }
];

const roles = ['Admin', 'Editor'];

const ListUsers = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Handle Edit Click
  const handleEditClick = (user) => {
    setEditingUser(user);
    setShowAddForm(true);
  };

  // Handle Form Cancel
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingUser(null);
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
            {mockUsers.length} users
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={showAddForm ? <CloseIcon /> : <AddIcon />}
          onClick={() => {
            if (showAddForm) handleCancel();
            else setShowAddForm(true);
          }}
          sx={{
            backgroundColor: '#DC0000', // Red color
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            borderRadius: 2,
            minWidth: 120,
            '&:hover': {
              backgroundColor: '#B30000',
              boxShadow: 'none',
            },
          }}
        >
          {showAddForm ? 'Cancel' : 'Add User'}
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
                    enableReinitialize // Important for loading editingUser data
                    initialValues={{
                        fullName: editingUser ? editingUser.name : '',
                        email: editingUser ? editingUser.email : '',
                        password: '', // Don't pre-fill password
                        role: editingUser ? editingUser.role : 'Editor',
                    }}
                    validationSchema={getValidationSchema(!!editingUser)}
                    onSubmit={(values, { resetForm }) => {
                        if (editingUser) {
                            console.log('Updated User Data:', values);
                            alert('User updated! check console');
                        } else {
                            console.log('New User Data:', values);
                            alert('User added! check console');
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
                                        Full Name <span style={{ color: '#DC0000' }}>*</span>
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter full name"
                                        name="fullName"
                                        value={values.fullName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.fullName && Boolean(errors.fullName)}
                                        helperText={touched.fullName && errors.fullName}
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
                                        name="role"
                                        value={values.role}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.role && Boolean(errors.role)}
                                        helperText={touched.role && errors.role}
                                        variant="outlined"
                                        displayEmpty
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                                    >
                                        {roles.map((role) => (
                                            <MenuItem key={role} value={role}>{role}</MenuItem>
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
            {mockUsers.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#F3F4F6', color: '#6B7280', fontSize: '1rem' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#111827' }}>
                      {row.name}
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
                    label={row.role}
                    size="small"
                    icon={<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#9333EA', ml: 0.5 }} />}
                    sx={{
                      backgroundColor: '#F3E8FF', // Light purple
                      color: '#9333EA', // Purple text
                      fontWeight: 500,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      height: 24,
                      '& .MuiChip-icon': { margin: '0 4px 0 6px' } // Adjust dot spacing
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

export default ListUsers;