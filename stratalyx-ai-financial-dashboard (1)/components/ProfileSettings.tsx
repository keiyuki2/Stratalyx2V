


import React, { useState } from 'react';
import type { SubscriptionPlan } from '../types';
import BillingModal from './BillingModal';
import { useAppContext } from '../context/AppContext';

const Card: React.FC<{ children: React.ReactNode, className?: string, as?: React.ElementType }> = ({ children, className = '', as: Component = 'div' }) => (
    <Component className={`bg-surface border border-border rounded-lg p-4 sm:p-6 ${className}`}>
        {children}
    </Component>
);

const InfoRow: React.FC<{ label: string, value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-2">
        <span className="text-sm text-text-secondary">{label}</span>
        <span className="text-sm font-semibold text-text-primary">{value}</span>
    </div>
);

const UsageBar: React.FC<{ label: string, value: number, max: number, unit: string }> = ({ label, value, max, unit }) => {
    const percentage = (value / max) * 100;
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-text-primary">{label}</span>
                <span className="text-text-secondary">{value} / {max} {unit}</span>
            </div>
            <div className="w-full bg-background rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void; 'aria-label': string }> = ({ enabled, onChange, "aria-label": ariaLabel }) => (
    <button
        onClick={() => onChange(!enabled)}
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={ariaLabel}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-surface ${enabled ? 'bg-primary' : 'bg-gray-600'}`}
    >
        <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
    </button>
);

const SecuritySetting: React.FC<{ label: string; description: string; children: React.ReactNode; }> = ({ label, description, children }) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3">
        <div className="flex-grow">
            <p className="font-semibold text-text-primary">{label}</p>
            <p className="text-sm text-text-secondary">{description}</p>
        </div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
            {children}
        </div>
    </div>
);


const planDetailsMap: Record<SubscriptionPlan, {
    nameKey: string;
    price: string;
    featureKeys: string[];
    usage: {
        queries: { value: number, max: number, unit: string };
        data: { value: number, max: number, unit: string };
        agents: { value: number, max: number, unit: string };
    }
}> = {
    Free: {
        nameKey: 'planFree',
        price: '0₮/сар',
        featureKeys: ['featureFreeQueries', 'featureFreeAgents', 'featureFreeDashboard', 'featureFreeNews'],
        usage: {
            queries: { value: 5, max: 25, unit: 'queries/day' },
            data: { value: 0.1, max: 0.5, unit: 'GB' },
            agents: { value: 1, max: 1, unit: 'agents' },
        }
    },
    Plus: {
        nameKey: 'planPlus',
        price: '25,000₮/сар',
        featureKeys: ['featurePlusQueries', 'featurePlusAgents', 'featurePlusCharts', 'featurePlusAlerts'],
        usage: {
            queries: { value: 45, max: 100, unit: 'queries/day' },
            data: { value: 1.2, max: 5, unit: 'GB' },
            agents: { value: 2, max: 3, unit: 'agents' },
        }
    },
    'Pro Analyst': {
        nameKey: 'planProAnalyst',
        price: '60,000₮/сар',
        featureKeys: ['featureProQueries', 'featureProAgents', 'featureProIntegrations', 'featureProTools'],
        usage: {
            queries: { value: 250, max: 500, unit: 'queries/day' },
            data: { value: 4.5, max: 15, unit: 'GB' },
            agents: { value: 5, max: 6, unit: 'agents' },
        }
    },
    Ultra: {
        nameKey: 'planUltra',
        price: '120,000₮/сар',
        featureKeys: ['featureUltraQueries', 'featureUltraAgents', 'featureUltraApi', 'featureUltraAllIntegrations'],
        usage: {
            queries: { value: 800, max: 1000, unit: '(unlimited)' },
            data: { value: 12.0, max: 50, unit: 'GB' },
            agents: { value: 8, max: 10, unit: '(unlimited)' },
        }
    }
};


const countryDialCodes = [
    { name: 'Afghanistan', dial_code: '+93', code: 'AF' },
    { name: 'Albania', dial_code: '+355', code: 'AL' },
    { name: 'Algeria', dial_code: '+213', code: 'DZ' },
    { name: 'Andorra', dial_code: '+376', code: 'AD' },
    { name: 'Angola', dial_code: '+244', code: 'AO' },
    { name: 'Argentina', dial_code: '+54', code: 'AR' },
    { name: 'Armenia', dial_code: '+374', code: 'AM' },
    { name: 'Australia', dial_code: '+61', code: 'AU' },
    { name: 'Austria', dial_code: '+43', code: 'AT' },
    { name: 'Azerbaijan', dial_code: '+994', code: 'AZ' },
    { name: 'Bahamas', dial_code: '+1242', code: 'BS' },
    { name: 'Bahrain', dial_code: '+973', code: 'BH' },
    { name: 'Bangladesh', dial_code: '+880', code: 'BD' },
    { name: 'Belarus', dial_code: '+375', code: 'BY' },
    { name: 'Belgium', dial_code: '+32', code: 'BE' },
    { name: 'Brazil', dial_code: '+55', code: 'BR' },
    { name: 'Canada', dial_code: '+1', code: 'CA' },
    { name: 'Chile', dial_code: '+56', code: 'CL' },
    { name: 'China', dial_code: '+86', code: 'CN' },
    { name: 'Colombia', dial_code: '+57', code: 'CO' },
    { name: 'Denmark', dial_code: '+45', code: 'DK' },
    { name: 'Egypt', dial_code: '+20', code: 'EG' },
    { name: 'Finland', dial_code: '+358', code: 'FI' },
    { name: 'France', dial_code: '+33', code: 'FR' },
    { name: 'Germany', dial_code: '+49', code: 'DE' },
    { name: 'Greece', dial_code: '+30', code: 'GR' },
    { name: 'Hong Kong', dial_code: '+852', code: 'HK' },
    { name: 'Hungary', dial_code: '+36', code: 'HU' },
    { name: 'Iceland', dial_code: '+354', code: 'IS' },
    { name: 'India', dial_code: '+91', code: 'IN' },
    { name: 'Indonesia', dial_code: '+62', code: 'ID' },
    { name: 'Iran', dial_code: '+98', code: 'IR' },
    { name: 'Iraq', dial_code: '+964', code: 'IQ' },
    { name: 'Ireland', dial_code: '+353', code: 'IE' },
    { name: 'Israel', dial_code: '+972', code: 'IL' },
    { name: 'Italy', dial_code: '+39', code: 'IT' },
    { name: 'Japan', dial_code: '+81', code: 'JP' },
    { name: 'Mexico', dial_code: '+52', code: 'MX' },
    { name: 'Mongolia', dial_code: '+976', code: 'MN' },
    { name: 'Netherlands', dial_code: '+31', code: 'NL' },
    { name: 'New Zealand', dial_code: '+64', code: 'NZ' },
    { name: 'Norway', dial_code: '+47', code: 'NO' },
    { name: 'Pakistan', dial_code: '+92', code: 'PK' },
    { name: 'Philippines', dial_code: '+63', code: 'PH' },
    { name: 'Poland', dial_code: '+48', code: 'PL' },
    { name: 'Portugal', dial_code: '+351', code: 'PT' },
    { name: 'Russia', dial_code: '+7', code: 'RU' },
    { name: 'Saudi Arabia', dial_code: '+966', code: 'SA' },
    { name: 'Singapore', dial_code: '+65', code: 'SG' },
    { name: 'South Africa', dial_code: '+27', code: 'ZA' },
    { name: 'South Korea', dial_code: '+82', code: 'KR' },
    { name: 'Spain', dial_code: '+34', code: 'ES' },
    { name: 'Sweden', dial_code: '+46', code: 'SE' },
    { name: 'Switzerland', dial_code: '+41', code: 'CH' },
    { name: 'Turkey', dial_code: '+90', code: 'TR' },
    { name: 'United Arab Emirates', dial_code: '+971', code: 'AE' },
    { name: 'United Kingdom', dial_code: '+44', code: 'GB' },
    { name: 'United States', dial_code: '+1', code: 'US' },
].sort((a, b) => a.name.localeCompare(b.name));

const timezones = [
    { value: 'Pacific/Midway', label: '(GMT-11:00) Midway' },
    { value: 'Pacific/Honolulu', label: '(GMT-10:00) Hawaii' },
    { value: 'America/Anchorage', label: '(GMT-09:00) Alaska' },
    { value: 'America/Los_Angeles', label: '(GMT-08:00) Pacific Time' },
    { value: 'America/Denver', label: '(GMT-07:00) Mountain Time' },
    { value: 'America/Chicago', label: '(GMT-06:00) Central Time' },
    { value: 'America/New_York', label: '(GMT-05:00) Eastern Time' },
    { value: 'America/Caracas', label: '(GMT-04:30) Caracas' },
    { value: 'America/Halifax', label: '(GMT-04:00) Atlantic Time' },
    { value: 'America/Sao_Paulo', label: '(GMT-03:00) Brasilia' },
    { value: 'Atlantic/South_Georgia', label: '(GMT-02:00) Mid-Atlantic' },
    { value: 'Atlantic/Azores', label: '(GMT-01:00) Azores' },
    { value: 'Europe/London', label: '(GMT+00:00) London' },
    { value: 'Europe/Berlin', label: '(GMT+01:00) Berlin' },
    { value: 'Europe/Helsinki', label: '(GMT+02:00) Helsinki' },
    { value: 'Europe/Moscow', label: '(GMT+03:00) Moscow' },
    { value: 'Asia/Tehran', label: '(GMT+03:30) Tehran' },
    { value: 'Asia/Dubai', label: '(GMT+04:00) Dubai' },
    { value: 'Asia/Kabul', label: '(GMT+04:30) Kabul' },
    { name: 'Asia/Karachi', label: '(GMT+05:00) Karachi' },
    { name: 'Asia/Kolkata', label: '(GMT+05:30) Kolkata' },
    { name: 'Asia/Kathmandu', label: '(GMT+05:45) Kathmandu' },
    { name: 'Asia/Dhaka', label: '(GMT+06:00) Dhaka' },
    { name: 'Asia/Rangoon', label: '(GMT+06:30) Rangoon' },
    { name: 'Asia/Bangkok', label: '(GMT+07:00) Bangkok' },
    { name: 'Asia/Shanghai', label: '(GMT+08:00) Shanghai' },
    { name: 'Asia/Ulaanbaatar', label: '(GMT+08:00) Ulaanbaatar' },
    { name: 'Asia/Tokyo', label: '(GMT+09:00) Tokyo' },
    { name: 'Australia/Sydney', label: '(GMT+10:00) Sydney' },
    { name: 'Pacific/Guadalcanal', label: '(GMT+11:00) Solomons' },
    { name: 'Pacific/Auckland', label: '(GMT+12:00) Auckland' },
    { name: 'Pacific/Fiji', label: '(GMT+13:00) Fiji' },
];

export const ProfileSettings: React.FC<{ userPlan: SubscriptionPlan; setUserPlan: (plan: SubscriptionPlan) => void; }> = ({ userPlan, setUserPlan }) => {
    const { t } = useAppContext();
    const [timezone, setTimezone] = useState('');
    const [phoneCountryCode, setPhoneCountryCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
    const [is2faEnabled, setIs2faEnabled] = useState(true);
    const [isLoginAlertsEnabled, setIsLoginAlertsEnabled] = useState(true);
    const [sessionTimeout, setSessionTimeout] = useState('30');
    const currentPlanDetails = planDetailsMap[userPlan];

    const planOrder: SubscriptionPlan[] = ['Free', 'Plus', 'Pro Analyst', 'Ultra'];
    const handleUpgrade = () => {
        const currentIndex = planOrder.indexOf(userPlan);
        if (currentIndex < planOrder.length - 1) {
            setUserPlan(planOrder[currentIndex + 1]);
        }
    };

    return (
        <Card as="section" aria-labelledby="account-heading">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
                <div>
                    <h2 id="account-heading" className="text-xl font-bold text-text-primary">{t('account')}</h2>
                    <p className="text-text-secondary">{t('profileSubtitle')}</p>
                </div>
                <button className="mt-2 sm:mt-0 bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm">{t('editProfile')}</button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1: Profile & Subscription */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-background p-4 rounded-lg">
                        <h3 className="font-bold text-text-primary mb-2 text-lg">{t('profile')}</h3>
                        <div className="divide-y divide-border">
                            <InfoRow label={t('fullName')} value="John Trader" />
                            <InfoRow label={t('emailAddress')} value="john.trader@stocksense.ai" />
                            <div className="flex justify-between items-center py-2.5">
                                <span className="text-sm text-text-secondary">{t('phoneNumber')}</span>
                                <div className="flex items-center gap-1">
                                    <div className="relative">
                                        <select
                                            value={phoneCountryCode}
                                            onChange={(e) => setPhoneCountryCode(e.target.value)}
                                            className="bg-surface border border-border rounded-md pl-2 pr-7 py-1.5 text-sm font-semibold text-text-primary focus:ring-2 focus:ring-primary focus:outline-none appearance-none max-w-[150px]"
                                            aria-label="Select country code"
                                        >
                                            <option value="" disabled>{t('select')}</option>
                                            {countryDialCodes.map(c => <option key={c.code} value={c.dial_code}>{c.name} ({c.dial_code})</option>)}
                                        </select>
                                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary"><path d="m6 9 6 6 6-6"/></svg>
                                    </div>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder={t('numberPlaceholder')}
                                        className="bg-surface border border-border rounded-md px-2 py-1.5 text-sm font-semibold text-text-primary focus:ring-2 focus:ring-primary focus:outline-none w-28"
                                        aria-label="Phone number"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-2.5">
                                <span className="text-sm text-text-secondary">{t('timezone')}</span>
                                <div className="relative">
                                    <select
                                        value={timezone}
                                        onChange={(e) => setTimezone(e.target.value)}
                                        className="bg-surface border border-border rounded-md pl-3 pr-8 py-1.5 text-sm font-semibold text-text-primary focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
                                        aria-label={t('selectTimezone')}
                                    >
                                        <option value="" disabled>{t('selectTimezone')}</option>
                                        {timezones.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
                                    </select>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary"><path d="m6 9 6 6 6-6"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-background p-4 rounded-lg">
                        <h3 className="font-bold text-text-primary mb-2 text-lg">{t('subscription')}</h3>
                        <div className="divide-y divide-border">
                            <InfoRow label={t('currentPlan')} value={t(currentPlanDetails.nameKey)} />
                             <InfoRow label={t('status')} value={t('enabled')} />
                            <InfoRow label={t('price')} value={currentPlanDetails.price} />
                            <InfoRow label={t('nextBilling')} value="2025-08-09" />
                        </div>
                         <div className="mt-4">
                            <p className="font-semibold text-text-primary text-sm mb-2">{t('planFeatures')}</p>
                            <ul className="text-xs text-text-secondary list-disc list-inside space-y-1">
                                {currentPlanDetails.featureKeys.map(featureKey => <li key={featureKey}>{t(featureKey)}</li>)}
                            </ul>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button onClick={() => setIsBillingModalOpen(true)} className="flex-1 text-sm p-2 bg-surface hover:bg-border border border-border rounded-lg text-center text-text-primary transition-colors">{t('manageBilling')}</button>
                            {userPlan !== 'Ultra' && (
                                <button onClick={handleUpgrade} className="flex-1 text-sm p-2 bg-primary hover:bg-blue-600 border border-primary rounded-lg text-center text-white transition-colors">{t('upgradePlan')}</button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Column 2: Usage & Security */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-background p-4 rounded-lg">
                         <h3 className="font-bold text-text-primary mb-4 text-lg">{t('usageStatistics')}</h3>
                         <div className="space-y-6">
                            <UsageBar label={t('aiQueries')} value={currentPlanDetails.usage.queries.value} max={currentPlanDetails.usage.queries.max} unit={currentPlanDetails.usage.queries.unit} />
                            <UsageBar label={t('dataUsage')} value={currentPlanDetails.usage.data.value} max={currentPlanDetails.usage.data.max} unit={currentPlanDetails.usage.data.unit} />
                            <UsageBar label={t('activeAgentsUsage')} value={currentPlanDetails.usage.agents.value} max={currentPlanDetails.usage.agents.max} unit={currentPlanDetails.usage.agents.unit} />
                         </div>
                    </div>
                     <div className="bg-background p-4 rounded-lg">
                         <h3 className="font-bold text-text-primary mb-2 text-lg">{t('securitySettings')}</h3>
                         <div className="divide-y divide-border">
                            <SecuritySetting label={t('twoFactorAuth')} description={t('twoFactorAuthDesc')}>
                                <ToggleSwitch enabled={is2faEnabled} onChange={setIs2faEnabled} aria-label={t('twoFactorAuth')} />
                            </SecuritySetting>
                            <SecuritySetting label={t('loginAlerts')} description={t('loginAlertsDesc')}>
                                <ToggleSwitch enabled={isLoginAlertsEnabled} onChange={setIsLoginAlertsEnabled} aria-label={t('loginAlerts')} />
                            </SecuritySetting>
                             <SecuritySetting label={t('sessionTimeout')} description={t('sessionTimeoutDesc')}>
                                 <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)} className="bg-surface border border-border rounded-md px-2 py-1.5 text-sm font-semibold text-text-primary focus:ring-2 focus:ring-primary focus:outline-none appearance-none">
                                     <option value="15">15 minutes</option>
                                     <option value="30">30 minutes</option>
                                     <option value="60">1 hour</option>
                                     <option value="never">Never</option>
                                 </select>
                             </SecuritySetting>
                         </div>
                         <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                            <button className="text-sm p-2 bg-surface hover:bg-border border border-border rounded-lg text-center text-text-primary transition-colors">{t('changePassword')}</button>
                            <button className="text-sm p-2 bg-surface hover:bg-border border border-border rounded-lg text-center text-text-primary transition-colors">{t('downloadAccountData')}</button>
                         </div>
                    </div>
                </div>
            </div>
            <BillingModal 
                isOpen={isBillingModalOpen}
                onClose={() => setIsBillingModalOpen(false)}
                plan={userPlan}
            />
        </Card>
    );
};