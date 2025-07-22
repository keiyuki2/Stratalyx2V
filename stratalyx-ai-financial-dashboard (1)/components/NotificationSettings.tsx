

import React, { useState, useCallback } from 'react';
import { Icons } from '../constants';
import { useAppContext } from '../context/AppContext';

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-surface border border-border rounded-lg p-4 sm:p-6 ${className}`}>
        {children}
    </div>
);

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


const notificationTypes = {
    email: [
        { id: 'marketAlerts', labelKey: 'notificationMarketAlerts', descriptionKey: 'notificationMarketAlertsDesc' },
        { id: 'analysisComplete', labelKey: 'notificationAnalysisComplete', descriptionKey: 'notificationAnalysisCompleteDesc' },
        { id: 'systemUpdates', labelKey: 'notificationSystemUpdates', descriptionKey: 'notificationSystemUpdatesDesc' },
        { id: 'priceTargets', labelKey: 'notificationPriceTargets', descriptionKey: 'notificationPriceTargetsDesc' },
        { id: 'portfolioUpdates', labelKey: 'notificationPortfolioUpdates', descriptionKey: 'notificationPortfolioUpdatesDesc' },
        { id: 'newsAlerts', labelKey: 'notificationNewsAlerts', descriptionKey: 'notificationNewsAlertsDesc' },
        { id: 'weeklyDigest', labelKey: 'notificationWeeklyDigest', descriptionKey: 'notificationWeeklyDigestDesc' },
        { id: 'maintenanceNotices', labelKey: 'notificationMaintenanceNotices', descriptionKey: 'notificationMaintenanceNoticesDesc' },
    ],
    push: [
        { id: 'marketAlerts', labelKey: 'notificationMarketAlerts', descriptionKey: 'notificationMarketAlertsDesc' },
        { id: 'analysisComplete', labelKey: 'notificationAnalysisComplete', descriptionKey: 'notificationAnalysisCompleteDesc' },
        { id: 'systemUpdates', labelKey: 'notificationSystemUpdates', descriptionKey: 'notificationSystemUpdatesDesc' },
        { id: 'priceTargets', labelKey: 'notificationPriceTargets', descriptionKey: 'notificationPriceTargetsDesc' },
        { id: 'portfolioUpdates', labelKey: 'notificationPortfolioUpdates', descriptionKey: 'notificationPortfolioUpdatesDesc' },
        { id: 'newsAlerts', labelKey: 'notificationNewsAlerts', descriptionKey: 'notificationNewsAlertsDesc' },
        { id: 'urgentAlerts', labelKey: 'notificationUrgentAlerts', descriptionKey: 'notificationUrgentAlertsDesc' },
    ],
    inApp: [
        { id: 'marketAlerts', labelKey: 'notificationMarketAlerts', descriptionKey: 'notificationMarketAlertsDesc' },
        { id: 'analysisComplete', labelKey: 'notificationAnalysisComplete', descriptionKey: 'notificationAnalysisCompleteDesc' },
        { id: 'systemUpdates', labelKey: 'notificationSystemUpdates', descriptionKey: 'notificationSystemUpdatesDesc' },
        { id: 'priceTargets', labelKey: 'notificationPriceTargets', descriptionKey: 'notificationPriceTargetsDesc' },
        { id: 'portfolioUpdates', labelKey: 'notificationPortfolioUpdates', descriptionKey: 'notificationPortfolioUpdatesDesc' },
        { id: 'newsAlerts', labelKey: 'notificationNewsAlerts', descriptionKey: 'notificationNewsAlertsDesc' },
        { id: 'chatResponses', labelKey: 'notificationChatResponses', descriptionKey: 'notificationChatResponsesDesc' },
        { id: 'agentUpdates', labelKey: 'notificationAgentUpdates', descriptionKey: 'notificationAgentUpdatesDesc' },
    ]
};

const initialSettings = {
    email: { marketAlerts: true, analysisComplete: true, systemUpdates: true, priceTargets: false, portfolioUpdates: false, newsAlerts: true, weeklyDigest: true, maintenanceNotices: true },
    push: { marketAlerts: true, analysisComplete: true, systemUpdates: false, priceTargets: true, portfolioUpdates: true, newsAlerts: true, urgentAlerts: true },
    inApp: { marketAlerts: true, analysisComplete: true, systemUpdates: true, priceTargets: true, portfolioUpdates: true, newsAlerts: true, chatResponses: true, agentUpdates: false },
    timing: {
        frequency: 'Immediate',
        timezone: 'America/New_York',
        quietHours: true,
        quietStart: '22:00',
        quietEnd: '08:00'
    }
};

type SettingsCategory = 'email' | 'push' | 'inApp';

const NotificationCategory: React.FC<{
    title: string;
    settings: { [key: string]: boolean };
    types: { id: string, labelKey: string, descriptionKey: string }[];
    onToggle: (category: SettingsCategory, id: string, value: boolean) => void;
    categoryKey: SettingsCategory;
}> = ({ title, settings, types, onToggle, categoryKey }) => {
    const { t } = useAppContext();
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-text-primary">{title}</h3>
                <button className="flex items-center gap-2 text-sm text-primary hover:underline focus:outline-none" aria-label={`Configure ${title}`}>
                    {React.cloneElement(Icons.settings, { className: 'w-4 h-4' })}
                    {t('configure')}
                </button>
            </div>
            <div className="space-y-4">
                {types.map(type => (
                    <div key={type.id} className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-2">
                        <div className="flex-grow">
                            <p className="font-semibold text-text-primary">{t(type.labelKey)}</p>
                            <p className="text-sm text-text-secondary">{t(type.descriptionKey)}</p>
                        </div>
                        <ToggleSwitch enabled={!!settings[type.id]} onChange={(value) => onToggle(categoryKey, type.id, value)} aria-label={`Toggle ${t(type.labelKey)} for ${title}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

