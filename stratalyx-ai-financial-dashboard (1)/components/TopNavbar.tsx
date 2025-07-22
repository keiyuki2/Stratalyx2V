import React, { useState, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { NavLink } = ReactRouterDOM;
import { Icons } from '../constants';
import { useAppContext } from '../context/AppContext';
import { Language } from '../types';
import AdminAuthModal from './AdminAuthModal';

interface TopNavbarProps {
    onLogout: () => void;
    isVisible: boolean;
    onOpenQuickActions: () => void;
}

const NavItem: React.FC<{ to: string; icon: React.ReactElement<{ className?: string }>; label: string; }> = ({ to, icon, label }) => {
    const baseClasses = "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeClasses = "bg-primary text-white";
    const inactiveClasses = "text-text-secondary hover:bg-border hover:text-text-primary";

    return (
        <NavLink
            to={to}
            className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
            {React.cloneElement(icon, { className: 'w-5 h-5' })}
            <span className="hidden lg:inline">{label}</span>
        </NavLink>
    );
};

const TopNavbar: React.FC<TopNavbarProps> = ({ onLogout, isVisible, onOpenQuickActions }) => {
    const { t, language, setLanguage } = useAppContext();
    const [logoClickCount, setLogoClickCount] = useState(0);
    const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
    const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const navItems = [
        { path: '/dashboard', labelKey: 'dashboard', icon: Icons.dashboard },
        { path: '/markets', labelKey: 'markets', icon: Icons.candlestickChart },
        { path: '/agents', labelKey: 'agents', icon: Icons.agents },
        { path: '/chat', labelKey: 'chat', icon: Icons.chat },
        { path: '/tools', labelKey: 'tools', icon: Icons.tools },
        { path: '/code', labelKey: 'navCode', icon: Icons.code },
    ];

    const toggleLanguage = () => {
        setLanguage(language === Language.EN ? Language.MN : Language.EN);
    };
    
    const handleLogoClick = () => {
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
        }

        const newCount = logoClickCount + 1;
        if (newCount === 7) {
            setIsAdminAuthModalOpen(true);
            setLogoClickCount(0);
        } else {
            setLogoClickCount(newCount);
            clickTimeoutRef.current = setTimeout(() => {
                setLogoClickCount(0);
            }, 2000); // Reset after 2 seconds of inactivity
        }
    };

    return (
        <>
            <header className={`bg-surface/90 backdrop-blur-lg border-b border-border flex-shrink-0 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div
                                className="flex-shrink-0 flex items-center gap-3 mr-4 cursor-pointer"
                                onClick={handleLogoClick}
                                title="Admin Access?"
                            >
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                    {React.cloneElement(Icons.logo, { className: 'w-full h-full object-cover' })}
                                </div>
                                <h1 className="text-xl font-bold text-text-primary hidden sm:block">Stratalyx AI</h1>
                            </div>
                            <nav className="flex items-center space-x-1">
                                {navItems.map(item => (
                                    <NavItem key={item.path} to={item.path} icon={item.icon} label={t(item.labelKey)} />
                                ))}
                            </nav>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onOpenQuickActions}
                                title="Open Quick Actions (⌘K)"
                                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-text-secondary bg-background border border-border hover:text-text-primary hover:border-primary transition-colors"
                            >
                                {React.cloneElement(Icons.search, { className: 'w-4 h-4' })}
                                <span className="hidden lg:inline">Search...</span>
                                <kbd className="ml-2 font-sans text-xs bg-border px-1.5 py-0.5 rounded">⌘K</kbd>
                            </button>
                            <button onClick={toggleLanguage} title="Toggle Language" className="flex items-center justify-center w-10 h-10 rounded-md text-sm font-medium text-text-secondary hover:bg-border hover:text-text-primary transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                            </button>
                             <NavLink
                                to="/settings"
                                title="Settings"
                                className={({ isActive }) => `flex items-center justify-center w-10 h-10 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white' : 'text-text-secondary hover:bg-border hover:text-text-primary'}`}
                            >
                                {React.cloneElement(Icons.settings, { className: 'w-5 h-5' })}
                            </NavLink>
                            <button onClick={onLogout} title="Logout" className="flex items-center justify-center w-10 h-10 rounded-md text-sm font-medium text-text-secondary hover:bg-border hover:text-text-primary transition-colors">
                                {React.cloneElement(Icons.logout, { className: 'w-5 h-5' })}
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <AdminAuthModal 
                isOpen={isAdminAuthModalOpen}
                onClose={() => setIsAdminAuthModalOpen(false)}
            />
        </>
    );
};

export default TopNavbar;