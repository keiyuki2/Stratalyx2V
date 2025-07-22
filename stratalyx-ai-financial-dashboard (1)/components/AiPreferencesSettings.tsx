
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import type { SubscriptionPlan } from '../types';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-surface border border-border rounded-lg p-4 sm:p-6 ${className}`}>
        {children}
    </div>
);

type Profile = 'free' | 'plus' | 'proanalyst' | 'ultra';
const planHierarchy: Record<Profile, number> = { free: 0, plus: 1, proanalyst: 2, ultra: 3 };

const planToProfileMap: Record<SubscriptionPlan, Profile> = {
    'Free': 'free',
    'Plus': 'plus',
    'Pro Analyst': 'proanalyst',
    'Ultra': 'ultra'
};

const SelectInput: React.FC<{
    id?: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string; requiredPlan: Profile }[];
    currentUserPlan: Profile;
    className?: string;
}> = ({ id, label, value, onChange, options, currentUserPlan, className }) => {
    const { t } = useAppContext();
    const currentUserLevel = planHierarchy[currentUserPlan];

    return (
        <div>
            <label htmlFor={id} className="text-sm font-semibold text-text-primary block mb-1">{label}</label>
            <div className="relative">
                <select
                    id={id}
                    value={value}
                    onChange={onChange}
                    className={`bg-background border border-border rounded-md pl-3 pr-8 py-2 text-sm w-full text-text-primary focus:ring-2 focus:ring-primary focus:outline-none appearance-none ${className}`}
                >
                    {options.map(option => {
                        const requiredLevel = planHierarchy[option.requiredPlan];
                        const isDisabled = requiredLevel > currentUserLevel;
                        return (
                            <option key={option.value} value={option.value} disabled={isDisabled} className={isDisabled ? 'text-text-secondary/50' : ''}>
                                {option.label} {isDisabled ? `(${t('plan' + option.requiredPlan.charAt(0).toUpperCase() + option.requiredPlan.slice(1) as any)} Plan)` : ''}
                            </option>
                        );
                    })}
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary"><path d="m6 9 6 6 6-6"/></svg>
            </div>
        </div>
    );
};

const Checkbox: React.FC<{
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    isLocked: boolean;
}> = ({ id, label, checked, onChange, isLocked }) => (
    <label
        htmlFor={isLocked ? undefined : id}
        className={cn(
            'flex items-center gap-2 p-3 bg-background rounded-lg border border-transparent transition-all duration-300',
            isLocked 
                ? 'opacity-50 cursor-not-allowed blur-sm' 
                : 'hover:border-primary cursor-pointer'
        )}
        title={isLocked ? "Upgrade your plan to unlock this feature" : ""}
    >
        <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => !isLocked && onChange(e.target.checked)}
            disabled={isLocked}
            className="h-4 w-4 rounded border-border bg-surface text-primary focus:ring-primary shrink-0 disabled:opacity-50"
        />
        <span className="text-sm text-text-primary">{label}</span>
        {isLocked && React.cloneElement(Icons.lock, { className: 'w-3 h-3 text-text-secondary ml-auto' })}
    </label>
);

const ToggleSwitch: React.FC<{
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    'aria-label': string;
    isLocked: boolean;
}> = ({ enabled, onChange, "aria-label": ariaLabel, isLocked }) => (
    <button
        onClick={() => !isLocked && onChange(!enabled)}
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={ariaLabel}
        disabled={isLocked}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-surface ${enabled ? 'bg-primary' : 'bg-gray-600'} ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {isLocked && <div className="absolute -left-5 top-1/2 -translate-y-1/2">{React.cloneElement(Icons.lock, { className: 'w-3 h-3 text-text-secondary' })}</div>}
        <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
    </button>
);


const initialSettings = {
    analysis: {
        tone: 'analyst',
        format: 'detailed',
        risk: 'moderate',
        goal: 'growth',
    },
    focusAreas: {
        stocks: true, crypto: true, forex: false, commodities: true, bonds: false, etfs: true
    },
    preferredAgents: {
        openai: true, claude: true, gemini: true
    },
    promptTemplates: [
        { id: 1, title: 'Daily Market Summary', content: 'Provide a concise daily market summary focusing on major indices, top movers, and key economic events.' },
        { id: 2, title: 'Risk Assessment', content: 'Analyze the risk factors for the given stock including volatility, market conditions, and sector performance.' },
        { id: 3, title: 'Technical Analysis', content: 'Perform technical analysis including chart patterns, support/resistance levels, and momentum indicators.' }
    ],
    advanced: {
        suggestions: true, memory: true, realtime: true
    }
};

type AnalysisSettings = typeof initialSettings.analysis;
type FocusAreas = typeof initialSettings.focusAreas;
type PreferredAgents = typeof initialSettings.preferredAgents;
type AdvancedSettings = typeof initialSettings.advanced;


const profileConfigs: Record<Profile, Partial<typeof initialSettings>> = {
    free: {
        analysis: { tone: 'casual', format: 'summary', risk: 'low', goal: 'preservation' },
        focusAreas: { stocks: true, crypto: true, forex: false, commodities: false, bonds: false, etfs: true },
        advanced: { suggestions: true, memory: false, realtime: false },
    },
    plus: {
        analysis: { tone: 'analyst', format: 'bullets', risk: 'moderate', goal: 'growth' },
        focusAreas: { stocks: true, crypto: true, forex: true, commodities: true, bonds: false, etfs: true },
        advanced: { suggestions: true, memory: true, realtime: true },
    },
    proanalyst: {
        analysis: { tone: 'professional', format: 'detailed', risk: 'moderate', goal: 'growth' },
        focusAreas: { stocks: true, crypto: false, forex: true, commodities: true, bonds: true, etfs: true },
        advanced: { suggestions: true, memory: true, realtime: true },
    },
    ultra: {
        analysis: { tone: 'professional', format: 'detailed', risk: 'high', goal: 'growth' },
        focusAreas: { stocks: true, crypto: true, forex: true, commodities: true, bonds: true, etfs: true },
        advanced: { suggestions: true, memory: true, realtime: true },
    },
};

export const AiPreferencesSettings: React.FC<{ userPlan: SubscriptionPlan; setUserPlan: (plan: SubscriptionPlan) => void; }> = ({ userPlan, setUserPlan }) => {
    const { t } = useAppContext();
    const [settings, setSettings] = useState(initialSettings);
    const [tempCode, setTempCode] = useState('');
    const [codeMessage, setCodeMessage] = useState({ text: '', isError: false });

    const handleApplyProfile = (profile: Profile) => {
        const config = profileConfigs[profile];
        // Deep merge to avoid losing keys not present in profileConfigs
        setSettings(prev => ({
            ...prev,
            analysis: { ...prev.analysis, ...config.analysis },
            focusAreas: { ...prev.focusAreas, ...config.focusAreas },
            preferredAgents: { ...prev.preferredAgents, ...config.preferredAgents },
            advanced: { ...prev.advanced, ...config.advanced },
        }));
    };
    
    useEffect(() => {
        const profileKey = planToProfileMap[userPlan];

        if (profileKey) {
            handleApplyProfile(profileKey);
        }
    }, [userPlan]);


    const handleRedeemCode = (e: React.FormEvent) => {
        e.preventDefault();
        const codeToRedeem = tempCode.toUpperCase();
        setCodeMessage({ text: '', isError: false });

        // Check codes from local storage first
        try {
            const savedCodesJSON = localStorage.getItem('promoCodes');
            if (savedCodesJSON) {
                const savedCodes: any[] = JSON.parse(savedCodesJSON);
                const matchedCode = savedCodes.find(c => c.code === codeToRedeem);

                if (matchedCode) {
                    const validPlans: SubscriptionPlan[] = ['Free', 'Plus', 'Pro Analyst', 'Ultra'];
                    
                    // A code is a plan upgrade if its target plan is one of the specific plans
                    const isPlanUpgrade = validPlans.includes(matchedCode.targetPlan);

                    if (matchedCode.type === 'Free Month' || isPlanUpgrade) {
                        const upgradeTo = isPlanUpgrade ? matchedCode.targetPlan : 'Plus'; // Default to 'Plus' for generic Free Month
                        setUserPlan(upgradeTo);
                        setCodeMessage({ text: `Success! You have unlocked the ${upgradeTo} plan.`, isError: false });
                    } else { // It's a discount code (Percentage, Fixed, or targets 'All Plans')
                        localStorage.setItem('appliedDiscount', JSON.stringify(matchedCode));
                        setCodeMessage({ text: `Success! Your discount code '${codeToRedeem}' has been applied.`, isError: false });
                    }
                    setTempCode('');
                    return; // Exit after successful redemption
                }
            }
        } catch (error) {
            console.error("Error processing promo codes from localStorage:", error);
        }

        // Hardcoded fallbacks if not found in localStorage
        if (codeToRedeem === 'UNLOCKPRO') {
            setUserPlan('Pro Analyst');
            setCodeMessage({ text: t('redeemSuccess').replace('{plan}', t('planProAnalyst')), isError: false });
            setTempCode('');
            return;
        }
        if (codeToRedeem === 'UNLOCKPLUS') {
            setUserPlan('Plus');
            setCodeMessage({ text: t('redeemSuccess').replace('{plan}', t('planPlus')), isError: false });
            setTempCode('');
            return;
        }

        // If no code was found
        setCodeMessage({ text: t('redeemError'), isError: true });
        setTempCode('');
    };
    
    const currentUserProfile = planToProfileMap[userPlan];
    
    const handleAnalysisChange = (field: keyof AnalysisSettings, value: string) => {
        setSettings(p => ({ ...p, analysis: { ...p.analysis, [field]: value } }));
    };

    return (
        <Card>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
                 <div>
                    <h2 className="text-xl font-bold text-text-primary">{t('aiPreferences')}</h2>
                    <p className="text-text-secondary">{t('aiPreferencesSubtitle')}</p>
                </div>
                <form onSubmit={handleRedeemCode} className="flex items-center gap-2 mt-4 sm:mt-0">
                    <input
                        type="text"
                        placeholder={t('redeemCode')}
                        value={tempCode}
                        onChange={(e) => setTempCode(e.target.value)}
                        className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                     <button type="submit" className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm">{t('redeem')}</button>
                </form>
            </div>
            {codeMessage.text && (
                <p className={`text-sm mb-4 ${codeMessage.isError ? 'text-danger' : 'text-success'}`}>{codeMessage.text}</p>
            )}

            <div className="space-y-12">
                <section>
                    <h3 className="text-lg font-bold text-text-primary mb-2">{t('quickSetupProfiles')}</h3>
                    <p className="text-text-secondary text-sm mb-4">{t('quickSetupProfilesDesc')}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <ProfileCard name={t('planFree')} description={t('planFreeDesc')} onApply={() => handleApplyProfile('free')} features={['25 queries/day', 'Basic Dashboard']} icon={Icons.user} isLocked={planHierarchy['free'] > planHierarchy[currentUserProfile]} />
                        <ProfileCard name={t('planPlus')} description={t('planPlusDesc')} onApply={() => handleApplyProfile('plus')} features={['100 queries/day', 'Real-time Charts', 'Up to 3 Agents']} icon={Icons.lightning} isLocked={planHierarchy['plus'] > planHierarchy[currentUserProfile]} />
                        <ProfileCard name={t('planProAnalyst')} description={t('planProAnalystDesc')} onApply={() => handleApplyProfile('proanalyst')} features={['500 queries/day', 'Broker Integrations', 'Adv. Financial Tools']} icon={Icons.research} isLocked={planHierarchy['proanalyst'] > planHierarchy[currentUserProfile]} />
                        <ProfileCard name={t('planUltra')} description={t('planUltraDesc')} onApply={() => handleApplyProfile('ultra')} features={['Unlimited Queries', 'Custom Agents', 'API Access']} icon={Icons.shield} isLocked={planHierarchy['ultra'] > planHierarchy[currentUserProfile]} />
                    </div>
                </section>
                
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <section>
                        <h3 className="text-lg font-bold text-text-primary mb-4">{t('analysisPreferences')}</h3>
                        <div className="space-y-4">
                            <SelectInput
                                label={t('responseTone')}
                                value={settings.analysis.tone}
                                onChange={(e) => handleAnalysisChange('tone', e.target.value)}
                                options={[
                                    { value: 'casual', label: 'Casual', requiredPlan: 'free' },
                                    { value: 'analyst', label: 'Analyst', requiredPlan: 'plus' },
                                    { value: 'professional', label: 'Professional', requiredPlan: 'proanalyst' }
                                ]}
                                currentUserPlan={currentUserProfile}
                            />
                             <SelectInput
                                label={t('responseFormat')}
                                value={settings.analysis.format}
                                onChange={(e) => handleAnalysisChange('format', e.target.value)}
                                options={[
                                    { value: 'summary', label: 'Concise Summary', requiredPlan: 'free' },
                                    { value: 'bullets', label: 'Key Bullet Points', requiredPlan: 'plus' },
                                    { value: 'detailed', label: 'Detailed Report', requiredPlan: 'proanalyst' }
                                ]}
                                currentUserPlan={currentUserProfile}
                            />
                             <SelectInput
                                label={t('riskTolerance')}
                                value={settings.analysis.risk}
                                onChange={(e) => handleAnalysisChange('risk', e.target.value)}
                                options={[
                                    { value: 'low', label: 'Low', requiredPlan: 'free' },
                                    { value: 'moderate', label: 'Moderate', requiredPlan: 'plus' },
                                    { value: 'high', label: 'High', requiredPlan: 'ultra' }
                                ]}
                                currentUserPlan={currentUserProfile}
                            />
                             <SelectInput
                                label={t('investmentGoal')}
                                value={settings.analysis.goal}
                                onChange={(e) => handleAnalysisChange('goal', e.target.value)}
                                options={[
                                    { value: 'preservation', label: 'Capital Preservation', requiredPlan: 'free' },
                                    { value: 'growth', label: 'Growth', requiredPlan: 'plus' },
                                    { value: 'income', label: 'Income', requiredPlan: 'proanalyst' }
                                ]}
                                currentUserPlan={currentUserProfile}
                            />
                        </div>
                    </section>
                    <section>
                         <h3 className="text-lg font-bold text-text-primary mb-4">{t('marketFocusAreas')}</h3>
                         <p className="text-sm text-text-secondary mb-4">{t('marketFocusAreasDesc')}</p>
                         <div className="grid grid-cols-2 gap-2">
                            {Object.entries({
                                stocks: { label: t('stocks'), requiredPlan: 'free' },
                                crypto: { label: t('crypto'), requiredPlan: 'free' },
                                forex: { label: t('forex'), requiredPlan: 'plus' },
                                commodities: { label: t('commodities'), requiredPlan: 'plus' },
                                bonds: { label: t('bonds'), requiredPlan: 'proanalyst' },
                                etfs: { label: t('etfs'), requiredPlan: 'proanalyst' }
                            } as Record<keyof FocusAreas, { label: string, requiredPlan: Profile }>).map(([key, item]) => (
                                <Checkbox
                                    key={key}
                                    id={key}
                                    label={item.label}
                                    checked={settings.focusAreas[key as keyof FocusAreas]}
                                    onChange={(val) => setSettings(p => ({ ...p, focusAreas: { ...p.focusAreas, [key]: val } }))}
                                    isLocked={planHierarchy[item.requiredPlan] > planHierarchy[currentUserProfile]}
                                />
                            ))}
                         </div>
                    </section>
                </div>
                
                <section>
                    <h3 className="text-lg font-bold text-text-primary mb-4">{t('advancedSettings')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <AdvancedSettingToggle 
                            id="suggestions" 
                            label={t('autoSuggestions')} 
                            description={t('autoSuggestionsDesc')}
                            checked={settings.advanced.suggestions}
                            onChange={(val) => setSettings(p => ({ ...p, advanced: { ...p.advanced, suggestions: val } }))}
                            requiredPlan="free"
                            currentUserPlan={currentUserProfile}
                        />
                         <AdvancedSettingToggle 
                            id="memory" 
                            label={t('contextMemory')} 
                            description={t('contextMemoryDesc')}
                            checked={settings.advanced.memory}
                            onChange={(val) => setSettings(p => ({ ...p, advanced: { ...p.advanced, memory: val } }))}
                            requiredPlan="plus"
                            currentUserPlan={currentUserProfile}
                        />
                         <AdvancedSettingToggle 
                            id="realtime" 
                            label={t('realtimeData')} 
                            description={t('realtimeDataDesc')}
                            checked={settings.advanced.realtime}
                            onChange={(val) => setSettings(p => ({ ...p, advanced: { ...p.advanced, realtime: val } }))}
                            requiredPlan="proanalyst"
                            currentUserPlan={currentUserProfile}
                        />
                    </div>
                </section>

                 <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-end gap-3">
                    <button onClick={() => setSettings(initialSettings)} className="bg-surface hover:bg-border text-text-primary font-semibold py-2 px-6 rounded-lg border border-border transition-colors">{t('resetToDefaults')}</button>
                    <button className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">{t('savePreferences')}</button>
                </div>
            </div>
        </Card>
    );
};

const ProfileCard: React.FC<{ name: string; description: string; onApply: () => void; features: string[]; icon: React.ReactElement<{ className?: string }>; isLocked: boolean; }> = ({ name, description, onApply, features, icon, isLocked }) => (
    <div className={cn("bg-background border border-border rounded-lg p-4 flex flex-col relative transition-opacity", isLocked && "opacity-60")}>
        {isLocked && (
            <div className="absolute inset-0 bg-surface/30 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                <div className="text-center p-4 bg-background/80 rounded-lg shadow-lg">
                    {React.cloneElement(Icons.lock, { className: 'w-8 h-8 text-primary mx-auto mb-2' })}
                    <p className="text-text-primary font-semibold">Upgrade Plan</p>
                    <p className="text-xs text-text-secondary">to unlock this profile</p>
                </div>
            </div>
        )}
        <div className="flex items-start gap-3 mb-3">
            <div className="bg-primary/20 text-primary p-2 rounded-full mt-1">
                {React.cloneElement(icon, { className: 'w-5 h-5' })}
            </div>
            <div>
                <h4 className="font-bold text-text-primary">{name}</h4>
                <p className="text-xs text-text-secondary">{description}</p>
            </div>
        </div>
        <ul className="text-xs text-text-secondary list-disc list-inside space-y-1 my-2 flex-grow">
            {features.map(f => <li key={f}>{f}</li>)}
        </ul>
        <button onClick={onApply} disabled={isLocked} className="w-full mt-4 bg-primary/20 hover:bg-primary/30 text-primary font-semibold py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Apply Profile</button>
    </div>
);


const AdvancedSettingToggle: React.FC<{
    id: string;
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    requiredPlan: Profile;
    currentUserPlan: Profile;
}> = ({ id, label, description, checked, onChange, requiredPlan, currentUserPlan }) => {
    const isLocked = planHierarchy[requiredPlan] > planHierarchy[currentUserPlan];
    return (
        <div className={cn(
            "flex items-start justify-between bg-background p-4 rounded-lg transition-all duration-300",
            isLocked && 'opacity-60 blur-sm pointer-events-none'
        )}>
            <div className="flex-grow pr-4">
                <p className="font-semibold text-text-primary">{label}</p>
                <p className="text-sm text-text-secondary">{description}</p>
            </div>
            <ToggleSwitch enabled={checked} onChange={onChange} aria-label={label} isLocked={isLocked} />
        </div>
    );
};
