import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, IconButton, Chip, Stack, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { parseFrontmatter, estimateReadingTime } from '../utils/markdown';

const NotePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [content, setContent] = useState<string>('');
    const [metadata, setMetadata] = useState<any>({});
    const [readingTime, setReadingTime] = useState<number>(0);
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
                setReadingTime(estimateReadingTime(content));
            })
            .catch(() => {
                setContent('# Note not found');
            })
            .finally(() => setLoading(false));
    }, [slug]);

    return (
        <Box sx={{ width: '100%', maxWidth: 780, mx: 'auto', minWidth: 0, pb: 8, overflowX: 'clip' }}>
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
                        <Box
                            sx={{
                                mb: 5,
                                pb: 4,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Typography
                                variant="h4"
                                fontWeight={700}
                                sx={{
                                    mb: 1.5,
                                    fontSize: { xs: '1.5rem', sm: '1.85rem' },
                                    overflowWrap: 'anywhere',
                                    wordBreak: 'break-word',
                                    letterSpacing: '-0.02em',
                                    lineHeight: 1.25,
                                }}
                            >
                                {metadata.title}
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                sx={{ mb: 2, flexWrap: 'wrap', opacity: 0.8, minWidth: 0 }}
                                useFlexGap
                            >
                                {metadata.date && (
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(metadata.date).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Typography>
                                )}
                                {readingTime > 0 && (
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {readingTime} min read
                                        </Typography>
                                    </Stack>
                                )}
                            </Stack>

                            {metadata.tags?.length > 0 && (
                                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', minWidth: 0 }} useFlexGap>
                                    {metadata.tags.map((tag: string) => (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            size="small"
                                            variant="outlined"
                                            sx={{ maxWidth: '100%', '& .MuiChip-label': { overflowWrap: 'anywhere' } }}
                                        />
                                    ))}
                                </Stack>
                            )}
                        </Box>
                    )}

                    <MarkdownRenderer content={content} />
                </>
            )}
        </Box>
    );
};

export default NotePage;
