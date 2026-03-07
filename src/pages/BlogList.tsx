import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, CircularProgress } from '@mui/material';
import BlogCard from '../components/BlogCard';
import type { BlogItem } from '../components/BlogCard';
import { parseFrontmatter } from '../utils/markdown';

const BlogList: React.FC = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<BlogItem[]>([]);
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
                            excerpt: data.excerpt || content.substring(0, 150) + '...',
                        } as BlogItem;
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
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' }, gap: { xs: 2, md: 4 } }}>
                    {blogs.map((post) => (
                        <Box key={post.slug} sx={{ minWidth: 0 }}>
                            <BlogCard post={post} onClick={(slug) => navigate(`/blog/${slug}`)} />
                        </Box>
                    ))}
                    {blogs.length === 0 && (
                        <Box sx={{ gridColumn: '1 / -1' }}>
                            <Typography color="text.secondary">No blog posts found.</Typography>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default BlogList;
