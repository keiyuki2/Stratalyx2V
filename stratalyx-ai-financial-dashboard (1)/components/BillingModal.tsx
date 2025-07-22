
import React, { useState, useEffect, useRef } from 'react';
import type { SubscriptionPlan } from '../types';
import { Icons } from '../constants';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';

const planPrices: Record<SubscriptionPlan, string> = {
    'Free': '0₮',
    'Plus': '25,000₮',
    'Pro Analyst': '60,000₮',
    'Ultra': '120,000₮',
};

const planHierarchy: Record<SubscriptionPlan, number> = {
    'Free': 0,
    'Plus': 1,
    'Pro Analyst': 2,
    'Ultra': 3,
};

const mockInvoices = [
    { id: 'INV-2024-003', date: '2024-07-01', amount: '60,000₮', plan: 'Pro Analyst', status: 'Paid' },
    { id: 'INV-2024-002', date: '2024-06-01', amount: '60,000₮', plan: 'Pro Analyst', status: 'Paid' },
    { id: 'INV-2024-001', date: '2024-05-01', amount: '25,000₮', plan: 'Plus', status: 'Paid' },
];

interface BillingModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: SubscriptionPlan;
}

const BillingModal: React.FC<BillingModalProps> = ({ isOpen, onClose, plan }) => {
    const { t } = useAppContext();
    const [activeTab, setActiveTab] = useState<'payment' | 'history'>('payment');
    const [formState, setFormState] = useState({
        fullName: '',
        selectedPlan: plan,
        notes: '',
        paymentProof: null as File | null,
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [appliedDiscount, setAppliedDiscount] = useState<any | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const availablePlans: SubscriptionPlan[] = ['Free', 'Plus', 'Pro Analyst', 'Ultra'];
    const userPlanLevel = planHierarchy[plan];
    const filteredPlans = availablePlans.filter(p => planHierarchy[p] >= userPlanLevel);


    useEffect(() => {
        if (isOpen) {
            setActiveTab('payment');
            setFormState({
                fullName: '',
                selectedPlan: plan,
                notes: '',
                paymentProof: null,
            });
            setIsSubmitted(false);
            try {
                const discountJSON = localStorage.getItem('appliedDiscount');
                if (discountJSON) {
                    setAppliedDiscount(JSON.parse(discountJSON));
                } else {
                    setAppliedDiscount(null);
                }
            } catch (error) {
                console.error("Failed to parse discount code from localStorage", error);
                setAppliedDiscount(null);
            }
        }
    }, [isOpen, plan]);

    const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormState(prev => ({ ...prev, selectedPlan: e.target.value as SubscriptionPlan }));
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormState(prev => ({...prev, paymentProof: e.target.files![0]}));
        }
    };
    
    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };
    
    const handleRemoveDiscount = () => {
        localStorage.removeItem('appliedDiscount');
        setAppliedDiscount(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Billing form submitted:', formState);
        setIsSubmitted(true);
    };

    if (!isOpen) return null;
    
    const basePrice = parseFloat(planPrices[formState.selectedPlan].replace(/,|₮/g, ''));
    let finalPrice = basePrice;
    let discountText = '';
    let isDiscountApplicable = false;

    if (appliedDiscount && basePrice > 0) {
        isDiscountApplicable = appliedDiscount.targetPlan === 'All Plans' || appliedDiscount.targetPlan === formState.selectedPlan;
        if (isDiscountApplicable) {
             if (appliedDiscount.type === 'Percentage') {
                finalPrice = basePrice * (1 - appliedDiscount.value / 100);
                discountText = `${appliedDiscount.value}% off`;
            } else if (appliedDiscount.type === 'Fixed') {
                finalPrice = Math.max(0, basePrice - appliedDiscount.value);
                discountText = `${appliedDiscount.value.toLocaleString()}₮ off`;
            }
        }
    }

    const PaymentTab = () => (
         <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                    {React.cloneElement(Icons.financials, { className: 'w-5 h-5 text-primary' })}
                    <span>{t('payViaMonpay')}</span>
                </h3>
                <div className="mt-2 bg-background p-4 rounded-lg border border-border space-y-2">
                    <p className="text-text-secondary">{t('sendPaymentTo')}</p>
                    <p className="font-mono text-xl font-bold text-brand-cyan tracking-wider">9910 4863 281</p>
                    <p className="text-text-secondary pt-2 border-t border-border">{t('currentPrice')}</p>
                    
                        {appliedDiscount && basePrice > 0 && isDiscountApplicable ? (
                        <div className="flex items-baseline gap-2">
                            <p className="font-bold text-xl text-text-secondary line-through">{planPrices[formState.selectedPlan]}</p>
                            <p className="font-bold text-2xl text-success">{finalPrice.toLocaleString()}₮</p>
                            <p className="text-success text-lg">{t('perMonth')}</p>
                        </div>
                    ) : (
                        <p className="font-bold text-xl text-text-primary">{planPrices[formState.selectedPlan]} {t('perMonth')}</p>
                    )}

                    {appliedDiscount && basePrice > 0 && (
                        <div className={cn("text-xs flex items-center justify-between bg-opacity-10 p-2 rounded-md mt-1",
                            isDiscountApplicable ? "bg-success text-success" : "bg-warning text-warning"
                        )}>
                            <span className="flex items-center gap-1">
                                {React.cloneElement(Icons.gift, { className: 'w-4 h-4' })}
                                {isDiscountApplicable ?
                                    `Applied code: ${appliedDiscount.code} (${discountText})` :
                                    `Code '${appliedDiscount.code}' not valid for ${t(`plan${formState.selectedPlan.replace(' ', '')}` as any)} plan.`
                                }
                            </span>
                            <button onClick={handleRemoveDiscount} className="font-bold text-lg leading-none" title="Remove code">&times;</button>
                        </div>
                    )}
                </div>
            </div>
            
            <div>
                <label htmlFor="selectedPlan" className="block text-sm font-medium text-text-secondary mb-1">{t('subscriptionPlan')}</label>
                <div className="relative">
                    <select name="selectedPlan" id="selectedPlan" value={formState.selectedPlan} onChange={handlePlanChange} required className="w-full bg-background p-2 rounded-md border border-border appearance-none pl-3 pr-8 focus:ring-2 focus:ring-primary focus:outline-none">
                        {filteredPlans.map(p => <option key={p} value={p}>{t('planNameSuffix').replace('{planName}', t(`plan${p.replace(' ', '')}` as any))}</option>)}
                    </select>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary"><path d="m6 9 6 6 6-6"/></svg>
                </div>
            </div>

            <div className="border-t border-border my-4"></div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">{t('confirmYourPayment')}</h3>
                <p className="text-sm text-text-secondary -mt-2">{t('confirmYourPaymentDesc')}</p>
                
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-text-secondary mb-1">{t('fullName')}</label>
                    <input type="text" name="fullName" id="fullName" value={formState.fullName} onChange={handleChange} required className="w-full bg-background p-2 rounded-md border border-border" placeholder={t('mustMatchAccountName')}/>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">{t('paymentScreenshot')}</label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                        required
                    />
                    <button
                        type="button"
                        onClick={triggerFileSelect}
                        className="w-full flex items-center justify-center gap-2 bg-background p-3 rounded-md border-2 border-dashed border-border hover:border-primary transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        <span className="text-sm font-semibold">
                            {formState.paymentProof ? formState.paymentProof.name : t('uploadScreenshot')}
                        </span>
                    </button>
                </div>
                
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-text-secondary mb-1">{t('notesOptional')}</label>
                    <textarea name="notes" id="notes" rows={3} value={formState.notes} onChange={handleChange} className="w-full bg-background p-2 rounded-md border border-border" placeholder={t('notesPlaceholder')}></textarea>
                </div>
                
                <button type="submit" className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors">
                    {t('submitForVerification')}
                </button>
            </form>
        </div>
    );

    const HistoryTab = () => (
         <div className="space-y-3">
             <table className="min-w-full text-left text-sm">
                 <thead className="border-b border-border text-text-secondary">
                     <tr>
                         <th className="py-2">{t('invoiceDate')}</th>
                         <th className="py-2">{t('invoiceAmount')}</th>
                         <th className="py-2">{t('invoiceStatus')}</th>
                         <th className="py-2 text-right">{t('actions')}</th>
                     </tr>
                 </thead>
                 <tbody>
                     {mockInvoices.map(invoice => (
                         <tr key={invoice.id} className="border-b border-border last:border-0">
                             <td className="py-3">{invoice.date}</td>
                             <td className="py-3 font-semibold">{invoice.amount}</td>
                             <td className="py-3">
                                 <span className="px-2 py-1 text-xs font-semibold rounded-full bg-success/20 text-success">{t('statusPaid')}</span>
                             </td>
                             <td className="py-3 text-right">
                                 <button className="text-primary hover:underline">{t('invoiceDownload')}</button>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
    );

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-surface border border-border rounded-lg w-full max-w-lg max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-border flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-text-primary">{t('manageBilling')}</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </header>
                
                <div className="p-2 bg-background border-b border-border flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <button onClick={() => setActiveTab('payment')} className={`flex-1 text-center font-semibold py-2 rounded-md text-sm transition-colors ${activeTab === 'payment' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-border'}`}>{t('paymentDetails')}</button>
                        <button onClick={() => setActiveTab('history')} className={`flex-1 text-center font-semibold py-2 rounded-md text-sm transition-colors ${activeTab === 'history' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-border'}`}>{t('invoiceHistory')}</button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto">
                    {isSubmitted ? (
                        <div className="text-center p-8">
                            <div className="mx-auto w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mt-4">{t('paymentPending')}</h3>
                            <p className="text-text-secondary mt-2">
                                {t('paymentPendingDesc')}
                            </p>
                            <button onClick={onClose} className="mt-6 bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg">
                                {t('close')}
                            </button>
                        </div>
                    ) : (
                        <>
                           {activeTab === 'payment' && <PaymentTab />}
                           {activeTab === 'history' && <HistoryTab />}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BillingModal;
