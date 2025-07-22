


import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate, Link } = ReactRouterDOM;
import { Icons } from '../constants';
import { getRealTimeQuotes } from '../services/twelveDataService';
import type { Stock } from '../types';

interface QuickActionsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const actionGroups = [
    {
        category: 'Quick Actions',
        actions: [
            { id: 'ai-analysis', label: 'AI Analysis', icon: Icons.agents, path: '/chat' },
            { id: 'settings', label: 'General Settings', icon: Icons.settings, path: '/settings' },
            { id: 'portfolio-check', label: 'Portfolio Check', icon: Icons.portfolio, path: '#' },
            { id: 'set-alerts', label: 'Set Alerts', icon: Icons.alerts, path: '#' },
        ],
    },
    {
        category: 'Market Tools',
        actions: [
            { id: 'stock-screener', label: 'Stock Screener', icon: Icons.screener, path: '#' },
            { id: 'compare-stocks', label: 'Compare Stocks', icon: Icons.compare, path: '#' },
            { id: 'earnings-calendar', label: 'Earnings Calendar', icon: Icons.calendar, path: '#' },
            { id: 'news-sentiment', label: 'News Sentiment', icon: Icons.cci, path: '#' },
        ],
    },
];

const QuickActionsModal: React.FC<QuickActionsModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [aiQuery, setAiQuery] = useState('');
    const [spxData, setSpxData] = useState<Stock | null>(null);
    const [spxLoading, setSpxLoading] = useState(true);
    const modalRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setSearchTerm('');
            setAiQuery('');
            searchInputRef.current?.focus();
            
            setSpxLoading(true);
            getRealTimeQuotes(['SPX'])
                .then(data => {
                    const quote = data['SPX'];
                    if (quote) {
                        setSpxData({
                            ticker: quote.symbol,
                            name: quote.name,
                            price: parseFloat(quote.close),
                            change: parseFloat(quote.change),
                            changePercent: parseFloat(quote.percent_change),
                            volume: parseInt(quote.volume, 10).toLocaleString(),
                        });
                    }
                })
                .catch(err => console.error("Failed to fetch SPX data for modal:", err))
                .finally(() => setSpxLoading(false));
        }
    }, [isOpen]);
    
    const handleAiSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (aiQuery.trim()) {
            navigate(`/chat?q=${encodeURIComponent(aiQuery)}`);
            onClose();
        }
    };
    
    const handleActionClick = (path: string) => {
      if(path === '#') {
        console.log("Placeholder action clicked.");
      }
      onClose();
    };

    const filteredGroups = actionGroups.map(group => ({
        ...group,
        actions: group.actions.filter(action =>
            action.label.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    })).filter(group => group.actions.length > 0);
    
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 transition-opacity duration-300"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                ref={modalRef}
                className="bg-surface w-full max-w-2xl rounded-lg border border-border shadow-2xl flex flex-col transition-all duration-300 transform scale-95 opacity-0 animate-fade-in-scale"
                onClick={e => e.stopPropagation()}
                style={{ animationFillMode: 'forwards' }}
            >
                <div className="p-3 border-b border-border flex items-center gap-3">
                    {React.cloneElement(Icons.search, { className: 'w-5 h-5 text-text-secondary' })}
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search for actions..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent text-text-primary placeholder-text-secondary focus:outline-none"
                    />
                </div>
                
                <div className="p-2 max-h-[300px] overflow-y-auto">
                    {filteredGroups.length > 0 ? (
                      filteredGroups.map(group => (
                        <div key={group.category} className="mb-2">
                            <h3 className="px-2 py-1 text-xs font-semibold text-text-secondary">{group.category}</h3>
                            <ul>
                                {group.actions.map(action => (
                                    <li key={action.id}>
                                        <Link 
                                            to={action.path} 
                                            onClick={() => handleActionClick(action.path)}
                                            className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-border cursor-pointer text-text-primary"
                                        >
                                            <div className="flex items-center gap-3">
                                                {React.cloneElement(action.icon, { className: 'w-5 h-5 text-text-secondary' })}
                                                <span>{action.label}</span>
                                            </div>
                                            {action.path !== '#' && React.cloneElement(Icons.arrowRight, { className: 'w-4 h-4 text-text-secondary' })}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                      ))
                    ) : (
                        <p className="text-center p-4 text-text-secondary">No actions found.</p>
                    )}
                </div>

                <form onSubmit={handleAiSubmit} className="p-3 border-t border-border">
                    <label className="text-xs font-semibold text-text-secondary mb-1 block px-1">Ask AI Assistant</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={aiQuery}
                            onChange={e => setAiQuery(e.target.value)}
                            placeholder="Get instant market insights..."
                            className="flex-grow bg-background border border-border rounded-md p-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                        <button type="submit" className="bg-primary text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors">
                            Ask
                        </button>
                    </div>
                </form>
                
                <footer className="bg-background rounded-b-lg p-3 border-t border-border">
                    {spxLoading ? (
                        <div className="animate-pulse flex items-center gap-4">
                            <div className="h-4 bg-border rounded w-20"></div>
                            <div className="h-4 bg-border rounded w-16"></div>
                            <div className="h-4 bg-border rounded w-12"></div>
                            <div className="h-4 bg-border rounded w-24 ml-auto"></div>
                        </div>
                    ) : spxData ? (
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                                <p className="font-bold text-text-primary">{spxData.name}</p>
                                <p className="font-semibold text-text-primary">{spxData.price.toFixed(2)}</p>
                                <p className={`font-semibold ${spxData.change >= 0 ? 'text-success' : 'text-danger'}`}>
                                    {spxData.change.toFixed(2)} ({spxData.changePercent.toFixed(2)}%)
                                </p>
                            </div>
                            <p className="text-text-secondary">Vol: {spxData.volume}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-text-secondary">S&P 500 data unavailable.</p>
                    )}
                </footer>
            </div>
            <style>{`
                @keyframes fade-in-scale {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fade-in-scale {
                    animation-name: fade-in-scale;
                    animation-duration: 0.2s;
                    animation-timing-function: ease-out;
                }
            `}</style>
        </div>
    );
};

export default QuickActionsModal;