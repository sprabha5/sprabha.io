import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, IconButton, Paper, Chip, Stack, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReactMarkdown from 'react-markdown';
import { parseFrontmatter } from '../utils/markdown';

const NotePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [content, setContent] = useState<string>('');
    const [metadata, setMetadata] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/content/notes/${slug}.md`)
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
                setContent('# Note not found');
            })
            .finally(() => setLoading(false));
    }, [slug]);

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', pb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/notes')} sx={{ mr: 2 }} aria-label="back">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="body2" color="text.secondary">Back to Notes</Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {metadata.title && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
                                {metadata.title}
                            </Typography>

                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                {metadata.date && (
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(metadata.date).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Typography>
                                )}
                                <Stack direction="row" spacing={1}>
                                    {metadata.tags?.map((tag: string) => (
                                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                                    ))}
                                </Stack>
                            </Stack>
                        </Box>
                    )}

                    <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, bgcolor: 'background.paper', borderRadius: 4, '& img': { maxWidth: '100%', borderRadius: 2 } }}>
                        <Box sx={{ typography: 'body1', '& h1, & h2, & h3, & h4': { mt: 4, mb: 2, fontWeight: 600 } }}>
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

export default NotePage;
