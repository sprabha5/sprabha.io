import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    main: '#B39DDB',
                },
                secondary: {
                    main: '#9FA8DA',
                },
                background: {
                    default: '#0a0e1a',
                    paper: 'rgba(15, 20, 40, 0.85)',
                },
                text: {
                    primary: '#e8e4f0',
                    secondary: 'rgba(200, 195, 215, 0.7)',
                },
                divider: 'rgba(180, 160, 220, 0.15)',
            },
        },
        dark: {
            palette: {
                primary: {
                    main: '#D0BCFF',
                },
                secondary: {
                    main: '#CCC2DC',
                },
                background: {
                    default: '#060a14',
                    paper: 'rgba(12, 16, 30, 0.85)',
                },
                text: {
                    primary: '#e8e4f0',
                    secondary: 'rgba(200, 195, 215, 0.65)',
                },
                divider: 'rgba(180, 160, 220, 0.12)',
            }
        }
    },
    typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
        h1: { fontWeight: 700, letterSpacing: '-0.03em' },
        h2: { fontWeight: 700, letterSpacing: '-0.025em' },
        h3: { fontWeight: 700, letterSpacing: '-0.02em' },
        h4: { fontWeight: 600, letterSpacing: '-0.02em' },
        h5: { fontWeight: 600, letterSpacing: '-0.015em' },
        h6: { fontWeight: 600, letterSpacing: '-0.01em' },
        subtitle1: { fontWeight: 500, letterSpacing: '-0.01em' },
        subtitle2: { fontWeight: 500, letterSpacing: '-0.005em' },
        body1: { letterSpacing: '-0.01em', lineHeight: 1.65 },
        body2: { letterSpacing: '-0.005em', lineHeight: 1.6 },
        caption: { letterSpacing: '0em' },
        button: {
            textTransform: 'none',
            fontWeight: 500,
            letterSpacing: '-0.01em',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                },
            },
        },
    },
});

export default theme;
