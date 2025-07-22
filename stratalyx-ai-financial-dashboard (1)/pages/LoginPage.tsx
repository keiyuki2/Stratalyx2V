import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import AuthLayout from '../components/AuthLayout';
import { Icons } from '../constants';

const SocialButton: React.FC<{ icon: React.ReactElement<any>; text: string; className?: string }> = ({ icon, text, className = '' }) => (
    <button className={`w-full flex items-center justify-center gap-3 py-2.5 px-4 border rounded-md text-sm font-semibold transition-colors ${className}`}>
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
        {text}
    </button>
);

const FeatureHighlight: React.FC<{ icon: React.ReactElement<any>; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-center gap-3 text-left">
        {React.cloneElement(icon, { className: 'w-6 h-6 text-primary' })}
        <div>
            <p className="text-sm font-semibold text-text-primary">{title}</p>
            <p className="text-xs text-text-secondary">{description}</p>
        </div>
    </div>
);


const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        console.log('Logging in...', { email, rememberMe });
        onLogin();
    };

    return (
        <AuthLayout>
            <div className="bg-surface/90 backdrop-blur-sm border border-border rounded-lg p-8 shadow-2xl">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Welcome Back</h2>
                    <p className="text-text-secondary mb-6">Sign in to access your personalized AI stock analysis dashboard</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email Address <span className="text-danger">*</span></label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full bg-background border border-border rounded-md p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium text-text-secondary mb-1">Password <span className="text-danger">*</span></label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full bg-background border border-border rounded-md p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="Enter your password"
                        />
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-primary bg-background border-border rounded focus:ring-primary"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                                Remember me
                            </label>
                        </div>
                        <div className="text-sm">
                            <a href="#" className="font-medium text-primary hover:underline">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    {error && <p className="text-danger text-sm text-center">{error}</p>}

                    <div>
                        <button type="submit" className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-background bg-brand-cyan hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-surface">
                            Sign In {React.cloneElement(Icons.arrowRight, { className: 'w-4 h-4' })}
                        </button>
                    </div>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-surface px-2 text-sm text-text-secondary">Or continue with</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <SocialButton icon={Icons.google} text="Continue with Google" className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50" />
                        <SocialButton icon={Icons.linkedin} text="Continue with LinkedIn" className="bg-[#0A66C2] text-white border-[#0A66C2] hover:bg-blue-700" />
                    </div>
                </form>
                 <div className="mt-8 pt-6 border-t border-border text-center space-y-4">
                    <FeatureHighlight icon={Icons.shield} title="Secure Login" description="Bank-level encryption" />
                    <FeatureHighlight icon={Icons.lock} title="Data Protection" description="Your data is never shared" />
                    <FeatureHighlight icon={Icons.lightning} title="Real-time Data" description="Live market updates" />
                </div>
            </div>
            <p className="text-center text-sm text-text-secondary mt-8">
                New to the platform?{' '}
                <Link to="/signup" className="font-semibold text-primary hover:underline flex items-center justify-center gap-1">
                     {React.cloneElement(Icons.user, { className: 'w-4 h-4' })} Create Account
                </Link>
            </p>
        </AuthLayout>
    );
};

export default LoginPage;