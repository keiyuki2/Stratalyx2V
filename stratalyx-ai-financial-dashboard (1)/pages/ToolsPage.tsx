import React, { useState, useEffect, useId } from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { getEconomicCalendar, getEarningsCalendar, getCommodityPrices, getMseSectors } from '../services/alphaVantageService';
import { getMntData } from '../services/fredService';
import { getFxRate } from '../services/twelveDataService';
import { compareStocks, analyzePortfolioHealth } from '../services/analysisService';
import { Icons, availableAgents } from '../constants';
import type { EconomicEvent, EarningEvent, Commodity, Currency, StockComparison, PortfolioHolding, PortfolioHealth, MseSector, MntData } from '../types';
import { useAppContext } from '../context/AppContext';

// --- SHARED COMPONENTS ---
const Card: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className = '', title }) => (
    <div className={`bg-surface border border-border rounded-lg ${className}`}>
        {title && <h3 className="text-lg font-bold text-text-primary px-6 pt-4">{title}</h3>}
        <div className="p-6">{children}</div>
    </div>
);

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`bg-border/50 rounded animate-pulse ${className}`}></div>
);

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface p-3 border border-border rounded-lg shadow-lg">
                <p className="label font-bold text-text-primary">{label}</p>
                {payload.map((pld: any, index: number) => (
                    <div key={index} style={{ color: pld.color }}>
                        {pld.name}: {pld.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// --- CALCULATOR: DOLLAR-COST AVERAGING ---
const DollarCostAveragingVisualizer: React.FC = () => {
    const [params, setParams] = useState({
        initial: 1000,
        monthly: 200,
        years: 10,
        rate: 8
    });
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        const data = [];
        let dcaValue = params.initial;
        const lumpSumValue = params.initial;
        const monthlyRate = Math.pow(1 + params.rate / 100, 1 / 12) - 1;

        for (let i = 0; i <= params.years * 12; i++) {
            const year = Math.floor(i / 12);
            let currentLumpSum = lumpSumValue * Math.pow(1 + monthlyRate, i);
            
            if (i > 0) {
                 dcaValue = dcaValue * (1 + monthlyRate) + params.monthly;
            }

            if (i % 12 === 0 || i === params.years * 12) {
                data.push({
                    year: year,
                    dca: dcaValue,
                    lumpSum: currentLumpSum
                });
            }
        }
        setResults(data);
    }, [params]);

    const totalInvested = params.initial + (params.monthly * params.years * 12);
    const finalDca = results[results.length - 1]?.dca || 0;
    const finalLumpSum = results[results.length - 1]?.lumpSum || 0;

    return (
        <Card title="Dollar-Cost Averaging (DCA) Visualizer">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                    <label className="text-sm text-text-secondary">Initial Investment ($)</label>
                    <input type="number" value={params.initial} onChange={e => setParams({...params, initial: +e.target.value})} className="w-full bg-background p-2 rounded-md border border-border mt-1" />
                </div>
                <div>
                    <label className="text-sm text-text-secondary">Monthly Contribution ($)</label>
                    <input type="number" value={params.monthly} onChange={e => setParams({...params, monthly: +e.target.value})} className="w-full bg-background p-2 rounded-md border border-border mt-1" />
                </div>
                <div>
                    <label className="text-sm text-text-secondary">Time Horizon (Years)</label>
                    <input type="number" value={params.years} onChange={e => setParams({...params, years: +e.target.value})} className="w-full bg-background p-2 rounded-md border border-border mt-1" />
                </div>
                <div>
                    <label className="text-sm text-text-secondary">Annual Return (%)</label>
                    <input type="number" value={params.rate} onChange={e => setParams({...params, rate: +e.target.value})} className="w-full bg-background p-2 rounded-md border border-border mt-1" />
                </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={results}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                    <XAxis dataKey="year" stroke="#848D97" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                    <YAxis stroke="#848D97" tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="dca" name="DCA Strategy" stroke="#2F81F7" strokeWidth={2} />
                    <Line type="monotone" dataKey="lumpSum" name="Lump Sum" stroke="#34D399" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-center">
                <div className="bg-background p-3 rounded-lg">
                    <p className="text-sm text-text-secondary">Total Invested (DCA)</p>
                    <p className="text-lg font-bold text-text-primary">${totalInvested.toLocaleString()}</p>
                </div>
                <div className="bg-background p-3 rounded-lg">
                    <p className="text-sm text-text-secondary">Final Balance (DCA)</p>
                    <p className="text-lg font-bold text-success">${finalDca.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                </div>
                 <div className="bg-background p-3 rounded-lg">
                    <p className="text-sm text-text-secondary">Final Balance (Lump Sum)</p>
                    <p className="text-lg font-bold text-success">${finalLumpSum.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                </div>
            </div>
        </Card>
    );
};


// --- MONGOLIA: MSE SECTOR TRACKER ---
const MseSectorTracker: React.FC = () => {
    const [sectors, setSectors] = useState<MseSector[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMseSectors().then(data => {
            setSectors(data);
            setLoading(false);
        });
    }, []);

    if(loading) return <Skeleton className="h-96 w-full" />

    return (
        <Card title="MSE Sector Tracker">
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie data={sectors} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {sectors.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    );
};

// --- MONGOLIA: MNT INSIGHTS ---
const MntInsights: React.FC = () => {
    const [mntData, setMntData] = useState<MntData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMntData().then(data => {
            setMntData(data);
            setLoading(false);
        });
    }, []);

    if(loading) return <Skeleton className="h-96 w-full" />
    if(!mntData) return <p>Could not load MNT data.</p>

    return(
        <Card title="Mongolian Tugrug (MNT) Insights">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-center">
                <div className="bg-background p-4 rounded-lg">
                    <p className="text-sm text-text-secondary">Inflation Rate (YoY)</p>
                    <p className="text-3xl font-bold text-danger">{mntData.inflation.toFixed(1)}%</p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                    <p className="text-sm text-text-secondary">Central Bank Policy Rate</p>
                    <p className="text-3xl font-bold text-primary">{mntData.policyRate.toFixed(1)}%</p>
                </div>
            </div>
            <h4 className="text-md font-semibold text-text-primary mb-2">MNT / USD Exchange Rate (24 Months)</h4>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mntData.historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                    <XAxis dataKey="date" stroke="#848D97" />
                    <YAxis stroke="#848D97" domain={['dataMin - 20', 'dataMax + 20']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="value" name="MNT/USD" stroke="#8957E5" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
};

// --- COMMODITIES TRACKER ---
const CommodityTracker: React.FC = () => {
    const [commodities, setCommodities] = useState<Commodity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCommodityPrices().then(data => {
            setCommodities(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <Skeleton className="h-64 w-full" />;

    return (
        <Card title="Commodity Tracker">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {commodities.map(c => (
                    <div key={c.name} className="bg-background p-4 rounded-lg text-center">
                         <div className="mx-auto w-10 h-10 mb-2">{c.icon}</div>
                        <p className="font-bold text-text-primary">{c.name}</p>
                        <p className="text-lg font-semibold text-text-primary">${c.price.toFixed(2)}</p>
                        <p className={`text-sm font-semibold ${c.change >= 0 ? 'text-success' : 'text-danger'}`}>{c.change.toFixed(2)} ({c.changePercent.toFixed(2)}%)</p>
                        <p className="text-xs text-text-secondary">{c.unit}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};


// --- AI: STOCK COMPARATOR ---
const StockComparator: React.FC = () => {
    const [tickers, setTickers] = useState({ t1: 'AAPL', t2: 'MSFT' });
    const [comparison, setComparison] = useState<{ comparison: StockComparison[], summary: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCompare = async () => {
        if (!tickers.t1 || !tickers.t2) {
            setError('Please enter two tickers to compare.');
            return;
        }
        setLoading(true);
        setError('');
        setComparison(null);
        const result = await compareStocks(tickers.t1, tickers.t2);
        if ('error' in result) {
            setError(result.error);
        } else {
            setComparison(result);
        }
        setLoading(false);
    };
    
    const renderComparisonRow = (label: string, key: keyof StockComparison) => {
        const item1 = comparison?.comparison[0]?.[key];
        const item2 = comparison?.comparison[1]?.[key];
        
        // Basic formatter, can be expanded
        const formatValue = (value: any) => {
            if (typeof value === 'number') {
                if (key.toLowerCase().includes('performance')) return `${value.toFixed(2)}%`;
                return value.toLocaleString();
            }
            return value;
        }

        return (
            <tr className="border-b border-border">
                <td className="py-3 px-4 text-sm font-semibold text-text-secondary">{label}</td>
                <td className="py-3 px-4 text-sm text-text-primary text-center">{formatValue(item1)}</td>
                <td className="py-3 px-4 text-sm text-text-primary text-center">{formatValue(item2)}</td>
            </tr>
        );
    }
    
    return (
        <Card title="AI Stock Comparator">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <input type="text" placeholder="Ticker 1" value={tickers.t1} onChange={e => setTickers({...tickers, t1: e.target.value.toUpperCase()})} className="w-full bg-background p-2 rounded-md border border-border" />
                <span className="text-text-secondary font-bold">vs</span>
                <input type="text" placeholder="Ticker 2" value={tickers.t2} onChange={e => setTickers({...tickers, t2: e.target.value.toUpperCase()})} className="w-full bg-background p-2 rounded-md border border-border" />
                <button onClick={handleCompare} disabled={loading} className="w-full md:w-auto bg-primary text-white font-semibold px-6 py-2 rounded-md disabled:bg-gray-500">
                    {loading ? 'Comparing...' : 'Compare'}
                </button>
            </div>
            {error && <p className="text-danger text-center mb-4">{error}</p>}
            {loading && <Skeleton className="h-96 w-full" />}
            {comparison && (
                <div>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-background">
                                <th className="py-2 px-4 text-left text-sm font-semibold text-text-secondary">Metric</th>
                                <th className="py-2 px-4 text-center text-sm font-semibold text-text-primary">{comparison.comparison[0].ticker}</th>
                                <th className="py-2 px-4 text-center text-sm font-semibold text-text-primary">{comparison.comparison[1].ticker}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderComparisonRow("Price", "price")}
                            {renderComparisonRow("Market Cap", "marketCap")}
                            {renderComparisonRow("P/E Ratio", "peRatio")}
                            {renderComparisonRow("YTD Performance", "performanceYTD")}
                            {renderComparisonRow("Volatility (Beta)", "volatility")}
                            {renderComparisonRow("Analyst Rating", "analystRating")}
                            {renderComparisonRow("AI Sentiment", "aiSentiment")}
                            {renderComparisonRow("Optimal Buy", "optimalBuy")}
                            {renderComparisonRow("Optimal Sell", "optimalSell")}
                        </tbody>
                    </table>
                    <div className="mt-6 bg-background p-4 rounded-lg">
                        <h4 className="font-semibold text-text-primary mb-2">AI Summary</h4>
                        <p className="text-text-secondary text-sm">{comparison.summary}</p>
                    </div>
                </div>
            )}
        </Card>
    );
};


// --- AI: PORTFOLIO HEALTH CHECK ---
const PortfolioHealthCheck: React.FC = () => {
    const [holdings, setHoldings] = useState<PortfolioHolding[]>([
        { id: '1', ticker: 'AAPL', shares: 10, purchasePrice: 150 },
        { id: '2', ticker: 'TSLA', shares: 5, purchasePrice: 200 },
        { id: '3', ticker: 'NVDA', shares: 3, purchasePrice: 400 },
    ]);
    const [analysis, setAnalysis] = useState<PortfolioHealth | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        setLoading(true);
        setError('');
        const result = await analyzePortfolioHealth(holdings);
        if ('error' in result) {
            setError(result.error);
        } else {
            setAnalysis(result);
        }
        setLoading(false);
    };
    
    const radarData = analysis ? [
        { subject: 'Risk', A: analysis.riskScore, fullMark: 100 },
        { subject: 'Performance', A: analysis.performance, fullMark: 100 },
        { subject: 'Diversification', A: analysis.diversification, fullMark: 100 },
        { subject: 'Value', A: analysis.value, fullMark: 100 },
        { subject: 'Potential', A: analysis.potential, fullMark: 100 },
    ] : [];

    return (
        <Card title="AI Portfolio Health Check">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h4 className="text-md font-semibold text-text-primary mb-2">Your Holdings</h4>
                    <div className="space-y-2 mb-4">
                        {holdings.map(h => (
                            <div key={h.id} className="flex items-center gap-2 bg-background p-2 rounded-md">
                                <input value={h.ticker} className="w-20 bg-surface p-1 rounded-md border border-border" readOnly/>
                                <input value={h.shares} className="w-20 bg-surface p-1 rounded-md border border-border" readOnly/>
                                <input value={h.purchasePrice} className="w-24 bg-surface p-1 rounded-md border border-border" readOnly/>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleAnalyze} disabled={loading} className="w-full bg-primary text-white font-semibold px-6 py-2 rounded-md disabled:bg-gray-500">
                        {loading ? 'Analyzing...' : 'Analyze Portfolio'}
                    </button>
                </div>
                <div>
                     {loading && <Skeleton className="h-80 w-full" />}
                     {error && <p className="text-danger text-center">{error}</p>}
                     {analysis && (
                        <div>
                             <ResponsiveContainer width="100%" height={300}>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="#30363D" />
                                    <PolarAngleAxis dataKey="subject" stroke="#848D97" />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Portfolio" dataKey="A" stroke="#2F81F7" fill="#2F81F7" fillOpacity={0.6} />
                                </RadarChart>
                            </ResponsiveContainer>
                            <div className="bg-background p-4 rounded-lg">
                                <h4 className="font-semibold text-text-primary mb-2">AI Summary</h4>
                                <p className="text-text-secondary text-sm">{analysis.summary}</p>
                            </div>
                        </div>
                     )}
                </div>
            </div>
        </Card>
    );
};


// --- MAIN PAGE ---
const ToolsPage: React.FC = () => {
    const { t } = useAppContext();
    const [activeTool, setActiveTool] = useState('dcaVisualizer');
    
    const toolCategories = [
        {
            nameKey: 'calculators',
            icon: Icons.pieChart,
            tools: [
                { id: 'dcaVisualizer', nameKey: 'dcaVisualizer' },
                // { id: 'compoundInterest', nameKey: 'compoundInterest' },
                // { id: 'investmentReturn', nameKey: 'investmentReturn' },
                // { id: 'riskQuiz', nameKey: 'riskQuiz' },
            ]
        },
        {
            nameKey: 'marketUtils',
            icon: Icons.screener,
            tools: [
                // { id: 'currencyConverter', nameKey: 'currencyConverter' },
                { id: 'commodityTracker', nameKey: 'commodityTracker' },
                // { id: 'economicCalendar', nameKey: 'economicCalendar' },
                // { id: 'earningsCalendar', nameKey: 'earningsCalendar' },
            ]
        },
        {
            nameKey: 'mongoliaSpecific',
            icon: Icons.balanceScale,
            tools: [
                { id: 'mseSectorTracker', nameKey: 'mseSectorTracker' },
                { id: 'mntInsights', nameKey: 'mntInsights' },
            ]
        },
        {
            nameKey: 'aiExtras',
            icon: Icons.agents,
            tools: [
                { id: 'stockComparator', nameKey: 'stockComparator' },
                { id: 'portfolioHealthCheck', nameKey: 'portfolioHealthCheck' },
            ]
        }
    ];
    
    const renderActiveTool = () => {
        switch (activeTool) {
            case 'dcaVisualizer': return <DollarCostAveragingVisualizer />;
            case 'mseSectorTracker': return <MseSectorTracker />;
            case 'mntInsights': return <MntInsights />;
            case 'commodityTracker': return <CommodityTracker />;
            case 'stockComparator': return <StockComparator />;
            case 'portfolioHealthCheck': return <PortfolioHealthCheck />;
            default: return <div>Select a tool</div>;
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-text-primary">{t('toolsTitle')}</h1>
                <p className="text-text-secondary">{t('toolsSubtitle')}</p>
            </header>
            
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="md:w-64 flex-shrink-0">
                    <nav className="space-y-4">
                        {toolCategories.map(category => (
                            <div key={category.nameKey}>
                                <h3 className="flex items-center gap-2 px-3 text-sm font-semibold text-text-secondary mb-2">
                                    {React.cloneElement(category.icon, { className: 'w-5 h-5' })}
                                    {t(category.nameKey)}
                                </h3>
                                <div className="space-y-1">
                                    {category.tools.map(tool => (
                                        <button
                                            key={tool.id}
                                            onClick={() => setActiveTool(tool.id)}
                                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeTool === tool.id ? 'bg-primary text-white font-semibold' : 'text-text-primary hover:bg-border'}`}
                                        >
                                            {t(tool.nameKey)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>
                </aside>

                <main className="flex-grow min-w-0">
                    {renderActiveTool()}
                </main>
            </div>
        </div>
    );
};

export default ToolsPage;