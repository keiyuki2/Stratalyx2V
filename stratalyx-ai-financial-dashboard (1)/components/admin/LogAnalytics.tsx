import React from 'react';
import { useAppContext } from '../../context/AppContext';

const mockLogs = `[2024-08-01 10:30:15] INFO: User 'usr_003' (Bat-Erdene) initiated query with agent 'GPT-4 Turbo'. Prompt: "Analyze NVDA earnings report".
[2024-08-01 10:30:17] DEBUG: Agent 'GPT-4 Turbo' processing completed. Tokens used: 1250. Response time: 1.8s.
[2024-08-01 10:31:05] INFO: User 'usr_002' (Khulan) initiated query with agent 'Claude 3 Opus'. Prompt: "What is the market outlook for oil?".
[2024-08-01 10:31:06] DEBUG: Agent 'Claude 3 Opus' processing completed. Tokens used: 980. Response time: 1.1s.
[2024-08-01 10:32:40] WARN: User 'usr_006' (Temuujin) query failed. Reason: Content policy violation.
[2024-08-01 10:33:12] INFO: User 'usr_001' (John Trader) initiated query with agent 'Gemini Pro'. Prompt: "Compare AAPL and MSFT".`;

const LogAnalytics: React.FC = () => {
    const { t } = useAppContext();

    return (
        <div className="space-y-6">
            <div className="bg-surface border border-border rounded-lg">
                <div className="p-4 border-b border-border">
                    <h2 className="text-xl font-bold text-text-primary">{t('queryLogs')}</h2>
                    <p className="text-sm text-text-secondary mt-1">Live feed of user queries and agent responses.</p>
                </div>
                <div className="p-4">
                    <div className="bg-background font-mono text-xs text-text-secondary p-4 rounded-md h-64 overflow-y-auto">
                        <pre>{mockLogs}</pre>
                    </div>
                </div>
            </div>
             <div className="bg-surface border border-border rounded-lg">
                <div className="p-4 border-b border-border">
                    <h2 className="text-xl font-bold text-text-primary">{t('adminActivity')}</h2>
                     <p className="text-sm text-text-secondary mt-1">Track who edited what and when (Coming Soon)</p>
                </div>
                <div className="p-4 bg-background rounded-b-lg">
                    <p className="text-center text-text-secondary">No admin activity logs yet.</p>
                </div>
            </div>
             <div className="bg-surface border border-border rounded-lg">
                <div className="p-4 border-b border-border">
                    <h2 className="text-xl font-bold text-text-primary">{t('performanceGraphs')}</h2>
                     <p className="text-sm text-text-secondary mt-1">Response time, uptime, etc. (Coming Soon)</p>
                </div>
                <div className="p-4 bg-background rounded-b-lg">
                    <p className="text-center text-text-secondary">Performance data is being aggregated.</p>
                </div>
            </div>
        </div>
    );
};

export default LogAnalytics;