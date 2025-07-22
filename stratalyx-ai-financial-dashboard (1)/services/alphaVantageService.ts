import { ALPHA_VANTAGE_API_KEY } from '../config';
import type { Stock, MarketMovers, EconomicEvent, EarningEvent, Commodity, MseSector } from '../types';
import { Icons } from '../constants';

const API_URL = 'https://www.alphavantage.co/query';
const PROXY_URL = 'https://corsproxy.io/?';

interface AlphaVantageMover {
    ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
    volume: string;
}

interface AlphaVantageResponse {
    top_gainers: AlphaVantageMover[];
    top_losers: AlphaVantageMover[];
    most_actively_traded: AlphaVantageMover[];
    Information?: string; // Alpha Vantage returns this on API limit
}

const formatVolume = (volumeStr: string): string => {
    const volume = parseInt(volumeStr, 10);
    if (isNaN(volume)) return 'N/A';
    if (volume >= 1_000_000_000) return `${(volume / 1_000_000_000).toFixed(1)}B`;
    if (volume >= 1_000_000) return `${(volume / 1_000_000).toFixed(1)}M`;
    if (volume >= 1_000) return `${(volume / 1_000).toFixed(1)}K`;
    return volume.toString();
};

const parseMoversData = (data: AlphaVantageMover[]): Stock[] => {
    if (!data) return [];
    return data.map(stock => ({
        ticker: stock.ticker,
        // The TOP_GAINERS_LOSERS endpoint from Alpha Vantage does not provide the company name.
        // We use the ticker as a fallback to fulfill the 'Stock' type contract.
        name: stock.ticker,
        price: parseFloat(stock.price),
        change: parseFloat(stock.change_amount),
        changePercent: parseFloat(stock.change_percentage.replace('%', '')),
        volume: formatVolume(stock.volume),
    }));
};

export const getMarketMovers = async (): Promise<MarketMovers> => {
    const targetUrl = `${API_URL}?function=TOP_GAINERS_LOSERS&apikey=${ALPHA_VANTAGE_API_KEY}`;
    try {
        const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`);
        if (!response.ok) {
            throw new Error(`Alpha Vantage movers request failed: ${response.statusText}`);
        }
        const data: AlphaVantageResponse = await response.json();

        // The free Alpha Vantage API has a very strict rate limit (e.g., 25 requests/day).
        // If the limit is hit, it returns an 'Information' field instead of data.
        if (data.Information) {
            console.warn('Alpha Vantage API limit likely reached:', data.Information);
            return { gainers: [], losers: [], mostActive: [] };
        }

        if (!data.top_gainers || !data.top_losers || !data.most_actively_traded) {
             throw new Error('Invalid data structure from Alpha Vantage movers API');
        }

        return {
            gainers: parseMoversData(data.top_gainers),
            losers: parseMoversData(data.top_losers),
            mostActive: parseMoversData(data.most_actively_traded),
        };
    } catch (error) {
        console.error('Error fetching market movers from Alpha Vantage:', error);
        // Return empty structure to prevent dashboard crash
        return { gainers: [], losers: [], mostActive: [] };
    }
};


// --- MOCKED DATA FOR TOOLS PAGE ---
// The live AlphaVantage API for calendars returns CSV, which is complex to parse on frontend.
// Mocking allows for a functional UI immediately.

export const getEconomicCalendar = async (): Promise<EconomicEvent[]> => {
    return Promise.resolve([
        { time: '08:30 AM', event: 'Core CPI (MoM)', country: 'US', actual: '0.3%', forecast: '0.3%', previous: '0.4%' },
        { time: '10:00 AM', event: 'FOMC Meeting Minutes', country: 'US', actual: '-', forecast: '-', previous: '-' },
        { time: '02:30 PM', event: 'Crude Oil Inventories', country: 'US', actual: '-2.5M', forecast: '-1.4M', previous: '1.8M' },
        { time: 'Tomorrow', event: 'German ZEW Economic Sentiment', country: 'DE', actual: '', forecast: '47.8', previous: '47.1' },
    ]);
};

export const getEarningsCalendar = async (): Promise<EarningEvent[]> => {
     return Promise.resolve([
        { date: 'Today', symbol: 'NVDA', name: 'NVIDIA Corporation', epsEstimate: '5.59', time: 'After Hours' },
        { date: 'Today', symbol: 'TGT', name: 'Target Corporation', epsEstimate: '2.05', time: 'Before Market' },
        { date: 'Tomorrow', symbol: 'SNOW', name: 'Snowflake Inc.', epsEstimate: '0.17', time: 'After Hours' },
        { date: 'May 23', symbol: 'COST', name: 'Costco Wholesale Corporation', epsEstimate: '3.70', time: 'After Hours' },
    ]);
};

export const getCommodityPrices = async (): Promise<Commodity[]> => {
    // Mocked data for demonstration
    return Promise.resolve([
        { name: 'Gold', price: 2415.50, change: 12.30, changePercent: 0.51, unit: 'USD/oz', icon: Icons.gold },
        { name: 'Silver', price: 31.50, change: 0.85, changePercent: 2.78, unit: 'USD/oz', icon: Icons.silver },
        { name: 'Copper', price: 5.12, change: -0.04, changePercent: -0.78, unit: 'USD/lb', icon: Icons.copper },
        { name: 'Coal', price: 135.70, change: 1.25, changePercent: 0.93, unit: 'USD/tonne', icon: Icons.coal },
    ]);
};

export const getMseSectors = async (): Promise<MseSector[]> => {
    // Mocked data for Mongolian Stock Exchange
    return Promise.resolve([
      { name: 'Mining', value: 45, color: '#2F81F7' },
      { name: 'Banking', value: 25, color: '#238636' },
      { name: 'Manufacturing', value: 15, color: '#8957E5' },
      { name: 'Real Estate', value: 8, color: '#FBBF24' },
      { name: 'Retail', value: 5, color: '#34D399' },
      { name: 'Other', value: 2, color: '#848D97' },
    ]);
};