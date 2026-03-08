import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea, Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export interface YouTubeItem {
    id: string;
    title: string;
    description: string;
    date: string;
    thumbnail: string;
}

interface VideoCardProps {
    video: YouTubeItem;
    onClick: (id: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <CardActionArea onClick={() => onClick(video.id)} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="180"
                        image={video.thumbnail}
                        alt={video.title}
                        sx={{ objectFit: 'cover' }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'rgba(0,0,0,0.6)',
                            borderRadius: '50%',
                            width: 48,
                            height: 48,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <PlayArrowIcon sx={{ color: 'white', fontSize: 32 }} />
                    </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{ fontWeight: 600, mb: 0.75, fontSize: { xs: '1.1rem', sm: '1.15rem' }, lineHeight: 1.3 }}
                    >
                        {video.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1.5, fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                        {video.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" display="block" sx={{ mt: 'auto', fontSize: '0.9rem' }}>
                        {new Date(video.date).toLocaleDateString()}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default VideoCard;
