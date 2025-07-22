



import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import type { Stock, NewsArticle, EconomicIndicator, Sector, Country, CountryCode, SectorPerformanceData, Language } from '../types';
import { Icons } from '../constants';
import { useSettings } from '../context/SettingsContext';
import { getRealTimeQuotes, getTimeSeries, getSymbolStatistics } from '../services/twelveDataService';
import { getMarketNews } from '../services/newsApiService';
import { getEconomicIndicators as getFredData } from '../services/fredService';
import { batchTranslate } from '../services/analysisService';
import { NewsDetailModal } from '../components/NewsDetailModal';
import { MarketHeatmap } from '../components/MarketHeatmap';
import { SectorPerformance } from '../components/SectorPerformance';
import Sparkline from '../components/Sparkline';
import { useAppContext } from '../context/AppContext';


const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`bg-border/50 rounded animate-pulse ${className}`}></div>
);

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-surface border border-border rounded-lg p-4 h-full ${className}`}>
        {children}
    </div>
);

// Add local interface definitions to fix type errors
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
    };
    symbol: string;
}

const MarketIndices: React.FC<{ indices: Stock[], loading: boolean, lastUpdated: Date | null }> = ({ indices, loading, lastUpdated }) => {
    const { t } = useAppContext();
    const marketStatus = indices.find(i => i.status !== 'unknown')?.status || 'closed';
    const isMarketOpen = marketStatus === 'open';

    return (
        <Card className="flex flex-col">
             <div className="flex justify-between items-center mb-3">
                 <h3 className="font-semibold text-text-primary">{t('marketIndices')}</h3>
                 <div className="flex items-center gap-2">
                     <div className={`w-2.5 h-2.5 rounded-full ${isMarketOpen ? 'bg-success animate-pulse' : 'bg-danger'}`}></div>
                     <span className="text-xs font-semibold text-text-secondary">{isMarketOpen ? t('live') : t('marketClosed')}</span>
                 </div>
             </div>
             <div className="flex-grow space-y-2">
                 {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-4"><Skeleton className="h-5 w-full" /></div>
                            <div className="col-span-3"><Skeleton className="h-5 w-full" /></div>
                            <div className="col-span-2"><Skeleton className="h-5 w-full" /></div>
                            <div className="col-span-3"><Skeleton className="h-5 w-full" /></div>
                        </div>
                    ))
                 ) : (
                    indices.map(stock => (
                        <div key={stock.ticker} className="grid grid-cols-12 gap-x-3 items-center text-sm py-1">
                             <div className="col-span-4">
                                 <p className="font-bold text-text-primary truncate" title={stock.name}>{stock.name}</p>
                                 <p className="text-text-secondary text-xs">{stock.ticker}</p>
                             </div>
                             <div className="col-span-3">
                                <Sparkline data={stock.sparklineData || []} color={stock.change >= 0 ? '#34D399' : '#F87171'} height={30} />
                             </div>
                             <div className="col-span-2 text-right">
                                 <p className="font-semibold text-text-primary">{stock.price.toFixed(2)}</p>
                             </div>
                             <div className={`col-span-3 text-right font-semibold flex items-center justify-end gap-1 ${stock.change >= 0 ? 'text-success' : 'text-danger'}`}>
                                {React.cloneElement(stock.change >= 0 ? Icons.up : Icons.down, { className: 'w-4 h-4' })}
                                <span>{stock.changePercent.toFixed(2)}%</span>
                             </div>
                        </div>
                    ))
                 )}
             </div>
             {lastUpdated && <p className="text-xs text-text-secondary mt-2 text-right">Last updated: {lastUpdated.toLocaleTimeString()}</p>}
        </Card>
    );
};


const KeyStocksWidget: React.FC<{ stocks: Stock[], loading: boolean }> = ({ stocks, loading }) => {
    const [activeTab, setActiveTab] = useState<'gainers' | 'losers' | 'mostActive'>('gainers');
    const { t } = useAppContext();

    type TabKey = 'gainers' | 'losers' | 'mostActive';

    const TABS: { key: TabKey, labelKey: string }[] = [
        { key: 'gainers', labelKey: 'topGainers' },
        { key: 'losers', labelKey: 'topLosers' },
        { key: 'mostActive', labelKey: 'mostActive' },
    ];
    
    const safeStocks = stocks || [];

    const gainers = [...safeStocks].sort((a, b) => b.changePercent - a.changePercent);
    const losers = [...safeStocks].sort((a, b) => a.changePercent - b.changePercent);
    const mostActive = [...safeStocks].sort((a, b) => {
        const volA = parseInt(a.volume?.replace(/,/g, '') || '0', 10);
        const volB = parseInt(b.volume?.replace(/,/g, '') || '0', 10);
        return volB - volA;
    });

    const dataMap = { gainers, losers, mostActive };
    const activeData = dataMap[activeTab];

    return (
        <Card>
            <h3 className="font-semibold text-text-primary mb-2">{t('keyStocks')}</h3>
            <div className="flex border-b border-border mb-3">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-3 py-2 text-sm font-semibold transition-colors focus:outline-none ${activeTab === tab.key ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                        {t(tab.labelKey)}
                    </button>
                ))}
            </div>
            <div className="space-y-3">
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <div>
                                    <Skeleton className="h-5 w-12 mb-1" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                            <div className="text-right">
                                <Skeleton className="h-5 w-16 mb-1" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                        </div>
                    ))
                ) : (
                    activeData && activeData.length > 0 ? (
                        activeData.slice(0, 5).map(stock => (
                            <div key={stock.ticker} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={`https://logo.clearbit.com/${stock.name.split(' ')[0].toLowerCase().replace('.', '')}.com`}
                                        onError={(e) => {
                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${stock.ticker}&background=30363D&color=E6EDF3&font-size=0.5`;
                                            e.currentTarget.onerror = null;
                                        }}
                                        alt={`${stock.name} logo`}
                                        className="w-8 h-8 rounded-full bg-border"
                                    />
                                    <div className="max-w-[120px]">
                                        <p className="font-bold text-text-primary truncate" title={stock.ticker}>{stock.ticker}</p>
                                        <p className="text-text-secondary text-xs truncate" title={stock.name}>{stock.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-text-primary">${stock.price.toFixed(2)}</p>
                                    <p className={`text-xs font-semibold ${stock.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-text-secondary py-4 text-sm">
                           No stocks configured for this country.
                        </div>
                    )
                )}
            </div>
        </Card>
    );
};


