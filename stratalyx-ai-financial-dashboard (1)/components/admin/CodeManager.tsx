
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const mockCodes = [
    { code: 'PROANALYST25', type: 'Percentage', value: 25, uses: '0/10', expires: '2025-09-01', targetPlan: 'Pro Analyst' },
    { code: 'FREEMONTH', type: 'Free Month', value: 1, uses: '0/500', expires: '2025-01-01', targetPlan: 'Trader' },
    { code: 'STX50', type: 'Percentage', value: 50, uses: '15/100', expires: '2024-12-31', targetPlan: 'All Plans' },
    { code: 'TRADERPRO', type: 'Free Month', value: 1, uses: '8/20', expires: '2024-09-30', targetPlan: 'Trader' },
    { code: 'WELCOME10', type: 'Fixed', value: 10, uses: '152/∞', expires: 'N/A', targetPlan: 'All Plans' },
];

const CodeManager: React.FC = () => {
    const { t } = useAppContext();
    const [codes, setCodes] = useState(() => {
        try {
            const savedCodes = window.localStorage.getItem('promoCodes');
            return savedCodes ? JSON.parse(savedCodes) : mockCodes;
        } catch (error) {
            console.error("Failed to load promo codes from localStorage", error);
            return mockCodes;
        }
    });

    const [newCode, setNewCode] = useState({
        code: '',
        type: 'Percentage',
        value: '',
        targetPlan: 'All Plans',
    });
    
    useEffect(() => {
        try {
            window.localStorage.setItem('promoCodes', JSON.stringify(codes));
        } catch (error) {
            console.error("Failed to save promo codes to localStorage", error);
        }
    }, [codes]);


    const handleGenerate = () => {
        if (!newCode.code || !newCode.value) {
            alert('Please fill in code and value.');
            return;
        }
        const generatedCode = {
            ...newCode,
            value: Number(newCode.value),
            uses: '0/100',
            expires: '2025-08-01',
        };
        setCodes((prev: any[]) => [generatedCode, ...prev]);
        setNewCode({ code: '', type: 'Percentage', value: '', targetPlan: 'All Plans' });
    };

    const handleRemove = (codeToRemove: string) => {
        setCodes((prev: any[]) => prev.filter(c => c.code !== codeToRemove));
    };

    return (
        <div className="space-y-6">
            <div className="bg-surface border border-border rounded-lg">
                <div className="p-4 border-b border-border">
                    <h2 className="text-xl font-bold text-text-primary">{t('generateNewCode')}</h2>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div>
                        <label className="text-sm font-semibold text-text-secondary">{t('code')}</label>
                        <input type="text" value={newCode.code} onChange={e => setNewCode({...newCode, code: e.target.value.toUpperCase()})} className="w-full mt-1 bg-background border border-border rounded-md p-2"/>
                    </div>
                     <div>
                        <label className="text-sm font-semibold text-text-secondary">{t('type')}</label>
                        <select value={newCode.type} onChange={e => setNewCode({...newCode, type: e.target.value})} className="w-full mt-1 bg-background border border-border rounded-md p-2">
                            <option>Percentage</option>
                            <option>Fixed</option>
                            <option>Free Month</option>
                        </select>
                    </div>
                     <div>
                        <label className="text-sm font-semibold text-text-secondary">{t('value')}</label>
                        <input type="number" value={newCode.value} onChange={e => setNewCode({...newCode, value: e.target.value})} className="w-full mt-1 bg-background border border-border rounded-md p-2"/>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-text-secondary">Target Plan</label>
                        <select value={newCode.targetPlan} onChange={e => setNewCode({...newCode, targetPlan: e.target.value})} className="w-full mt-1 bg-background border border-border rounded-md p-2">
                            <option value="All Plans">{t('allPlans')}</option>
                            <option value="Free">{t('planFree')}</option>
                            <option value="Trader">{t('planTrader')}</option>
                            <option value="Analyst">{t('planAnalyst')}</option>
                            <option value="Pro Analyst">{t('planProAnalyst')}</option>
                        </select>
                    </div>
                    <button onClick={handleGenerate} className="bg-primary text-white font-semibold p-2 rounded-md hover:bg-blue-600 transition-colors">{t('generate')}</button>
                </div>
            </div>

            <div className="bg-surface border border-border rounded-lg">
                <div className="p-4 border-b border-border">
                    <h2 className="text-xl font-bold text-text-primary">{t('codeManager')}</h2>
                </div>
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-background">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-text-secondary">{t('code')}</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-text-secondary">{t('type')}</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-text-secondary">{t('value')}</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-text-secondary">Target Plan</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-text-secondary">{t('uses')}</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-text-secondary">{t('expires')}</th>
                            <th className="py-3 px-4 text-right text-sm font-semibold text-text-secondary">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {codes.map((c: any) => (
                            <tr key={c.code}>
                                <td className="py-3 px-4 text-sm font-mono text-text-primary">{c.code}</td>
                                <td className="py-3 px-4 text-sm text-text-secondary">{c.type}</td>
                                <td className="py-3 px-4 text-sm text-text-primary">{c.value}{c.type === 'Percentage' ? '%' : ''}</td>
                                <td className="py-3 px-4 text-sm text-text-secondary">
                                    {c.targetPlan === 'All Plans' ? t('allPlans') : t(`plan${c.targetPlan.replace(' ', '')}` as any)}
                                </td>
                                <td className="py-3 px-4 text-sm text-text-secondary">{c.uses}</td>
                                <td className="py-3 px-4 text-sm text-text-secondary">{c.expires}</td>
                                <td className="py-3 px-4 text-right text-sm">
                                    <button onClick={() => handleRemove(c.code)} className="text-danger hover:underline cursor-pointer">
                                        {t('remove')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CodeManager;