import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import Starfield from '../components/Starfield';
import { Icons } from '../constants';

const SocialButton: React.FC<{ icon: React.ReactElement<any>; text: string; className?: string }> = ({ icon, text, className = '' }) => (
    <button className={`w-full flex items-center justify-center gap-3 py-2.5 px-4 border rounded-md text-sm font-semibold transition-colors ${className}`}>
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
        {text}
    </button>
);

const FeatureListItem: React.FC<{ icon: React.ReactElement<any>; title: string }> = ({ icon, title }) => (
    <li className="flex items-center gap-3">
        <div className="bg-success/20 p-1 rounded-full">
            {React.cloneElement(icon, { className: 'w-4 h-4 text-success' })}
        </div>
        <span className="text-text-secondary">{title}</span>
    </li>
);

const InfoBox: React.FC<{ icon: React.ReactElement<any>; title: string, children: React.ReactNode}> = ({icon, title, children}) => (
     <div className="bg-surface/50 border border-border p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
            {React.cloneElement(icon, { className: 'w-5 h-5 text-primary' })}
            <h4 className="font-semibold text-text-primary">{title}</h4>
        </div>
        <div className="text-sm text-text-secondary">{children}</div>
    </div>
)

const SignUpPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [agreedTerms, setAgreedTerms] = useState(false);
    const [agreedPrivacy, setAgreedPrivacy] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name || !email || !password || !userType) {
            setError('Please fill in all required fields.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!agreedTerms || !agreedPrivacy) {
            setError('You must agree to the terms and privacy policy.');
            return;
        }
        console.log('Registering user:', { name, email, userType });
        onLogin();
    };

    return (
        <div className="relative min-h-screen w-full overflow-y-auto bg-background text-white font-sans flex items-center justify-center p-4">
            <Starfield />
            <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column */}
                <div className="space-y-8">
                     <Link to="/" className="flex items-center gap-3 mb-8">
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                            {React.cloneElement(Icons.logo, { className: 'w-full h-full object-cover' })}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-wider">Stratalyx AI</h1>
                            <p className="text-text-secondary">AI-Powered Investment Intelligence</p>
                        </div>
                    </Link>
                    <h2 className="text-4xl font-bold text-text-primary">Join the Future of <br/><span className="text-brand-cyan">Smart Investing</span></h2>
                    <p className="text-lg text-text-secondary">Get personalized AI insights from multiple expert agents. Make informed investment decisions with confidence.</p>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <FeatureListItem icon={Icons.agents} title="Multi-AI Analysis" />
                        <FeatureListItem icon={Icons.lightning} title="Real-time Data" />
                        <FeatureListItem icon={Icons.user} title="Personalized Insights" />
                        <FeatureListItem icon={Icons.shield} title="Secure Platform" />
                    </ul>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoBox icon={Icons.lock} title="Bank-Level Security">Your data is protected with 256-bit SSL encryption.</InfoBox>
                        <InfoBox icon={Icons.user} title="Privacy First">We never share your personal information with third parties.</InfoBox>
                        <InfoBox icon={Icons.checkmark} title="AI Transparency">All AI recommendations include source attribution and confidence levels.</InfoBox>
                        <InfoBox icon={Icons.alerts} title="Risk Disclosure">Investment decisions carry risk. AI insights are for informational purposes only.</InfoBox>
                    </div>
                     <div className="bg-surface/30 p-4 rounded-lg text-xs text-text-secondary">
                        <p className="font-bold mb-2">Important Financial Disclaimer</p>
                        <p>Stratalyx AI provides AI-generated insights for informational purposes only. All investment decisions should be made based on your own research and risk tolerance. Past performance does not guarantee future results. Please consult with a qualified financial advisor before making investment decisions.</p>
                    </div>
                </div>

                {/* Right Column */}
                <div className="bg-surface/90 backdrop-blur-sm border border-border rounded-lg p-8 shadow-2xl">
                    <h3 className="text-2xl font-bold text-text-primary mb-2">Create Your Account</h3>
                    <p className="text-text-secondary mb-6">Start your AI-powered investment journey today</p>
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField id="name" label="Full Name" type="text" value={name} onChange={setName} required />
                        <InputField id="email" label="Email Address" type="email" value={email} onChange={setEmail} required />
                        <div>
                             <label htmlFor="user-type" className="block text-sm font-medium text-text-secondary mb-1">User Type <span className="text-danger">*</span></label>
                            <select
                                id="user-type"
                                value={userType}
                                onChange={(e) => setUserType(e.target.value)}
                                required
                                className="mt-1 block w-full bg-background border border-border rounded-md p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
                            >
                                <option value="" disabled>Select your investor profile</option>
                                <option value="beginner">Beginner Investor</option>
                                <option value="trader">Active Trader</option>
                                <option value="analyst">Financial Analyst</option>
                            </select>
                        </div>
                        <InputField id="password" label="Password" type="password" value={password} onChange={setPassword} required placeholder="Create a strong password" />
                        <InputField id="confirm-password" label="Confirm Password" type="password" value={confirmPassword} onChange={setConfirmPassword} required placeholder="Confirm your password" />
                        
                        <AgreementCheckbox id="terms" checked={agreedTerms} onChange={setAgreedTerms} label="I agree to the Terms of Service and Risk Disclaimers" description="By checking this, you acknowledge the risks associated with financial investments and AI-generated advice" />
                        <AgreementCheckbox id="privacy" checked={agreedPrivacy} onChange={setAgreedPrivacy} label="I agree to the Privacy Policy and Data Usage" description="We use your data to provide personalized AI insights and improve our services" />

                        {error && <p className="text-danger text-sm text-center">{error}</p>}
                        
                        <button type="submit" className="w-full py-3 px-4 rounded-md font-bold text-background bg-brand-cyan hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-surface">
                            Create Account
                        </button>

                         <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-border" /></div>
                            <div className="relative flex justify-center"><span className="bg-surface px-2 text-sm text-text-secondary">Or continue with</span></div>
                        </div>

                        <div className="flex gap-4">
                            <SocialButton icon={Icons.google} text="Google" className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 flex-1" />
                            <SocialButton icon={Icons.linkedin} text="LinkedIn" className="bg-[#0A66C2] text-white border-[#0A66C2] hover:bg-blue-700 flex-1" />
                        </div>
                    </form>
                    <p className="text-center text-sm text-text-secondary mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-primary hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const InputField: React.FC<{id: string, label:string, type: string, value: string, onChange: (val: string) => void, required?: boolean, placeholder?: string}> = 
({id, label, type, value, onChange, required, placeholder}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label} {required && <span className="text-danger">*</span>}</label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className="mt-1 block w-full bg-background border border-border rounded-md p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
        />
    </div>
);


const AgreementCheckbox: React.FC<{id: string, label: string, description: string, checked: boolean, onChange: (val: boolean) => void}> = 
({id, label, description, checked, onChange}) => (
    <div className="flex items-start gap-3">
        <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="h-5 w-5 mt-0.5 text-primary bg-background border-border rounded focus:ring-primary shrink-0"
        />
        <div>
             <label htmlFor={id} className="block text-sm font-medium text-text-primary cursor-pointer">{label} <span className="text-danger">*</span></label>
             <p className="text-xs text-text-secondary">{description}</p>
        </div>
    </div>
);

export default SignUpPage;