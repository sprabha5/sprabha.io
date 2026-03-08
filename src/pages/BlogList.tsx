import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Stack, Chip, CircularProgress, Divider } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { parseFrontmatter, estimateReadingTime } from '../utils/markdown';

interface BlogPost {
    slug: string;
    title: string;
    date: string;
    tags: string[];
    readingTime: number;
}

const BlogList: React.FC = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/content/blog/index.json')
            .then(res => res.json())
            .then(async (files: string[]) => {
                const posts = await Promise.all(
                    files.map(async (file) => {
                        const res = await fetch(`/content/blog/${file}`);
                        const text = await res.text();
                        const { data, content } = parseFrontmatter(text);
                        const slug = file.replace(/\.md$/, '');
                        return {
                            slug,
                            title: data.title || slug,
                            date: data.date || new Date().toISOString(),
                            tags: data.tags || [],
                            readingTime: estimateReadingTime(content),
                        } as BlogPost;
                    })
                );
                posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setBlogs(posts);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <Box>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box>
                    {blogs.map((post, idx) => (
                        <React.Fragment key={post.slug}>
                            <Box
                                onClick={() => navigate(`/blog/${post.slug}`)}
                                sx={{
                                    py: 3,
                                    px: 1,
                                    cursor: 'pointer',
                                    borderRadius: 2,
                                    transition: 'background-color 0.2s ease',
                                    '&:hover': { bgcolor: 'action.hover' },
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    sx={{
                                        mb: 0.5,
                                        lineHeight: 1.35,
                                        fontSize: { xs: '1.15rem', sm: '1.2rem' },
                                        overflowWrap: 'anywhere',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {post.title}
                                </Typography>

                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.75, opacity: 0.6 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                                        {new Date(post.date).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </Typography>
                                    <Stack direction="row" alignItems="center" spacing={0.3}>
                                        <AccessTimeIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                                            {post.readingTime} min
                                        </Typography>
                                    </Stack>
                                </Stack>

                                {post.tags.length > 0 && (
                                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                                        {post.tags.map((tag) => (
                                            <Chip
                                                key={tag}
                                                label={tag}
                                                size="small"
                                                sx={{
                                                    height: 22,
                                                    fontSize: '0.78rem',
                                                    fontWeight: 500,
                                                    borderRadius: '6px',
                                                    bgcolor: 'primary.main',
                                                    color: 'primary.contrastText',
                                                    opacity: 0.85,
                                                    '& .MuiChip-label': { px: 0.75 },
                                                }}
                                            />
                                        ))}
                                    </Stack>
                                )}
                            </Box>
                            {idx < blogs.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                    {blogs.length === 0 && (
                        <Typography color="text.secondary">No blog posts found.</Typography>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default BlogList;
