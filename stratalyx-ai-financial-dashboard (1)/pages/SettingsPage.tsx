import React, { useState } from 'react';
import { NotificationSettings } from '../components/NotificationSettings';
import { ManageStocks } from '../components/ManageStocks';
import { SoundSettings } from '../components/SoundSettings';
import { DataSettings } from '../components/DataSettings';
import { ProfileSettings } from '../components/ProfileSettings';
import { AiPreferencesSettings } from '../components/AiPreferencesSettings';
import { IntegrationsSettings } from '../components/IntegrationsSettings';
import { Icons } from '../constants';
import type { SubscriptionPlan } from '../types';
import { useAppContext } from '../context/AppContext';

type SettingsView = 'account' | 'ai' | 'notifications' | 'stocks' | 'data' | 'integrations';

const SettingsPage: React.FC = () => {
    const [activeView, setActiveView] = useState<SettingsView>('account');
    const [userPlan, setUserPlan] = useState<SubscriptionPlan>('Free');
    const { t } = useAppContext();

    const navItems = [
        { id: 'account', labelKey: 'account', icon: Icons.user },
        { id: 'ai', labelKey: 'aiPreferences', icon: Icons.agents },
        { id: 'notifications', labelKey: 'notificationsSound', icon: Icons.alerts },
        { id: 'stocks', labelKey: 'myStocks', icon: Icons.portfolio },
        { id: 'data', labelKey: 'dataManagement', icon: Icons.database },
        { id: 'integrations', labelKey: 'integrations', icon: Icons.link },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-text-primary">{t('settings')}</h1>
                <p className="text-text-secondary mt-1">{t('settingsSubtitle')}</p>
            </header>

            <nav className="mb-8 bg-surface border border-border rounded-lg p-2 flex items-center gap-2 overflow-x-auto">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id as SettingsView)}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeView === item.id 
                            ? 'bg-primary text-white' 
                            : 'text-text-secondary hover:bg-border hover:text-text-primary'
                        }`}
                        aria-current={activeView === item.id}
                    >
                        {React.cloneElement(item.icon, { className: 'w-5 h-5' })}
                        <span className="hidden sm:inline">{t(item.labelKey)}</span>
                    </button>
                ))}
            </nav>

            <div className="space-y-8">
                {activeView === 'account' && (
                    <ProfileSettings userPlan={userPlan} setUserPlan={setUserPlan} />
                )}
                {activeView === 'ai' && (
                    <AiPreferencesSettings userPlan={userPlan} setUserPlan={setUserPlan} />
                )}
                {activeView === 'notifications' && (
                    <>
                        <NotificationSettings />
                        <SoundSettings />
                    </>
                )}
                {activeView === 'stocks' && (
                    <ManageStocks />
                )}
                {activeView === 'data' && (
                    <DataSettings />
                )}
                {activeView === 'integrations' && (
                    <IntegrationsSettings userPlan={userPlan} />
                )}
            </div>
        </div>
    );
};

export default SettingsPage;