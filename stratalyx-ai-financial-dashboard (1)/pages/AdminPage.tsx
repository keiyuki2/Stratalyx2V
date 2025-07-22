import React, { useState } from 'react';
import { Icons } from '../constants';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserManagement from '../components/admin/UserManagement';
import BillingVerifications from '../components/admin/BillingVerifications';
import AiAgentManagement from '../components/admin/AiAgentManagement';
import SubscriptionControl from '../components/admin/SubscriptionControl';
import CodeManager from '../components/admin/CodeManager';
import FeedbackManager from '../components/admin/FeedbackManager';
import ContentManager from '../components/admin/ContentManager';
import NotificationEngine from '../components/admin/NotificationEngine';
import LogAnalytics from '../components/admin/LogAnalytics';
import DangerZone from '../components/admin/DangerZone';
import { useAppContext } from '../context/AppContext';

type AdminView = 'dashboard' | 'users' | 'aiAgents' | 'subscriptions' | 'billing' | 'codes' | 'feedback' | 'content' | 'notifications' | 'logs' | 'dangerZone';

interface NavItem {
    id: AdminView;
    labelKey: string;
    icon: React.ReactElement<{ className?: string }>;
    type?: 'item';
}
interface NavSeparator {
    id: string;
    type: 'separator';
}
type NavItemType = NavItem | NavSeparator;


const AdminPage: React.FC = () => {
    const { t } = useAppContext();
    const [activeView, setActiveView] = useState<AdminView>('dashboard');
    
    const navItems: NavItemType[] = [
        { id: 'dashboard', labelKey: 'adminDashboard', icon: Icons.dashboard, type: 'item' },
        { id: 'sep1', type: 'separator' },
        { id: 'users', labelKey: 'userManagement', icon: Icons.user, type: 'item' },
        { id: 'sep2', type: 'separator' },
        { id: 'aiAgents', labelKey: 'aiAgentManagement', icon: Icons.agents, type: 'item' },
        { id: 'subscriptions', labelKey: 'subscriptionControl', icon: Icons.financials, type: 'item' },
        { id: 'billing', labelKey: 'billingVerifications', icon: Icons.checkmark, type: 'item' },
        { id: 'codes', labelKey: 'codeManager', icon: Icons.gift, type: 'item' },
        { id: 'feedback', labelKey: 'feedbackManager', icon: Icons.star, type: 'item' },
        { id: 'sep3', type: 'separator' },
        { id: 'content', labelKey: 'contentManager', icon: Icons.research, type: 'item' },
        { id: 'notifications', labelKey: 'notificationEngine', icon: Icons.alerts, type: 'item' },
        { id: 'logs', labelKey: 'logAnalytics', icon: Icons.database, type: 'item' },
        { id: 'sep4', type: 'separator' },
        { id: 'dangerZone', labelKey: 'dangerZone', icon: Icons.alertTriangle, type: 'item' },
    ];
    
    const renderContent = () => {
        switch (activeView) {
            case 'dashboard': return <AdminDashboard setActiveView={setActiveView} />;
            case 'users': return <UserManagement />;
            case 'aiAgents': return <AiAgentManagement />;
            case 'subscriptions': return <SubscriptionControl />;
            case 'billing': return <BillingVerifications />;
            case 'codes': return <CodeManager />;
            case 'feedback': return <FeedbackManager />;
            case 'content': return <ContentManager />;
            case 'notifications': return <NotificationEngine />;
            case 'logs': return <LogAnalytics />;
            case 'dangerZone': return <DangerZone />;
            default: return <AdminDashboard setActiveView={setActiveView} />;
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-text-primary">{t('adminPanel')}</h1>
                <p className="text-text-secondary mt-1">{t('adminPanelSubtitle')}</p>
            </header>
            
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="md:w-60 flex-shrink-0">
                    <nav className="space-y-1">
                        {navItems.map(item => {
                             if (item.type === 'separator') {
                                return <div key={item.id} className="pt-2"></div>;
                            }
                            const isDanger = item.id === 'dangerZone';
                            const isActive = activeView === item.id;
                            
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveView(item.id as AdminView)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                                        isActive
                                            ? isDanger ? 'bg-danger/80 text-white' : 'bg-primary text-white' 
                                            : isDanger ? 'text-danger hover:bg-danger/20' : 'text-text-secondary hover:bg-border hover:text-text-primary'
                                    }`}
                                    aria-current={activeView === item.id}
                                >
                                    {React.cloneElement(item.icon, { className: 'w-5 h-5' })}
                                    <span>{t(item.labelKey)}</span>
                                </button>
                            )
                        })}
                    </nav>
                </aside>
                
                <main className="flex-grow min-w-0">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminPage;