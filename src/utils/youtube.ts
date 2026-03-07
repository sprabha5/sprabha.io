import type { YouTubeItem } from '../components/VideoCard';

// /content/youtube/index.json
// {
//   "channelId": "UCxxxxxxxxxxxxxxxxxxxxxx"
// }

type YouTubeConfig = {
    channelId: string;
};

const CONFIG_PATH = '/content/youtube/index.json';
const CHANNEL_ID_REGEX = /^UC[\w-]{22}$/;
const FETCH_TIMEOUT_MS = 8000;

// The YouTube RSS feed is public and usually works directly from browsers.
// Fallback proxies are retained for restrictive networks.
const CORS_PROXIES = [
    (url: string) => url,
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url: string) => `https://cors.isomorphic-git.org/${url}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url: string) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(url)}`,
];

let cachedVideos: YouTubeItem[] | null = null;
let pendingVideosPromise: Promise<YouTubeItem[]> | null = null;

type FetchAttempt = {
    requestUrl: string;
    promise: Promise<string>;
    abort: () => void;
};

function toErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        if (error.name === 'AbortError') {
            return 'Request timed out or was cancelled';
        }
        return error.message;
    }
    return String(error);
}

function createFetchAttempt(requestUrl: string): FetchAttempt {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const promise = (async () => {
        try {
            const response = await fetch(requestUrl, { signal: controller.signal });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const text = await response.text();
            if (!text.trim()) {
                throw new Error('Empty response body');
            }

            return text;
        } finally {
            window.clearTimeout(timeoutId);
        }
    })();

    return {
        requestUrl,
        promise,
        abort: () => controller.abort(),
    };
}

async function loadConfig(): Promise<YouTubeConfig> {
    const response = await fetch(CONFIG_PATH);
    if (!response.ok) {
        throw new Error(`Could not read ${CONFIG_PATH} (${response.status}).`);
    }

    const config = (await response.json()) as YouTubeConfig;

    if (!config?.channelId || !CHANNEL_ID_REGEX.test(config.channelId.trim())) {
        throw new Error(
            `${CONFIG_PATH} must contain a valid "channelId" (starts with UC, 24 chars).\n` +
            'Find it in YouTube Studio > Settings > Channel > Advanced settings.'
        );
    }

    return { channelId: config.channelId.trim() };
}

async function fetchTextWithFallback(url: string): Promise<string> {
    const attempts = CORS_PROXIES.map((buildUrl) => createFetchAttempt(buildUrl(url)));

    try {
        return await Promise.any(
            attempts.map(({ requestUrl, promise }) =>
                promise.catch((error: unknown) => {
                    throw new Error(`${requestUrl} -> ${toErrorMessage(error)}`);
                })
            )
        );
    } catch (error: unknown) {
        const details =
            error instanceof AggregateError
                ? error.errors.map((entry: unknown) => toErrorMessage(entry)).join('\n')
                : toErrorMessage(error);
        throw new Error(`Failed to fetch feed after ${CORS_PROXIES.length} attempts:\n${details}`);
    } finally {
        attempts.forEach(({ abort }) => abort());
    }
}

function readTagText(parent: Element, tagName: string): string {
    return parent.getElementsByTagName(tagName)[0]?.textContent?.trim() || '';
}

function readThumbnail(entry: Element, videoId: string): string {
    const url = entry.getElementsByTagName('media:thumbnail')[0]?.getAttribute('url')?.trim();
    return url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function parseFeed(feedXml: string): YouTubeItem[] {
    const doc = new DOMParser().parseFromString(feedXml, 'application/xml');

    if (doc.querySelector('parsererror')) {
        throw new Error('Unable to parse YouTube feed XML.');
    }

    const videos: YouTubeItem[] = [];

    for (const entry of Array.from(doc.getElementsByTagName('entry'))) {
        const videoId = readTagText(entry, 'yt:videoId') || readTagText(entry, 'videoId');
        if (!videoId) {
            continue;
        }

        videos.push({
            id: videoId,
            title: readTagText(entry, 'title') || videoId,
            description: readTagText(entry, 'media:description'),
            date: readTagText(entry, 'published') || new Date().toISOString(),
            thumbnail: readThumbnail(entry, videoId),
        });
    }

    return videos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function fetchAllYouTubeVideos(forceRefresh = false): Promise<YouTubeItem[]> {
    if (!forceRefresh && cachedVideos) {
        return cachedVideos;
    }
    if (!forceRefresh && pendingVideosPromise) {
        return pendingVideosPromise;
    }

    pendingVideosPromise = (async () => {
        const { channelId } = await loadConfig();
        const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
        const feedXml = await fetchTextWithFallback(feedUrl);
        cachedVideos = parseFeed(feedXml);
        return cachedVideos;
    })();

    try {
        return await pendingVideosPromise;
    } finally {
        pendingVideosPromise = null;
    }
}
