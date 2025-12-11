import React from 'react';
import {
    Box,
    Button,
    Popover,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';

const FilterComponent = ({
    open,
    anchorEl,
    onClose,
    title,
    value,
    onChange,
    onClear,
    onApply,
    placeholder = 'Select value…',
    options = [],
}) => {

    // Ensure unique options
    const uniqueOptions = Array.from(new Set(options));

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            slotProps={{
                paper: {
                    sx: {
                        mt: 1,
                        p: 2,
                        width: 240,
                        borderRadius: 2,
                        border: '1px solid #E5E7EB',
                        boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.08), 0px 4px 12px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        backgroundColor: '#FAFAFA',
                    },
                },
            }}
        >
            {/* Title */}
            <Box sx={{ textAlign: 'center' }}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        color: '#1F2937',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                    }}
                >
                    {title}
                </Typography>
                {value && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: '#6B7280',
                            fontSize: '0.7rem',
                            fontStyle: 'italic',
                            display: 'block',
                            mt: 0.5,
                        }}
                    >
                        Current Filter: "{value}"
                    </Typography>
                )}
            </Box>

            {/* Dropdown */}
            <FormControl fullWidth size="small">
                <InputLabel>{placeholder}</InputLabel>
                <Select
                    value={value || ''}
                    onChange={(e) => onChange(e)}
                    label={placeholder}
                >
                    {uniqueOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Actions */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 0.5 }}>
                <Button
                    size="small"
                    variant="contained"
                    onClick={onApply}
                    fullWidth
                    sx={{
                        textTransform: 'none',
                        bgcolor: '#DC0000',
                        fontSize: '0.875rem',
                        py: 0.75,
                        boxShadow: 'none',
                        '&:hover': {
                            bgcolor: '#B30000',
                            boxShadow: '0px 2px 8px rgba(220, 0, 0, 0.25)',
                        },
                    }}
                >
                    Apply Filter
                </Button>
                <Button
                    size="small"
                    variant="outlined"
                    onClick={onClear}
                    fullWidth
                    sx={{
                        textTransform: 'none',
                        color: '#6B7280',
                        borderColor: '#D1D5DB',
                        fontSize: '0.875rem',
                        py: 0.75,
                        '&:hover': {
                            borderColor: '#9CA3AF',
                            backgroundColor: '#F9FAFB',
                        },
                    }}
                >
                    Clear
                </Button>
            </Box>
        </Popover>
    );
};

export default FilterComponent;
