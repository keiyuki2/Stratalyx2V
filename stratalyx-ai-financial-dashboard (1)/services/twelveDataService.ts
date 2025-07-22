import { TWELVE_DATA_API_KEY } from '../config';
import type { Stock, CandlestickData } from '../types';

const API_URL = 'https://api.twelvedata.com';

interface TwelveDataQuote {
    symbol: string;
    name: string;
    close: string;
    change: string;
    percent_change: string;
    volume: string;
    is_market_open?: boolean;
}

interface TwelveDataStatistics {
    statistics: {
        market_capitalization: string;
        fifty_two_week?: {
            high: string;
            low: string;
        };
    };
    valuations?: {
        pe_ratio: string | null;
    };
    symbol: string;
}

interface TwelveDataTimeSeries {
    values: {
        datetime: string;
        close: string;
        open?: string;
        high?: string;
        low?: string;
        volume?: string;
    }[];
    meta: {
        symbol: string;
    };
    status: string;
}

interface TwelveDataFxRate {
    rate: number;
    timestamp: number;
}


export const getRealTimeQuotes = async (symbols: string[]): Promise<Record<string, TwelveDataQuote>> => {
    try {
        const response = await fetch(`${API_URL}/quote?symbol=${symbols.join(',')}&apikey=${TWELVE_DATA_API_KEY}`);
        if (!response.ok) {
            throw new Error(`Twelve Data API request failed: ${response.statusText}`);
        }
        // The API returns data for a single symbol as an object, and for multiple as an object with symbols as keys
        const data = await response.json();
        if (symbols.length === 1 && data.symbol) {
            return { [symbols[0]]: data };
        }
        return data;
    } catch (error) {
        console.error('Error fetching from Twelve Data:', error);
        throw error;
    }
};

export const getTimeSeries = async (symbol: string, outputsize: number = 30): Promise<{ value: number }[]> => {
    try {
        const response = await fetch(`${API_URL}/time_series?symbol=${symbol}&interval=1day&outputsize=${outputsize}&apikey=${TWELVE_DATA_API_KEY}`);
        if (!response.ok) {
            console.error(`Twelve Data Time Series request for ${symbol} failed: ${response.statusText}`);
            return [];
        }
        const data: TwelveDataTimeSeries = await response.json();
        if (data.status !== 'ok' || !data.values) {
            console.warn(`No time series data for ${symbol}. Status: ${data.status}`);
            return [];
        }

        return data.values.map(v => ({ value: parseFloat(v.close) })).reverse(); // Reverse to get chronological order

    } catch (error) {
        console.error(`Error fetching time series for ${symbol} from Twelve Data:`, error);
        return [];
    }
};

export const getHistoricalCandleData = async (symbol: string, interval: string, outputsize: number): Promise<CandlestickData[]> => {
    try {
        const response = await fetch(`${API_URL}/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${TWELVE_DATA_API_KEY}`);
        if (!response.ok) {
            console.error(`Twelve Data Time Series (OHLC) request for ${symbol} failed: ${response.statusText}`);
            return [];
        }
        const data: TwelveDataTimeSeries = await response.json();
        if (data.status !== 'ok' || !data.values) {
            console.warn(`No OHLC data for ${symbol}. Status: ${data.status}`);
            return [];
        }

        return data.values
            .map(v => ({
                time: new Date(v.datetime).getTime() / 1000,
                open: parseFloat(v.open!),
                high: parseFloat(v.high!),
                low: parseFloat(v.low!),
                close: parseFloat(v.close!),
                volume: v.volume ? parseInt(v.volume, 10) : undefined,
            }))
            .filter(d => !isNaN(d.open))
            .reverse();

    } catch (error) {
        console.error(`Error fetching OHLC data for ${symbol} from Twelve Data:`, error);
        return [];
    }
};


export const getSymbolStatistics = async (symbols: string[]): Promise<Record<string, TwelveDataStatistics>> => {
    try {
        const response = await fetch(`${API_URL}/statistics?symbol=${symbols.join(',')}&apikey=${TWELVE_DATA_API_KEY}`);
        if (!response.ok) {
            throw new Error(`Twelve Data API /statistics request failed: ${response.statusText}`);
        }
        const data = await response.json();
        if (symbols.length === 1) {
            return { [symbols[0]]: data };
        }
        return data;
    } catch (error) {
        console.error('Error fetching statistics from Twelve Data:', error);
        throw error;
    }
};

export const getFxRate = async (from: string, to: string): Promise<number | null> => {
    try {
        const response = await fetch(`${API_URL}/exchange_rate?symbol=${from}/${to}&apikey=${TWELVE_DATA_API_KEY}`);
        if (!response.ok) {
            throw new Error(`Twelve Data FX rate request failed: ${response.statusText}`);
        }
        const data: TwelveDataFxRate = await response.json();
        return data.rate;
    } catch (error) {
        console.error('Error fetching FX rate from Twelve Data:', error);
        return null;
    }
};