import { createTheme } from '@mui/material/styles';

// Create a custom theme with Inter font for all typography
const theme = createTheme({
    typography: {
        fontFamily: '"Inter", sans-serif',
        // Base font size: 16px
        fontSize: 16,
        // Individual component typography
        h1: {
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500, // Medium for headings
        },
        h2: {
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500, // Medium for headings
        },
        h3: {
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500, // Medium for headings
        },
        h4: {
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600, // Semibold for h4
        },
        h5: {
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500, // Medium for headings
        },
        h6: {
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600, // Semibold for h6
        },
        subtitle1: {
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500, // Medium for labels
        },
        subtitle2: {
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500, // Medium for labels
        },
        body1: {
            fontFamily: '"Inter", sans-serif',
            fontWeight: 400, // Normal for body text
            lineHeight: 1.6, // Better readability
        },
        body2: {
            fontFamily: '"Inter", sans-serif',
            fontWeight: 400, // Normal for body text
            lineHeight: 1.6, // Better readability
        },
        button: {
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500, // Medium for buttons
            textTransform: 'none', // Prevents uppercase transformation for better readability
        },
        caption: {
            fontFamily: '"Inter", sans-serif',
            fontWeight: 400, // Normal for captions
        },
        overline: {
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500, // Medium for overline
        },
    },
    components: {
        // Override all MUI components to use Inter font
        MuiCssBaseline: {
            styleOverrides: `
        * {
          font-family: "Inter", sans-serif !important;
        }
        body {
          font-family: "Inter", sans-serif;
          font-size: 16px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `,
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& input, & textarea': {
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '16px',
                    },
                    '& label': {
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500, // Medium for labels
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontWeight: 500, // Medium for labels
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500, // Medium for buttons
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400, // Normal for menu items
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400, // Normal for table cells
                },
                head: {
                    fontWeight: 500, // Medium for table headers
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500, // Medium for chips
                },
            },
        },
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    fontFamily: '"Inter", sans-serif',
                },
                option: {
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400, // Normal for options
                },
            },
        },
    },
});

export default theme;
