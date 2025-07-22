import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Icons } from '../../constants';

const DangerAction: React.FC<{ title: string; description: string; buttonText: string; onAction: () => void; }> = ({ title, description, buttonText, onAction }) => (
     <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="mb-2 sm:mb-0">
            <p className="font-semibold text-text-primary">{title}</p>
            <p className="text-sm text-text-secondary">{description}</p>
        </div>
        <button onClick={onAction} className="text-sm bg-danger/20 text-danger font-semibold px-4 py-2 rounded-lg hover:bg-danger/30 transition-colors shrink-0">
            {buttonText}
        </button>
    </div>
)

const DangerZone: React.FC = () => {
    const { t } = useAppContext();

    const handleDeleteUser = () => {
        if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
            console.log('Deleting user...');
        }
    };
    
    const handleWipeData = () => {
        if (window.confirm('Are you sure you want to wipe all data? This is irreversible.')) {
            console.log('Wiping data...');
        }
    };
    
    const handleResetConfig = () => {
         if (window.confirm('Are you sure you want to reset all AI configurations to their defaults?')) {
            console.log('Resetting AI configs...');
        }
    };

    const handleShutdown = () => {
        if (window.confirm('SYSTEM SHUTDOWN: Are you absolutely sure? This will take the entire platform offline.')) {
            console.log('Initiating system shutdown...');
        }
    };

    const handleInjectData = () => {
        if (window.confirm('Inject fake broker and user data for demo purposes?')) {
            console.log('Injecting demo data...');
            alert('Demo data injected successfully!');
        }
    };

    return (
        <div className="bg-surface border border-danger/50 rounded-lg">
            <div className="p-4 border-b border-danger/30 flex items-center gap-2">
                {React.cloneElement(Icons.alertTriangle, { className: 'w-6 h-6 text-danger'})}
                <h2 className="text-xl font-bold text-danger">{t('dangerZone')}</h2>
            </div>
            <div className="p-4 space-y-4 divide-y divide-danger/20">
                <DangerAction
                    title="Inject Demo Data"
                    description="Populate the platform with fake broker and user data for demo purposes."
                    buttonText="Inject Data"
                    onAction={handleInjectData}
                />
                <DangerAction
                    title={t('deleteUser')}
                    description="Permanently delete a user and all their associated data."
                    buttonText={t('deleteUser')}
                    onAction={handleDeleteUser}
                />
                 <DangerAction
                    title={t('wipeData')}
                    description="Wipe all non-essential data like alerts and cache."
                    buttonText={t('wipeData')}
                    onAction={handleWipeData}
                />
                 <DangerAction
                    title={t('resetConfig')}
                    description="Reset all AI configurations and agent settings to factory defaults."
                    buttonText={t('resetConfig')}
                    onAction={handleResetConfig}
                />
                 <DangerAction
                    title={t('systemShutdown')}
                    description="Last resort. This will take the platform offline."
                    buttonText={t('systemShutdown')}
                    onAction={handleShutdown}
                />
            </div>
        </div>
    );
};

export default DangerZone;