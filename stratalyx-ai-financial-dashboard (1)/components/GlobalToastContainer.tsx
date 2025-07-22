import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import GlobalToast from './GlobalToast';

const GlobalToastContainer: React.FC = () => {
    const { toasts, removeToast } = useAppContext();

    if (!toasts || !removeToast) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-[100] w-full max-w-sm space-y-3">
            <AnimatePresence>
                {toasts.map(toast => (
                    <GlobalToast key={toast.id} toast={toast} onClose={removeToast} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default GlobalToastContainer;