const formatTimeAgo = (unixTimestamp: number): string => {
    const now = new Date();
    const past = new Date(unixTimestamp * 1000);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m ago`;
    return `${Math.floor(seconds)}s ago`;
}

const MarketNews: React.FC<{ articles: NewsArticle[], loading: boolean, onArticleClick: (article: NewsArticle) => void }> = ({ articles, loading, onArticleClick }) => {
    const { t } = useAppContext();
    return (
        <Card>
            <h3 className="font-semibold text-text-primary mb-3">{t('marketNews')}</h3>
            <div className="space-y-4">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex gap-4">
                            <Skeleton className="w-32 h-20 rounded-md flex-shrink-0" />
                            <div className="flex-1">
                                <Skeleton className="h-5 w-full mb-2" />
                                <Skeleton className="h-4 w-4/5 mb-3" />
                                <Skeleton className="h-3 w-1/3" />
                            </div>
                        </div>
                    ))
                ) : (
                    articles.slice(0, 4).map(article => (
                         <div key={article.id} className="flex gap-4 cursor-pointer hover:bg-border/50 p-2 -m-2 rounded-lg transition-colors" onClick={() => onArticleClick(article)}>
                            <img src={article.imageUrl || `https://ui-avatars.com/api/?name=${article.source}&background=30363D&color=E6EDF3&font-size=0.5`} alt={article.headline} className="w-32 h-20 object-cover rounded-md flex-shrink-0"/>
                            <div>
                                <h4 className="font-bold text-text-primary line-clamp-2">{article.headline}</h4>
                                <p className="text-sm text-text-secondary mt-1 line-clamp-2">{article.summary}</p>
                                <div className="flex items-center gap-2 text-xs text-text-secondary mt-2">
                                    <span>{article.source}</span>
                                    <span>&bull;</span>
                                    <span>{formatTimeAgo(article.datetime)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
};

export const SUPPORTED_COUNTRIES: Country[] = [
    { code: 'US', name: 'unitedStates' },
    { code: 'DE', name: 'germany' },
    { code: 'CN', name: 'china' },
    { code: 'JP', name: 'japan' },
    { code: 'GB', name: 'unitedKingdom' },
    { code: 'MN', name: 'mongolia' },
];

const EconomicIndicators: React.FC<{
    indicators: EconomicIndicator[];
    loading: boolean;
    selectedCountry: CountryCode;
    onCountryChange: (code: CountryCode) => void;
}> = ({ indicators, loading, selectedCountry, onCountryChange }) => {
    const { t } = useAppContext();
    return (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-text-primary">{t('economicIndicators')}</h3>
            <div className="relative">
                <select
                    value={selectedCountry}
                    onChange={(e) => onCountryChange(e.target.value as CountryCode)}
                    disabled={loading}
                    className="bg-background border border-border rounded-md pl-3 pr-8 py-1.5 text-sm text-text-secondary focus:ring-2 focus:ring-primary focus:outline-none appearance-none disabled:opacity-50"
                    aria-label="Select country for economic indicators"
                >
                    {SUPPORTED_COUNTRIES.map(c => <option key={c.code} value={c.code}>{t(c.name)}</option>)}
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary"><path d="m6 9 6 6 6-6"/></svg>
            </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-background p-3 rounded-md">
                        <div className="flex items-center gap-2 mb-1">
                           <Skeleton className="w-4 h-4 rounded-full"/>
                           <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-7 w-16 my-1" />
                        <div className="flex justify-between items-center">
                           <Skeleton className="h-4 w-10" />
                           <Skeleton className="h-3 w-14" />
                        </div>
                    </div>
                ))
            ) : (
                indicators.map(indicator => (
                    <div key={indicator.name} className="bg-background p-3 rounded-md">
                        <div className="flex items-center gap-2 text-text-secondary text-xs mb-1 truncate">
                            {React.isValidElement(indicator.icon) ? React.cloneElement(indicator.icon, { className: 'w-4 h-4 flex-shrink-0' }) : indicator.icon}
                            <span className="truncate" title={indicator.name}>{indicator.name}</span>
                        </div>
                        <p className="text-xl font-bold text-text-primary truncate">{indicator.value}</p>
                        <div className="flex justify-between items-center mt-1">
                            <p className={`text-sm font-semibold ${indicator.positive ? 'text-success' : 'text-danger'}`}>{indicator.change}</p>
                            <p className="text-xs text-text-secondary"> {indicator.observationDate}</p>
                        </div>
                    </div>
                ))
            )}
             {!loading && indicators.length === 0 && (
                <div className="col-span-full text-center py-8 text-text-secondary">
                    No economic data available for the selected country.
                </div>
            )}
        </div>
    </Card>
);
}

