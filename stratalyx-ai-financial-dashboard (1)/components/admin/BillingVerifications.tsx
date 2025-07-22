

import React, { useState, useMemo } from 'react';
import type { SubscriptionPlan } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface VerificationRequest {
    id: string;
    userName: string;
    plan: SubscriptionPlan;
    submittedAt: string;
    proofUrl: string; // URL to the payment screenshot
}

const mockVerifications: VerificationRequest[] = [
    { id: 'SUB_001', userName: 'Bat-Erdene', plan: 'Pro Analyst', submittedAt: '2024-08-01 10:30 AM', proofUrl: 'https://i.imgur.com/example.png' },
    { id: 'SUB_002', userName: 'Khulan', plan: 'Plus', submittedAt: '2024-08-01 09:15 AM', proofUrl: 'https://i.imgur.com/example.png' },
    { id: 'SUB_003', userName: 'Temuujin', plan: 'Plus', submittedAt: '2024-07-31 05:00 PM', proofUrl: 'https://i.imgur.com/example.png' },
    { id: 'SUB_004', userName: 'Anar', plan: 'Free', submittedAt: '2024-07-31 02:10 PM', proofUrl: 'https://i.imgur.com/example.png' },
];


const BillingVerifications: React.FC = () => {
    const { t } = useAppContext();
    const [verifications, setVerifications] = useState<VerificationRequest[]>(mockVerifications);
    const [filterPlan, setFilterPlan] = useState<string>('all');

    const filteredVerifications = useMemo(() => {
        return verifications.filter(v => filterPlan === 'all' || v.plan === filterPlan);
    }, [verifications, filterPlan]);

    const handleAction = (id: string, action: 'approve' | 'reject') => {
        console.log(`Verification ${id} has been ${action}d.`);
        setVerifications(prev => prev.filter(v => v.id !== id));
    };

    return (
         <div className="bg-surface border border-border rounded-lg">
            <div className="p-4 border-b border-border">
                 <h2 className="text-xl font-bold text-text-primary">{t('billingVerifications')}</h2>
                 <p className="text-sm text-text-secondary mt-1">Review and approve manual payment submissions.</p>
            </div>
             <div className="p-4 flex gap-3">
                 <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)} className="bg-background border border-border rounded-md p-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none">
                    <option value="all">{t('allPlans')}</option>
                    <option value="Free">{t('planFree')}</option>
                    <option value="Plus">{t('planPlus')}</option>
                    <option value="Pro Analyst">{t('planProAnalyst')}</option>
                    <option value="Ultra">{t('planUltra')}</option>
                </select>
             </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-background">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-text-secondary sm:pl-6">{t('submissionId')}</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-text-secondary">{t('user')}</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-text-secondary">{t('plan')}</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-text-secondary">{t('submissionDate')}</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-text-secondary">{t('paymentScreenshot')}</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-text-secondary">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredVerifications.map((v) => (
                            <tr key={v.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 font-mono text-text-secondary">{v.id}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-text-primary">{v.userName}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary">{t(`plan${v.plan.replace(' ', '')}` as any)}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary">{v.submittedAt}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary">
                                    <a href={v.proofUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{t('viewProof')}</a>
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleAction(v.id, 'approve')} className="bg-success/20 text-success font-semibold px-3 py-1 rounded-md hover:bg-success/30">{t('approve')}</button>
                                        <button onClick={() => handleAction(v.id, 'reject')} className="bg-danger/20 text-danger font-semibold px-3 py-1 rounded-md hover:bg-danger/30">{t('reject')}</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredVerifications.length === 0 && (
                    <p className="text-center text-text-secondary p-8">No pending verifications found.</p>
                )}
            </div>
        </div>
    );
};

export default BillingVerifications;