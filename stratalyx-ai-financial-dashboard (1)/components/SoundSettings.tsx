

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

const VolumeSlider: React.FC<{ value: number, onChange: (value: number) => void, 'aria-label': string }> = ({ value, onChange, 'aria-label': ariaLabel }) => (
     <div className="flex items-center gap-4">
        <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
            aria-label={ariaLabel}
        />
        <span className="w-12 text-right text-sm text-text-primary font-mono">{value}%</span>
    </div>
);

export const SoundSettings: React.FC = () => {
    const { t } = useAppContext();
    const [muteAll, setMuteAll] = useState(false);
    const [masterVolume, setMasterVolume] = useState(80);
    const [notificationVolume, setNotificationVolume] = useState(100);
    const [uiVolume, setUiVolume] = useState(60);
    const [soundPack, setSoundPack] = useState('default');
    
    const handleMuteAll = (muted: boolean) => {
        setMuteAll(muted);
        if (muted) {
            setMasterVolume(0);
        } else {
            setMasterVolume(80); // Restore to a default value
        }
    };
    
    const handleMasterVolumeChange = (volume: number) => {
        setMasterVolume(volume);
        if(volume === 0) setMuteAll(true);
        else setMuteAll(false);
    };

    return (
        <Card>
            <h2 className="text-xl font-bold text-text-primary mb-1">{t('soundSettings')}</h2>
            <p className="text-text-secondary mb-8">{t('soundSettingsDesc')}</p>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-text-primary">{t('muteAllSounds')}</p>
                        <p className="text-sm text-text-secondary">{t('muteAllSoundsDesc')}</p>
                    </div>
                    <ToggleSwitch enabled={muteAll} onChange={handleMuteAll} aria-label={t('muteAllSounds')} />
                </div>

                <div>
                    <label className="font-semibold text-text-primary block mb-1">{t('masterVolume')}</label>
                    <VolumeSlider value={muteAll ? 0 : masterVolume} onChange={handleMasterVolumeChange} aria-label={t('masterVolume')} />
                </div>

                <div className={`transition-opacity ${muteAll ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    <div className="space-y-4 pt-4 border-t border-border">
                        <div>
                            <label className="font-semibold text-text-primary block mb-1">{t('notificationVolume')}</label>
                            <VolumeSlider value={notificationVolume} onChange={setNotificationVolume} aria-label={t('notificationVolume')} />
                        </div>
                        <div>
                            <label className="font-semibold text-text-primary block mb-1">{t('uiVolume')}</label>
                            <VolumeSlider value={uiVolume} onChange={setUiVolume} aria-label={t('uiVolume')} />
                        </div>
                    </div>
                </div>

                 <div>
                    <label htmlFor="sound-pack" className="font-semibold text-text-primary block mb-1">{t('soundPack')}</label>
                    <p className="text-sm text-text-secondary mb-2">{t('soundPackDesc')}</p>
                    <select 
                        id="sound-pack" 
                        value={soundPack}
                        onChange={(e) => setSoundPack(e.target.value)}
                        className="w-full bg-background border border-border rounded-md p-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                        <option value="default">{t('soundPackDefault')}</option>
                        <option value="modern">{t('soundPackModern')}</option>
                        <option value="classic">{t('soundPackClassic')}</option>
                        <option value="silent">{t('soundPackSilent')}</option>
                    </select>
                </div>
            </div>
        </Card>
    );
};
