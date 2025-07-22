import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { availableAgents } from '../../constants';

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

const AiAgentManagement: React.FC = () => {
    const { t } = useAppContext();
    const [agents, setAgents] = useState(availableAgents.map(a => ({ ...a, modelVersion: 'v2.1 (Stable)' })));

    const handleToggle = (id: string) => {
        setAgents(prev => prev.map(agent => agent.id === id ? { ...agent, active: !agent.active } : agent));
    };

    const handleModelChange = (id: string, version: string) => {
        setAgents(prev => prev.map(agent => agent.id === id ? { ...agent, modelVersion: version } : agent));
    };

    return (
        <div className="bg-surface border border-border rounded-lg">
            <div className="p-4 border-b border-border">
                <h2 className="text-xl font-bold text-text-primary">{t('aiAgentManagement')}</h2>
                <p className="text-sm text-text-secondary mt-1">Activate/deactivate agents, set default prompts, and track accuracy.</p>
            </div>
            <div className="p-4">
                <div className="space-y-4">
                    {agents.map(agent => (
                        <div key={agent.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-background rounded-lg">
                            <div className="mb-4 md:mb-0 md:mr-4 flex-grow">
                                <h3 className="font-bold text-text-primary">{agent.name} <span className="text-sm text-text-secondary font-normal">by {agent.provider}</span></h3>
                                <p className="text-sm text-text-secondary mt-1">{agent.description}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto md:flex-shrink-0">
                                <div className="flex items-center gap-2">
                                    <label htmlFor={`model-${agent.id}`} className="text-sm font-semibold text-text-secondary shrink-0">Model Version</label>
                                    <select
                                        id={`model-${agent.id}`}
                                        value={agent.modelVersion}
                                        onChange={(e) => handleModelChange(agent.id, e.target.value)}
                                        className="bg-surface border border-border rounded-md p-1.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                    >
                                        <option>v2.1 (Stable)</option>
                                        <option>v2.2 (Beta)</option>
                                        <option>v3.0 (Alpha)</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-text-secondary">{t('agentStatus')}</span>
                                    <ToggleSwitch enabled={agent.active} onChange={() => handleToggle(agent.id)} aria-label={`Toggle ${agent.name}`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AiAgentManagement;