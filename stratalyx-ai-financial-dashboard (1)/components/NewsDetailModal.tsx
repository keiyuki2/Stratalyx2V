import React, { useState, useEffect } from 'react';
import type { NewsArticle, NewsAnalysisResult, Language } from '../types';
import { analyzeNewsArticle, batchTranslate } from '../services/analysisService';
import { useAppContext } from '../context/AppContext';

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`bg-border/50 rounded animate-pulse ${className}`}></div>
);

const SentimentBadge: React.FC<{ sentiment: 'Positive' | 'Negative' | 'Neutral' }> = ({ sentiment }) => {
    const sentimentClasses = {
        Positive: 'bg-success/20 text-success',
        Negative: 'bg-danger/20 text-danger',
        Neutral: 'bg-gray-500/20 text-text-secondary',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${sentimentClasses[sentiment]}`}>{sentiment}</span>;
}


export const NewsDetailModal: React.FC<{ article: NewsArticle | null; originalArticle: NewsArticle | null; onClose: () => void; }> = ({ article, originalArticle, onClose }) => {
    const { language } = useAppContext();
    const [analysis, setAnalysis] = useState<NewsAnalysisResult | null>(null);
    const [translatedAnalysis, setTranslatedAnalysis] = useState<NewsAnalysisResult | null>(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
        // Fetch analysis using the original English article
        if (originalArticle) {
            const getAnalysis = async () => {
                setLoadingAnalysis(true);
                setAnalysis(null);
                setTranslatedAnalysis(null);
                const result = await analyzeNewsArticle(originalArticle);
                setAnalysis(result);
                setLoadingAnalysis(false);
            };
            getAnalysis();
        }
    }, [originalArticle]);

    useEffect(() => {
        // Translate the analysis result when language or analysis changes
        const translateAnalysis = async () => {
            if (language === 'mn' && analysis && !analysis.error) {
                setIsTranslating(true);
                const itemsToTranslate: { id: string; text: string }[] = [];

                itemsToTranslate.push({ id: 'summary', text: analysis.summary });
                itemsToTranslate.push({ id: 'marketImpact', text: analysis.marketImpact });

                analysis.keyTakeaways.forEach((takeaway, index) => {
                    itemsToTranslate.push({ id: `kt-${index}`, text: takeaway });
                });

                analysis.impactedStocks.forEach((stock, index) => {
                    itemsToTranslate.push({ id: `is-${index}`, text: stock.reason });
                });
                
                const translations = await batchTranslate(itemsToTranslate, language);
                
                const newTranslatedAnalysis: NewsAnalysisResult = {
                    ...analysis,
                    summary: translations['summary'] || analysis.summary,
                    marketImpact: translations['marketImpact'] || analysis.marketImpact,
                    keyTakeaways: analysis.keyTakeaways.map((takeaway, index) => translations[`kt-${index}`] || takeaway),
                    impactedStocks: analysis.impactedStocks.map((stock, index) => ({
                        ...stock,
                        reason: translations[`is-${index}`] || stock.reason,
                    })),
                };

                setTranslatedAnalysis(newTranslatedAnalysis);
                setIsTranslating(false);
            } else {
                setTranslatedAnalysis(null); // Clear translation if language is English
            }
        };
        translateAnalysis();
    }, [analysis, language]);


    if (!article) return null;

    const displayAnalysis = translatedAnalysis || analysis;
    const isOverallLoading = loadingAnalysis || isTranslating;

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-surface border border-border rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <header className="p-4 border-b border-border flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">{article.headline}</h2>
                        <p className="text-sm text-text-secondary">{article.source} &bull; <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary underline">Read original</a></p>
                    </div>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </header>
                
                <div className="p-6 overflow-y-auto space-y-6">
                    {isOverallLoading && (
                        <>
                            <div>
                                <h3 className="text-lg font-semibold text-text-primary mb-2">AI Summary</h3>
                                <Skeleton className="h-4 w-full mb-1" />
                                <Skeleton className="h-4 w-full mb-1" />
                                <Skeleton className="h-4 w-4/5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-text-primary mb-2">Key Takeaways</h3>
                                <Skeleton className="h-4 w-full mb-1" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-text-primary mb-2">Impacted Stocks</h3>
                                <div className="flex justify-between items-center mb-2 bg-background p-3 rounded-lg">
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-6 w-24 rounded-full" />
                                </div>
                                 <div className="flex justify-between items-center bg-background p-3 rounded-lg">
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-6 w-24 rounded-full" />
                                </div>
                            </div>
                        </>
                    )}
                    
                    {displayAnalysis && !isOverallLoading && (
                         <>
                            {displayAnalysis.error && <div className="bg-danger/20 text-danger p-3 rounded-md">{displayAnalysis.error}</div>}
                            
                            <div>
                                <h3 className="text-lg font-semibold text-text-primary mb-2">AI Summary</h3>
                                <p className="text-text-secondary whitespace-pre-wrap">{displayAnalysis.summary}</p>
                            </div>

                            {displayAnalysis.keyTakeaways.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-text-primary mb-2">Key Takeaways</h3>
                                    <ul className="list-disc list-inside space-y-1 text-text-secondary">
                                        {displayAnalysis.keyTakeaways.map((item, index) => <li key={index}>{item}</li>)}
                                    </ul>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-text-primary mb-2">Market Impact</h3>
                                    <p className="text-text-secondary">{displayAnalysis.marketImpact}</p>
                                </div>
                                <div className="text-center bg-background p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-text-primary mb-2">Confidence Score</h3>
                                    <p className="text-4xl font-bold text-brand-cyan">{displayAnalysis.confidenceScore}<span className="text-2xl text-text-secondary">/100</span></p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-text-primary mb-2">Impacted Stocks</h3>
                                {displayAnalysis.impactedStocks.length > 0 ? (
                                    <div className="space-y-2">
                                        {displayAnalysis.impactedStocks.map((stock) => (
                                            <div key={stock.ticker} className="bg-background p-3 rounded-lg">
                                                <div className="flex justify-between items-center mb-1">
                                                    <p className="font-bold text-lg text-text-primary">{stock.ticker}</p>
                                                    <SentimentBadge sentiment={stock.sentiment} />
                                                </div>
                                                <p className="text-sm text-text-secondary">{stock.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-background p-4 rounded-lg text-center">
                                        <p className="text-sm text-text-secondary">AI analysis found no specific stocks directly impacted by this news.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
