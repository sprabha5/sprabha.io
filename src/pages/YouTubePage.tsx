import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, IconButton, Paper, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { YouTubeItem } from '../components/VideoCard';
import { fetchAllYouTubeVideos } from '../utils/youtube';

const YouTubePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [video, setVideo] = useState<YouTubeItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isCancelled = false;

        fetchAllYouTubeVideos()
            .then((videos) => {
                if (isCancelled) return;
                const selectedVideo = videos.find((item) => item.id === (id || '')) || null;
                setVideo(selectedVideo);
            })
            .catch((err: unknown) => {
                if (isCancelled) return;
                const message = err instanceof Error ? err.message : 'Failed to load YouTube video.';
                setError(message);
            })
            .finally(() => {
                if (isCancelled) return;
                setLoading(false);
            });

        return () => {
            isCancelled = true;
        };
    }, [id]);

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', pb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/youtube')} sx={{ mr: 2 }} aria-label="back">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="body2" color="text.secondary">Back to Videos</Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            ) : video ? (
                <Box>
                    <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 3, mb: 4, bgcolor: 'black' }}>
                        <Box
                            sx={{
                                position: 'relative',
                                paddingBottom: '56.25%', // 16:9 aspect ratio
                                height: 0,
                                overflow: 'hidden',
                                '& iframe': {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                },
                            }}
                        >
                            <iframe
                                src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </Box>
                    </Paper>

                    <Typography variant="h5" fontWeight={700} sx={{ mb: 1.5, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                        {video.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                        {new Date(video.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </Typography>

                    {video.description && (
                        <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                {video.description}
                            </Typography>
                        </Paper>
                    )}
                </Box>
            ) : (
                <Typography variant="h5" color="error">
                    Video not found
                </Typography>
            )}
        </Box>
    );
};

export default YouTubePage;
