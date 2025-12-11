import React from 'react';
import {
    Box,
    Button,
    Popover,
    Typography,
    TextField,
    Autocomplete,
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
    placeholder = 'Select or enter value…',
    options = [],
    freeSolo = true, // set to false if you want to disallow typing
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
            </Box>

            {/* Autocomplete Input */}
            <Autocomplete
                freeSolo={freeSolo}
                options={uniqueOptions}
                value={value || null}
                inputValue={value || ''}
                onChange={(event, newValue) => {

                    onChange({ target: { value: newValue || '' } });
                }}
                onInputChange={(event, newInputValue, reason) => {
                    if (reason === 'input' || reason === 'clear') {
                        onChange({ target: { value: newInputValue || '' } });
                    }
                }}
                getOptionLabel={(option) =>
                    typeof option === 'string' ? option : option?.label || ''
                }
                isOptionEqualToValue={(option, val) =>
                    typeof option === 'string'
                        ? option === val
                        : option?.value === val?.value
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size="small"
                        placeholder={placeholder}
                        autoFocus
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'white',
                                borderRadius: 1.5,
                                '& fieldset': { borderColor: '#D1D5DB', borderWidth: '1.5px' },
                                '&:hover fieldset': { borderColor: '#9CA3AF' },
                                '&.Mui-focused fieldset': { borderColor: '#DC0000', borderWidth: '2px' },
                            },
                            '& .MuiOutlinedInput-input': { fontSize: '0.875rem', padding: '8px 12px' },
                        }}
                    />
                )}
                fullWidth
                size="small"
                sx={{
                    '& .MuiAutocomplete-popupIndicator': { color: '#6B7280' },
                    '& .MuiAutocomplete-clearIndicator': { color: '#9CA3AF' },
                }}
            />

            {/* Actions */}
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, mt: 0.5 }}>
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