const sectorETFMap: { [key: string]: { name: string; icon: React.ReactElement; leaders: string; } } = {
    'XLK': { name: 'Technology', icon: Icons.technology, leaders: 'AAPL, MSFT, NVDA' },
    'XLY': { name: 'Consumer Disc.', icon: Icons.consumerDiscretionary, leaders: 'AMZN, TSLA, HD'},
    'XLV': { name: 'Healthcare', icon: Icons.healthcare, leaders: 'JNJ, LLY, UNH' },
    'XLF': { name: 'Financials', icon: Icons.financials, leaders: 'JPM, BAC, WFC' },
    'XLI': { name: 'Industrials', icon: Icons.industrials, leaders: 'CAT, HON, BA' },
    'XLE': { name: 'Energy', icon: Icons.energy, leaders: 'XOM, CVX, COP' },
    'XLB': { name: 'Materials', icon: Icons.materials, leaders: 'LIN, APD, SHW' },
    'XLU': { name: 'Utilities', icon: Icons.utilities, leaders: 'NEE, DUK, SO' },
};

const globalIndexSymbols: Record<string, string> = {
    'SPX': 'S&P 500',
    'IXIC': 'NASDAQ',
    'DJI': 'Dow Jones',
    'RUT': 'Russell 2000',
    '^N225': 'Nikkei 225',
    '^FTSE': 'FTSE 100',
    '^GDAXI': 'DAX',
    '000300.SS': 'CSI 300',
};


