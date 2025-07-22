import React, { useState, useRef, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useSearchParams } = ReactRouterDOM;
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { ChatMessage, AgentConsensus, AgentResponse } from '../types';
import { Icons } from '../constants';
import { useAppContext } from '../context/AppContext';

const SmartListItem: React.FC<{ itemContent: string }> = ({ itemContent }) => {
    const rules = [
        { keywords: /(diversification|portfolio|allocation)/i, icon: Icons.pieChart },
        { keywords: /(revenue|growth|increase|profit)/i, icon: Icons.trendUp },
        { keywords: /(decline|loss|decrease|reduction)/i, icon: Icons.trendDown },
        { keywords: /(risk|balance)/i, icon: Icons.balanceScale },
        { keywords: /(volatility|volatile|swing)/i, icon: Icons.volatility },
    ];

    let icon = null;
    
    // Find the first matching icon from rules
    for (const rule of rules) {
        if (rule.keywords.test(itemContent)) {
            icon = rule.icon;
            break;
        }
    }

    // Positive/negative percentages can override the icon
    if (/\+\s?\d+(\.\d+)?%/.test(itemContent)) icon = Icons.trendUp;
    if (/\-\s?\d+(\.\d+)?%/.test(itemContent)) icon = Icons.trendDown;

    // Use a generic bullet if no specific icon is found
    const bulletIcon = icon 
        ? React.cloneElement(icon, { className: 'w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0' })
        : <span className="text-primary mr-3 mt-1 flex-shrink-0">&#8226;</span>;
    
    // Style the content
    let styledContent = itemContent
      .replace(/\+\s?\d+(\.\d+)?%/g, '<strong class="text-success">$&</strong>')
      .replace(/\-\s?\d+(\.\d+)?%/g, '<strong class="text-danger">$&</strong>')
      .replace(/\*\*(.*?)\*\*/gs, '<strong class="font-sans font-semibold text-text-primary">$1</strong>');
      
    return (
        <li className="flex items-start">
            {bulletIcon}
            <span dangerouslySetInnerHTML={{ __html: styledContent }} />
        </li>
    );
};

const FormattedAiMessage: React.FC<{ content: string; winningOption?: string; }> = ({ content, winningOption }) => {
    const blocks = content.split('\n\n');

    return (
        <div className="space-y-4">
            {winningOption && (
                 <div className="mb-4 p-3 bg-surface border-l-4 border-primary rounded-r-lg">
                    <p className="text-xs font-semibold text-text-secondary tracking-wider uppercase">AI Consensus</p>
                    <p className="text-lg font-bold text-text-primary mt-1">{winningOption}</p>
                </div>
            )}
            <div className="font-serif text-base text-text-secondary leading-relaxed space-y-4">
                {blocks.map((block, index) => {
                    const trimmedBlock = block.trim();
                    if (!trimmedBlock) return null;

                    if (index === 0 && trimmedBlock.startsWith('**') && trimmedBlock.endsWith('**')) {
                        const recommendation = trimmedBlock.substring(2, trimmedBlock.length - 2);
                        return <div key={index} className="text-xl font-bold font-sans text-text-primary">{recommendation}</div>;
                    }

                    if (trimmedBlock.startsWith('*')) {
                        const listItems = block.split('\n').filter(line => line.trim().startsWith('*'));
                        return (
                            <ul key={index} className="space-y-2">
                                {listItems.map((item, itemIndex) => {
                                    const itemContent = item.trim().replace(/^\*\s*/, '');
                                    return <SmartListItem key={itemIndex} itemContent={itemContent} />;
                                })}
                            </ul>
                        );
                    }

                    let pContent = block.replace(/\n/g, '<br />');
                    pContent = pContent.replace(/\*\*(.*?)\*\*/gs, '<strong class="font-sans font-semibold text-text-primary">$1</strong>');
                    pContent = pContent.replace(/\*\*([^:]+):/g, '<strong class="font-sans font-semibold text-text-primary">$1:</strong>');

                    return <p key={index} dangerouslySetInnerHTML={{ __html: pContent }} />;
                })}
            </div>
        </div>
    );
};


