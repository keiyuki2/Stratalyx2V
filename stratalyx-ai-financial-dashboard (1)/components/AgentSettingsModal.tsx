
import React, { useState } from 'react';
import type { Agent } from '../types';

const Card: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className = '', title }) => (
    <div className={`bg-background border border-border rounded-lg ${className}`}>
        {title && <h3 className="text-lg font-bold text-text-primary p-4 sm:p-6 border-b border-border">{title}</h3>}
        <div className="p-4 sm:p-6">{children}</div>
    </div>
);

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void; 'aria-label': string }> = ({ enabled, onChange, "aria-label": ariaLabel }) => (
    <button
        onClick={() => onChange(!enabled)}
        type="button"
        role="switch"
        aria-checked={enabled}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-surface ${enabled ? 'bg-primary' : 'bg-gray-600'}`}
    >
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const ToolCheckbox: React.FC<{ label: string; description: string; checked: boolean; onChange: (checked: boolean) => void; }> = ({ label, description, checked, onChange }) => (
    <div className="flex items-start justify-between">
        <div>
            <p className="font-semibold text-text-primary">{label}</p>
            <p className="text-sm text-text-secondary">{description}</p>
        </div>
        <ToggleSwitch enabled={checked} onChange={onChange} aria-label={label} />
    </div>
);

export const AgentSettingsModal: React.FC<{ agent: Agent | null, onClose: () => void }> = ({ agent, onClose }) => {
    // Mock initial settings state
    const [settings, setSettings] = useState({
        apiKey: '',
        model: 'gpt-4-turbo-2024-04-09',
        temperature: 0.7,
        maxTokens: 2000,
        timeout: 30,
        responseFormat: 'detailed',
        enableWebSearch: true,
        tools: {
            webSearch: true,
            marketData: true,
            newsAnalysis: true,
            chartGeneration: false,
            sentimentAnalysis: true,
        },
        customInstructions: 'Act as a senior financial analyst providing insights for a seasoned trader. Focus on technical analysis and market sentiment. Be concise.'
    });
    const [showApiKey, setShowApiKey] = useState(false);

    const handleSave = () => {
        if (agent) {
             console.log("Saving configuration for", agent.name, settings);
        }
        onClose();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }));
    };

    const handleToggleChange = (name: string, value: boolean) => {
        setSettings(prev => ({...prev, [name]: value}));
    }

    const handleToolToggleChange = (toolName: keyof typeof settings.tools, value: boolean) => {
        setSettings(prev => ({
            ...prev,
            tools: {
                ...prev.tools,
                [toolName]: value
            }
        }));
    };

    if (!agent) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            onClick={onClose}
        >
            <div 
                className="bg-surface border border-border rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 sm:p-6 border-b border-border flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">Configure {agent.name}</h2>
                        <p className="text-text-secondary">{agent.provider}</p>
                    </div>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </header>

                <div className="p-4 sm:p-6 overflow-y-auto">
                    <div className="space-y-8">
                        <Card title="API Configuration">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="apiKey" className="block text-sm font-medium text-text-secondary mb-1">API Key</label>
                                    <p className="text-xs text-text-secondary/80 mb-2">Your API key will be encrypted and stored securely.</p>
                                    <div className="relative">
                                        <input
                                            id="apiKey"
                                            name="apiKey"
                                            type={showApiKey ? "text" : "password"}
                                            value={settings.apiKey}
                                            onChange={handleInputChange}
                                            placeholder="Enter API key"
                                            className="block w-full bg-background border border-border rounded-md p-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowApiKey(!showApiKey)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary hover:text-text-primary"
                                            aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                                        >
                                            {showApiKey ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="model" className="block text-sm font-medium text-text-secondary mb-1">Model</label>
                                    <select
                                        id="model"
                                        name="model"
                                        value={settings.model}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full bg-background border border-border rounded-md p-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                    >
                                        <option>gpt-4-turbo-2024-04-09</option>
                                        <option>gpt-4</option>
                                        <option>gpt-3.5-turbo</option>
                                    </select>
                                </div>
                            </div>
                        </Card>

                        <Card title="Model Parameters">
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="temperature" className="block text-sm font-medium text-text-secondary mb-1">Temperature</label>
                                    <p className="text-xs text-text-secondary/80 mb-2">Controls randomness. Higher values make output more random.</p>
                                    <div className="flex items-center gap-4">
                                        <input
                                            id="temperature"
                                            type="range"
                                            min="0"
                                            max="2"
                                            step="0.1"
                                            value={settings.temperature}
                                            onChange={handleSliderChange}
                                            className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                        <span className="font-mono text-sm text-text-primary w-12 text-center">{settings.temperature.toFixed(1)}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="maxTokens" className="block text-sm font-medium text-text-secondary mb-1">Max Tokens</label>
                                        <p className="text-xs text-text-secondary/80 mb-2">Maximum response length.</p>
                                        <input id="maxTokens" name="maxTokens" type="number" value={settings.maxTokens} onChange={handleInputChange} className="mt-1 block w-full bg-background border border-border rounded-md p-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
                                    </div>
                                    <div>
                                        <label htmlFor="timeout" className="block text-sm font-medium text-text-secondary mb-1">Timeout (seconds)</label>
                                        <p className="text-xs text-text-secondary/80 mb-2">Request timeout.</p>
                                        <input id="timeout" name="timeout" type="number" value={settings.timeout} onChange={handleInputChange} className="mt-1 block w-full bg-background border border-border rounded-md p-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card title="Response Configuration">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="responseFormat" className="block text-sm font-medium text-text-secondary mb-1">Response Format</label>
                                    <select
                                        id="responseFormat"
                                        name="responseFormat"
                                        value={settings.responseFormat}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full bg-background border border-border rounded-md p-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                    >
                                        <option value="detailed">Detailed Analysis</option>
                                        <option value="summary">Concise Summary</option>
                                        <option value="json">JSON Object</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                     <div>
                                        <p className="font-semibold text-text-primary">Enable Web Search</p>
                                        <p className="text-sm text-text-secondary">Allow agent to search the web for current information.</p>
                                    </div>
                                    <ToggleSwitch enabled={settings.enableWebSearch} onChange={(val) => handleToggleChange('enableWebSearch', val)} aria-label="Enable Web Search" />
                                </div>
                            </div>
                        </Card>

                        <Card title="Tool Access">
                             <div className="space-y-4">
                                <ToolCheckbox label="Web Search" description="Access to real-time web search" checked={settings.tools.webSearch} onChange={(val) => handleToolToggleChange('webSearch', val)} />
                                <ToolCheckbox label="Market Data" description="Real-time financial data access" checked={settings.tools.marketData} onChange={(val) => handleToolToggleChange('marketData', val)} />
                                <ToolCheckbox label="News Analysis" description="Financial news processing" checked={settings.tools.newsAnalysis} onChange={(val) => handleToolToggleChange('newsAnalysis', val)} />
                                <ToolCheckbox label="Chart Generation" description="Create visual charts" checked={settings.tools.chartGeneration} onChange={(val) => handleToolToggleChange('chartGeneration', val)} />
                                <ToolCheckbox label="Sentiment Analysis" description="Market sentiment evaluation" checked={settings.tools.sentimentAnalysis} onChange={(val) => handleToolToggleChange('sentimentAnalysis', val)} />
                             </div>
                        </Card>

                        <Card title="Custom Instructions">
                            <textarea
                                name="customInstructions"
                                value={settings.customInstructions}
                                onChange={handleInputChange}
                                rows={5}
                                placeholder="Enter custom instructions for this agent..."
                                className="w-full bg-background border border-border rounded-md p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </Card>

                        <div className="flex justify-end gap-4 pt-4">
                            <button onClick={onClose} className="bg-surface hover:bg-border text-text-primary font-semibold py-2 px-6 rounded-lg border border-border transition-colors">Cancel</button>
                            <button onClick={handleSave} className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">Save Configuration</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