const DashboardPage: React.FC = () => {
    const isInitialLoad = useRef(true);
    const [loading, setLoading] = useState(true);
    const { customStocks, isLoading: settingsLoading } = useSettings();
    const [marketIndices, setMarketIndices] = useState<Stock[]>([]);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [keyStocks, setKeyStocks] = useState<Stock[]>([]);
    const [marketNews, setMarketNews] = useState<NewsArticle[]>([]);
    const [displayedNews, setDisplayedNews] = useState<NewsArticle[]>([]);
    const [isTranslating, setIsTranslating] = useState(false);
    const [sectors, setSectors] = useState<Sector[]>([]);
    const [economicIndicators, setEconomicIndicators] = useState<EconomicIndicator[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
    const [selectedOriginalArticle, setSelectedOriginalArticle] = useState<NewsArticle | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<CountryCode>('US');
    const [showSectorHeatmap, setShowSectorHeatmap] = useState(false);
    const { t, language } = useAppContext();


    const fetchData = useCallback(async (country: CountryCode, isRefresh: boolean = false) => {
        if (settingsLoading) return; // Wait for custom stocks to be loaded
        if (!isRefresh) {
            setLoading(true);
        }
        
        try {
            const keyStockSymbols = customStocks[country]?.map(s => s.ticker) || [];
            const sectorSymbols = Object.keys(sectorETFMap);
            
            const countryPromises = [
                getFredData(country),
                keyStockSymbols.length > 0 ? getRealTimeQuotes(keyStockSymbols) : Promise.resolve(null),
            ];

            const initialPromises = isInitialLoad.current ? [
                getRealTimeQuotes(Object.keys(globalIndexSymbols)),
                Promise.all(Object.keys(globalIndexSymbols).map(symbol => getTimeSeries(symbol))),
                getRealTimeQuotes(sectorSymbols),
                getSymbolStatistics(sectorSymbols),
                getMarketNews(),
                ...sectorSymbols.map(symbol => getTimeSeries(symbol, 252))
            ] : [];

            const allResults = await Promise.allSettled([...countryPromises, ...initialPromises]);
            const [econRes, keyStocksRes] = allResults;
            
            if (econRes.status === 'fulfilled' && econRes.value) setEconomicIndicators(econRes.value);
            else setEconomicIndicators([]);

            if (keyStocksRes.status === 'fulfilled' && keyStocksRes.value) {
                const countryStockInfo = customStocks[country];
                const quotes = keyStocksRes.value as Record<string, TwelveDataQuote>;
                const data = Object.values(quotes)
                    .filter(q => q && q.symbol && q.close && q.change && q.percent_change)
                    .map(q => {
                        const stockDetails = countryStockInfo.find(s => s.ticker === q.symbol);
                        return {
                            ticker: q.symbol,
                            name: stockDetails ? stockDetails.name : q.name,
                            price: parseFloat(q.close),
                            change: parseFloat(q.change),
                            changePercent: parseFloat(q.percent_change),
                            volume: q.volume ? parseInt(q.volume, 10).toLocaleString() : 'N/A',
                        };
                    });
                setKeyStocks(data);
            } else {
                 setKeyStocks([]);
            }

            if (isInitialLoad.current) {
                const [indicesQuotesRes, indicesSparklinesRes, sectorsRes, statsRes, newsRes, ...sectorTimeSeriesRes] = allResults.slice(2);

                if (indicesQuotesRes.status === 'fulfilled' && indicesQuotesRes.value && indicesSparklinesRes.status === 'fulfilled' && indicesSparklinesRes.value) {
                    const quotes = indicesQuotesRes.value as Record<string, TwelveDataQuote>;
                    const sparklines = indicesSparklinesRes.value as { value: number }[][];
                    const symbols = Object.keys(globalIndexSymbols);

                    const data = symbols.map((symbol, i): Stock => {
                        const quote = quotes[symbol];
                        return {
                            ticker: symbol,
                            name: globalIndexSymbols[symbol],
                            price: quote ? parseFloat(quote.close) : 0,
                            change: quote ? parseFloat(quote.change) : 0,
                            changePercent: quote ? parseFloat(quote.percent_change) : 0,
                            volume: quote?.volume ? parseInt(quote.volume, 10).toLocaleString() : 'N/A',
                            status: quote?.is_market_open ? 'open' : 'closed',
                            sparklineData: sparklines[i] || [],
                        };
                    });
                    setMarketIndices(data);
                    setLastUpdated(new Date());
                }

                 if (sectorsRes.status === 'fulfilled' && sectorsRes.value && statsRes.status === 'fulfilled' && statsRes.value) {
                    const quotes = sectorsRes.value as Record<string, TwelveDataQuote>;
                    const stats = statsRes.value as Record<string, TwelveDataStatistics>;
                    const timeSeriesData = sectorTimeSeriesRes.map(res => res.status === 'fulfilled' ? res.value : []);

                    const calculatePerformances = (series: { value: number }[]): Omit<SectorPerformanceData, '1D'> => {
                        const defaultPerf = { '1W': 0, '1M': 0, '3M': 0, '1Y': 0 };
                        if (series.length < 2) return defaultPerf;

                        const len = series.length;
                        const latest = series[len - 1].value;
                        if(latest === 0) return defaultPerf;

                        const periods: Record<keyof Omit<SectorPerformanceData, '1D'>, number> = { '1W': 5, '1M': 21, '3M': 63, '1Y': 252 };

                        const getPerf = (days: number) => {
                            if (len > days) {
                                const pastValue = series[len - 1 - days]?.value;
                                if (pastValue > 0) return ((latest / pastValue) - 1) * 100;
                            }
                            return 0; // Return 0 if not enough data
                        };
                        
                        return {
                           '1W': getPerf(periods['1W']),
                           '1M': getPerf(periods['1M']),
                           '3M': getPerf(periods['3M']),
                           '1Y': getPerf(periods['1Y']),
                        };
                    };

                    const data: Sector[] = sectorSymbols.map((symbol, index) => {
                            const quote = quotes[symbol];
                            const stat = stats[symbol];
                            const mapped = sectorETFMap[symbol];
                            const timeSeries = timeSeriesData[index] || [];
                           
                            if (!mapped || !quote?.percent_change || !stat?.statistics?.market_capitalization) return null;
                            
                            const perfHistory = calculatePerformances(timeSeries);

                            return {
                               ticker: symbol,
                               name: mapped.name,
                               performance: {
                                   '1D': parseFloat(quote.percent_change),
                                   ...perfHistory,
                               },
                               marketCap: parseFloat(stat.statistics.market_capitalization),
                               icon: mapped.icon,
                               leaders: mapped.leaders,
                            }
                        })
                        .filter((s): s is Sector => s !== null);
                    setSectors(data);
                }

                if (newsRes.status === 'fulfilled' && newsRes.value) {
                    setMarketNews((newsRes.value as NewsArticle[]).filter(n => n.headline));
                }
            }

        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            if (!isRefresh) {
                setLoading(false);
            }
            if (isInitialLoad.current) {
                isInitialLoad.current = false;
            }
        }
    }, [customStocks, settingsLoading]);
    
    // Auto-refresh for indices
    useEffect(() => {
        const refreshQuotes = async () => {
            if (isInitialLoad.current || marketIndices.length === 0) return;
            try {
                const symbols = Object.keys(globalIndexSymbols);
                const quotes = await getRealTimeQuotes(symbols);
                setMarketIndices(prevIndices => 
                    prevIndices.map(index => {
                        const quote = quotes[index.ticker];
                        return quote ? {
                            ...index,
                            price: parseFloat(quote.close),
                            change: parseFloat(quote.change),
                            changePercent: parseFloat(quote.percent_change),
                            status: quote.is_market_open ? 'open' : 'closed',
                        } : index;
                    })
                );
                setLastUpdated(new Date());
            } catch (error) {
                console.error("Failed to refresh index quotes:", error);
            }
        };
        const intervalId = setInterval(refreshQuotes, 60000); // 60 seconds
        return () => clearInterval(intervalId);
    }, [marketIndices]);

    useEffect(() => {
        fetchData(selectedCountry);
    }, [fetchData, selectedCountry]);
    
    useEffect(() => {
        const translateNews = async () => {
            if (language === 'mn' && marketNews.length > 0) {
                setIsTranslating(true);
                const itemsToTranslate = marketNews.flatMap(article => [
                    { id: `h-${article.id}`, text: article.headline },
                    { id: `s-${article.id}`, text: article.summary || '' }
                ]);

                const translations = await batchTranslate(itemsToTranslate, language);
                
                const newDisplayedNews = marketNews.map(article => ({
                    ...article,
                    headline: translations[`h-${article.id}`] || article.headline,
                    summary: translations[`s-${article.id}`] || article.summary,
                }));

                setDisplayedNews(newDisplayedNews);
                setIsTranslating(false);
            } else {
                setDisplayedNews(marketNews);
            }
        };
        translateNews();
    }, [marketNews, language]);

    const handleArticleClick = (article: NewsArticle) => {
        const original = marketNews.find(a => a.id === article.id);
        setSelectedOriginalArticle(original || null);
        setSelectedArticle(article);
    };

    const handleCloseModal = () => {
        setSelectedArticle(null);
        setSelectedOriginalArticle(null);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">{t('marketDataDashboard')}</h1>
                    <p className="text-text-secondary">{t('dashboardSubtitle')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchData(selectedCountry, true)}
                        disabled={loading}
                        className="bg-surface hover:bg-border text-text-secondary font-semibold py-2 px-4 rounded-lg flex items-center gap-2 border border-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={loading ? 'animate-spin' : ''}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                        {loading ? t('refreshing') : t('refresh')}
                    </button>
                </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2"><MarketIndices indices={marketIndices} loading={loading && isInitialLoad.current} lastUpdated={lastUpdated} /></div>
                <div className="lg:col-span-2"><KeyStocksWidget stocks={keyStocks} loading={loading} /></div>
                <div className="lg:col-span-4">
                    <EconomicIndicators 
                        indicators={economicIndicators} 
                        loading={loading}
                        selectedCountry={selectedCountry}
                        onCountryChange={setSelectedCountry}
                    />
                </div>
                <div className="lg:col-span-2">
                   {showSectorHeatmap ? (
                        <MarketHeatmap 
                           sectors={sectors} 
                           loading={loading && isInitialLoad.current}
                           onToggleView={() => setShowSectorHeatmap(false)}
                        />
                   ) : (
                        <SectorPerformance 
                           sectors={sectors} 
                           loading={loading && isInitialLoad.current}
                           lastUpdated={lastUpdated}
                           onToggleView={() => setShowSectorHeatmap(true)}
                        />
                   )}
                </div>
                <div className="lg:col-span-2"><MarketNews articles={displayedNews} loading={(loading && isInitialLoad.current) || isTranslating} onArticleClick={handleArticleClick}/></div>
            </div>
             <NewsDetailModal article={selectedArticle} originalArticle={selectedOriginalArticle} onClose={handleCloseModal} />
        </div>
    );
};

export default DashboardPage;