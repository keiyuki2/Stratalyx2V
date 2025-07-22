import React, { useState } from 'react';
import { Icons } from '../constants';
import type { SubscriptionPlan } from '../types';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-surface border border-border rounded-lg p-4 sm:p-6 ${className}`}>
        {children}
    </div>
);

const IntegrationCard: React.FC<{
    title: string;
    description: string;
    icon: React.ReactElement<{ className?: string }>;
    isLocked: boolean;
    lockedPlanName: string;
    isComingSoon?: boolean;
    children?: React.ReactNode;
}> = ({ title, description, icon, isLocked, lockedPlanName, isComingSoon = false, children }) => {
    const { t } = useAppContext();
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    
    const handleConnectClick = () => {
        if (isLocked || isComingSoon) return;
        if (isConnected) {
            setIsConnected(false);
        } else {
            setIsExpanded(prev => !prev);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsConnecting(true);
        setTimeout(() => {
            setIsConnecting(false);
            setIsConnected(true);
            setIsExpanded(false);
        }, 2000);
    };

    const getButtonContent = () => {
        if (isLocked) return `Upgrade to ${lockedPlanName}`;
        if (isComingSoon) return t('comingSoon');
        if (isConnected) return t('disconnect');
        if (isExpanded) return 'Cancel';
        return t('connectAccount');
    };
    
    const getButtonTitle = () => {
        if (isLocked) return `Available for ${lockedPlanName} plan and above`;
        return '';
    };

    return (
        <div className="bg-background p-4 rounded-lg border border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="p-3 bg-border rounded-full text-text-primary">
                    {React.cloneElement(icon, { className: 'w-6 h-6' })}
                </div>
                <div className="flex-grow">
                    <h4 className="font-bold text-text-primary">{title}</h4>
                    <p className="text-sm text-text-secondary">{description}</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {isConnected && (
                        <div className="flex items-center gap-2 text-sm font-semibold text-success">
                            <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></div>
                            {t('connected')}
                        </div>
                    )}
                    <button
                        onClick={handleConnectClick}
                        disabled={isComingSoon || isLocked}
                        title={getButtonTitle()}
                        className={cn(
                            "w-full sm:w-auto text-sm font-semibold py-2 px-4 rounded-lg transition-colors",
                            isLocked || isComingSoon ? "bg-border text-text-secondary cursor-not-allowed" :
                            isConnected ? "bg-danger/20 text-danger hover:bg-danger/30" :
                            "bg-primary text-white hover:bg-blue-600"
                        )}
                    >
                        {getButtonContent()}
                    </button>
                </div>
            </div>
            {isExpanded && !isConnected && (
                <form onSubmit={handleFormSubmit} className="mt-4 pt-4 border-t border-border space-y-4">
                    {children}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsExpanded(false)}
                            className="bg-surface hover:bg-border text-text-primary font-semibold py-2 px-4 rounded-lg border border-border"
                        >
                            Cancel
                        </button>
                         <button
                            type="submit"
                            disabled={isConnecting}
                            className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 disabled:bg-gray-500"
                        >
                            {isConnecting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                            {isConnecting ? t('connecting') : t('connectAccount')}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

const SecuredInput: React.FC<{ id: string, label: string, placeholder: string }> = ({ id, label, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
        <div className="relative">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                {React.cloneElement(Icons.lock as React.ReactElement<{ className?: string }>)}
            </span>
            <input
                id={id}
                type="password"
                placeholder={placeholder}
                className="w-full bg-surface border border-border rounded-md p-2 pl-9 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
        </div>
    </div>
)

export const IntegrationsSettings: React.FC<{ userPlan: SubscriptionPlan }> = ({ userPlan }) => {
    const { t } = useAppContext();

    return (
        <Card>
            <h2 className="text-xl font-bold text-text-primary">{t('integrations')}</h2>
            <p className="text-text-secondary mb-6">{t('integrationsSubtitle')}</p>
            <div className="space-y-4">
                <IntegrationCard
                    title={t('metatraderTitle')}
                    description={t('metatraderDesc')}
                    icon={React.cloneElement(Icons.link as React.ReactElement<{ className?: string }>)}
                    isLocked={userPlan !== 'Ultra'}
                    lockedPlanName="Ultra"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <SecuredInput id="mt5-login" label={t('loginId')} placeholder="12345678" />
                        <SecuredInput id="mt5-password" label={t('password')} placeholder="••••••••••" />
                        <SecuredInput id="mt5-server" label={t('server')} placeholder="MetaQuotes-Demo" />
                    </div>
                    <p className="text-xs text-text-secondary text-center">{t('credentialsNote')}</p>
                </IntegrationCard>

                <IntegrationCard
                    title={t('tradingviewTitle')}
                    description={t('tradingviewDesc')}
                    icon={React.cloneElement(Icons.link as React.ReactElement<{ className?: string }>)}
                    isLocked={userPlan !== 'Pro Analyst' && userPlan !== 'Ultra'}
                    lockedPlanName="Pro Analyst"
                >
                    <div className="grid grid-cols-1">
                        <SecuredInput id="tv-token" label={t('usernameToken')} placeholder="Enter your Username or Token" />
                    </div>
                    <p className="text-xs text-text-secondary text-center mt-2">{t('credentialsNote')}</p>
                </IntegrationCard>

                 <IntegrationCard
                    title={t('binanceTitle')}
                    description={t('binanceDesc')}
                    icon={React.cloneElement(Icons.link as React.ReactElement<{ className?: string }>)}
                    isLocked={userPlan !== 'Ultra'}
                    lockedPlanName="Ultra"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SecuredInput id="binance-api" label={t('apiKey')} placeholder="Enter your API Key" />
                        <SecuredInput id="binance-secret" label={t('secretKey')} placeholder="Enter your Secret Key" />
                    </div>
                    <p className="text-xs text-text-secondary text-center mt-2">{t('credentialsNote')}</p>
                </IntegrationCard>
            </div>
        </Card>
    );
};