const FeedbackSummary: React.FC<{ messages: ChatMessage[] }> = ({ messages }) => {
    const { totalUpvotes, totalDownvotes, assistantMessages, ratedMessages } = React.useMemo(() => {
        return messages.reduce((acc, msg) => {
            if (msg.role === 'assistant') {
                acc.assistantMessages++;
                acc.totalUpvotes += msg.upvotes ?? 0;
                acc.totalDownvotes += msg.downvotes ?? 0;
                if (msg.userVote) {
                    acc.ratedMessages++;
                }
            }
            return acc;
        }, { totalUpvotes: 0, totalDownvotes: 0, assistantMessages: 0, ratedMessages: 0 });
    }, [messages]);

    const chartData = [
        { name: 'Helpful', value: totalUpvotes, fill: '#34D399' },
        { name: 'Needs Improvement', value: totalDownvotes, fill: '#F87171' },
    ];

    const feedbackRate = assistantMessages > 0 ? ((ratedMessages / assistantMessages) * 100).toFixed(0) : 0;

    const noData = totalUpvotes === 0 && totalDownvotes === 0;

    return (
        <div className="flex flex-col flex-shrink-0">
            <h3 className="text-xl font-bold text-text-primary mb-4">Session Feedback</h3>
            <div className="flex-grow flex flex-col items-center justify-start bg-background p-4 rounded-lg">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D', borderRadius: '0.5rem' }}
                            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                        />
                        <Pie
                            data={noData ? [{name: 'No ratings yet', value: 1, fill: '#30363D'}] : chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={noData ? 0 : 5}
                            dataKey="value"
                        >
                            {(noData ? [{name: 'No ratings yet', value: 1, fill: '#30363D'}] : chartData).map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                
                <div className="w-full space-y-3 mt-6">
                    {noData && <p className="text-text-secondary text-center pb-2">Rate responses to see feedback</p>}
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-success"></div>
                            <p className="text-text-secondary">Helpful Responses</p>
                        </div>
                        <p className="font-bold text-text-primary">{totalUpvotes}</p>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-danger"></div>
                            <p className="text-text-secondary">Needs Improvement</p>
                        </div>
                        <p className="font-bold text-text-primary">{totalDownvotes}</p>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-3 border-t border-border">
                        <p className="text-text-secondary">Feedback Rate</p>
                        <p className="font-bold text-text-primary">{feedbackRate}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ConfidenceMeter: React.FC<{ value: number }> = ({ value }) => {
    const size = 32;
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    let color = 'text-success';
    if (value < 75) color = 'text-warning';
    if (value < 50) color = 'text-danger';
    
    return (
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
            <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
                <circle className="text-border" strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx={size/2} cy={size/2} />
                <circle
                    className={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size/2}
                    cy={size/2}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-text-primary">
                {value}
            </span>
        </div>
    );
};

const LiveAgentPoll: React.FC<{ poll: AgentConsensus | null; revealedResponses: AgentResponse[] }> = ({ poll, revealedResponses }) => {
    if (!poll) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center bg-background p-4 rounded-lg mt-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary/50 mb-2"><path d="m9.09 9.09 11.32 2.83-2.83 11.32-11.32-2.83z"/><path d="M14.12 14.12 2.8 11.27l11.32-2.83 2.83 11.32z"/></svg>
                <p className="text-sm text-text-secondary/80">Ask a question to start a poll</p>
            </div>
        );
    }

    const tally = poll.options.reduce((acc, option) => {
        acc[option] = revealedResponses.filter(r => r.chosenOption === option).length;
        return acc;
    }, {} as Record<string, number>);

    const totalVotes = revealedResponses.length;

    return (
        <div className="flex-grow flex flex-col bg-background p-4 rounded-lg mt-4">
            <h3 className="text-xl font-bold text-text-primary mb-1">Live Agent Poll</h3>
            <p className="text-text-secondary text-sm mb-4">{poll.question}</p>
            
            <div className="space-y-3 mb-6">
                {poll.options.map(option => {
                    const votes = tally[option] || 0;
                    const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                    return (
                        <div key={option}>
                            <div className="flex justify-between items-center mb-1 text-sm">
                                <span className="font-semibold text-text-primary">{option}</span>
                                <span className="text-text-secondary">{votes} vote{votes !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="w-full bg-surface rounded-full h-2.5">
                                <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div>
                <h4 className="font-semibold text-text-secondary text-sm mb-2">Agent Justifications</h4>
                <div className="space-y-2">
                    {revealedResponses.length === 0 && (
                        <p className="text-sm text-center text-text-secondary py-4 animate-pulse">Waiting for agent votes...</p>
                    )}
                    {revealedResponses.map((response, index) => (
                        <div key={index} className="bg-surface p-3 rounded-lg border border-border/50 animate-fade-in">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-bold text-text-primary text-sm">{response.agentName}</p>
                                <p className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary/20 text-primary">{response.chosenOption}</p>
                            </div>
                            <p className="text-xs text-text-secondary leading-normal mb-3">{response.justification}</p>
                            <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                                <ConfidenceMeter value={response.confidence} />
                                <div className="flex-grow">
                                    <div className="flex items-center gap-1.5">
                                      <p className="text-xs font-semibold text-text-secondary">Confidence:</p>
                                      {response.confidence < 70 && React.cloneElement(Icons.uncertainty, {className: 'w-4 h-4 text-warning'})}
                                    </div>
                                    <p className="text-xs text-text-secondary/80">{response.confidenceReason}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};


const promptTemplates = [
    "What's the outlook for {subject}?",
    "Analyze the performance of {subject}.",
    "Should I buy {subject} at its current price?",
    "Provide a technical analysis for {subject}.",
    "What are the key risks for {subject}?",
    "Compare {subject} with {subject2}.",
    "Summarize recent news impacting {subject}.",
    "Is {subject} a good long-term investment?"
];

const promptSubjects = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA',
    'the S&P 500', 'the NASDAQ index',
    'Bitcoin', 'Ethereum',
    'Gold', 'Crude Oil',
    'my portfolio', 'the energy sector'
];

const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const generateSinglePrompt = (existingPrompts: Set<string>): string => {
    let newPrompt = '';
    let attempts = 0; // To prevent infinite loops
    const shuffledSubjects = shuffleArray(promptSubjects);

    do {
        const template = promptTemplates[Math.floor(Math.random() * promptTemplates.length)];
        
        if (template.includes('{subject2}')) {
             if (attempts < shuffledSubjects.length - 1) {
                newPrompt = template.replace('{subject}', shuffledSubjects[attempts]).replace('{subject2}', shuffledSubjects[attempts + 1]);
            } else {
                 newPrompt = template.replace('{subject}', shuffledSubjects[0]).replace('{subject2}', shuffledSubjects[1]);
            }
        } else {
             if (attempts < shuffledSubjects.length) {
                newPrompt = template.replace('{subject}', shuffledSubjects[attempts]);
            } else {
                newPrompt = template.replace('{subject}', shuffledSubjects[0]);
            }
        }
        attempts++;
    } while (existingPrompts.has(newPrompt) && attempts < 50);

    return newPrompt;
};


const generateInitialPrompts = (): string[] => {
    const prompts = new Set<string>();
    while (prompts.size < 4) {
        prompts.add(generateSinglePrompt(prompts));
    }
    return Array.from(prompts);
};

const getWinningOption = (poll: AgentConsensus): string => {
    if (!poll || !poll.responses || poll.responses.length === 0) return '';
    
    const voteCounts = poll.responses.reduce((acc, response) => {
        acc[response.chosenOption] = (acc[response.chosenOption] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    if (Object.keys(voteCounts).length === 0) return '';
    
    let winningOption = '';
    let maxVotes = 0;
    for (const option in voteCounts) {
        if (voteCounts[option] > maxVotes) {
            maxVotes = voteCounts[option];
            winningOption = option;
        }
    }
    return winningOption;
};

export const ChatPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [suggestedPrompts, setSuggestedPrompts] = useState(generateInitialPrompts);
    const [livePoll, setLivePoll] = useState<AgentConsensus | null>(null);
    const [revealedResponses, setRevealedResponses] = useState<AgentResponse[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const { t } = useAppContext();

    useEffect(() => {
        const node = chatContainerRef.current;
        if (node) {
            const isScrolledToBottom = node.scrollHeight - node.scrollTop <= node.clientHeight + 150;
            if (isScrolledToBottom) {
                node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
            }
        }
    }, [messages]);
    
    useEffect(() => {
        if (livePoll && revealedResponses.length < livePoll.responses.length) {
            const timer = setTimeout(() => {
                setRevealedResponses(prev => {
                    if (prev.length < livePoll.responses.length) {
                       return [...prev, livePoll.responses[prev.length]];
                    }
                    return prev;
                });
            }, 1500); // 1.5 second delay
            return () => clearTimeout(timer);
        }
    }, [livePoll, revealedResponses]);

    const generateMultiAgentConsensus = async (prompt: string): Promise<AgentConsensus | null> => {
        if (!process.env.API_KEY) return null;
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const consensusSchema = {
            type: Type.OBJECT,
            properties: {
                question: {
                    type: Type.STRING,
                    description: 'A short, neutral question summarizing the user\'s query.'
                },
                options: {
                    type: Type.ARRAY,
                    description: 'An array of 2 to 4 concise, distinct options for potential outcomes.',
                    items: { type: Type.STRING },
                    minItems: 2,
                    maxItems: 4,
                },
                responses: {
                    type: Type.ARRAY,
                    description: 'An array of responses, one from each simulated AI agent.',
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            agentName: {
                                type: Type.STRING,
                                enum: ['GPT-4 Turbo', 'Claude 3 Opus', 'Gemini Pro'],
                                description: 'The name of the simulated AI agent.'
                            },
                            chosenOption: {
                                type: Type.STRING,
                                description: 'The option chosen by this agent. MUST be one of the strings from the main options array.'
                            },
                            justification: {
                                type: Type.STRING,
                                description: 'A detailed summary explaining why the agent chose this option.'
                            },
                            confidence: {
                                type: Type.NUMBER,
                                description: 'A confidence score from 0-100 on the chosen option.'
                            },
                            confidenceReason: {
                                type: Type.STRING,
                                description: 'A brief, one-sentence justification for the confidence score (e.g., "High confidence due to strong technical indicators").'
                            }
                        },
                        required: ['agentName', 'chosenOption', 'justification', 'confidence', 'confidenceReason']
                    },
                    minItems: 3,
                    maxItems: 3,
                }
            },
            required: ['question', 'options', 'responses']
        };

        const consensusGenPrompt = `
            You are a master AI orchestrator. Your task is to simulate a multi-agent consensus panel to answer a user's financial query.
            User query: "${prompt}"
            
            Follow these steps:
            1.  **Formulate a Question**: Create a concise, neutral question summarizing the user's core dilemma.
            2.  **Define Options**: Generate 2-4 distinct, clear options that address the question.
            3.  **Simulate Agent Responses**:
                *   Create exactly three responses, one for each of the following AI agents: 'GPT-4 Turbo', 'Claude 3 Opus', 'Gemini Pro'.
                *   For each agent, select one of the options you defined.
                *   For each agent, write a detailed justification for their choice, mimicking the distinct style and analytical focus of that specific model (e.g., GPT-4 is balanced, Claude is nuanced, Gemini is data-driven).
                *   For each agent, provide a 'confidence' score (0-100) and a brief 'confidenceReason'. The score should reflect the strength of their argument.
                *   Ensure the 'chosenOption' for each agent is an exact match to one of the strings in the 'options' array.
                *   Agents should form their opinions independently. It is perfectly acceptable for multiple agents to agree on the same option if their reasoning supports it. The goal is a realistic simulation of an expert panel where consensus can naturally occur.
            
            Return ONLY the JSON object conforming to the schema.
        `;

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: consensusGenPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: consensusSchema,
                },
            });

            const jsonText = response.text.trim();
            const consensusResponse: AgentConsensus = JSON.parse(jsonText);
            
            if (consensusResponse.question && consensusResponse.options && consensusResponse.responses?.length === 3) {
                 return consensusResponse;
            }
            console.warn("Received malformed consensus data:", consensusResponse);
            return null;
        } catch (error) {
            console.error("Error generating multi-agent consensus:", error);
            return null;
        }
    };
    
    const startLivePoll = (prompt: string, assistantMessageId: string) => {
        setLivePoll(null);
        setRevealedResponses([]);
        
        const isConsensusQuery = /should I|what if|what.*do|choose between|opinion on|analyze.*options|pros and cons of/i.test(prompt);

        if (isConsensusQuery) {
            generateMultiAgentConsensus(prompt).then(consensusData => {
                if (consensusData) {
                    setLivePoll(consensusData);
                    const winner = getWinningOption(consensusData);
                    if (winner) {
                        setMessages(prev => prev.map(msg => 
                            msg.id === assistantMessageId ? { ...msg, winningOption: winner } : msg
                        ));
                    }
                }
            });
        }
    }

    const handleSendMessage = async (prompt: string) => {
        if (isLoading || !prompt.trim() || !chat) return;
        
        const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: prompt };
        const assistantMessageId = (Date.now() + 1).toString();
        
        startLivePoll(prompt, assistantMessageId);
        
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setInput('');

        setMessages(prev => [...prev, { 
            id: assistantMessageId, 
            role: 'assistant', 
            content: '', 
            agent: 'Gemini', 
            upvotes: 0, 
            downvotes: 0, 
            userVote: null,
            winningOption: '',
        }]);
        
        try {
            const responseStream = await chat.sendMessageStream({ message: prompt });
            let accumulatedText = "";
            for await (const chunk of responseStream) {
                accumulatedText += chunk.text;
                setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId ? { ...msg, content: accumulatedText } : msg
                ));
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setMessages(prev => prev.map(msg => 
                msg.id === assistantMessageId ? { ...msg, content: `Error: ${errorMessage}` } : msg
            ));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestedPromptClick = (prompt: string) => {
        handleSendMessage(prompt);

        setSuggestedPrompts(currentPrompts => {
            const currentPromptsSet = new Set(currentPrompts);
            const newPrompt = generateSinglePrompt(currentPromptsSet);
            return currentPrompts.map(p => (p === prompt ? newPrompt : p));
        });
    };

    useEffect(() => {
        if (!process.env.API_KEY) {
            console.error("API Key is missing. Chat functionality will be disabled.");
            return;
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chatSession = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are Stratalyx AI, an expert financial analyst. Your goal is to provide clear, concise, and actionable investment insights. Always be objective and data-driven. Start with a clear recommendation (Buy, Sell, Hold, or Neutral) in bold, followed by a summary of your reasoning in bullet points. Conclude with a confidence level and potential risks.",
            },
        });
        setChat(chatSession);

        const doSend = async (currentChat: Chat, prompt: string) => {
            if (isLoading || !prompt.trim()) return;

            const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: prompt };
            const assistantMessageId = (Date.now() + 1).toString();

            startLivePoll(prompt, assistantMessageId);

            setMessages(prev => [...prev, userMessage]);
            setIsLoading(true);

            setMessages(prev => [...prev, { 
                id: assistantMessageId, 
                role: 'assistant', 
                content: '', 
                agent: 'Gemini', 
                upvotes: 0, 
                downvotes: 0, 
                userVote: null,
                winningOption: '',
            }]);

            try {
                const responseStream = await currentChat.sendMessageStream({ message: prompt });
                let accumulatedText = "";
                
                for await (const chunk of responseStream) {
                    accumulatedText += chunk.text;
                    setMessages(prev => prev.map(msg => 
                        msg.id === assistantMessageId ? { ...msg, content: accumulatedText } : msg
                    ));
                }
            } catch (error) {
                console.error(error);
                 const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                 setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId ? { ...msg, content: `Error: ${errorMessage}` } : msg
                 ));
            } finally {
                setIsLoading(false);
            }
        };

        if (initialQuery) {
            doSend(chatSession, initialQuery);
        }
    }, []);

    const handleVote = (messageId: string, vote: 'up' | 'down') => {
        setMessages(messages => messages.map(msg => {
            if (msg.id === messageId && msg.role === 'assistant') {
                const upvotes = msg.upvotes ?? 0;
                const downvotes = msg.downvotes ?? 0;
                let newUpvotes = upvotes;
                let newDownvotes = downvotes;
                const currentVote = msg.userVote;

                if (currentVote === vote) {
                    if (vote === 'up') newUpvotes--;
                    else newDownvotes--;
                    return { ...msg, upvotes: newUpvotes, downvotes: newDownvotes, userVote: null };
                } else {
                    if (currentVote === 'up') newUpvotes--;
                    if (currentVote === 'down') newDownvotes--;

                    if (vote === 'up') newUpvotes++;
                    else newDownvotes++;
                    return { ...msg, upvotes: newUpvotes, downvotes: newDownvotes, userVote: vote };
                }
            }
            return msg;
        }));
    };

    return (
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8">
            <header className="mb-6 flex-shrink-0">
                <h1 className="text-2xl font-bold text-text-primary">{t('aiInvestmentChat')}</h1>
                <p className="text-text-secondary">{t('aiChatSubtitle')}</p>
            </header>
            
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Chat Panel */}
                <div className="lg:col-span-2 flex flex-col bg-surface border border-border rounded-lg min-h-0">
                    <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto">
                        {messages.length === 0 && !isLoading ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary">
                                {React.cloneElement(Icons.chat, { className: 'w-16 h-16 mb-4' })}
                                <h2 className="text-lg font-semibold text-text-primary">Start a conversation</h2>
                                <p>Ask a question or choose a suggestion below.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {messages.map((msg, index) => (
                                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.role === 'assistant' && (
                                            <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d473533a3dc2834d1154238e93297a7d.svg" alt="Gemini" className="w-8 h-8 rounded-full bg-surface self-start" />
                                        )}
                                        <div className="flex flex-col gap-1 max-w-xl">
                                            <div className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-background'}`}>
                                                {msg.content || msg.winningOption ? (
                                                    msg.role === 'assistant' ? (
                                                        <FormattedAiMessage content={msg.content} winningOption={msg.winningOption} />
                                                    ) : (
                                                        <p className="text-base whitespace-pre-wrap font-sans">{msg.content}</p>
                                                    )
                                                ) : (
                                                    isLoading && msg.role === 'assistant' && index === messages.length - 1 ? <p className="animate-pulse">...</p> : null
                                                )}
                                            </div>
                                             {msg.role === 'assistant' && msg.content && (!isLoading || index !== messages.length - 1) && (
                                                <div className="flex gap-2 items-center px-1">
                                                    <button onClick={() => handleVote(msg.id, 'up')} className={`p-1 rounded-full transition-colors ${msg.userVote === 'up' ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:text-primary hover:bg-border'}`} aria-label="Upvote response">
                                                        {React.cloneElement(Icons.thumbsUp, { className: 'w-4 h-4' })}
                                                    </button>
                                                    {(msg.upvotes ?? 0) > 0 && <span className="text-xs text-success font-semibold">{msg.upvotes}</span>}
                                                    <button onClick={() => handleVote(msg.id, 'down')} className={`p-1 rounded-full transition-colors ${msg.userVote === 'down' ? 'bg-danger/20 text-danger' : 'text-text-secondary hover:text-danger hover:bg-border'}`} aria-label="Downvote response">
                                                        {React.cloneElement(Icons.thumbsDown, { className: 'w-4 h-4' })}
                                                    </button>
                                                    {(msg.downvotes ?? 0) > 0 && <span className="text-xs text-danger font-semibold">{msg.downvotes}</span>}
                                                </div>
                                            )}
                                        </div>
                                        {msg.role === 'user' && (
                                            <div className="w-8 h-8 rounded-full bg-border flex-shrink-0 flex items-center justify-center">
                                                {React.cloneElement(Icons.user, { className: 'w-5 h-5 text-text-secondary' })}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-border flex-shrink-0">
                        <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                            {suggestedPrompts.map(prompt => (
                                <button key={prompt} onClick={() => handleSuggestedPromptClick(prompt)} disabled={isLoading || !chat} className="text-sm p-2 bg-background hover:bg-border border border-border rounded-lg text-left text-text-secondary transition-colors disabled:opacity-50">
                                    {prompt}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
                                placeholder="Ask about a stock, market trend, or economic event..."
                                className="flex-grow bg-background border border-border rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                                disabled={isLoading || !chat}
                            />
                            <button
                                onClick={() => handleSendMessage(input)}
                                disabled={isLoading || !input.trim() || !chat}
                                className="bg-primary hover:bg-blue-600 text-white font-semibold p-3 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
                 {/* Right Panel */}
                <div className="hidden lg:flex flex-col bg-surface border border-border rounded-lg p-4 overflow-y-auto">
                    <FeedbackSummary messages={messages} />
                    <LiveAgentPoll poll={livePoll} revealedResponses={revealedResponses} />
                </div>
            </div>
        </div>
    );
};