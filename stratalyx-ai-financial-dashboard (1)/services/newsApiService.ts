import { NEWS_API_KEY } from '../config';
import type { NewsArticle } from '../types';

const API_URL = 'https://newsapi.org/v2';
const PROXY_URL = 'https://corsproxy.io/?';

interface NewsApiResponseArticle {
    source: {
        id: string | null;
        name: string;
    };
    author: string | null;
    title: string;
    description: string;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}

interface NewsApiResponse {
    status: string;
    totalResults: number;
    articles: NewsApiResponseArticle[];
}

export const getMarketNews = async (): Promise<NewsArticle[]> => {
    try {
        const targetUrl = `${API_URL}/top-headlines?country=us&category=business&apiKey=${NEWS_API_KEY}`;
        const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`);

        if (!response.ok) {
            throw new Error(`NewsAPI request failed: ${response.statusText}`);
        }

        const data: NewsApiResponse = await response.json();

        if (data.status !== 'ok') {
            throw new Error(`NewsAPI returned an error: ${data.status}`);
        }

        return data.articles
            .filter(article => article.title && article.url)
            .map((article, index) => ({
                id: index, // Use index as a fallback ID
                source: article.source.name,
                headline: article.title,
                summary: article.description,
                datetime: Math.floor(new Date(article.publishedAt).getTime() / 1000), // Convert to UNIX timestamp
                imageUrl: article.urlToImage || undefined,
                url: article.url,
            }));
    } catch (error) {
        console.error('Error fetching from NewsAPI:', error);
        return []; // Return an empty array to prevent crashing the dashboard
    }
};
