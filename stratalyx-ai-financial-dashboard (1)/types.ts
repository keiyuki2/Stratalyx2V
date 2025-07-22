import React from 'react';

export type CountryCode = 'US' | 'DE' | 'CN' | 'JP' | 'GB' | 'MN';

export interface Country {
    code: CountryCode;
    name: string;
}

export interface Stock {
    ticker: string;
    name:string;
    price: number;
    change: number;
    changePercent: number;
    volume: string;
    marketCap?: string;
    high?: number;
    low?: number;
    status?: 'open' | 'closed' | 'unknown';
    sparklineData?: { value: number }[];
}

export interface NewsArticle {
    id: number;
    source: string;
    headline: string;
    summary?: string;
    datetime: number; // UNIX timestamp
    imageUrl?: string;
    url: string;
}

export interface EconomicIndicator {
    name: string;
    value: string;
    change: string;
    observationDate: string;
    positive: boolean;
    icon: React.ReactElement<{ className?: string }>;
}

export interface SectorPerformanceData {
    '1D': number;
    '1W': number;

    '1M': number;
    '3M': number;
    '1Y': number;
}

export interface Sector {
    name: string;
    performance: SectorPerformanceData;
    marketCap: number;
    leaders: string;
    icon: React.ReactElement<{ className?: string }>;
    ticker: string;
}


export interface Agent {
    id: string;
    name: string;
    provider: string;
    description: string;
    accuracy: number;
    avgResponse: number;
    costPerQuery: number;
    active: boolean;
    userRating: number;
    predictionAccuracy?: number; // Added for leaderboard
}

export interface PerformanceData {
    date: string;
    OpenAI: number;
    Claude: number;
    Gemini: number;
}

export interface NewsAnalysisResult {
    summary: string;
    keyTakeaways: string[];
    impactedStocks: {
        ticker: string;
        sentiment: 'Positive' | 'Negative' | 'Neutral';
        reason: string;
    }[];
    marketImpact: string;
    confidenceScore: number;
    error?: string; // Optional field for handling analysis errors
}

export interface CandlestickAnalysisResult {
    pattern: {
        name: string;
        description: string;
    };
    trend: 'Bullish' | 'Bearish' | 'Neutral';
    supportLevel: number;
    resistanceLevel: number;
    shortTermOutlook: string;
    confidence: number;
    error?: string;
}

export interface CandlestickPredictionResult {
    predictions: CandlestickData[];
    confidence: number;
    rationale: string;
    error?: string;
}


export interface MarketMovers {
    gainers: Stock[];
    losers: Stock[];
    mostActive: Stock[];
}

export interface AgentResponse {
  agentName: 'GPT-4 Turbo' | 'Claude 3 Opus' | 'Gemini Pro';
  chosenOption: string;
  justification: string;
  confidence: number;
  confidenceReason: string;
}

export interface AgentConsensus {
  question: string;
  options: string[];
  responses: AgentResponse[];
}


export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    agent?: string;
    upvotes?: number;
    downvotes?: number;
    userVote?: 'up' | 'down' | null;
    winningOption?: string;
}

export interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}


export enum Language {
    EN = 'en',
    MN = 'mn'
}

export type SubscriptionPlan = 'Free' | 'Plus' | 'Pro Analyst' | 'Ultra';

// --- New types for Tools Page ---

export interface EconomicEvent {
    time: string;
    event: string;
    country: string;
    actual: string;
    forecast: string;
    previous: string;
}

export interface EarningEvent {
    date: string;
    symbol: string;
    name: string;
    epsEstimate: string;
    time: string;
}

export interface Commodity {
    name: string;
    price: number;
    change: number;
    changePercent: number;
    unit: string;
    icon: React.ReactElement<{ className?: string }>;
}

export interface Currency {
    code: string;
    name: string;
}

export interface StockComparison {
    ticker: string;
    price: number;
    marketCap: string;
    peRatio: number;
    performanceYTD: number;
    volatility: number;
    analystRating: string;
    aiSentiment: 'Positive' | 'Negative' | 'Neutral';
    optimalBuy: number;
    optimalSell: number;
}

export interface PortfolioHolding {
    id: string;
    ticker: string;
    shares: number;
    purchasePrice: number;
}

export interface PortfolioHealth {
    riskScore: number;
    performance: number;
    diversification: number;
    value: number;
    potential: number;
    summary: string;
}

export interface MseSector {
    name: string;
    value: number; // Percentage of market cap
    color: string;
}

export interface MntData {
    inflation: number;
    policyRate: number;
    historicalData: { date: string; value: number }[];
}

export type ToastLevel = 'Success' | 'Info' | 'Warning' | 'Critical';

export interface ToastMessage {
  id: string;
  message: string;
  level: ToastLevel;
}