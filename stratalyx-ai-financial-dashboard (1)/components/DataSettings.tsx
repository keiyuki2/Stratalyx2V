

import React, { useState } from 'react';
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

const SelectInput: React.FC<{ id?: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode, 'aria-label': string, className?: string }> = ({ id, value, onChange, children, 'aria-label': ariaLabel, className }) => (
    <div className="relative">
        <select
            id={id}
            value={value}
            onChange={onChange}
            aria-label={ariaLabel}
            className={`bg-background border border-border rounded-md pl-3 pr-8 py-1.5 text-sm text-text-primary focus:ring-2 focus:ring-primary focus:outline-none appearance-none ${className}`}
        >
            {children}
        </select>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary"><path d="m6 9 6 6 6-6"/></svg>
    </div>
);


const Checkbox: React.FC<{ id: string, label: string, checked: boolean, onChange: (checked: boolean) => void }> = ({ id, label, checked, onChange }) => (
    <div className="flex items-center">
        <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary"
        />
        <label htmlFor={id} className="ml-3 text-sm text-text-primary">
            {label}
        </label>
    </div>
);


const initialDataSettings = {
    retention: {
        queryHistory: '1y',
        chatSessions: '6m',
        marketCache: '3m',
        userPrefs: 'forever',
        analytics: '1y',
    },
    privacy: {
        shareAnalytics: true,
        aiModelImprovement: true,
        marketing: false,
        thirdPartySharing: false,
        dataProcessing: true,
    },
    export: {
        format: 'json',
        dateRange: '3m',
        include: {
            chatHistory: true,
            queryHistory: true,
            userPrefs: false,
            analyticsData: false,
        },
    },
    apiKey: ''
};

const retentionItems = [
    { key: 'queryHistory', titleKey: 'retentionQueryHistory', descriptionKey: 'retentionQueryHistoryDesc', size: '2.3 MB' },
    { key: 'chatSessions', titleKey: 'retentionChatSessions', descriptionKey: 'retentionChatSessionsDesc', size: '1.8 MB' },
    { key: 'marketCache', titleKey: 'retentionMarketCache', descriptionKey: 'retentionMarketCacheDesc', size: '15.7 MB' },
    { key: 'userPrefs', titleKey: 'retentionUserPrefs', descriptionKey: 'retentionUserPrefsDesc', size: '0.1 MB' },
    { key: 'analytics', titleKey: 'retentionAnalytics', descriptionKey: 'retentionAnalyticsDesc', size: '0.8 MB' },
];

const privacyItems = [
    { key: 'shareAnalytics', titleKey: 'privacyShareAnalytics', descriptionKey: 'privacyShareAnalyticsDesc' },
    { key: 'aiModelImprovement', titleKey: 'privacyAIImprovement', descriptionKey: 'privacyAIImprovementDesc' },
    { key: 'marketing', titleKey: 'privacyMarketing', descriptionKey: 'privacyMarketingDesc' },
    { key: 'thirdPartySharing', titleKey: 'privacyThirdParty', descriptionKey: 'privacyThirdPartyDesc' },
    { key: 'dataProcessing', titleKey: 'privacyDataProcessing', descriptionKey: 'privacyDataProcessingDesc' },
];

const exportIncludeItems = [
    { key: 'chatHistory', labelKey: 'exportChatHistory', descriptionKey: 'exportChatHistory' },
    { key: 'queryHistory', labelKey: 'exportQueryHistory', descriptionKey: 'exportQueryHistory' },
    { key: 'userPrefs', labelKey: 'exportUserPrefs', descriptionKey: 'exportUserPrefs' },
    { key: 'analyticsData', labelKey: 'exportAnalytics', descriptionKey: 'exportAnalytics' },
]

