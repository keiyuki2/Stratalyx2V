import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Icons } from '../constants';

const { useNavigate } = ReactRouterDOM;

interface AdminAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // In a real application, this would be handled more securely.
    const SECRET_PASSWORD = 'MASTERKEY';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password === SECRET_PASSWORD) {
            navigate('/admin');
            onClose();
        } else {
            setError('Incorrect password. Please try again.');
            setPassword('');
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999] p-4"
            onClick={onClose}
        >
            <div 
                className="bg-surface border border-border rounded-lg w-full max-w-sm"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-border flex flex-col items-center text-center">
                    <div className="p-3 bg-primary/20 rounded-full mb-3 text-primary">
                        {React.cloneElement(Icons.shield, { className: 'w-8 h-8' })}
                    </div>
                    <h2 className="text-xl font-bold text-text-primary">Admin Access</h2>
                    <p className="text-sm text-text-secondary">Enter the password to continue.</p>
                </header>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="admin-password" className="sr-only">Password</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                                {React.cloneElement(Icons.lock, { className: 'w-5 h-5' })}
                            </span>
                             <input
                                id="admin-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                                required
                                className="w-full bg-background border border-border rounded-md p-3 pl-10 text-lg text-center tracking-widest font-mono focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder="******"
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-danger text-center">{error}</p>}
                    
                    <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md font-semibold text-white bg-primary hover:bg-blue-600 transition-colors">
                        Authenticate
                        {React.cloneElement(Icons.arrowRight, { className: 'w-5 h-5' })}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminAuthModal;