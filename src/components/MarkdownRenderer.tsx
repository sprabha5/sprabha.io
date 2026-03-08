import React, { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import {
    Typography,
    Box,
    IconButton,
    Tooltip,
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

import '../styles/markdown-prose.css';

interface MarkdownRendererProps {
    content: string;
}

/* ---------- Copy Button for code blocks ---------- */
const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [text]);

    return (
        <Tooltip title={copied ? 'Copied!' : 'Copy code'} placement="left">
            <IconButton
                className="code-copy-btn"
                onClick={handleCopy}
                size="small"
                sx={{
                    color: 'grey.400',
                    bgcolor: 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(4px)',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.5)', color: 'grey.200' },
                }}
            >
                {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
        </Tooltip>
    );
};

/* ---------- Custom component overrides ---------- */
const createComponents = (isDark: boolean): Components => ({
    h1: ({ children, ...props }) => (
        <Typography
            variant="h4"
            component="h1"
            fontWeight={800}
            sx={{ mt: 3, mb: 1.5, letterSpacing: '-0.02em' }}
            {...props}
        >
            {children}
        </Typography>
    ),
    h2: ({ children, ...props }) => (
        <Typography
            variant="h5"
            component="h2"
            fontWeight={700}
            sx={{ letterSpacing: '-0.01em' }}
            {...props}
        >
            {children}
        </Typography>
    ),
    h3: ({ children, ...props }) => (
        <Typography
            variant="h6"
            component="h3"
            fontWeight={600}
            {...props}
        >
            {children}
        </Typography>
    ),
    h4: ({ children, ...props }) => (
        <Typography
            variant="subtitle1"
            component="h4"
            fontWeight={600}
            {...props}
        >
            {children}
        </Typography>
    ),
    p: ({ children, node, ...props }) => {
        // Check if paragraph contains only an image — if so, render unwrapped
        const child = node?.children;
        if (child && child.length === 1 && child[0].type === 'element' && child[0].tagName === 'img') {
            return <>{children}</>;
        }
        return (
            <Typography
                variant="body1"
                component="p"
                sx={{ lineHeight: 1.85, fontSize: 'inherit' }}
                {...props}
            >
                {children}
            </Typography>
        );
    },
    a: ({ children, href, ...props }) => (
        <Box
            component="a"
            href={href}
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            sx={{
                color: 'primary.main',
                textDecoration: 'none',
                fontWeight: 500,
                borderBottom: '1px solid transparent',
                transition: 'border-color 0.2s ease',
                '&:hover': {
                    borderBottomColor: 'primary.main',
                },
            }}
            {...props}
        >
            {children}
        </Box>
    ),
    blockquote: ({ children, ...props }) => (
        <Box
            component="blockquote"
            {...props}
        >
            {children}
        </Box>
    ),
    img: ({ src, alt, ...props }) => (
        <Box className="image-container">
            <img src={src} alt={alt || ''} loading="lazy" {...props} />
            {alt && alt !== '' && (
                <Typography className="image-caption" variant="caption" component="p">
                    {alt}
                </Typography>
            )}
        </Box>
    ),
    table: ({ children, ...props }) => (
        <Box className="table-wrapper">
            <table {...props}>{children}</table>
        </Box>
    ),
    pre: ({ children, ...props }) => {
        // Extract raw text from code block children for copy button
        let rawText = '';
        React.Children.forEach(children, (child) => {
            if (React.isValidElement(child) && child.props) {
                const codeProps = child.props as { children?: React.ReactNode };
                if (typeof codeProps.children === 'string') {
                    rawText = codeProps.children;
                } else if (Array.isArray(codeProps.children)) {
                    rawText = codeProps.children
                        .map((c: any) => (typeof c === 'string' ? c : ''))
                        .join('');
                }
            }
        });

        return (
            <Box className="code-block-wrapper">
                <CopyButton text={rawText} />
                <pre
                    style={{
                        margin: 0,
                        borderRadius: '12px',
                        background: isDark
                            ? 'rgba(30, 30, 40, 0.9)'
                            : '#22272e',
                    }}
                    {...props}
                >
                    {children}
                </pre>
            </Box>
        );
    },
    code: ({ children, className, ...props }) => {
        // If it's inside a <pre>, render as-is (highlight.js handles it)
        if (className?.startsWith('hljs') || className?.startsWith('language-')) {
            return <code className={className} {...props}>{children}</code>;
        }
        // Inline code
        return <code {...props}>{children}</code>;
    },
    hr: ({ ...props }) => <hr {...props} />,
});

/* ---------- Main Component ---------- */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    const { mode } = useColorScheme();
    const isDark = mode === 'dark';
    const components = React.useMemo(() => createComponents(isDark), [isDark]);

    return (
        <Box className="markdown-prose">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeRaw]}
                components={components}
            >
                {content}
            </ReactMarkdown>
        </Box>
    );
};

export default MarkdownRenderer;
