

import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const mockTransactions = [
    { id: 'txn_1', user: 'John Trader', plan: 'Pro Analyst', amount: '60,000₮', date: '2024-07-25', status: 'Success' },
    { id: 'txn_2', user: 'Jane Doe', plan: 'Plus', amount: '25,000₮', date: '2024-07-24', status: 'Success' },
    { id: 'txn_3', user: 'Peter Jones', plan: 'Free', amount: '0₮', date: '2024-07-22', status: 'Success' },
];

const mockUsers = [
    { id: 'usr_001', name: 'John Trader'},
    { id: 'usr_002', name: 'Jane Doe'},
    { id: 'usr_005', name: 'Peter Jones'},
]

const SubscriptionControl: React.FC = () => {
    const { t } = useAppContext();
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedPlan, setSelectedPlan] = useState('');

    const handleUpgrade = () => {
        if (!selectedUser || !selectedPlan) {
            alert('Please select a user and a plan.');
            return;
        }
        console.log(`Upgrading user ${selectedUser} to ${selectedPlan} plan.`);
        alert(`User ${selectedUser} upgraded to ${selectedPlan}!`);
    };

    return (
        <div className="space-y-6">
            <div className="bg-surface border border-border rounded-lg">
                <div className="p-4 border-b border-border">
                    <h2 className="text-xl font-bold text-text-primary">{t('transactions')}</h2>
                </div>
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-background">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-text-secondary">Transaction ID</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-text-secondary">{t('user')}</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-text-secondary">{t('plan')}</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-text-secondary">Amount</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-text-secondary">Date</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-text-secondary">{t('status')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {mockTransactions.map(tx => (
                            <tr key={tx.id}>
                                <td className="py-3 px-4 text-sm text-text-secondary font-mono">{tx.id}</td>
                                <td className="py-3 px-4 text-sm font-semibold text-text-primary">{tx.user}</td>
                                <td className="py-3 px-4 text-sm text-text-secondary">{tx.plan}</td>
                                <td className="py-3 px-4 text-sm text-text-primary">{tx.amount}</td>
                                <td className="py-3 px-4 text-sm text-text-secondary">{tx.date}</td>
                                <td className="py-3 px-4 text-sm text-success">{tx.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             <div className="bg-surface border border-border rounded-lg">
                <div className="p-4 border-b border-border">
                    <h2 className="text-xl font-bold text-text-primary">{t('forceUserUpgrade')}</h2>
                </div>
                <div className="p-4 space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                         <div>
                             <label className="text-sm font-semibold text-text-secondary">{t('selectUser')}</label>
                             <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} className="w-full mt-1 bg-background border border-border rounded-md p-2 focus:ring-primary focus:outline-none">
                                <option value="" disabled>-- {t('selectUser')} --</option>
                                {mockUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                             </select>
                         </div>
                         <div>
                             <label className="text-sm font-semibold text-text-secondary">{t('selectPlan')}</label>
                             <select value={selectedPlan} onChange={e => setSelectedPlan(e.target.value)} className="w-full mt-1 bg-background border border-border rounded-md p-2 focus:ring-primary focus:outline-none">
                                <option value="" disabled>-- {t('selectPlan')} --</option>
                                <option value="Free">{t('planFree')}</option>
                                <option value="Plus">{t('planPlus')}</option>
                                <option value="Pro Analyst">{t('planProAnalyst')}</option>
                                <option value="Ultra">{t('planUltra')}</option>
                             </select>
                         </div>
                         <div className="md:pt-6">
                            <button onClick={handleUpgrade} className="w-full bg-primary text-white font-semibold p-2 rounded-md hover:bg-blue-600 transition-colors">{t('upgradeUser')}</button>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionControl;