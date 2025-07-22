


import React, { useState } from 'react';
import type { Agent } from '../types';
import { availableAgents, performanceData, Icons } from '../constants';
import PerformanceChart from '../components/PerformanceChart';
import { useAppContext } from '../context/AppContext';
import { AgentDetailModal } from '../components/AgentDetailModal';
import { AgentSettingsModal } from '../components/AgentSettingsModal';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactElement<{ className?: string }>; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-surface p-5 rounded-lg border border-border flex items-start justify-between">
        <div>
            <p className="text-sm text-text-secondary mb-1">{title}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
        <div className={`rounded-full p-2`} style={{ backgroundColor: `${color}20`, color: color }}>
            {React.isValidElement(icon) ? React.cloneElement(icon, { className: 'w-6 h-6' }) : icon}
        </div>
    </div>
);

const AgentCard: React.FC<{ agent: Agent, onToggle: (id: string) => void, onSelect: (agent: Agent) => void }> = ({ agent, onToggle, onSelect }) => (
    <div onClick={() => onSelect(agent)} className="block group cursor-pointer">
        <div className="bg-surface p-4 rounded-lg border border-border group-hover:border-primary transition-colors duration-200 h-full flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-text-primary text-md leading-tight">{agent.name}</p>
                    <div className="flex items-center gap-1.5">
                        {!agent.active && <span className="text-xs text-danger font-semibold">Offline</span>}
                        <div className={`w-2 h-2 rounded-full mt-0.5 flex-shrink-0 ${agent.active ? 'bg-success' : 'bg-danger'}`}></div>
                    </div>
                </div>
                <p className="text-xs text-text-secondary mb-3">{agent.provider}</p>
            </div>
            <div className="flex justify-between items-center mt-2">
                <div className="text-xs">
                    <p className="text-text-secondary">Accuracy</p>
                    <p className="font-semibold text-success">{agent.accuracy}%</p>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onToggle(agent.id); }}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors z-10 relative ${agent.active ? 'bg-primary' : 'bg-gray-600'}`}
                    aria-label={`Toggle ${agent.name}`}
                >
                    <span className={`block w-4 h-4 bg-white rounded-full transition-transform ${agent.active ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
            </div>
        </div>
    </div>
);

const AgentLeaderboard: React.FC<{ agents: Agent[] }> = ({ agents }) => {
    const sortedAgents = [...agents].sort((a, b) => (b.predictionAccuracy ?? 0) - (a.predictionAccuracy ?? 0)).slice(0, 5);

    return (
        <div className="bg-surface p-5 rounded-lg border border-border">
            <h2 className="text-xl font-bold text-text-primary mb-4">Agent Leaderboard</h2>
            <div className="space-y-4">
                {sortedAgents.map((agent, index) => (
                    <div key={agent.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-text-secondary w-5 text-center">{index + 1}</span>
                            <div>
                                <p className="font-semibold text-text-primary">{agent.name}</p>
                                <p className="text-xs text-text-secondary">{agent.provider}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-success text-base">{agent.predictionAccuracy?.toFixed(1)}%</p>
                            <p className="text-xs text-text-secondary">Pred. Acc.</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const AgentManagementPage: React.FC = () => {
    const [agents, setAgents] = useState<Agent[]>(availableAgents);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [configuringAgent, setConfiguringAgent] = useState<Agent | null>(null);
    const { t } = useAppContext();

    const handleToggleAgent = (id: string) => {
        setAgents(prevAgents =>
            prevAgents.map(agent =>
                agent.id === id ? { ...agent, active: !agent.active } : agent
            )
        );
    };

    const handleConfigureClick = (agent: Agent) => {
        setSelectedAgent(null); // Close the details modal
        setConfiguringAgent(agent); // Open the settings modal
    };

    const activeAgentsCount = agents.filter(a => a.active).length;
    const avgRating = agents.length > 0 ? (agents.reduce((acc, a) => acc + a.userRating, 0) / agents.length).toFixed(1) : '0.0';

    const statCardsData = [
        { titleKey: 'activeAgents', value: activeAgentsCount.toString(), icon: Icons.agents, color: "#2F81F7" },
        { titleKey: 'queriesToday', value: "2,614", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, color: "#34D399" },
        { titleKey: 'avgUserRating', value: `${avgRating}/5`, icon: Icons.star, color: "#FBBF24" },
        { titleKey: 'monthlyCost', value: "$1,275.50", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, color: "#8957E5" },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">{t('agentManagement')}</h1>
                    <p className="text-text-secondary">{t('agentManagementSubtitle')}</p>
                </div>
                <button className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    {t('addAgent')}
                </button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCardsData.map(card => (
                    <StatCard key={card.titleKey} title={t(card.titleKey)} value={card.value} icon={card.icon} color={card.color} />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-3">
                     <h2 className="text-xl font-bold text-text-primary mb-4">{t('availableAgents')}</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {agents.map(agent => (
                            <AgentCard key={agent.id} agent={agent} onToggle={handleToggleAgent} onSelect={setSelectedAgent} />
                        ))}
                    </div>
                </div>
                <div className="xl:col-span-1 space-y-8">
                    <div className="bg-surface p-5 rounded-lg border border-border">
                        <h2 className="text-xl font-bold text-text-primary mb-4">{t('performanceTrends')}</h2>
                        <p className="text-sm text-text-secondary mb-4">{t('performanceSubtitle')}</p>
                        <PerformanceChart data={performanceData} />
                    </div>
                    <AgentLeaderboard agents={agents} />
                </div>
            </div>

            <AgentDetailModal
                agent={selectedAgent}
                onClose={() => setSelectedAgent(null)}
                onConfigure={handleConfigureClick}
            />
            
            <AgentSettingsModal
                agent={configuringAgent}
                onClose={() => setConfiguringAgent(null)}
            />
        </div>
    );
};

export default AgentManagementPage;