export const DataSettings: React.FC = () => {
    const { t } = useAppContext();
    const [settings, setSettings] = useState(initialDataSettings);

    const handleRetentionChange = (key: keyof typeof initialDataSettings.retention, value: string) => {
        setSettings(prev => ({ ...prev, retention: { ...prev.retention, [key]: value } }));
    };

    const handlePrivacyChange = (key: keyof typeof initialDataSettings.privacy, value: boolean) => {
        setSettings(prev => ({ ...prev, privacy: { ...prev.privacy, [key]: value } }));
    };

    const handleExportChange = (field: keyof typeof initialDataSettings.export, value: any) => {
        setSettings(prev => ({ ...prev, export: { ...prev.export, [field]: value }}));
    }

    const handleExportIncludeChange = (key: keyof typeof initialDataSettings.export.include, value: boolean) => {
        setSettings(prev => ({ ...prev, export: { ...prev.export, include: {...prev.export.include, [key]: value }}}));
    }

    const saveSettings = () => {
        alert(t('saveDataSettings') + '!');
        console.log('Saving data settings:', settings);
    }
    
    return (
        <Card>
            <h2 className="text-xl font-bold text-text-primary mb-1">{t('dataManagement')}</h2>
            <p className="text-text-secondary mb-8">{t('dataManagementDesc')}</p>
            
            <div className="space-y-12">
                <section aria-labelledby="data-retention-heading">
                    <h3 id="data-retention-heading" className="text-lg font-bold text-text-primary mb-4">{t('dataRetention')}</h3>
                    <div className="space-y-4">
                        {retentionItems.map(item => (
                            <div key={item.key} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-background rounded-lg">
                                <div className="flex-grow">
                                    <p className="font-semibold text-text-primary">{t(item.titleKey)}</p>
                                    <p className="text-sm text-text-secondary">{t(item.descriptionKey)}</p>
                                    <p className="text-xs text-text-secondary/70 mt-1">Current size: {item.size}</p>
                                </div>
                                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                    <SelectInput aria-label={`Retention period for ${t(item.titleKey)}`} value={settings.retention[item.key as keyof typeof settings.retention]} onChange={(e) => handleRetentionChange(item.key as keyof typeof settings.retention, e.target.value)}>
                                        <option value="forever">{t('retentionForever')}</option>
                                        <option value="1y">{t('retention1Y')}</option>
                                        <option value="6m">{t('retention6M')}</option>
                                        <option value="3m">{t('retention3M')}</option>
                                        <option value="30d">{t('retention30D')}</option>
                                    </SelectInput>
                                    <button className="text-sm text-danger/80 hover:text-danger hover:bg-danger/10 px-3 py-1.5 rounded-md transition-colors">{t('delete')}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section aria-labelledby="privacy-controls-heading">
                    <h3 id="privacy-controls-heading" className="text-lg font-bold text-text-primary mb-4">{t('privacyControls')}</h3>
                     <div className="space-y-4">
                        {privacyItems.map(item => (
                             <div key={item.key} className="flex items-start justify-between p-3 bg-background rounded-lg">
                                <div className="flex-grow">
                                    <p className="font-semibold text-text-primary">{t(item.titleKey)}</p>
                                    <p className="text-sm text-text-secondary">{t(item.descriptionKey)}</p>
                                </div>
                                <div className="pl-4">
                                    <ToggleSwitch enabled={settings.privacy[item.key as keyof typeof settings.privacy]} onChange={(val) => handlePrivacyChange(item.key as keyof typeof settings.privacy, val)} aria-label={t(item.titleKey)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <section aria-labelledby="data-export-heading">
                         <h3 id="data-export-heading" className="text-lg font-bold text-text-primary mb-4">{t('dataExport')}</h3>
                         <div className="space-y-6 bg-background p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-text-primary block mb-1">{t('exportFormat')}</label>
                                    <SelectInput aria-label={t('exportFormat')} value={settings.export.format} onChange={(e) => handleExportChange('format', e.target.value)} className="w-full">
                                        <option value="json">{t('formatJSON')}</option>
                                        <option value="csv">{t('formatCSV')}</option>
                                    </SelectInput>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-text-primary block mb-1">{t('dateRange')}</label>
                                    <SelectInput aria-label={t('dateRange')} value={settings.export.dateRange} onChange={(e) => handleExportChange('dateRange', e.target.value)} className="w-full">
                                        <option value="all">{t('rangeAll')}</option>
                                        <option value="1y">{t('range1Y')}</option>
                                        <option value="6m">{t('range6M')}</option>
                                        <option value="3m">{t('range3M')}</option>
                                        <option value="30d">{t('range30D')}</option>
                                    </SelectInput>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-text-primary mb-2">{t('includeInExport')}</h4>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                    {exportIncludeItems.map(item => (
                                        <div key={item.key}>
                                            <Checkbox id={item.key} label={t(item.labelKey)} checked={settings.export.include[item.key as keyof typeof settings.export.include]} onChange={val => handleExportIncludeChange(item.key as keyof typeof settings.export.include, val)} />
                                            <p className="text-xs text-text-secondary ml-7">{t(item.descriptionKey)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 text-sm p-2 bg-surface hover:bg-border border border-border rounded-lg text-center text-text-primary transition-colors">{t('previewExport')}</button>
                                <button className="flex-1 text-sm p-2 bg-primary hover:bg-blue-600 border border-primary rounded-lg text-center text-white transition-colors">{t('exportData')}</button>
                            </div>
                         </div>
                    </section>
                    
                    <section aria-labelledby="api-access-heading" className="space-y-4">
                         <h3 id="api-access-heading" className="text-lg font-bold text-text-primary mb-4">{t('apiAccess')}</h3>
                          <div className="space-y-4 bg-background p-4 rounded-lg">
                             <div className="flex items-center justify-between">
                                 <p className="text-sm text-text-secondary">{t('apiKeyStatus')}</p>
                                 <span className="text-sm font-semibold text-warning">{t('inactive')}</span>
                             </div>
                             <p className="text-sm text-text-secondary">{t('noApiKeyGenerated')}</p>
                             <div className="flex gap-2">
                                <button className="flex-1 text-sm p-2 bg-primary hover:bg-blue-600 border border-primary rounded-lg text-center text-white transition-colors">{t('generateApiKey')}</button>
                                <button className="flex-1 text-sm p-2 bg-surface hover:bg-border border border-border rounded-lg text-center text-text-primary transition-colors">{t('apiDocumentation')}</button>
                             </div>
                          </div>
                    </section>
                </div>

                <section aria-labelledby="danger-zone-heading">
                     <h3 id="danger-zone-heading" className="text-lg font-bold text-danger mb-4">{t('dangerZone')}</h3>
                     <div className="border border-danger/50 rounded-lg p-4 space-y-4">
                        <div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                <div className="mb-2 sm:mb-0">
                                    <p className="font-semibold text-text-primary">{t('deleteAllData')}</p>
                                    <p className="text-sm text-text-secondary">{t('deleteAllDataDesc')}</p>
                                </div>
                                <button className="text-sm bg-danger/20 text-danger font-semibold px-4 py-2 rounded-lg hover:bg-danger/30 transition-colors">{t('deleteEverything')}</button>
                            </div>
                        </div>
                        <div className="border-t border-danger/30"></div>
                         <div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                <div className="mb-2 sm:mb-0">
                                    <p className="font-semibold text-text-primary">{t('closeAccount')}</p>
                                    <p className="text-sm text-text-secondary">{t('closeAccountDesc')}</p>
                                </div>
                                <button className="text-sm bg-danger/20 text-danger font-semibold px-4 py-2 rounded-lg hover:bg-danger/30 transition-colors">{t('closeAccount')}</button>
                            </div>
                        </div>
                     </div>
                </section>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-end gap-3">
                 <button onClick={() => console.log('Resetting settings')} className="bg-surface hover:bg-border text-text-primary font-semibold py-2 px-6 rounded-lg border border-border transition-colors">{t('resetSettings')}</button>
                <button onClick={saveSettings} className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">{t('saveDataSettings')}</button>
            </div>
        </Card>
    );
};
