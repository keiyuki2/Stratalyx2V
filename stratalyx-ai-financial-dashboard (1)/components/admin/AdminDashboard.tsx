import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Icons } from '../../constants';
import { useAppContext } from '../../context/AppContext';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactElement<{ className?: string }>; change?: string; isPositive?: boolean }> = ({ title, value, icon, change, isPositive }) => {
    const changeColor = isPositive === undefined ? 'text-text-secondary' : isPositive ? 'text-success' : 'text-danger';
    return (
        <div className="bg-surface border border-border rounded-lg p-5">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-full">{React.cloneElement(icon, { className: 'w-6 h-6 text-primary' })}</div>
                    <div>
                        <p className="text-sm text-text-secondary">{title}</p>
                        <p className="text-2xl font-bold text-text-primary">{value}</p>
                    </div>
                </div>
                {change && <span className={`text-xs font-semibold ${changeColor}`}>{change}</span>}
            </div>
        </div>
    );
}

const MOCK_VERIFICATIONS = [
    { id: 'SUB_001', user: 'Bat-Erdene', plan: 'Pro Analyst', date: '2024-08-01' },
    { id: 'SUB_002', user: 'Khulan', plan: 'Plus', date: '2024-08-01' },
    { id: 'SUB_003', user: 'Temuujin', plan: 'Plus', date: '2024-07-31' },
];

const AdminDashboard: React.FC<{ setActiveView: (view: any) => void; }> = ({ setActiveView }) => {
    const { t } = useAppContext();
    const subscriptionData = [
        { name: t('planFree'), value: 400, fill: '#848D97' },
        { name: t('planPlus'), value: 300, fill: '#2F81F7' },
        { name: t('planProAnalyst'), value: 150, fill: '#34D399' },
        { name: t('planUltra'), value: 50, fill: '#8957E5' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title={t('totalUsers')} value="900" icon={Icons.user} change="+22 this week" isPositive={true} />
                <StatCard title={t('paidSubscribers')} value="500" icon={Icons.checkmark} change="+5 this week" isPositive={true} />
                <StatCard title="Token Usage Today" value="1.2M" icon={Icons.database} change="+10% today" isPositive={false} />
                <StatCard title={t('avgAgentVoteTime')} value="1.8s" icon={Icons.chat} change="-0.2s vs yesterday" isPositive={true} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-surface border border-border rounded-lg p-5">
                        <h3 className="font-bold text-text-primary mb-4">{t('recentPendingVerifications')}</h3>
                        <div className="space-y-2">
                            {MOCK_VERIFICATIONS.slice(0, 2).map(v => (
                                <div key={v.id} className="flex justify-between items-center bg-background p-3 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-text-primary">{v.user}</p>
                                        <p className="text-sm text-text-secondary">{t(`plan${v.plan.replace(' ', '')}`)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-text-secondary">{v.date}</p>
                                        <p className="text-xs text-text-secondary">{v.id}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                         <button onClick={() => setActiveView('billing')} className="text-sm text-primary hover:underline mt-4 w-full text-center">{t('viewAll')}</button>
                    </div>
                     <div className="bg-surface border border-border rounded-lg p-5">
                        <h3 className="font-bold text-danger mb-4">{t('systemWarnings')}</h3>
                         <ul className="space-y-3">
                             <li className="flex items-start gap-3 text-sm">
                                <div className="text-warning mt-0.5">{React.cloneElement(Icons.alertTriangle, { className: 'w-4 h-4' })}</div>
                                <div>
                                    <p className="font-semibold text-text-primary">{t('apiRateLimit')}</p>
                                    <p className="text-xs text-text-secondary">Consider upgrading API plan or optimizing queries.</p>
                                </div>
                             </li>
                              <li className="flex items-start gap-3 text-sm">
                                <div className="text-danger mt-0.5">{React.cloneElement(Icons.alertTriangle, { className: 'w-4 h-4' })}</div>
                                <div>
                                    <p className="font-semibold text-text-primary">{t('failedWebhooks')}</p>
                                    <p className="text-xs text-text-secondary">Check webhook configurations and server logs.</p>
                                </div>
                             </li>
                         </ul>
                    </div>
                </div>
                 <div className="lg:col-span-1 bg-surface border border-border rounded-lg p-5">
                    <h3 className="font-bold text-text-primary mb-4">{t('subscriptionsByPlan')}</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={subscriptionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {subscriptionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;