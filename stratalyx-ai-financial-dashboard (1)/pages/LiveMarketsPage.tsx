


import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    createChart,
    ColorType,
    CrosshairMode,
    IChartApi,
    ISeriesApi,
    CandlestickSeriesPartialOptions,
    ChartOptions,
    DeepPartial,
    UTCTimestamp,
    LogicalRange,
} from 'lightweight-charts';
import type { CandlestickData, CandlestickAnalysisResult, CandlestickPredictionResult } from '../types';
import { Icons } from '../constants';
import Sparkline from '../components/Sparkline';
import { useAppContext } from '../context/AppContext';
import { analyzeCandlestickData, predictCandlestickData } from '../services/analysisService';

const generateMockCandlestickData = (): CandlestickData[] => {
    const data: CandlestickData[] = [];
    let price = 150;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 200; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (200 - i));
        const time = date.getTime() / 1000;

        const open = price + (Math.random() - 0.5);
        const close = open + (Math.random() - 0.5) * 5;
        const high = Math.max(open, close) + Math.random() * 2;
        const low = Math.min(open, close) - Math.random() * 2;
        
        data.push({ time, open, high, low, close } as CandlestickData);
        price = close;
    }
    return data;
};

const mockPreviewData = Array.from({ length: 100 }, (_, i) => ({ value: 150 + Math.sin(i / 10) * 20 + Math.random() * 10 }));

interface MaxProfitInfo {
    buyPrice: number;
    buyDate: number; // timestamp
    sellPrice: number;
    sellDate: number; // timestamp
    profit: number;
    returnPercentage: number;
}


const StatRow: React.FC<{ label: string, value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-b-0">
        <span className="text-sm text-text-secondary">{label}</span>
        <span className="text-sm font-semibold text-text-primary text-right">{value}</span>
    </div>
);

const AnalysisInfo: React.FC<{ icon: React.ReactElement<{ className?: string }>, label: string, value: React.ReactNode, valueClass?: string }> = ({ icon, label, value, valueClass = '' }) => (
    <div className="flex items-start gap-3">
        {React.cloneElement(icon, { className: 'w-5 h-5 text-text-secondary mt-1 flex-shrink-0' })}
        <div>
            <p className="text-sm text-text-secondary">{label}</p>
            <p className={`font-semibold text-text-primary ${valueClass}`}>{value}</p>
        </div>
    </div>
);

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`bg-border/50 rounded animate-pulse ${className}`}></div>
);

const AIAnalysisPanel: React.FC<{ result: CandlestickAnalysisResult | null, isLoading: boolean, error: string | null, onRetry: () => void }> = ({ result, isLoading, error, onRetry }) => {
    if (isLoading && !result) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-sm text-danger mb-2">Analysis failed: {error}</p>
                <button onClick={onRetry} className="text-sm bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600">Retry?</button>
            </div>
        )
    }

    if (!result) {
        return <div className="text-sm text-text-secondary/70 text-center py-8">Click "Start Live AI" to get analysis.</div>;
    }

    const trendMap = {
        Bullish: { icon: Icons.trendUp, color: 'text-success' },
        Bearish: { icon: Icons.trendDown, color: 'text-danger' },
        Neutral: { icon: Icons.balanceScale, color: 'text-text-secondary' },
    };
    
    return (
        <div className="space-y-4">
            <AnalysisInfo icon={Icons.candlestickChart} label="Pattern Detected" value={result.pattern.name} />
            <AnalysisInfo
                icon={trendMap[result.trend].icon}
                label="Trend"
                value={result.trend}
                valueClass={trendMap[result.trend].color}
            />
            <AnalysisInfo icon={Icons.trendDown} label="Support Level" value={`$${result.supportLevel.toFixed(2)}`} />
            <AnalysisInfo icon={Icons.trendUp} label="Resistance Level" value={`$${result.resistanceLevel.toFixed(2)}`} />
             <AnalysisInfo icon={Icons.uncertainty} label="Confidence" value={`${result.confidence}/100`} />
            <div>
                <p className="text-sm text-text-secondary mb-1">Short-Term Outlook</p>
                <p className="text-sm text-text-primary bg-background p-2 rounded-md">{result.shortTermOutlook}</p>
            </div>
        </div>
    );
};

const ConfidenceBar: React.FC<{ value: number }> = ({ value }) => {
    let barColor = 'bg-success';
    if (value < 75) barColor = 'bg-warning';
    if (value < 50) barColor = 'bg-danger';

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-text-secondary">Confidence</p>
                <p className="font-bold text-text-primary text-sm">{value}%</p>
            </div>
            <div className="w-full bg-background rounded-full h-2">
                <div 
                    className={`h-2 rounded-full transition-all duration-500 ${barColor}`} 
                    style={{ width: `${value}%` }}
                ></div>
            </div>
        </div>
    );
};

