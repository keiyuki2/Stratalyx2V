
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Agent } from '../types';
import { agentAnalyticsData, Icons } from '../constants';

const Card: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className = '', title }) => (
    <div className={`bg-surface border border-border rounded-lg ${className}`}>
        {title && <h3 className="text-lg font-bold text-text-primary p-4 sm:p-6 border-b border-border">{title}</h3>}
        <div className="p-4 sm:p-6">{children}</div>
    </div>
);


const KPI: React.FC<{ label: string; value: string; change?: string; isPositive?: boolean }> = ({ label, value, change, isPositive }) => (
    <div className="bg-surface border border-border rounded-lg p-4 sm:p-6">
        <p className="text-sm text-text-secondary mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-text-primary">{value}</p>
            {change && (
                <span className={`text-sm font-semibold ${isPositive ? 'text-success' : 'text-danger'}`}>
                    {change}
                </span>
            )}
        </div>
    </div>
);

const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
        <div className="flex items-center text-yellow-400">
            {[...Array(fullStars)].map((_, i) => React.cloneElement(Icons.star, { key: `full-${i}`, className: 'w-4 h-4 fill-current' }))}
            {/* Simple representation for half star if needed */}
            {[...Array(emptyStars)].map((_, i) => React.cloneElement(Icons.star, { key: `empty-${i}`, className: 'w-4 h-4' }))}
        </div>
    );
};

const ReviewForm: React.FC<{ agentName: string, onReviewSubmit: (review: { rating: number, text: string }) => void }> = ({ agentName, onReviewSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;
        onReviewSubmit({ rating, text: comment });
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <Card title="Leave a Review">
                <div className="text-center p-8">
                    <div className="mx-auto w-12 h-12 bg-success/20 text-success rounded-full flex items-center justify-center">
                        {React.cloneElement(Icons.checkmark, { className: 'w-8 h-8' })}
                    </div>
                    <h4 className="text-lg font-bold text-text-primary mt-4">Thank You!</h4>
                    <p className="text-text-secondary">Your feedback helps us improve our AI agents.</p>
                </div>
            </Card>
        );
    }

    return (
        <Card title="Leave a Review">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <p className="text-sm font-semibold text-text-primary mb-2">Your Rating for {agentName}</p>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                type="button"
                                key={star}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="text-yellow-400 focus:outline-none"
                                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                            >
                                {React.cloneElement(Icons.star, {
                                    className: `w-7 h-7 transition-colors ${(hoverRating || rating) >= star ? 'fill-current' : ''}`
                                })}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="review-comment" className="text-sm font-semibold text-text-primary mb-2 block">
                        Your Comments (Optional)
                    </label>
                    <textarea
                        id="review-comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        placeholder={`What did you like or dislike about ${agentName}?`}
                        className="w-full bg-background border border-border rounded-md p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                </div>
                <button
                    type="submit"
                    disabled={rating === 0}
                    className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                    Submit Review
                </button>
            </form>
        </Card>
    );
};

