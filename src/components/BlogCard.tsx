import React from 'react';
import { Card, CardContent, Typography, CardActionArea, Stack, Chip, Box, CardMedia } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export interface BlogItem {
    slug: string;
    title: string;
    date: string;
    tags: string[];
    excerpt?: string;
    image?: string;
    readingTime?: number;
}

interface BlogCardProps {
    post: BlogItem;
    onClick: (slug: string) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
    return (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                width: '100%',
                minWidth: 0,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                    borderColor: 'primary.main',
                },
            }}
        >
            <CardActionArea
                onClick={() => onClick(post.slug)}
                sx={{
                    height: '100%',
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                }}
            >
                {post.image && (
                    <CardMedia
                        component="img"
                        image={post.image}
                        alt={`${post.title} image`}
                        sx={{
                            width: '100%',
                            aspectRatio: '16 / 9',
                            objectFit: 'cover',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                        }}
                    />
                )}
                <CardContent sx={{ flexGrow: 1, width: '100%', minWidth: 0, p: { xs: 2, sm: 2.5 } }}>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            overflowWrap: 'anywhere',
                            wordBreak: 'break-word',
                            lineHeight: 1.3,
                            letterSpacing: '-0.01em',
                        }}
                    >
                        {post.title}
                    </Typography>

                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5, opacity: 0.7 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            {new Date(post.date).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </Typography>
                        {post.readingTime && (
                            <Stack direction="row" alignItems="center" spacing={0.3}>
                                <AccessTimeIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                    {post.readingTime} min
                                </Typography>
                            </Stack>
                        )}
                    </Stack>

                    <Box sx={{ mt: 'auto' }}>
                        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                            {post.tags.map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    size="small"
                                    sx={{
                                        maxWidth: '100%',
                                        borderRadius: '6px',
                                        fontSize: '0.7rem',
                                        fontWeight: 500,
                                        height: 24,
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        opacity: 0.85,
                                        '& .MuiChip-label': {
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            px: 1,
                                        },
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default BlogCard;