const AIPredictionPanel: React.FC<{ result: CandlestickPredictionResult | null, isLoading: boolean, error: string | null, onRetry: () => void }> = ({ result, isLoading, error, onRetry }) => {
     if (isLoading && !result) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
        );
    }

     if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-sm text-danger mb-2">Prediction failed: {error}</p>
                <button onClick={onRetry} className="text-sm bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600">Retry?</button>
            </div>
        )
    }

    if (!result) {
        return <div className="text-sm text-text-secondary/70 text-center py-8">Forecasts will appear here.</div>;
    }

    return (
        <div className="space-y-4">
            <ConfidenceBar value={result.confidence} />
             <div>
                <p className="text-sm text-text-secondary mb-1">Forecast Rationale</p>
                <p className="text-sm text-text-primary bg-background p-2 rounded-md">{result.rationale}</p>
            </div>
        </div>
    );
};

const calculateMaxProfit = (data: CandlestickData[]): MaxProfitInfo | null => {
    if (data.length < 2) return null;

    let minPrice = Infinity;
    let maxProfit = 0;
    
    let buyPrice = 0;
    let sellPrice = 0;
    let buyTime = 0;
    let sellTime = 0;
    
    let tempBuyTime = 0;

    for (const candle of data) {
        if (candle.low < minPrice) {
            minPrice = candle.low;
            tempBuyTime = candle.time;
        }

        const potentialProfit = candle.high - minPrice;

        if (potentialProfit > maxProfit) {
            maxProfit = potentialProfit;
            buyPrice = minPrice;
            sellPrice = candle.high;
            buyTime = tempBuyTime;
            sellTime = candle.time;
        }
    }
    
    if (maxProfit <= 0) return null;

    return {
        buyPrice,
        buyDate: buyTime,
        sellPrice,
        sellDate: sellTime,
        profit: sellPrice - buyPrice,
        returnPercentage: buyPrice > 0 ? (maxProfit / buyPrice) * 100 : 0,
    };
};