const timezones = [
    { value: 'Pacific/Midway', label: '(GMT-11:00) Midway Island, Samoa' },
    { value: 'Pacific/Honolulu', label: '(GMT-10:00) Hawaii' },
    { value: 'America/Anchorage', label: '(GMT-09:00) Alaska' },
    { value: 'America/Los_Angeles', label: '(GMT-08:00) Pacific Time (US & Canada)' },
    { value: 'America/Denver', label: '(GMT-07:00) Mountain Time (US & Canada)' },
    { value: 'America/Chicago', label: '(GMT-06:00) Central Time (US & Canada)' },
    { value: 'America/New_York', label: '(GMT-05:00) Eastern Time (US & Canada)' },
    { value: 'America/Caracas', label: '(GMT-04:30) Caracas' },
    { value: 'America/Halifax', label: '(GMT-04:00) Atlantic Time (Canada)' },
    { value: 'America/Sao_Paulo', label: '(GMT-03:00) Brasilia' },
    { value: 'Atlantic/South_Georgia', label: '(GMT-02:00) Mid-Atlantic' },
    { value: 'Atlantic/Azores', label: '(GMT-01:00) Azores' },
    { value: 'Europe/London', label: '(GMT+00:00) London, Dublin, Lisbon' },
    { value: 'Europe/Berlin', label: '(GMT+01:00) Amsterdam, Berlin, Rome, Paris' },
    { value: 'Europe/Helsinki', label: '(GMT+02:00) Helsinki, Kyiv, Riga, Sofia' },
    { value: 'Europe/Moscow', label: '(GMT+03:00) Moscow, St. Petersburg' },
    { value: 'Asia/Tehran', label: '(GMT+03:30) Tehran' },
    { value: 'Asia/Dubai', label: '(GMT+04:00) Abu Dhabi, Muscat' },
    { value: 'Asia/Kabul', label: '(GMT+04:30) Kabul' },
    { value: 'Asia/Karachi', label: '(GMT+05:00) Islamabad, Karachi, Tashkent' },
    { value: 'Asia/Kolkata', label: '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi' },
    { value: 'Asia/Kathmandu', label: '(GMT+05:45) Kathmandu' },
    { value: 'Asia/Dhaka', label: '(GMT+06:00) Astana, Dhaka' },
    { value: 'Asia/Rangoon', label: '(GMT+06:30) Rangoon' },
    { value: 'Asia/Bangkok', label: '(GMT+07:00) Bangkok, Hanoi, Jakarta' },
    { value: 'Asia/Shanghai', label: '(GMT+08:00) Beijing, Hong Kong, Singapore' },
    { value: 'Asia/Tokyo', label: '(GMT+09:00) Osaka, Sapporo, Tokyo' },
    { value: 'Australia/Sydney', label: '(GMT+10:00) Sydney, Melbourne' },
    { value: 'Pacific/Guadalcanal', label: '(GMT+11:00) Magadan, Solomon Is., New Caledonia' },
    { value: 'Pacific/Auckland', label: '(GMT+12:00) Auckland, Wellington' },
    { value: 'Pacific/Fiji', label: '(GMT+13:00) Fiji, Kamchatka, Marshall Is.' },
];