export const AgentDetailModal: React.FC<{ agent: Agent | null; onClose: () => void; onConfigure: (agent: Agent) => void; }> = ({ agent, onClose, onConfigure }) => {
    
    const [analytics, setAnalytics] = useState<any>(null);

    useEffect(() => {
        if (agent) {
            setAnalytics(agentAnalyticsData[agent.id as keyof typeof agentAnalyticsData] || null);
        }
    }, [agent]);


    const handleReviewSubmit = (review: { rating: number, text: string }) => {
        if (!analytics || !agent) return;
        
        const newFeedback = {
            time: 'Just now',
            text: review.text,
            rating: review.rating,
        };

        const newRatingDist = [...analytics.ratingDistribution];
        const ratingIndex = 5 - review.rating; // 5 stars is index 0
        if (newRatingDist[ratingIndex]) {
            newRatingDist[ratingIndex] = { ...newRatingDist[ratingIndex], count: newRatingDist[ratingIndex].count + 1 };
        }
        
        const newTotalQueries = analytics.kpis.totalQueries + 1;
        const newAvgRating = ((analytics.kpis.userRating * analytics.kpis.totalQueries) + review.rating) / newTotalQueries;

        setAnalytics({
            ...analytics,
            kpis: {
                ...analytics.kpis,
                userRating: parseFloat(newAvgRating.toFixed(1)),
                totalQueries: newTotalQueries,
            },
            recentFeedback: [newFeedback, ...analytics.recentFeedback],
            ratingDistribution: newRatingDist,
        });
    };

    if (!agent) {
        return null;
    }

    if (!analytics) {
        return null; 
    }

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-surface border border-border rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 sm:p-6 border-b border-border flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">{agent.name} Analytics</h2>
                        <p className="text-text-secondary">Detailed performance insights for {agent.provider}</p>
                    </div>
                     <div className="flex items-center gap-3">
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${agent.active ? 'bg-success/20 text-success' : 'bg-gray-500/20 text-gray-400'}`}>
                            {agent.active ? 'Active' : 'Inactive'}
                        </span>
                        <button
                            onClick={() => onConfigure(agent)}
                            className="flex items-center gap-2 bg-surface hover:bg-border text-text-primary font-semibold py-2 px-3 rounded-lg text-sm transition-colors border border-border"
                            title="Configure Agent"
                        >
                            {React.cloneElement(Icons.settings, { className: 'w-4 h-4' })}
                            Configure
                        </button>
                        <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                </header>
                 <div className="p-4 sm:p-6 overflow-y-auto">
                    {/* KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <KPI label="Accuracy Rate" value={`${analytics.kpis.accuracy}%`} change="+2.3% from last week" isPositive />
                        <KPI label="Avg Response Time" value={`${analytics.kpis.responseTime}ms`} change="-15ms from last week" isPositive />
                        <KPI label="Total Queries" value={analytics.kpis.totalQueries.toLocaleString()} change="+12% from last week" isPositive />
                        <KPI label="User Rating" value={`${analytics.kpis.userRating}/5`} change="+0.2 from last week" isPositive />
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card title="Performance Over Time">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={analytics.performanceOverTime}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                                        <XAxis dataKey="week" stroke="#848D97" />
                                        <YAxis yAxisId="left" orientation="left" stroke="#34D399" label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft', fill: '#34D399' }} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#2F81F7" label={{ value: 'Response (ms)', angle: -90, position: 'insideRight', fill: '#2F81F7' }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D' }} />
                                        <Legend />
                                        <Bar yAxisId="left" dataKey="accuracy" fill="#34D399" name="Accuracy (%)" />
                                        <Bar yAxisId="right" dataKey="responseTime" fill="#2F81F7" name="Response Time (ms)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card title="Query Distribution">
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie data={analytics.queryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                                {analytics.queryDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D' }} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Card>
                                <Card title="Usage Patterns">
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex justify-between">
                                            <span className="text-text-secondary">Peak Usage Time</span>
                                            <span className="font-semibold text-text-primary">{analytics.usagePatterns.peakTime}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-text-secondary">Most Active Day</span>
                                            <span className="font-semibold text-text-primary">{analytics.usagePatterns.mostActiveDay}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-text-secondary">Avg. Session Length</span>
                                            <span className="font-semibold text-text-primary">{analytics.usagePatterns.avgSessionLength}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-text-secondary">Repeat Users</span>
                                            <span className="font-semibold text-text-primary">{analytics.usagePatterns.repeatUsers}</span>
                                        </li>
                                    </ul>
                                </Card>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-1 space-y-8">
                             <Card title="Cost Analysis">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-text-secondary">Total Cost (30 days)</span>
                                        <span className="text-2xl font-bold text-text-primary">${analytics.costAnalysis.totalCost.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline text-sm">
                                        <span className="text-text-secondary">Cost per Query</span>
                                        <span className="font-semibold text-text-primary">${analytics.costAnalysis.costPerQuery.toFixed(3)}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline text-sm">
                                        <span className="text-text-secondary">Projected Monthly</span>
                                        <span className="font-semibold text-text-primary">${analytics.costAnalysis.projectedMonthly.toFixed(2)}</span>
                                    </div>
                                    <div className="pt-4 border-t border-border">
                                        <h4 className="font-semibold text-text-primary mb-2">Cost Breakdown</h4>
                                        <ResponsiveContainer width="100%" height={150}>
                                            <PieChart>
                                                <Pie data={analytics.costAnalysis.breakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5}>
                                                    {analytics.costAnalysis.breakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                                </Pie>
                                                <Tooltip contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D' }} />
                                                <Legend layout="vertical" verticalAlign="middle" align="right" iconSize={8} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Card>
                            <Card title="User Feedback">
                                <h4 className="font-semibold text-text-primary mb-2">Rating Distribution</h4>
                                <ResponsiveContainer width="100%" height={150}>
                                    <BarChart data={analytics.ratingDistribution} layout="vertical" margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#30363D" horizontal={false} />
                                        <XAxis type="number" hide />
                                        <YAxis type="category" dataKey="name" stroke="#848D97" width={40} />
                                        <Tooltip contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D' }} />
                                        <Bar dataKey="count" name="Ratings" barSize={15}>
                                            {analytics.ratingDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                                <h4 className="font-semibold text-text-primary mt-6 mb-3">Recent Feedback</h4>
                                <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                                {analytics.recentFeedback.map((fb, i) => (
                                    <div key={i} className="text-sm border-b border-border last:border-b-0 pb-3 last:pb-0">
                                        <div className="flex justify-between items-center mb-1">
                                            {renderStarRating(fb.rating)}
                                            <span className="text-xs text-text-secondary">{fb.time}</span>
                                        </div>
                                        <p className="text-text-secondary">{fb.text || "No comment provided."}</p>
                                    </div>
                                ))}
                                </div>
                            </Card>
                            <ReviewForm agentName={agent.name} onReviewSubmit={handleReviewSubmit} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
