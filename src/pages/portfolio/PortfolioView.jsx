import React, { useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    Chip,
    IconButton,
    CircularProgress,
    Stack,
    Grid
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { getPortfolioById } from '../../store/slices/portfolioSlice';
import DOMPurify from 'dompurify';

const PortfolioView = ({ open, onClose, id }) => {
    const dispatch = useDispatch();
    const { currentPortfolio, status, error } = useSelector((state) => state.portfolio);

    useEffect(() => {
        if (open && id) {
            dispatch(getPortfolioById(id));
        }
    }, [open, id, dispatch]);

    const isLoading = status === 'loading';

    if (!open) return null;

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            scroll="paper"
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div" fontWeight="bold">
                    {currentPortfolio?.title}
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                        padding: 0
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3, pt: 0 }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error" align="center">{error}</Typography>
                ) : currentPortfolio ? (
                    <Box>
                        {/* Main Thumbnail Image */}
                        {currentPortfolio.thumbnail_image && (
                            <Box
                                component="img"
                                sx={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: 400,
                                    objectFit: 'cover',
                                    borderRadius: 3,
                                    mb: 2
                                }}
                                src={`${import.meta.env.REACT_APP_BACKEND_BASE_URL}${currentPortfolio.thumbnail_image}`}
                                alt={currentPortfolio.title}
                            />
                        )}

                        {/* Meta Tags (Category & Date) */}
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                            {currentPortfolio.category && currentPortfolio.category.length > 0 && (
                                <Box>
                                    {currentPortfolio.category.map((cat, index) => (
                                        <Chip
                                            key={index}
                                            label={cat}
                                            sx={{
                                                bgcolor: '#FFEBEE',
                                                color: '#D32F2F',
                                                fontWeight: 500,
                                                borderRadius: 1,
                                                height: 28,
                                                mr: 1
                                            }}
                                        />
                                    ))}
                                </Box>
                            )}
                            <Typography variant="body2" color="text.secondary">
                                {formatDate(currentPortfolio.createdAt)}
                            </Typography>
                        </Stack>

                        {/* Text Sections */}
                        <Stack spacing={2}>
                            {currentPortfolio.the_challenge && (
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#111827' }}>
                                        Challenge
                                    </Typography>
                                    <Box
                                        sx={{
                                            '& p': { margin: '0 0 8px 0', lineHeight: 1.6, fontSize: '0.875rem', color: 'text.secondary' },
                                            '& p:last-child': { marginBottom: 0 },
                                            '& ul': { margin: '8px 0', paddingLeft: '24px', listStyleType: 'disc' },
                                            '& ol': { margin: '8px 0', paddingLeft: '24px', listStyleType: 'decimal' },
                                            '& li': { marginBottom: '4px', fontSize: '0.875rem', color: 'text.secondary', display: 'list-item' },
                                            '& h1, & h2, & h3': { marginTop: '12px', marginBottom: '8px', color: '#111827' },
                                            '& strong': { fontWeight: 600 },
                                            '& a': { color: '#DC0000', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }
                                        }}
                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentPortfolio.the_challenge) }}
                                    />
                                </Box>
                            )}

                            {currentPortfolio.our_solution && (
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#111827' }}>
                                        Solution
                                    </Typography>
                                    <Box
                                        sx={{
                                            '& p': { margin: '0 0 8px 0', lineHeight: 1.6, fontSize: '0.875rem', color: 'text.secondary' },
                                            '& p:last-child': { marginBottom: 0 },
                                            '& ul': { margin: '8px 0', paddingLeft: '24px', listStyleType: 'disc' },
                                            '& ol': { margin: '8px 0', paddingLeft: '24px', listStyleType: 'decimal' },
                                            '& li': { marginBottom: '4px', fontSize: '0.875rem', color: 'text.secondary', display: 'list-item' },
                                            '& h1, & h2, & h3': { marginTop: '12px', marginBottom: '8px', color: '#111827' },
                                            '& strong': { fontWeight: 600 },
                                            '& a': { color: '#DC0000', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }
                                        }}
                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentPortfolio.our_solution) }}
                                    />
                                </Box>
                            )}

                            {currentPortfolio.the_result && (
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#111827' }}>
                                        Result
                                    </Typography>
                                    <Box
                                        sx={{
                                            '& p': { margin: '0 0 8px 0', lineHeight: 1.6, fontSize: '0.875rem', color: 'text.secondary' },
                                            '& p:last-child': { marginBottom: 0 },
                                            '& ul': { margin: '8px 0', paddingLeft: '24px', listStyleType: 'disc' },
                                            '& ol': { margin: '8px 0', paddingLeft: '24px', listStyleType: 'decimal' },
                                            '& li': { marginBottom: '4px', fontSize: '0.875rem', color: 'text.secondary', display: 'list-item' },
                                            '& h1, & h2, & h3': { marginTop: '12px', marginBottom: '8px', color: '#111827' },
                                            '& strong': { fontWeight: 600 },
                                            '& a': { color: '#DC0000', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }
                                        }}
                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentPortfolio.the_result) }}
                                    />
                                </Box>
                            )}
                        </Stack>

                        {/* Gallery Section - Optional but included as data exists */}
                        {currentPortfolio.image_gallery && currentPortfolio.image_gallery.length > 0 && (
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#111827' }}>
                                    Gallery
                                </Typography>
                                <Grid container spacing={2}>
                                    {currentPortfolio.image_gallery.map((img, idx) => (
                                        <Grid item xs={6} md={4} key={idx}>
                                            <Box
                                                component="img"
                                                src={`${import.meta.env.REACT_APP_BACKEND_BASE_URL}${img}`}
                                                sx={{
                                                    width: '100%',
                                                    height: 120,
                                                    objectFit: 'cover',
                                                    borderRadius: 2,
                                                }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}

                    </Box>
                ) : (
                    <Typography align="center" color="text.secondary">No details available.</Typography>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PortfolioView;
