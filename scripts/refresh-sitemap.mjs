import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_ORIGIN = 'https://shashiprabha.com';
const CHANNEL_ID_REGEX = /^UC[\w-]{22}$/;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const notesIndexPath = path.join(projectRoot, 'public', 'content', 'notes', 'index.json');
const blogIndexPath = path.join(projectRoot, 'public', 'content', 'blog', 'index.json');
const youtubeConfigPath = path.join(projectRoot, 'public', 'content', 'youtube', 'index.json');
const sitemapPath = path.join(projectRoot, 'sitemap.xml');

function slugFromMarkdownFilename(filename) {
  return filename.replace(/\.md$/i, '');
}

function toAbsoluteUrl(routePath) {
  return encodeURI(`${SITE_ORIGIN}${routePath}`);
}

async function loadIndex(indexPath) {
  try {
    const raw = await readFile(indexPath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((entry) => typeof entry === 'string');
  } catch {
    return [];
  }
}

async function loadYouTubeChannelId() {
  try {
    const raw = await readFile(youtubeConfigPath, 'utf-8');
    const parsed = JSON.parse(raw);
    const channelId = String(parsed?.channelId || '').trim();
    return CHANNEL_ID_REGEX.test(channelId) ? channelId : '';
  } catch {
    return '';
  }
}

async function loadYouTubeVideoIds(channelId) {
  if (!channelId) {
    return [];
  }

  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;

  try {
    const response = await fetch(feedUrl, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) {
      return [];
    }

    const feedXml = await response.text();
    return Array.from(feedXml.matchAll(/<yt:videoId>([^<]+)<\/yt:videoId>/g))
      .map((match) => match[1].trim())
      .filter((id) => id.length > 0);
  } catch {
    return [];
  }
}

async function main() {
  const noteFiles = await loadIndex(notesIndexPath);
  const blogFiles = await loadIndex(blogIndexPath);
  const channelId = await loadYouTubeChannelId();
  const youtubeVideoIds = await loadYouTubeVideoIds(channelId);

  const routes = [
    '/',
    '/notes',
    '/blog',
    '/youtube',
    ...noteFiles.map((filename) => `/notes/${slugFromMarkdownFilename(filename)}`),
    ...blogFiles.map((filename) => `/blog/${slugFromMarkdownFilename(filename)}`),
    ...youtubeVideoIds.map((id) => `/youtube/${id}`),
  ];

  const uniqueRoutes = Array.from(new Set(routes));
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...uniqueRoutes.map((route) => `  <url>\n    <loc>${toAbsoluteUrl(route)}</loc>\n  </url>`),
    '</urlset>',
    '',
  ].join('\n');

  await writeFile(sitemapPath, sitemap, 'utf-8');
  process.stdout.write(`Updated sitemap.xml with ${uniqueRoutes.length} URLs.\n`);
}

main().catch((error) => {
  process.stderr.write(`Failed to refresh sitemap: ${error.message}\n`);
  process.exit(1);
});
