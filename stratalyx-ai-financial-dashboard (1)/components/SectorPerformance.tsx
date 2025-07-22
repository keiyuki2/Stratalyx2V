import React, { useState } from 'react';
import type { Sector, SectorPerformanceData } from '../types';
import { useAppContext } from '../context/AppContext';

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`bg-border/50 rounded animate-pulse ${className}`}></div>
);

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-surface border border-border rounded-lg p-4 h-full flex flex-col ${className}`}>
        {children}
    </div>
);

type Timeframe = keyof SectorPerformanceData;

const formatMarketCap = (cap: number): string => {
    if (!cap) return 'N/A';
    if (cap >= 1e12) return `${(cap / 1e12).toFixed(1)}T`;
    if (cap >= 1e9) return `${(cap / 1e9).toFixed(1)}B`;
    if (cap >= 1e6) return `${(cap / 1e6).toFixed(1)}M`;
    return cap.toLocaleString();
};

export const SectorPerformance: React.FC<{ sectors: Sector[], loading: boolean, lastUpdated: Date | null, onToggleView: () => void }> = ({ sectors, loading, lastUpdated, onToggleView }) => {
    const [timeframe, setTimeframe] = useState<Timeframe>('1D');
    const { t } = useAppContext();

    const timeframes: { key: Timeframe; label: string }[] = [
        { key: '1D', label: '1D' },
        { key: '1W', label: '1W' },
        { key: '1M', label: '1M' },
        { key: '3M', label: '3M' },
        { key: '1Y', label: '1Y' },
    ];

    const renderLoadingState = () => (
        Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <div>
                        <Skeleton className="h-5 w-24 mb-1" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
                <Skeleton className="h-6 w-20" />
            </div>
        ))
    );

    const renderDataState = () => (
        sectors
            .sort((a, b) => (b.performance[timeframe] ?? -Infinity) - (a.performance[timeframe] ?? -Infinity))
            .map(sector => {
                const perf = sector.performance[timeframe];
                const isPositive = perf >= 0;
                return (
                    <div key={sector.ticker} className="flex items-center justify-between p-2 rounded-md hover:bg-background transition-colors">
                        <div className="flex items-center gap-3">
                             <div className="p-1.5 bg-background rounded-lg text-text-secondary">
                                {React.cloneElement(sector.icon, { className: 'w-5 h-5' })}
                             </div>
                            <div>
                                <p className="font-bold text-text-primary">{sector.name}</p>
                                <p className="text-xs text-text-secondary">
                                    Cap: {formatMarketCap(sector.marketCap)} &bull; {sector.leaders}
                                </p>
                            </div>
                        </div>
                        <div className={`w-24 text-right font-semibold text-lg ${isPositive ? 'text-success' : 'text-danger'}`}>
                            {isPositive ? '+' : ''}{perf?.toFixed(2) ?? 'N/A'}%
                        </div>
                    </div>
                );
            })
    );

    return (
        <Card>
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-text-primary">{t('sectorPerformance')}</h3>
                <div className="flex items-center bg-background border border-border rounded-md p-0.5">
                    {timeframes.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTimeframe(t.key)}
                            className={`px-2 py-1 text-xs font-semibold rounded-[5px] transition-colors ${timeframe === t.key ? 'bg-primary text-white' : 'text-text-secondary hover:bg-border/70'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-grow space-y-1 -mx-2 px-2 overflow-y-auto">
                {loading ? renderLoadingState() : renderDataState()}
            </div>
            <div className="flex justify-between items-center pt-3 mt-2 border-t border-border">
                <p className="text-xs text-text-secondary">
                    {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : ''}
                </p>
                <button onClick={onToggleView} className="text-sm font-semibold text-primary hover:underline focus:outline-none">
                    {t('heatMap')}
                </button>
            </div>
        </Card>
    );
};