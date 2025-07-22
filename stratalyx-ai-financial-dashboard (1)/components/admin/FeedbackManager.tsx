import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Icons } from '../../constants';

const mockReviews = [
    { id: 1, user: 'John Trader', rating: 5, text: 'Excellent analysis of the market conditions.', agent: 'GPT-4 Turbo', date: '2024-08-01', flagged: false },
    { id: 2, user: 'Jane Doe', rating: 3, text: 'The chart reading feature is hit or miss sometimes.', agent: 'Gemini Pro', date: '2024-07-31', flagged: true },
    { id: 3, user: 'Peter Jones', rating: 4, text: 'Good insights but could be faster.', agent: 'GPT-4 Turbo', date: '2024-07-30', flagged: false },
    { id: 4, user: 'Khulan', rating: 1, text: 'Totally wrong about the stock direction.', agent: 'Claude 3 Opus', date: '2024-07-29', flagged: true },
];

const renderStarRating = (rating: number) => (
    <div className="flex items-center text-yellow-400">
        {[...Array(5)].map((_, i) => React.cloneElement(Icons.star, { key: i, className: `w-4 h-4 ${i < rating ? 'fill-current' : ''}` }))}
    </div>
);

const FeedbackManager: React.FC = () => {
    const { t } = useAppContext();
    const [reviews, setReviews] = useState(mockReviews);

    const handleAction = (id: number, action: 'approve' | 'reject') => {
        console.log(`Review ${id} ${action}d.`);
        setReviews(prev => prev.filter(r => r.id !== id));
    };

    return (
        <div className="bg-surface border border-border rounded-lg">
            <div className="p-4 border-b border-border">
                <h2 className="text-xl font-bold text-text-primary">{t('feedbackManager')}</h2>
                <p className="text-sm text-text-secondary mt-1">Approve, reject, and manage user reviews for AI agents.</p>
            </div>
            <div className="p-4 flex justify-between">
                <div className="flex gap-2">
                    <button className="bg-background text-sm font-semibold p-2 rounded-md border border-border">{t('allStatuses')}</button>
                    <button className="bg-background text-sm font-semibold p-2 rounded-md border border-border">Sort by: Recency</button>
                </div>
                <div className="flex gap-2">
                    <button className="bg-success/20 text-success text-sm font-semibold p-2 rounded-md">{t('approveAll')}</button>
                    <button className="bg-danger/20 text-danger text-sm font-semibold p-2 rounded-md">{t('rejectAll')}</button>
                </div>
            </div>
            <div className="space-y-4 p-4">
                {reviews.map(review => (
                    <div key={review.id} className="bg-background p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3">
                                    <p className="font-semibold text-text-primary">{review.user}</p>
                                    <span className="text-xs text-text-secondary">on {review.agent}</span>
                                </div>
                                {renderStarRating(review.rating)}
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-text-secondary">{review.date}</p>
                                {review.flagged && <span className="text-xs text-warning font-bold">Flagged</span>}
                            </div>
                        </div>
                        <p className="text-sm text-text-secondary mt-2">{review.text}</p>
                        <div className="flex justify-end gap-2 mt-3">
                            <button onClick={() => handleAction(review.id, 'approve')} className="text-sm bg-success/20 text-success font-semibold px-3 py-1 rounded-md">{t('approve')}</button>
                            <button onClick={() => handleAction(review.id, 'reject')} className="text-sm bg-danger/20 text-danger font-semibold px-3 py-1 rounded-md">{t('reject')}</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeedbackManager;
