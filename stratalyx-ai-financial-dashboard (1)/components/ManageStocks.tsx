

import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { SUPPORTED_COUNTRIES } from '../pages/DashboardPage';
import type { CountryCode } from '../types';
import { useAppContext } from '../context/AppContext';

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-surface border border-border rounded-lg p-4 sm:p-6 ${className}`}>
        {children}
    </div>
);

export const ManageStocks: React.FC = () => {
    const { customStocks, addStock, removeStock, isLoading } = useSettings();
    const [activeTab, setActiveTab] = useState<CountryCode>('US');
    const [newStock, setNewStock] = useState({ ticker: '', name: '' });
    const [error, setError] = useState('');
    const { t } = useAppContext();

    const handleAddStock = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStock.ticker.trim() || !newStock.name.trim()) {
            setError('Both ticker and name are required.');
            return;
        }
        addStock(activeTab, {
            ticker: newStock.ticker.toUpperCase().trim(),
            name: newStock.name.trim()
        });
        setNewStock({ ticker: '', name: '' });
        setError('');
    };

    if (isLoading) {
        return <div className="text-text-secondary">Loading settings...</div>;
    }

    return (
        <Card>
            <h2 className="text-xl font-bold text-text-primary mb-4">{t('manageKeyStocks')}</h2>
            <p className="text-text-secondary mb-6">{t('manageKeyStocksDesc')}</p>
            
            <div className="flex border-b border-border mb-4 overflow-x-auto">
                {SUPPORTED_COUNTRIES.map(country => (
                    <button
                        key={country.code}
                        onClick={() => setActiveTab(country.code)}
                        className={`px-3 py-2 text-sm font-semibold transition-colors focus:outline-none flex-shrink-0 ${activeTab === country.code ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                        {t(country.name)}
                    </button>
                ))}
            </div>

            <div>
                <form onSubmit={handleAddStock} className="flex flex-col sm:flex-row items-start gap-2 mb-4 p-4 bg-background rounded-lg">
                    <div className="flex-1 w-full">
                        <label htmlFor="ticker" className="text-xs text-text-secondary">{t('stockTicker')}</label>
                        <input
                            id="ticker"
                            type="text"
                            value={newStock.ticker}
                            onChange={(e) => setNewStock({ ...newStock, ticker: e.target.value })}
                            placeholder="e.g., AAPL"
                            className="w-full bg-surface border border-border rounded-md p-2 mt-1 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                     <div className="flex-1 w-full">
                        <label htmlFor="name" className="text-xs text-text-secondary">{t('companyName')}</label>
                        <input
                            id="name"
                            type="text"
                            value={newStock.name}
                            onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
                            placeholder="e.g., Apple Inc."
                            className="w-full bg-surface border border-border rounded-md p-2 mt-1 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                    <button type="submit" className="w-full sm:w-auto mt-2 sm:mt-6 bg-primary text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                        {t('addAgent')}
                    </button>
                </form>
                {error && <p className="text-danger text-sm mb-4">{error}</p>}
                
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                    {customStocks[activeTab]?.length > 0 ? customStocks[activeTab].map(stock => (
                        <div key={stock.ticker} className="flex justify-between items-center bg-background p-3 rounded-lg">
                            <div>
                                <p className="font-bold text-text-primary">{stock.ticker}</p>
                                <p className="text-sm text-text-secondary">{stock.name}</p>
                            </div>
                            <button onClick={() => removeStock(activeTab, stock.ticker)} className="text-danger/70 hover:text-danger font-semibold px-3 py-1 rounded-md text-sm hover:bg-danger/20 transition-colors">
                                {t('remove')}
                            </button>
                        </div>
                    )) : (
                         <p className="text-center p-4 text-text-secondary">{t('noCustomStocks')}</p>
                    )}
                </div>
            </div>
        </Card>
    );
};
