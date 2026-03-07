import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, IconButton, Paper, Chip, Stack, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReactMarkdown from 'react-markdown';
import { parseFrontmatter } from '../utils/markdown';

const BlogPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [content, setContent] = useState<string>('');
    const [metadata, setMetadata] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/content/blog/${slug}.md`)
            .then(res => {
                if (!res.ok) throw new Error('Not found');
                return res.text();
            })
            .then(text => {
                const { data, content } = parseFrontmatter(text);
                setMetadata(data);
                setContent(content);
            })
            .catch(() => {
                setContent('# Blog post not found');
            })
            .finally(() => setLoading(false));
    }, [slug]);

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', minWidth: 0, pb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/blog')} sx={{ mr: 2 }} aria-label="back">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="body2" color="text.secondary">Back to Blog</Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {metadata.title && (
                        <Box sx={{ mb: 4 }}>
                            <Typography
                                variant="h2"
                                fontWeight={800}
                                sx={{ mb: 2, fontSize: { xs: '2rem', sm: '3rem' }, overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                            >
                                {metadata.title}
                            </Typography>

                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3, flexWrap: 'wrap' }} useFlexGap>
                                {metadata.date && (
                                    <Typography variant="subtitle1" color="primary" fontWeight={500}>
                                        {new Date(metadata.date).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Typography>
                                )}
                            </Stack>
                            <Stack direction="row" spacing={1} sx={{ mb: 4, flexWrap: 'wrap' }} useFlexGap>
                                {metadata.tags?.map((tag: string) => (
                                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                                ))}
                            </Stack>
                        </Box>
                    )}

                    <Paper elevation={0} sx={{ p: 0, bgcolor: 'transparent' }}>
                        <Box
                            sx={{
                                typography: 'body1',
                                lineHeight: 1.8,
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                minWidth: 0,
                                '& h1, & h2, & h3, & h4': { mt: 5, mb: 2, fontWeight: 700, overflowWrap: 'anywhere', wordBreak: 'break-word' },
                                '& p, & li, & a, & blockquote': { overflowWrap: 'anywhere', wordBreak: 'break-word' },
                                '& pre': { maxWidth: '100%', overflowX: 'auto' },
                                '& code': { overflowWrap: 'anywhere', wordBreak: 'break-word' },
                                '& table': { display: 'block', maxWidth: '100%', overflowX: 'auto' },
                                '& img': { maxWidth: '100%', height: 'auto', borderRadius: 2 },
                            }}
                        >
                            <ReactMarkdown>
                                {content}
                            </ReactMarkdown>
                        </Box>
                    </Paper>
                </>
            )}
        </Box>
    );
};

export default BlogPage;
