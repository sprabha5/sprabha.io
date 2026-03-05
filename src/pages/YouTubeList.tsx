import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, CircularProgress } from '@mui/material';
import VideoCard from '../components/VideoCard';
import type { YouTubeItem } from '../components/VideoCard';
import { fetchAllYouTubeVideos } from '../utils/youtube';

const YouTubeList: React.FC = () => {
    const navigate = useNavigate();
    const [youtubeData, setYoutubeData] = useState<YouTubeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAllYouTubeVideos()
            .then((items) => {
                setYoutubeData(items);
            })
            .catch((err: unknown) => {
                const message = err instanceof Error ? err.message : 'Failed to load YouTube videos.';
                setError(message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <Box sx={{ pb: 8 }}>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: 'minmax(0, 1fr)',
                                    sm: 'repeat(2, minmax(0, 1fr))',
                                    md: 'repeat(3, minmax(0, 1fr))',
                                },
                                gap: { xs: 2, md: 3 },
                            }}
                        >
                            {youtubeData.map((video) => (
                                <Box key={video.id} sx={{ minWidth: 0 }}>
                                    <VideoCard video={video} onClick={(id) => navigate(`/youtube/${id}`)} />
                                </Box>
                            ))}
                            {youtubeData.length === 0 && (
                                <Box sx={{ gridColumn: '1 / -1' }}>
                                    <Typography color="text.secondary">No videos available.</Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default YouTubeList;
