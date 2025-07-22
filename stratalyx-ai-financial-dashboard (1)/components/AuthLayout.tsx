import React from 'react';
import Starfield from './Starfield';
import { Icons } from '../constants';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-white font-sans flex items-center justify-center p-4">
        <Starfield />
        <div className="relative z-10 w-full max-w-md">
            <div className="flex flex-col justify-center items-center gap-4 mb-6 text-center">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                    {React.cloneElement(Icons.logo, { className: 'w-full h-full object-cover' })}
                </div>
                <h1 className="text-3xl font-bold tracking-wider">Stratalyx AI</h1>
                <p className="text-text-secondary">AI-Powered Market Insights</p>
            </div>
            {children}
        </div>
    </div>
);

export default AuthLayout;