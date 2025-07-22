
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CountryCode } from '../types';
import { countryStockMap as defaultStockMap } from '../constants';

type StockIdentifier = { ticker: string; name: string };
type CustomStockMap = Record<CountryCode, StockIdentifier[]>;

interface SettingsContextType {
    customStocks: CustomStockMap;
    addStock: (country: CountryCode, stock: StockIdentifier) => void;
    removeStock: (country: CountryCode, ticker: string) => void;
    isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [customStocks, setCustomStocks] = useState<CustomStockMap>(defaultStockMap);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const savedStocks = localStorage.getItem('customStocks');
            if (savedStocks) {
                setCustomStocks(JSON.parse(savedStocks));
            }
        } catch (error) {
            console.error("Failed to load custom stocks from localStorage", error);
            // Fallback to default if parsing fails
            setCustomStocks(defaultStockMap);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // Persist to localStorage whenever customStocks changes, but not on initial load
        if (!isLoading) {
            try {
                localStorage.setItem('customStocks', JSON.stringify(customStocks));
            } catch (error) {
                console.error("Failed to save custom stocks to localStorage", error);
            }
        }
    }, [customStocks, isLoading]);

    const addStock = useCallback((country: CountryCode, stock: StockIdentifier) => {
        setCustomStocks(prev => {
            const countryStocks = prev[country] || [];
            if (countryStocks.some(s => s.ticker.toLowerCase() === stock.ticker.toLowerCase())) {
                // Prevent duplicates
                return prev;
            }
            return {
                ...prev,
                [country]: [...countryStocks, stock]
            };
        });
    }, []);

    const removeStock = useCallback((country: CountryCode, ticker: string) => {
        setCustomStocks(prev => ({
            ...prev,
            [country]: prev[country].filter(s => s.ticker !== ticker)
        }));
    }, []);

    const value = { customStocks, addStock, removeStock, isLoading };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
