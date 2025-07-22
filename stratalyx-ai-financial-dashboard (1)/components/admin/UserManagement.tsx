

import React, { useState, useMemo } from 'react';
import { Icons } from '../../constants';
import type { SubscriptionPlan } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface User {
    id: string;
    name: string;
    email: string;
    plan: SubscriptionPlan;
    status: 'Active' | 'Deactivated' | 'Banned';
    joined: string;
    avatar: string;
}

const mockUsers: User[] = [
    { id: 'usr_001', name: 'John Trader', email: 'john.trader@example.com', plan: 'Pro Analyst', status: 'Active', joined: '2023-01-15', avatar: `https://i.pravatar.cc/150?u=usr_001`},
    { id: 'usr_002', name: 'Jane Doe', email: 'jane.doe@example.com', plan: 'Plus', status: 'Active', joined: '2023-03-22', avatar: `https://i.pravatar.cc/150?u=usr_002`},
    { id: 'usr_003', name: 'Bat-Erdene', email: 'bat.erdene@example.com', plan: 'Pro Analyst', status: 'Active', joined: '2023-05-10', avatar: `https://i.pravatar.cc/150?u=usr_003`},
    { id: 'usr_004', name: 'Khulan', email: 'khulan.mgl@example.com', plan: 'Plus', status: 'Deactivated', joined: '2023-06-01', avatar: `https://i.pravatar.cc/150?u=usr_004`},
    { id: 'usr_005', name: 'Peter Jones', email: 'peter.jones@example.com', plan: 'Free', status: 'Active', joined: '2023-08-19', avatar: `https://i.pravatar.cc/150?u=usr_005`},
    { id: 'usr_006', name: 'Temuujin', email: 'temuujin.b@example.com', plan: 'Plus', status: 'Banned', joined: '2023-09-05', avatar: `https://i.pravatar.cc/150?u=usr_006`},
];

const planColors: Record<SubscriptionPlan, string> = {
    'Free': 'bg-gray-500/20 text-gray-300',
    'Plus': 'bg-primary/20 text-primary',
    'Pro Analyst': 'bg-success/20 text-success',
    'Ultra': 'bg-purple-500/20 text-purple-300',
};

const statusColors: Record<User['status'], string> = {
    Active: 'bg-success/20 text-success',
    Deactivated: 'bg-gray-500/20 text-gray-400',
    Banned: 'bg-danger/20 text-danger',
}

const UserManagement: React.FC = () => {
    const { t } = useAppContext();
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPlan, setFilterPlan] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const searchMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const planMatch = filterPlan === 'all' || user.plan === filterPlan;
            const statusMatch = filterStatus === 'all' || user.status === filterStatus;
            return searchMatch && planMatch && statusMatch;
        });
    }, [users, searchTerm, filterPlan, filterStatus]);
    
    const handleStatusToggle = (userId: string) => {
        setUsers(prev => prev.map(u => u.id === userId ? {...u, status: u.status === 'Active' ? 'Deactivated' : 'Active'} : u));
    };

    return (
        <div className="bg-surface border border-border rounded-lg">
            <div className="p-4 border-b border-border">
                 <h2 className="text-xl font-bold text-text-primary">{t('userManagement')}</h2>
                 <p className="text-sm text-text-secondary mt-1">View, manage, and filter platform users.</p>
            </div>
            <div className="p-4 flex flex-col md:flex-row gap-3">
                <div className="relative flex-grow">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">{React.cloneElement(Icons.search, { className: 'w-4 h-4'})}</span>
                    <input 
                        type="text"
                        placeholder={t('searchUsers')}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-background border border-border rounded-md py-2 pl-9 pr-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                </div>
                <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)} className="bg-background border border-border rounded-md p-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none">
                    <option value="all">{t('allPlans')}</option>
                    <option value="Free">{t('planFree')}</option>
                    <option value="Plus">{t('planPlus')}</option>
                    <option value="Pro Analyst">{t('planProAnalyst')}</option>
                    <option value="Ultra">{t('planUltra')}</option>
                </select>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-background border border-border rounded-md p-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none">
                    <option value="all">{t('allStatuses')}</option>
                    <option value="Active">{t('active')}</option>
                    <option value="Deactivated">{t('deactivated')}</option>
                    <option value="Banned">{t('banned')}</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-background">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-text-secondary sm:pl-6">{t('user')}</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-text-secondary">{t('userId')}</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-text-secondary">{t('plan')}</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-text-secondary">{t('status')}</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-text-secondary">{t('joinedDate')}</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-text-secondary">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0">
                                        <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="font-medium text-text-primary">{user.name}</div>
                                        <div className="text-text-secondary">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary font-mono">{user.id}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${planColors[user.plan]}`}>
                                    {t(`plan${user.plan.replace(' ', '')}` as any)}
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary">
                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[user.status]}`}>
                                    {t(user.status.toLowerCase())}
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary">{user.joined}</td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <div className="flex justify-end gap-2">
                                     <button className="text-primary hover:underline">{t('edit')}</button>
                                     <button className="text-warning hover:underline">{t('warn')}</button>
                                     <button className="text-danger hover:underline">{t('ban')}</button>
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserManagement;