import React from 'react';
import type { Sector } from '../types';
import { useAppContext } from '../context/AppContext';

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`bg-border/50 rounded-lg animate-pulse ${className}`}></div>
);

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-surface border border-border rounded-lg p-4 h-full ${className}`}>
        {children}
    </div>
);

const getPerformanceColor = (performance: number): string => {
    if (performance >= 1.5) return 'bg-success/80 hover:bg-success';
    if (performance > 0) return 'bg-success/50 hover:bg-success/70';
    if (performance <= -1.5) return 'bg-danger/80 hover:bg-danger';
    if (performance < 0) return 'bg-danger/50 hover:bg-danger/70';
    return 'bg-gray-700';
};

const HeatmapTile: React.FC<{ sector: Sector, className?: string }> = ({ sector, className = '' }) => (
    <div
        className={`p-3 rounded-lg flex flex-col justify-center items-center text-center text-white transition-colors duration-200 ${getPerformanceColor(sector.performance['1D'])} ${className}`}
        title={`${sector.name}: ${sector.performance['1D'] >= 0 ? '+' : ''}${sector.performance['1D'].toFixed(2)}%`}
    >
        <p className="font-bold text-sm md:text-base">{sector.name}</p>
        <p className="text-lg md:text-xl font-semibold">{sector.performance['1D'] >= 0 ? '+' : ''}{sector.performance['1D'].toFixed(2)}%</p>
    </div>
);

export const MarketHeatmap: React.FC<{ sectors: Sector[], loading: boolean, onToggleView: () => void }> = ({ sectors, loading, onToggleView }) => {
    const { t } = useAppContext();
    const renderContent = () => {
        if (loading) {
            return (
                <div className="grid grid-cols-4 grid-rows-2 gap-2 h-72">
                    <Skeleton className="col-span-2 row-span-2" />
                    <Skeleton className="col-span-2 row-span-1" />
                    <Skeleton className="col-span-1 row-span-1" />
                    <Skeleton className="col-span-1 row-span-1" />
                </div>
            );
        }

        const sortedSectors = sectors
            .filter(s => s.marketCap && s.marketCap > 0 && s.performance != null)
            .sort((a, b) => b.marketCap - a.marketCap);

        if (sortedSectors.length === 0) {
            return (
                <div className="flex items-center justify-center h-full text-text-secondary">
                    No sector data available.
                </div>
            );
        }

        const [s1, s2, s3, s4, ...rest] = sortedSectors;
        
        return (
            <>
                <div className="grid grid-cols-4 grid-rows-2 gap-2 h-72">
                    {s1 && <HeatmapTile sector={s1} className="col-span-2 row-span-2" />}
                    {s2 && <HeatmapTile sector={s2} className="col-span-2 row-span-1" />}
                    {s3 && <HeatmapTile sector={s3} className="col-span-1 row-span-1" />}
                    {s4 && <HeatmapTile sector={s4} className="col-span-1 row-span-1" />}
                </div>
                <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary mt-4">
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-danger/80"></span> Strong Decline</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-danger/50"></span> Decline</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-success/50"></span> Gain</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-success/80"></span> Strong Gain</div>
                </div>
            </>
        );
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-text-primary">{t('marketHeatmap')}</h3>
                <button onClick={onToggleView} className="text-sm font-semibold text-primary hover:underline focus:outline-none">
                    {t('listView')}
                </button>
            </div>
            {renderContent()}
        </Card>
    );
};