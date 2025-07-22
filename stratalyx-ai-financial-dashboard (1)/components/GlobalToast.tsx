import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../constants';
import { cn } from '../lib/utils';
import type { ToastMessage, ToastLevel } from '../types';

interface GlobalToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const toastConfig: Record<ToastLevel, { icon: React.ReactElement<{ className?: string }>, barClass: string, iconClass: string }> = {
    Success: {
        icon: Icons.checkmark,
        barClass: 'bg-success',
        iconClass: 'text-success'
    },
    Info: {
        icon: Icons.info,
        barClass: 'bg-primary',
        iconClass: 'text-primary'
    },
    Warning: {
        icon: Icons.alertTriangle,
        barClass: 'bg-warning',
        iconClass: 'text-warning'
    },
    Critical: {
        icon: Icons.alertTriangle,
        barClass: 'bg-danger',
        iconClass: 'text-danger'
    },
};

const GlobalToast: React.FC<GlobalToastProps> = ({ toast, onClose }) => {
    const { id, message, level } = toast;
    const config = toastConfig[level];

    useEffect(() => {
        if (level !== 'Critical') {
            const timer = setTimeout(() => {
                onClose(id);
            }, 5000); // 5 seconds auto-dismiss
            return () => clearTimeout(timer);
        }
    }, [id, level, onClose]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="relative w-full max-w-sm overflow-hidden rounded-lg bg-surface shadow-lg border border-border"
        >
            <div className={cn("absolute left-0 top-0 bottom-0 w-2", config.barClass)}></div>
            <div className="flex items-start p-4 pl-6">
                <div className={cn("flex-shrink-0 pt-0.5", config.iconClass)}>
                    {React.cloneElement(config.icon, { className: 'w-6 h-6' })}
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-text-primary">{message}</p>
                </div>
                <div className="ml-4 flex flex-shrink-0">
                    <button
                        onClick={() => onClose(id)}
                        className="inline-flex rounded-md bg-surface text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default GlobalToast;