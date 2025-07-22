import React, { useState, useRef, useEffect } from 'react';

type OutputLine = {
    type: 'log' | 'error' | 'return';
    content: string;
};

const CodePage: React.FC = () => {
    const [code, setCode] = useState<string>('console.log("Hello, Stratalyx AI!");\n// Try returning a value\nreturn 123 * 2;');
    const [output, setOutput] = useState<OutputLine[]>([]);
    const consoleEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [output]);

    const handleRunCode = () => {
        const newOutput: OutputLine[] = [];
        const originalConsoleLog = console.log;
        
        console.log = (...args: any[]) => {
            const content = args.map(arg => {
                try {
                    return JSON.stringify(arg, null, 2);
                } catch {
                    return '[Circular Object]';
                }
            }).join(' ');
            newOutput.push({ type: 'log', content });
        };

        try {
            const result = new Function(code)();
            if (result !== undefined) {
                newOutput.push({ type: 'return', content: `=> ${JSON.stringify(result, null, 2)}` });
            }
        } catch (error) {
            if (error instanceof Error) {
                newOutput.push({ type: 'error', content: `Error: ${error.message}` });
            } else {
                newOutput.push({ type: 'error', content: 'An unknown error occurred.' });
            }
        } finally {
            console.log = originalConsoleLog; // Restore original console.log
            setOutput(newOutput);
        }
    };
    
    const handleClear = () => {
        setCode('');
        setOutput([]);
    };

    const renderOutputLine = (line: OutputLine, index: number) => {
        let classes = 'whitespace-pre-wrap break-words';
        switch (line.type) {
            case 'error': classes += ' text-danger'; break;
            case 'return': classes += ' text-brand-cyan'; break;
            default: classes += ' text-text-secondary';
        }
        return <pre key={index} className={classes}>{line.content}</pre>;
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-text-primary">Code Playground</h1>
                <p className="text-text-secondary">A simple environment to run JavaScript code.</p>
            </header>
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                {/* Editor */}
                <div className="flex flex-col bg-surface border border-border rounded-lg">
                    <div className="p-2 border-b border-border flex justify-between items-center">
                        <h2 className="font-semibold text-text-primary px-2">JavaScript Editor</h2>
                        <div className="flex gap-2">
                             <button onClick={handleClear} className="bg-surface hover:bg-border text-text-secondary font-semibold py-1.5 px-4 rounded-md text-sm transition-colors border border-border">Clear</button>
                            <button onClick={handleRunCode} className="bg-primary hover:bg-blue-600 text-white font-semibold py-1.5 px-4 rounded-md text-sm transition-colors">Run Code</button>
                        </div>
                    </div>
                    <div className="flex-grow relative bg-background">
                         <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-full bg-background border-none p-4 text-sm font-mono focus:outline-none resize-none"
                            spellCheck="false"
                        />
                    </div>
                </div>
                {/* Console */}
                <div className="flex flex-col bg-surface border border-border rounded-lg">
                     <div className="p-2 border-b border-border flex justify-between items-center">
                        <h2 className="font-semibold text-text-primary px-2">Console</h2>
                         <button onClick={() => setOutput([])} className="text-xs text-text-secondary hover:underline">Clear Console</button>
                    </div>
                    <div className="flex-grow p-4 font-mono text-sm overflow-y-auto">
                        {output.length > 0 ? output.map(renderOutputLine) : <p className="text-text-secondary/50">Output will appear here...</p>}
                        <div ref={consoleEndRef} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodePage;