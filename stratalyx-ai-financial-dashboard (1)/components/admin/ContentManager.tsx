import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const ContentManager: React.FC = () => {
    const { t } = useAppContext();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handlePost = () => {
        if (!title || !content) {
            alert('Title and content are required.');
            return;
        }
        console.log('Posting update:', { title, content });
        alert('Update posted successfully!');
        setTitle('');
        setContent('');
    };

    return (
        <div className="bg-surface border border-border rounded-lg">
            <div className="p-4 border-b border-border">
                <h2 className="text-xl font-bold text-text-primary">{t('contentManager')}</h2>
                <p className="text-sm text-text-secondary mt-1">Post platform news, feature updates, and manage scheduled content.</p>
            </div>
            <div className="p-4 space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">{t('postPlatformUpdate')}</h3>
                <div>
                    <label className="text-sm font-semibold text-text-secondary">{t('title')}</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full mt-1 bg-background border border-border rounded-md p-2"
                    />
                </div>
                <div>
                    <label className="text-sm font-semibold text-text-secondary">{t('content')}</label>
                    <textarea 
                        rows={8}
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        className="w-full mt-1 bg-background border border-border rounded-md p-2"
                    />
                </div>
                <div className="flex justify-end">
                    <button onClick={handlePost} className="bg-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-600 transition-colors">
                        {t('postUpdate')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContentManager;
