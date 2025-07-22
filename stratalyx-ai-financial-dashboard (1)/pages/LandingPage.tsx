import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import Starfield from '../components/Starfield';

const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string; }) => (
    <div className="bg-surface/50 backdrop-blur-sm p-6 rounded-lg border border-border transition-all hover:border-brand-cyan hover:scale-105">
        <div className="text-brand-cyan mb-3 text-2xl">{icon}</div>
        <h3 className="font-bold text-lg mb-2 text-text-primary">{title}</h3>
        <p className="text-text-secondary">{description}</p>
    </div>
);

const LandingPage: React.FC = () => {
    return (
        <div className="relative min-h-screen w-full overflow-x-hidden text-white font-sans">
            <Starfield />
            <div className="relative z-10 container mx-auto px-4">
                <header className="py-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold tracking-wider">Stratalyx AI</h1>
                    <Link to="/login" className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                        Sign In
                    </Link>
                </header>

                <main className="text-center pt-24 pb-32">
                    <h2 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
                        Join the Future of <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-primary">Smart Investing</span>
                    </h2>
                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-text-secondary mb-10">
                        Get personalized AI insights from multiple expert agents. Make informed investment decisions with confidence.
                    </p>
                    <Link to="/login" className="bg-brand-cyan hover:bg-cyan-500 text-background font-bold py-3 px-8 rounded-lg text-lg transition-transform hover:scale-105">
                        Get Started
                    </Link>
                </main>

                <section id="features" className="py-20">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard icon="🧠" title="Multi-AI Analysis" description="Leverage insights from leading AI models like GPT-4, Claude 3, and Gemini for comprehensive analysis." />
                        <FeatureCard icon="⏱️" title="Real-time Data" description="Access up-to-the-minute market data, news, and indicators to stay ahead of the curve." />
                        <FeatureCard icon="🎯" title="Personalized Insights" description="Tailor AI analysis to your risk tolerance, investment goals, and preferred markets." />
                        <FeatureCard icon="🛡️" title="Secure & Transparent" description="Your data is protected with bank-level security, and our AI provides clear source attribution." />
                    </div>
                </section>

                <footer className="text-center py-10 border-t border-border mt-20">
                    <p className="text-text-secondary">&copy; {new Date().getFullYear()} Stratalyx AI. All rights reserved.</p>
                    <p className="text-xs text-text-secondary/50 mt-2">
                        Investment decisions are for informational purposes only. Past performance is not indicative of future results. Consult with a qualified financial advisor.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;