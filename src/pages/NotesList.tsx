import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import NoteCard from '../components/NoteCard';
import type { NoteItem } from '../components/NoteCard';
import { parseFrontmatter } from '../utils/markdown';

const NotesList: React.FC = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState<NoteItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/content/notes/index.json')
            .then(res => res.json())
            .then(async (files: string[]) => {
                const posts = await Promise.all(
                    files.map(async (file) => {
                        const res = await fetch(`/content/notes/${file}`);
                        const text = await res.text();
                        const { data } = parseFrontmatter(text);
                        const slug = file.replace(/\.md$/, '');
                        return {
                            slug,
                            title: data.title || slug,
                            date: data.date || new Date().toISOString(),
                            tags: data.tags || [],
                            pinned: data.pinned === true,
                        } as NoteItem;
                    })
                );
                posts.sort((a, b) => {
                    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                });
                setNotes(posts);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <Box sx={{ position: 'relative', minHeight: '100%' }}>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: 'minmax(0, 1fr)',
                            sm: 'repeat(2, minmax(0, 1fr))',
                            md: 'repeat(3, minmax(0, 1fr))',
                            lg: 'repeat(4, minmax(0, 1fr))',
                        },
                        gap: { xs: 2, md: 3 },
                    }}
                >
                    {notes.map((note) => (
                        <Box key={note.slug} sx={{ minWidth: 0 }}>
                            <NoteCard note={note} onClick={(slug) => navigate(`/notes/${slug}`)} />
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default NotesList;
