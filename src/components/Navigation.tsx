import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    BottomNavigation,
    BottomNavigationAction,
    useMediaQuery,
    useTheme,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
} from '@mui/material';
import NoteIcon from '@mui/icons-material/Note';
import ArticleIcon from '@mui/icons-material/Article';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PersonIcon from '@mui/icons-material/Person';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const drawerWidth = 80; // Navigation Rail width
const contentMaxWidth = 1200;

const navItems = [
    { label: 'Home', path: '/', icon: <PersonIcon /> },
    { label: 'Notes', path: '/notes', icon: <NoteIcon /> },
    { label: 'Blog', path: '/blog', icon: <ArticleIcon /> },
    { label: 'YouTube', path: '/youtube', icon: <PlayCircleIcon /> },
];

interface NavigationProps {
    children: React.ReactNode;
}

const Navigation: React.FC<NavigationProps> = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const location = useLocation();

    const normalizePath = (path: string) => {
        const normalized = path.replace(/\/+$/, '');
        return normalized === '' ? '/' : normalized;
    };

    const isPathSelected = (targetPath: string) => {
        const current = normalizePath(location.pathname);
        const target = normalizePath(targetPath);

        if (target === '/') {
            return current === '/';
        }

        return current === target || current.startsWith(`${target}/`);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const activeTab = navItems.findIndex((item) => isPathSelected(item.path));
    const resolvedActiveTab = activeTab === -1 ? 0 : activeTab;
    const currentLabel = resolvedActiveTab === 0 ? 'Shashi Prabha' : navItems[resolvedActiveTab].label;

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* App Bar (Mainly for Mobile or title) */}
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: isMobile ? 1 : 0,
                    borderBottom: isMobile ? 'none' : '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Toolbar disableGutters sx={{ px: { xs: 3, sm: 6, md: 8 } }}>
                    <Box sx={{ width: '100%', maxWidth: contentMaxWidth, mx: 'auto', display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" noWrap component="div" fontWeight={600} sx={{ minWidth: 0, flexGrow: 1 }}>
                            {currentLabel}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                            <IconButton
                                size="small"
                                color="inherit"
                                component="a"
                                href="https://www.linkedin.com/in/shashiprabha08/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn profile"
                            >
                                <LinkedInIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                color="inherit"
                                component="a"
                                href="https://github.com/sprabha5"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub profile"
                            >
                                <GitHubIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Desktop Navigation Rail */}
            {!isMobile && (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRight: 'none',
                            bgcolor: 'background.paper',
                        },
                    }}
                >
                    <List sx={{ width: '100%', px: 1 }}>
                        {navItems.map((item) => {
                            const selected = isPathSelected(item.path);
                            return (
                                <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                                    <ListItemButton
                                        onClick={() => handleNavigation(item.path)}
                                        selected={selected}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '16px',
                                            py: 1,
                                            bgcolor: selected ? 'secondary.container' : 'transparent',
                                            '&.Mui-selected': {
                                                bgcolor: 'rgba(103, 80, 164, 0.12)', // Primary colored background
                                                '&:hover': {
                                                    bgcolor: 'rgba(103, 80, 164, 0.16)',
                                                },
                                            },
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                color: selected ? 'primary.main' : 'text.secondary',
                                                mb: 0.5,
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontSize: '0.65rem',
                                                fontWeight: selected ? 600 : 400,
                                                color: selected ? 'primary.main' : 'text.secondary',
                                            }}
                                        >
                                            {item.label}
                                        </Typography>
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Drawer>
            )}

            {/* Main Content Area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    px: { xs: 3, sm: 6, md: 8 },
                    pt: { xs: 10, sm: 11 }, // offset for appbar
                    pb: { xs: 10, sm: 3 }, // offset for bottom nav on mobile
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Box sx={{ width: '100%', maxWidth: contentMaxWidth, mx: 'auto' }}>
                    {children}
                </Box>
            </Box>

            {/* Mobile Bottom Navigation */}
            {isMobile && (
                <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }}>
                    <BottomNavigation
                        showLabels
                        value={resolvedActiveTab}
                        onChange={(_, newValue) => {
                            handleNavigation(navItems[newValue].path);
                        }}
                        sx={{
                            bgcolor: 'background.paper',
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            height: 64, // Material Design default usually is 56 or 80 (with labels)
                        }}
                    >
                        {navItems.map((item) => (
                            <BottomNavigationAction
                                key={item.label}
                                label={item.label}
                                icon={item.icon}
                                sx={{
                                    color: 'text.secondary',
                                    '&.Mui-selected': {
                                        color: 'primary.main',
                                    },
                                }}
                            />
                        ))}
                    </BottomNavigation>
                </Box>
            )}
        </Box>
    );
};

export default Navigation;