export const NotificationSettings: React.FC = () => {
    const { t } = useAppContext();
    const [settings, setSettings] = useState(initialSettings);
    const [originalSettings, setOriginalSettings] = useState(JSON.parse(JSON.stringify(initialSettings)));

    const handleToggle = useCallback((category: SettingsCategory, id: string, value: boolean) => {
        setSettings(prev => ({
            ...prev,
            [category]: { ...prev[category], [id]: value }
        }));
    }, []);
    
    const handleTimingChange = useCallback((field: string, value: any) => {
         setSettings(prev => ({
            ...prev,
            timing: { ...prev.timing, [field]: value }
        }));
    }, []);

    const setAllNotifications = (enabled: boolean) => {
        const newSettings = JSON.parse(JSON.stringify(settings));
        (Object.keys(notificationTypes) as SettingsCategory[]).forEach(category => {
            notificationTypes[category].forEach(type => {
                newSettings[category][type.id] = enabled;
            });
        });
        setSettings(newSettings);
    };

    const resetToDefaults = () => {
        setSettings(initialSettings);
    };

    const cancelChanges = () => {
        setSettings(originalSettings);
    };

    const saveChanges = () => {
        console.log("Saving settings:", settings);
        alert(t('saveNotificationSettings') + "!");
    };


    return (
        <Card>
            <h2 className="text-xl font-bold text-text-primary mb-1">{t('notifications')}</h2>
            <p className="text-text-secondary mb-8">{t('notificationsDesc')}</p>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                <div className="xl:col-span-2 space-y-10">
                    <NotificationCategory title={t('emailNotifications')} settings={settings.email} types={notificationTypes.email} onToggle={handleToggle} categoryKey="email" />
                    <NotificationCategory title={t('pushNotifications')} settings={settings.push} types={notificationTypes.push} onToggle={handleToggle} categoryKey="push" />
                    <NotificationCategory title={t('inAppNotifications')} settings={settings.inApp} types={notificationTypes.inApp} onToggle={handleToggle} categoryKey="inApp" />
                </div>
                <div className="space-y-8">
                    <div>
                        <h3 className="text-lg font-bold text-text-primary mb-4">{t('notificationTiming')}</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="frequency" className="text-sm font-semibold text-text-primary block mb-1">{t('notificationFrequency')}</label>
                                <p className="text-xs text-text-secondary mb-2">{t('notificationFrequencyDesc')}</p>
                                <select id="frequency" value={settings.timing.frequency} onChange={e => handleTimingChange('frequency', e.target.value)} className="w-full bg-background border border-border rounded-md p-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none">
                                    <option value="Immediate">{t('freqImmediate')}</option>
                                    <option value="Hourly">{t('freqHourly')}</option>
                                    <option value="Daily">{t('freqDaily')}</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="timezone" className="text-sm font-semibold text-text-primary block mb-1">{t('timezone')}</label>
                                <p className="text-xs text-text-secondary mb-2">{t('timezoneDesc')}</p>
                                <select id="timezone" value={settings.timing.timezone} onChange={e => handleTimingChange('timezone', e.target.value)} className="w-full bg-background border border-border rounded-md p-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none">
                                    {timezones.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className="text-sm font-semibold text-text-primary">{t('quietHours')}</p>
                                        <p className="text-xs text-text-secondary">{t('quietHoursDesc')}</p>
                                    </div>
                                    <ToggleSwitch enabled={settings.timing.quietHours} onChange={value => handleTimingChange('quietHours', value)} aria-label={t('quietHours')} />
                                </div>
                                {settings.timing.quietHours && (
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div>
                                            <label htmlFor="quietStart" className="text-xs text-text-secondary block mb-1">{t('quietStartTime')}</label>
                                            <input id="quietStart" type="time" value={settings.timing.quietStart} onChange={e => handleTimingChange('quietStart', e.target.value)} className="w-full bg-background border border-border rounded-md p-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
                                        </div>
                                         <div>
                                            <label htmlFor="quietEnd" className="text-xs text-text-secondary block mb-1">{t('quietEndTime')}</label>
                                            <input id="quietEnd" type="time" value={settings.timing.quietEnd} onChange={e => handleTimingChange('quietEnd', e.target.value)} className="w-full bg-background border border-border rounded-md p-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                         <h3 className="text-lg font-bold text-text-primary mb-4">{t('quickActions')}</h3>
                         <div className="grid grid-cols-2 gap-2">
                            <button className="text-sm p-2 bg-surface hover:bg-border border border-border rounded-lg text-center text-text-primary transition-colors">{t('testNotifications')}</button>
                            <button onClick={() => setAllNotifications(false)} className="text-sm p-2 bg-surface hover:bg-border border border-border rounded-lg text-center text-text-primary transition-colors">{t('disableAll')}</button>
                            <button onClick={() => setAllNotifications(true)} className="text-sm p-2 bg-surface hover:bg-border border border-border rounded-lg text-center text-text-primary transition-colors">{t('enableAll')}</button>
                            <button onClick={resetToDefaults} className="text-sm p-2 bg-surface hover:bg-border border border-border rounded-lg text-center text-text-primary transition-colors">{t('resetToDefaults')}</button>
                         </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-end gap-3">
                <button onClick={cancelChanges} className="bg-surface hover:bg-border text-text-primary font-semibold py-2 px-6 rounded-lg border border-border transition-colors">{t('cancelChanges')}</button>
                <button onClick={saveChanges} className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">{t('saveNotificationSettings')}</button>
            </div>
        </Card>
    );
};
