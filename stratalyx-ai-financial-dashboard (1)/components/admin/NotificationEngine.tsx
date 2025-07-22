import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import type { ToastLevel } from '../../types';

const NotificationEngine: React.FC = () => {
    const { t, addToast } = useAppContext();
    const [message, setMessage] = useState('');
    const [level, setLevel] = useState<ToastLevel>('Info');

    const handleSend = () => {
        if (!message) {
            alert('Message cannot be empty.');
            return;
        }
        addToast(message, level);
        setMessage('');
    };

    return (
        <div className="bg-surface border border-border rounded-lg">
            <div className="p-4 border-b border-border">
                <h2 className="text-xl font-bold text-text-primary">{t('notificationEngine')}</h2>
                <p className="text-sm text-text-secondary mt-1">Force-push alerts and manage notification triggers.</p>
            </div>
             <div className="p-4 space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">{t('sendGlobalNotification')}</h3>
                <div>
                    <label className="text-sm font-semibold text-text-secondary">{t('message')}</label>
                    <textarea 
                        rows={4}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="w-full mt-1 bg-background border border-border rounded-md p-2"
                    />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="text-sm font-semibold text-text-secondary">{t('level')}</label>
                        <select value={level} onChange={e => setLevel(e.target.value as ToastLevel)} className="w-full mt-1 bg-background border border-border rounded-md p-2">
                            <option value="Success">{t('success')}</option>
                            <option value="Info">{t('info')}</option>
                            <option value="Warning">{t('warning')}</option>
                            <option value="Critical">{t('critical')}</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <button onClick={handleSend} className="w-full bg-primary text-white font-semibold p-2 rounded-md hover:bg-blue-600 transition-colors">
                            {t('sendNotification')}
                        </button>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default NotificationEngine;