const MaxProfitPanel: React.FC<{ info: MaxProfitInfo | null }> = ({ info }) => {
    const formatDate = (timestamp: number) => new Date(timestamp * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    if (!info) {
        return (
            <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="text-lg font-bold text-text-primary">Maximum Profit Insight</h3>
                <p className="text-sm text-text-secondary mt-2">Analysis of the visible historical data will appear here. Pan or zoom the chart to update.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-surface border border-border rounded-lg p-6">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-text-primary">Maximum Profit Insight</h3>
                <p className="text-sm text-text-secondary">AI-calculated optimal buy/sell window based on visible historical data.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                {/* Optimal Buy */}
                <div className="bg-background p-4 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        {React.cloneElement(Icons.trendUp, { className: 'w-5 h-5 text-success' })}
                        <p className="font-semibold text-text-primary">Optimal Buy</p>
                    </div>
                    <p className="text-2xl font-bold text-text-primary">${info.buyPrice.toFixed(2)}</p>
                    <p className="text-sm text-text-secondary">{formatDate(info.buyDate)}</p>
                </div>

                {/* Optimal Sell */}
                <div className="bg-background p-4 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                         {React.cloneElement(Icons.trendDown, { className: 'w-5 h-5 text-danger' })}
                        <p className="font-semibold text-text-primary">Optimal Sell</p>
                    </div>
                    <p className="text-2xl font-bold text-text-primary">${info.sellPrice.toFixed(2)}</p>
                    <p className="text-sm text-text-secondary">{formatDate(info.sellDate)}</p>
                </div>

                {/* Max Profit */}
                <div className="bg-background p-4 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        {React.cloneElement(Icons.financials, { className: 'w-5 h-5 text-primary' })}
                        <p className="font-semibold text-text-primary">Max Profit</p>
                    </div>
                    <p className="text-2xl font-bold text-success">${info.profit.toFixed(2)}</p>
                    <p className="text-sm text-text-secondary">Gain</p>
                </div>

                {/* Return on Investment */}
                <div className="bg-background p-4 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                         {React.cloneElement(Icons.pieChart, { className: 'w-5 h-5 text-brand-cyan' })}
                        <p className="font-semibold text-text-primary">Return</p>
                    </div>
                    <p className="text-2xl font-bold text-success">+{info.returnPercentage.toFixed(2)}%</p>
                    <p className="text-sm text-text-secondary">On Investment</p>
                </div>
            </div>
        </div>
    );
};

const timeframes = [
    { label: '1D', days: 7 },
    { label: '5D', days: 5 },
    { label: '1M', days: 21 },
    { label: '6M', days: 126 },
    { label: '1Y', days: 252 },
    { label: 'All', days: -1 },
];

const LiveMarketsPage: React.FC = () => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const predictionChartContainerRef = useRef<HTMLDivElement>(null);
    const chartApiRef = useRef<IChartApi | null>(null);
    const predictionChartApiRef = useRef<IChartApi | null>(null);
    const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const predictionSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    
    const [mockCandleData] = useState(generateMockCandlestickData());
    const [isForecastEnabled, setIsForecastEnabled] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isPredicting, setIsPredicting] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<CandlestickAnalysisResult | null>(null);
    const [predictionResult, setPredictionResult] = useState<CandlestickPredictionResult | null>(null);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [predictionError, setPredictionError] = useState<string | null>(null);
    const [maxProfit, setMaxProfit] = useState<MaxProfitInfo | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [activeTimeframe, setActiveTimeframe] = useState('All');
    
    const { t } = useAppContext();

    const runForecast = useCallback(async () => {
        if (!chartApiRef.current) return;
        
        setIsAnalyzing(true);
        setIsPredicting(true);
        setAnalysisError(null);
        setPredictionError(null);

        try {
            const logicalRange = chartApiRef.current.timeScale().getVisibleLogicalRange();
            if (logicalRange) {
                const visibleData = mockCandleData.slice(
                    Math.floor(Math.max(0, logicalRange.from)), 
                    Math.ceil(Math.min(mockCandleData.length, logicalRange.to))
                );

                if (visibleData.length > 0) {
                    const analysisPromise = analyzeCandlestickData(visibleData).catch(e => {
                        setAnalysisError(e.message || "Unknown error");
                        return null;
                    });
                    const predictionPromise = predictCandlestickData(visibleData).catch(e => {
                        setPredictionError(e.message || "Unknown error");
                        return null;
                    });

                    const [analysisRes, predictionRes] = await Promise.all([analysisPromise, predictionPromise]);
                    
                    setAnalysisResult(analysisRes);
                    setPredictionResult(predictionRes);
                    setLastUpdated(new Date());
                }
            }
        } catch (error) {
            console.error("AI forecast failed:", error);
        } finally {
            setIsAnalyzing(false);
            setIsPredicting(false);
        }
    }, [mockCandleData]);

    const handleTimeframeChange = (timeframeLabel: string) => {
        setActiveTimeframe(timeframeLabel);

        if (!chartApiRef.current || !mockCandleData || mockCandleData.length === 0) return;

        const timeScale = chartApiRef.current.timeScale();

        if (timeframeLabel === 'All') {
            timeScale.fitContent();
            return;
        }

        const timeframe = timeframes.find(tf => tf.label === timeframeLabel);
        if (!timeframe) return;

        const data = mockCandleData;
        const lastDataPoint = data[data.length - 1];
        const fromDataPoint = data[Math.max(0, data.length - timeframe.days)];

        if (lastDataPoint && fromDataPoint) {
            timeScale.setVisibleRange({
                from: fromDataPoint.time as UTCTimestamp,
                to: lastDataPoint.time as UTCTimestamp,
            });
        }
    };
    
    const handleResetView = () => {
        if (chartApiRef.current) {
            chartApiRef.current.timeScale().fitContent();
            setActiveTimeframe('All');
        }
    };

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval> | null = null;
        if (isForecastEnabled) {
            runForecast(); 
            intervalId = setInterval(runForecast, 10000); 
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isForecastEnabled, runForecast]);
    
    useEffect(() => {
        if (predictionResult && predictionSeriesRef.current) {
            const last50Historical = mockCandleData.slice(-50);
            const validPredictions = predictionResult.predictions?.filter(p => 
                p && p.time != null && p.open != null && p.high != null && p.low != null && p.close != null
            ) || [];
            const combinedData = [...last50Historical, ...validPredictions];
            predictionSeriesRef.current.setData(combinedData as any);
             if (predictionChartApiRef.current) {
                predictionChartApiRef.current.timeScale().fitContent();
            }
        }
    }, [predictionResult, mockCandleData]);

    useEffect(() => {
        if (!chartContainerRef.current || !predictionChartContainerRef.current || mockCandleData.length === 0) return;
        
        const chartOptions: DeepPartial<ChartOptions> = {
             layout: {
                background: { type: ColorType.Solid, color: '#0D1117' },
                textColor: '#E6EDF3',
            },
            grid: {
                vertLines: { color: '#30363D' },
                horzLines: { color: '#30363D' },
            },
            handleScroll: {
                mouseWheel: false,
                pressedMouseMove: true,
            },
            handleScale: {
                axisPressedMouseMove: true,
                mouseWheel: true,
                pinch: true,
            },
            crosshair: {
                mode: CrosshairMode.Normal,
            },
        };

        const historicalChart = createChart(chartContainerRef.current, {
            ...chartOptions,
            width: chartContainerRef.current.clientWidth,
            height: 400,
        });
        chartApiRef.current = historicalChart;
        candleSeriesRef.current = (historicalChart as any).addCandlestickSeries({
            upColor: '#238636', downColor: '#A42626',
            borderDownColor: '#A42626', borderUpColor: '#238636',
            wickDownColor: '#A42626', wickUpColor: '#238636',
        });
        candleSeriesRef.current.setData(mockCandleData as any);

        const predictionChart = createChart(predictionChartContainerRef.current, {
            ...chartOptions,
            width: predictionChartContainerRef.current.clientWidth,
            height: 250,
        });
        predictionChartApiRef.current = predictionChart;
        predictionSeriesRef.current = (predictionChart as any).addCandlestickSeries({
            upColor: 'rgba(52, 211, 153, 0.6)', downColor: 'rgba(248, 113, 113, 0.6)',
            borderUpColor: 'rgba(52, 211, 153, 1)', borderDownColor: 'rgba(248, 113, 113, 1)',
            wickUpColor: 'rgba(52, 211, 153, 1)', wickDownColor: 'rgba(248, 113, 113, 1)',
        });
        predictionSeriesRef.current.setData(mockCandleData.slice(-50) as any);

        const onVisibleRangeChange = (range: LogicalRange | null) => {
            if (range) {
                const visibleData = mockCandleData.slice(
                    Math.floor(Math.max(0, range.from)),
                    Math.ceil(Math.min(mockCandleData.length, range.to))
                );
                setMaxProfit(calculateMaxProfit(visibleData));
            }
        };

        historicalChart.timeScale().subscribeVisibleLogicalRangeChange(onVisibleRangeChange);
        const initialRange = historicalChart.timeScale().getVisibleLogicalRange();
        onVisibleRangeChange(initialRange);
        
        handleResetView();

        const handleResize = () => {
            if (chartContainerRef.current && chartApiRef.current) {
                 chartApiRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
            if (predictionChartContainerRef.current && predictionChartApiRef.current) {
                predictionChartApiRef.current.applyOptions({ width: predictionChartContainerRef.current.clientWidth });
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if(chartApiRef.current) {
                 chartApiRef.current.timeScale().unsubscribeVisibleLogicalRangeChange(onVisibleRangeChange);
                 chartApiRef.current.remove();
            }
            if(predictionChartApiRef.current) {
                predictionChartApiRef.current.remove();
            }
            chartApiRef.current = null;
            predictionChartApiRef.current = null;
        };
    }, [mockCandleData]);

    const handleToggleForecast = () => {
        setIsForecastEnabled(prev => !prev);
        if (isForecastEnabled) {
            setIsAnalyzing(false);
            setIsPredicting(false);
            setAnalysisError(null);
            setPredictionError(null);
        } else {
            setAnalysisResult(null);
            setPredictionResult(null);
        }
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full">
            <header className="mb-6 flex-shrink-0">
                <h1 className="text-2xl font-bold text-text-primary">{t('markets')}</h1>
                <p className="text-text-secondary">{t('liveMarketsSubtitle')}</p>
            </header>
            
            <div className="bg-surface border border-border rounded-lg p-3 mb-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-80">
                   <select
                        defaultValue="AAPL"
                        className="w-full bg-background border border-border rounded-md p-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                   >
                       <option value="AAPL">AAPL - Apple Inc.</option>
                       <option value="MSFT">MSFT - Microsoft Corp.</option>
                       <option value="GOOGL">GOOGL - Alphabet Inc.</option>
                   </select>
                </div>
                <div className="flex items-center bg-background border border-border rounded-md p-0.5">
                    {timeframes.map(({ label }) => (
                        <button
                            key={label}
                            onClick={() => handleTimeframeChange(label)}
                            className={`px-3 py-1 text-sm font-semibold rounded-[5px] transition-colors ${activeTimeframe === label ? 'bg-primary text-white' : 'text-text-secondary hover:bg-border/70'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                 <button onClick={handleResetView} title="Reset Chart View" className="text-text-secondary hover:bg-border p-2 rounded-md transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v6h6M21 21v-6h-6"/><path d="M3 11a9 9 0 0 1 9-8 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 13a9 9 0 0 1-9 8 9.75 9.75 0 0 1-6.74-2.74L3 16"/></svg>
                </button>
                 <button
                    onClick={handleToggleForecast}
                    className={`ml-auto font-semibold py-2 px-4 rounded-lg flex items-center gap-2 border transition-colors ${isForecastEnabled ? 'bg-danger/20 text-danger border-danger/50 hover:bg-danger/30' : 'bg-primary hover:bg-blue-600 text-white border-primary'}`}
                >
                    {isForecastEnabled ? (
                        <>
                           {React.cloneElement(Icons.code, {className: 'w-4 h-4'})}
                           <span>Stop Live AI</span>
                        </>
                    ) : (
                         <>
                           {React.cloneElement(Icons.agents, {className: 'w-4 h-4'})}
                           <span>Start Live AI</span>
                        </>
                    )}
                </button>
            </div>

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="bg-surface border border-border rounded-lg p-2">
                       <div ref={chartContainerRef} className="w-full h-[400px]" />
                    </div>
                    <div className="bg-surface border border-border rounded-lg p-2">
                       <h4 className="font-semibold text-text-primary px-2 pt-1">AI Price Prediction (Next 10 Periods)</h4>
                       <div ref={predictionChartContainerRef} className="w-full h-[250px]" />
                    </div>
                     <MaxProfitPanel info={maxProfit} />
                </div>

                <div className="lg:col-span-1 bg-surface border border-border rounded-lg p-4 flex flex-col">
                    <h3 className="text-xl font-bold text-text-primary mb-4 flex-shrink-0">Details</h3>
                        <div className="flex flex-col flex-grow min-h-0 overflow-y-auto pr-2">
                            <div className="flex-shrink-0">
                                <h4 className="text-lg font-bold text-text-primary truncate">Apple Inc.</h4>
                                <p className="text-sm text-text-secondary mb-3">AAPL</p>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <p className="text-3xl font-bold text-text-primary">172.50</p>
                                    <p className="text-lg font-semibold text-success">+2.75</p>
                                </div>
                                <p className="font-semibold text-success">(+1.62%)</p>
                            </div>
                            
                            <div className="my-4 pt-4 border-t border-border flex-shrink-0">
                                <h5 className="text-sm font-semibold text-text-secondary mb-2">Performance Preview (1Y)</h5>
                                <div className="h-40">
                                    <Sparkline data={mockPreviewData} color="#2F81F7" height={160}/>
                                </div>
                            </div>

                            <div className="mt-2 pt-4 border-t border-border flex-shrink-0">
                                <h5 className="text-sm font-semibold text-text-secondary mb-2">Key Statistics</h5>
                                <div className="space-y-1">
                                    <StatRow label="Market Cap" value="$2.81T" />
                                    <StatRow label="Volume" value="55.1M" />
                                    <StatRow label="Day's Range" value="169.80 - 173.15" />
                                    <StatRow label="52-Week Range" value="124.17 - 198.23" />
                                    <StatRow label="P/E Ratio" value="29.45" />
                                </div>
                            </div>

                             <div className="mt-4 pt-4 border-t border-border flex-shrink-0">
                                <h5 className="text-sm font-semibold text-text-secondary mb-2 flex items-center gap-2">
                                    AI Analysis
                                    {isForecastEnabled && (
                                         <span className={`flex items-center gap-1.5 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full ${!isAnalyzing && 'opacity-50'}`}>
                                            <span className={`w-2 h-2 rounded-full bg-primary ${isAnalyzing && 'animate-pulse'}`}></span>
                                            LIVE
                                         </span>
                                    )}
                                </h5>
                                <AIAnalysisPanel result={analysisResult} isLoading={isAnalyzing} error={analysisError} onRetry={runForecast} />
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-border flex-shrink-0">
                                <h5 className="text-sm font-semibold text-text-secondary mb-2 flex items-center gap-2">
                                    AI Prediction
                                    {isForecastEnabled && (
                                         <span className={`flex items-center gap-1.5 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full ${!isPredicting && 'opacity-50'}`}>
                                            <span className={`w-2 h-2 rounded-full bg-primary ${isPredicting && 'animate-pulse'}`}></span>
                                            LIVE
                                         </span>
                                    )}
                                </h5>
                                <AIPredictionPanel result={predictionResult} isLoading={isPredicting} error={predictionError} onRetry={runForecast} />
                            </div>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default LiveMarketsPage;