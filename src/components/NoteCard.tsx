import React from 'react';
import { Card, CardContent, Typography, CardActionArea, Stack, Chip, Box } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';

export interface NoteItem {
    slug: string;
    title: string;
    date: string;
    tags: string[];
    pinned?: boolean;
}

interface NoteCardProps {
    note: NoteItem;
    onClick: (slug: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onClick }) => {
    return (
        <Card variant="outlined" sx={{ height: '100%', borderColor: note.pinned ? 'primary.main' : 'divider' }}>
            <CardActionArea onClick={() => onClick(note.slug)} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                <CardContent sx={{ flexGrow: 1, width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography
                            variant="subtitle1"
                            component="div"
                            sx={{ fontWeight: 600, lineHeight: 1.3, fontSize: { xs: '1.05rem', sm: '1.1rem' } }}
                        >
                            {note.title}
                        </Typography>
                        {note.pinned && (
                            <PushPinIcon color="primary" fontSize="small" sx={{ ml: 1, flexShrink: 0 }} />
                        )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" display="block" sx={{ mb: 2, fontSize: '0.9rem' }}>
                        {new Date(note.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 'auto' }}>
                        {note.tags.map((tag) => (
                            <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                variant="filled"
                                sx={{ bgcolor: 'secondary.container', color: 'onSecondaryContainer' }}
                            />
                        ))}
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default NoteCard;
