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
  Pagination,
  Stack,
  Table,
  TableSortLabel,
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
  ClearAll as ClearAllIcon,
  DeleteOutline as DeleteIcon,
  EditOutlined as EditIcon,
  FilterList as FilterListIcon,
  GridView as GridViewIcon,
  Search as SearchIcon,
  TableRows as TableRowsIcon,
  VisibilityOutlined as VisibilityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPortfolios, setFilter, setSearch, deletePortfolio, setPage, setSort, fetchCategories } from '../../store/slices/portfolioSlice';
import { useEffect, useState, useMemo } from 'react';
import PortfolioView from './PortfolioView';
import FilterComponent from '../../components/FilterComponent';
import Swal from 'sweetalert2';

const PortfolioList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: portfolios, status, search, filters, pagination, sort, tags } = useSelector((state) => state.portfolio);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewId, setViewId] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState({});
  const [tempFilterValues, setTempFilterValues] = useState({ title: '', category: '' });

  // Get categories with 'All Categories' option
  const categories = useMemo(() => {
    return ['All Categories', ...(tags || [])];
  }, [tags]);

  const handleView = (id) => {
    setViewId(id);
    setViewOpen(true);
  };

  const handleFilterClick = (event, column) => {
    setFilterAnchorEl({ ...filterAnchorEl, [column]: event.currentTarget });
    // Set temp value to current filter value
    setTempFilterValues({ ...tempFilterValues, [column]: filters[column] || '' });
  };

  const handleFilterClose = (column) => {
    setFilterAnchorEl({ ...filterAnchorEl, [column]: null });
  };

  const handleFilterInputChange = (column, value) => {
    setTempFilterValues({ ...tempFilterValues, [column]: value });
  };

  const handleFilterApply = (column) => {
    dispatch(setFilter({ key: column, value: tempFilterValues[column] }));
    handleFilterClose(column);
  };

  const handleFilterClear = (column) => {
    setTempFilterValues({ ...tempFilterValues, [column]: '' });
    dispatch(setFilter({ key: column, value: '' }));
    handleFilterClose(column);
  };

  const handleClearAllFilters = () => {
    // Clear search
    dispatch(setSearch(''));
    // Clear all filters
    dispatch(setFilter({ key: 'title', value: '' }));
    dispatch(setFilter({ key: 'category', value: '' }));
    dispatch(setFilter({ key: 'page', value: '' }));
    dispatch(setFilter({ key: 'tags', value: '' }));
    // Reset temp filter values
    setTempFilterValues({ title: '', category: '' });
    // Reset to page 1
    dispatch(setPage(1));
  };

  // Get unique values for autocomplete options
  const uniqueValues = useMemo(() => {
    const values = {
      title: new Set(),
      category: new Set(),
    };

    portfolios.forEach(item => {
      if (item.projectTitle || item.title) values.title.add(item.projectTitle || item.title);
      if (item.category) values.category.add(item.category);
    });

    return {
      title: Array.from(values.title).sort(),
      category: Array.from(values.category).sort(),
    };
  }, [portfolios]);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPortfolios());
  }, [dispatch, search, filters.category, filters.title, sort.key, sort.direction, pagination.page]);

  const displayData = portfolios || [];

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete this portfolio?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC0000',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      const res = await dispatch(deletePortfolio(id));
      if (res?.payload?.status === true || res?.type?.includes('fulfilled')) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Portfolio has been deleted.',
          icon: 'success',
          confirmButtonColor: '#DC0000',
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete portfolio.',
          icon: 'error',
          confirmButtonColor: '#DC0000',
        });
      }
    }
  };

  const hasActiveFilters =
    search?.trim() ||
    filters.title?.trim() ||
    filters.category?.trim();


  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh' }}>

      {/* Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#111827' }}>
            Portfolio Projects
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {portfolios?.length || 0} projects
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
            size="small"
            sx={{
              backgroundColor: '#DC0000',
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
            Add Portfolio
          </Button>
        </Stack>
      </Stack>

      {/* Filter Card */}
      <Card sx={{ p: 3, mb: 3, boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)', borderRadius: 3, border: '1px solid #E5E7EB' }}>
        <Stack spacing={3}>
          {/* Search Bar */}
          <TextField
            fullWidth
            name="search"
            placeholder="Search by title, category, or description..."
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
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
                  onClick={() => dispatch(setFilter({ key: 'category', value: cat }))}
                  sx={{
                    backgroundColor: (filters.category === cat) || (cat === 'All Categories' && !filters.category) ? '#DC0000' : '#F3F4F6',
                    color: (filters.category === cat) || (cat === 'All Categories' && !filters.category) ? 'white' : '#4B5563',
                    fontWeight: 500,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: (filters.category === cat) || (cat === 'All Categories' && !filters.category) ? '#B30000' : '#E5E7EB',
                    },
                    border: 'none',
                    height: 32,
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Card>

      {hasActiveFilters && (
        <Stack direction="row" mb={2} justifyContent="flex-end">
          <Button
            startIcon={<ClearAllIcon />}
            onClick={handleClearAllFilters}
            size="small"
            sx={{
              textTransform: 'none',
              backgroundColor: '#DC0000',
              color: 'white',
              px: 2,
              py: 0.75,
              borderRadius: 2,
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#B30000',
              },
            }}
          >
            Clear All Filters
          </Button>
        </Stack>
      )}


      {/* Projects Table */}
      <TableContainer component={Card} sx={{ boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)', borderRadius: 3, border: '1px solid #E5E7EB' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F9FAFB' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>Thumbnail</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TableSortLabel
                    active={sort?.key === 'title'}
                    direction={sort?.key === 'title' ? sort.direction : 'asc'}
                    onClick={() => dispatch(setSort({ key: 'title' }))}
                  >
                    Title
                  </TableSortLabel>
                  <IconButton
                    size="small"
                    onClick={(e) => handleFilterClick(e, 'title')}
                    sx={{ color: filters.title ? '#DC0000' : '#9CA3AF', padding: 0.5 }}
                  >
                    <FilterListIcon fontSize="small" />
                  </IconButton>
                  <FilterComponent
                    open={Boolean(filterAnchorEl.title)}
                    anchorEl={filterAnchorEl.title}
                    onClose={() => handleFilterClose('title')}
                    title="Filter by Title"
                    value={tempFilterValues.title}
                    onChange={(e) => handleFilterInputChange('title', e.target.value)}
                    onClear={() => handleFilterClear('title')}
                    onApply={() => handleFilterApply('title')}
                    placeholder="Select title…"
                    options={uniqueValues.title}
                  />
                </Box>
              </TableCell>

              <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TableSortLabel
                    active={sort?.key === 'category'}
                    direction={sort?.key === 'category' ? sort.direction : 'asc'}
                    onClick={() => dispatch(setSort({ key: 'category' }))}
                  >
                    Category
                  </TableSortLabel>
                  <IconButton
                    size="small"
                    onClick={(e) => handleFilterClick(e, 'category')}
                    sx={{ color: filters.category ? '#DC0000' : '#9CA3AF', padding: 0.5 }}
                  >
                    <FilterListIcon fontSize="small" />
                  </IconButton>
                  <FilterComponent
                    open={Boolean(filterAnchorEl.category)}
                    anchorEl={filterAnchorEl.category}
                    onClose={() => handleFilterClose('category')}
                    title="Filter by Category"
                    value={tempFilterValues.category}
                    onChange={(e) => handleFilterInputChange('category', e.target.value)}
                    onClear={() => handleFilterClear('category')}
                    onApply={() => handleFilterApply('category')}
                    placeholder="Select category…"
                    options={categories.filter(cat => cat !== 'All Categories')}
                    freeSolo={false}
                  />
                </Box>
              </TableCell>


              <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>
                <TableSortLabel
                  active={sort?.key === 'createdAt'}
                  direction={sort?.key === 'createdAt' ? sort.direction : 'asc'}
                  onClick={() => dispatch(setSort({ key: 'createdAt' }))}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }} align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {status === 'loading' ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Loading...</TableCell>
              </TableRow>
            ) : displayData.map((row) => {
              return (
                <TableRow key={row._id || row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Box
                      component="img"
                      src={row.thumbnail_image ? import.meta.env.REACT_APP_BACKEND_BASE_URL + row.thumbnail_image : ''}
                      alt={row.projectTitle || row.title}
                      sx={{ width: 60, height: 58, objectFit: 'cover', borderRadius: 2 }}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 220 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: '#111827',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={row.projectTitle || row.title}
                    >
                      {row.projectTitle || row.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.category}
                      size="small"
                      sx={{
                        bgcolor: '#FFEBEE',
                        color: '#D32F2F',
                        fontWeight: 500,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        height: 24
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(row.createdAt || row.date).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" sx={{ color: '#EF4444' }} onClick={() => handleView(row._id || row.id)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: '#22C55E' }}
                        onClick={() => navigate(`/portfolio/edit/${row._id || row.id}`)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small" sx={{ color: '#EF4444' }}
                        onClick={() => handleDelete(row._id || row.id)}
                      >
                        <DeleteIcon fontSize="small" /></IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {status !== 'loading' && displayData.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography color="text.secondary">No projects found.</Typography>
          </Box>
        )}
        <Stack alignItems="center" py={3}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={(event, value) => dispatch(setPage(value))}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
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

      <PortfolioView
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        id={viewId}
      />
    </Container>
  );
};

export default PortfolioList;