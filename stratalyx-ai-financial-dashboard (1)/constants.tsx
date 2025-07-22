import React from 'react';
import type { Stock, NewsArticle, Sector, Agent, PerformanceData, CountryCode } from './types';

// Icons (Lucide-inspired)
export const Icons = {
    logo: <img src="https://i.pinimg.com/736x/96/24/ca/9624ca65e34e684bb6a47d61c73cba60.jpg" alt="Stratalyx AI Logo" />,
    dashboard: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
    agents: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>,
    chat: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    settings: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0 2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
    tools: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    logout: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
    up: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
    down: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
    gdp: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="4"/><path d="M16 20V10"/><path d="M8 20V16"/></svg>,
    inflation: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="12" x2="12" y2="20"/><path d="M12 12V4"/><path d="m15 15-3-3-3 3"/><path d="m15 5 3 3"/><path d="m6 8 3-3"/></svg>,
    unemployment: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" y1="8" x2="22" y2="13"/><line x1="17" y1="13" x2="22" y2="8"/></svg>,
    fed: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V3"/><path d="M6 12H2a10 10 0 0 0 20 0h-4"/><path d="M6 12a6 6 0 0 0 12 0"/><path d="M12 12a2 2 0 0 0-4 0"/></svg>,
    cci: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
    pmi: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.3 12.7c.6-.6.6-1.5 0-2.1l-4.5-4.5c-.6-.6-1.5-.6-2.1 0l-1.4 1.4c-.6.6-.6 1.5 0 2.1l1.4 1.4"/><path d="M12 22a9.95 9.95 0 0 1-7-3.3c-2.3-3.3-1.6-7.8 1.7-10.1"/><path d="M12 12a5 5 0 0 0-5 5c0 1.4.6 2.7 1.5 3.5"/><path d="m14.5 7.5 1 1"/></svg>,
    technology: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>,
    healthcare: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
    financials: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M16 7.5a4 4 0 0 0-8 0"/><path d="M16 16.5a4 4 0 0 1-8 0"/></svg>,
    energy: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12h.01"/><path d="M15.5 6.79a8 8 0 1 0-8.02 8.02"/><path d="M16 18a4 4 0 0 0-8 0h8Z"/><path d="m11 14 1-2 1.5 3"/></svg>,
    consumerDiscretionary: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.16"/></svg>,
    industrials: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7-6H4a2 2 0 0 0-2 2v12Z"/><path d="M18 18h-4"/><path d="M18 14h-4"/><path d="M10 18v-4"/><path d="M10 10V6"/></svg>,
    materials: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 17.92V9.08"/><path d="M2.18 18L12 9.08l9.82 8.84"/></svg>,
    utilities: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L3 11h5v11h4V11h5L12 2zM6.5 11L12 6l5.5 5h-3.5v11h-4V11H6.5z"/></svg>,
    search: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
    portfolio: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
    alerts: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
    research: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
    screener: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>,
    compare: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
    calendar: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
    arrowRight: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>,
    database: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
    user: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    checkmark: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    lock: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
    code: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    gift: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
    star: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    google: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 6.343-4.118 11.25-10.464 11.25-6.104 0-10.334-4.82-10.334-10.59C-5.113 2.949-.982-1.58.003-1.58c3.225 0 5.625 1.44 6.985 2.67L5.04 2.87C4.12 2.05 2.68.976.003.976c-3.72 0-6.52 3.034-6.52 6.882 0 3.848 2.8 6.82 6.52 6.82 4.195 0 6.04-2.924 6.27-4.63H.003V8.81h6.985c.32 1.73.08 3.53-.78 5.03h0z" transform="translate(6 6) scale(1.2)"/></svg>,
    linkedin: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
    shield: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    info: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    alertTriangle: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    lightning: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    thumbsUp: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>,
    thumbsDown: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v6a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/></svg>,
    trendUp: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    trendDown: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
    pieChart: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>,
    balanceScale: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-2 1-4 1-6 0"/><path d="m2 16 3-8 3 8c-2 1-4 1-6 0"/><path d="M12 2v20"/><path d="M21 16H3"/></svg>,
    volatility: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    uncertainty: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>,
    candlestickChart: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5v4"/><rect width="4" height="6" x="7" y="9" rx="1"/><path d="M9 15v5"/><path d="M17 3v2"/><rect width="4" height="8" x="15" y="5" rx="1"/><path d="M17 13v8"/></svg>,
    gold: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="4" rx="1" /><rect x="3" y="14" width="18" height="4" rx="1" /><rect x="3" y="10" width="18" height="4" rx="1" /></svg>,
    silver: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="4" rx="1" fill="#C0C0C0" stroke="#A9A9A9" /><rect x="3" y="14" width="18" height="4" rx="1" fill="#C0C0C0" stroke="#A9A9A9" /><rect x="3" y="10" width="18" height="4" rx="1" fill="#C0C0C0" stroke="#A9A9A9" /></svg>,
    copper: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="4" rx="1" fill="#B87333" stroke="#8B4513" /><rect x="3" y="14" width="18" height="4" rx="1" fill="#B87333" stroke="#8B4513" /><rect x="3" y="10" width="18" height="4" rx="1" fill="#B87333" stroke="#8B4513" /></svg>,
    coal: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17l-4 4-4-4"/><path d="M6 21V5"/><path d="M18 17l-4 4-4-4"/><path d="M14 21V5"/><path d="M2 11h20"/></svg>,
    link: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>,
    adminPanel: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
};

export const countryStockMap: Record<CountryCode, { ticker: string, name: string }[]> = {
    US: [
        { ticker: 'AAPL', name: 'Apple Inc.' },
        { ticker: 'MSFT', name: 'Microsoft Corp.' },
        { ticker: 'GOOGL', name: 'Alphabet Inc.' },
        { ticker: 'AMZN', name: 'Amazon.com, Inc.' },
        { ticker: 'NVDA', name: 'NVIDIA Corp.' },
        { ticker: 'TSLA', name: 'Tesla, Inc.' },
    ],
    DE: [
        { ticker: 'SAP', name: 'SAP SE' },
        { ticker: 'SIE', name: 'Siemens AG' },
        { ticker: 'DTE', name: 'Deutsche Telekom' },
        { ticker: 'VOW3.DE', name: 'Volkswagen AG' },
        { ticker: 'MBG.DE', name: 'Mercedes-Benz Group' },
        { ticker: 'BMW.DE', name: 'BMW AG' },
    ],
    CN: [
        { ticker: 'BABA', name: 'Alibaba Group (ADR)' },
        { ticker: 'TCEHY', name: 'Tencent Holdings (ADR)' },
        { ticker: 'JD', name: 'JD.com (ADR)' },
        { ticker: 'BIDU', name: 'Baidu, Inc. (ADR)' },
        { ticker: 'NIO', name: 'NIO Inc. (ADR)' },
    ],
    JP: [
        { ticker: '7203.T', name: 'Toyota Motor Corp.' },
        { ticker: '6758.T', name: 'Sony Group Corp.' },
        { ticker: '9984.T', name: 'SoftBank Group' },
        { ticker: '8306.T', name: 'Mitsubishi UFJ Fin.' },
        { ticker: '6861.T', name: 'Keyence Corp.' },
    ],
    GB: [
        { ticker: 'AZN.L', name: 'AstraZeneca PLC' },
        { ticker: 'SHEL.L', name: 'Shell PLC' },
        { ticker: 'HSBA.L', name: 'HSBC Holdings' },
        { ticker: 'ULVR.L', name: 'Unilever PLC' },
        { ticker: 'DGE.L', name: 'Diageo PLC' },
    ],
    MN: [
        { ticker: 'APU.MNE', name: 'APU JSC' },
        { ticker: 'GOV.MNE', name: 'Gobi JSC' },
        { ticker: 'TTL.MNE', name: 'Tavan Tolgoi JSC' },
        { ticker: 'TDBM.MNE', name: 'Trade & Dev Bank of Mongolia' },
        { ticker: 'MNDL.MNE', name: 'Mandal Daatgal JSC' },
    ]
};

// Mock Data
export const marketIndices: Stock[] = [
    { ticker: 'SPX', name: 'S&P 500', price: 4567.89, change: 23.45, changePercent: 0.52, volume: '3.2B' },
    { ticker: 'IXIC', name: 'NASDAQ', price: 14234.56, change: -45.67, changePercent: -0.32, volume: '4.1B' },
    { ticker: 'DJI', name: 'Dow Jones', price: 34567.12, change: 156.78, changePercent: 0.45, volume: '2.8B' },
    { ticker: 'RUT', name: 'Russell 2000', price: 1987.65, change: -12.34, changePercent: -0.62, volume: '1.5B' },
];

export const trendingStocks: Stock[] = [
    { ticker: 'AAPL', name: 'Apple Inc.', price: 189.45, change: 5.67, changePercent: 3.08, volume: '45.2M' },
    { ticker: 'TSLA', name: 'Tesla, Inc.', price: 267.89, change: 12.34, changePercent: 4.83, volume: '67.8M' },
    { ticker: 'NVDA', name: 'NVIDIA Corporation', price: 456.78, change: 11.23, changePercent: 2.59, volume: '89.1M' },
    { ticker: 'MSFT', name: 'Microsoft Corporation', price: 334.56, change: 8.76, changePercent: 2.59, volume: '34.7M' },
];

const nowInSeconds = Math.floor(Date.now() / 1000);

export const newsArticles: NewsArticle[] = [
    { id: 1, source: 'Reuters', headline: 'Federal Reserve Signals Potential Rate Cut in Q4 2024', summary: 'Fed Chair Powell hints at monetary policy shift amid cooling inflation data and labor market concerns.', datetime: nowInSeconds - (30 * 60), imageUrl: 'https://picsum.photos/seed/reuters/200/100', url: '#' },
    { id: 2, source: 'Bloomberg', headline: 'Tech Stocks Rally on Strong AI Earnings Reports', summary: 'Major technology companies report better-than-expected quarterly results driven by AI investments and cloud growth.', datetime: nowInSeconds - (60 * 60), imageUrl: 'https://picsum.photos/seed/bloomberg/200/100', url: '#' },
    { id: 3, source: 'CNBC', headline: 'Oil Prices Surge Amid Middle East Tensions', summary: 'Crude oil futures jump 3% as geopolitical concerns raise supply disruption fears in key producing regions.', datetime: nowInSeconds - (60 * 60), imageUrl: 'https://picsum.photos/seed/cnbc/200/100', url: '#' },
    { id: 4, source: 'WSJ', headline: 'Consumer Spending Data Shows Resilient Economy', summary: 'Retail sales exceed expectations for third consecutive month, indicating strong consumer confidence despite inflation concerns.', datetime: nowInSeconds - (2 * 60 * 60), imageUrl: 'https://picsum.photos/seed/wsj/200/100', url: '#' },
];

export const sectors: Sector[] = []; // This will be populated by API calls now

export const availableAgents: Agent[] = [
    { id: 'gpt4', name: 'GPT-4 Turbo', provider: 'OpenAI', description: 'Advanced language model with superior reasoning capabilities for complex financial analysis.', accuracy: 94, avgResponse: 1200, costPerQuery: 0.045, active: true, userRating: 4.6, predictionAccuracy: 95.2 },
    { id: 'claude3', name: 'Claude 3 Opus', provider: 'Anthropic', description: 'Highly capable AI assistant with strong analytical skills and nuanced understanding of financial markets.', accuracy: 91, avgResponse: 980, costPerQuery: 0.038, active: true, userRating: 4.8, predictionAccuracy: 92.8 },
    { id: 'gemini', name: 'Gemini Pro', provider: 'Google', description: 'Multimodal AI model with strong performance in data analysis, chart interpretation, and real-time news.', accuracy: 88, avgResponse: 850, costPerQuery: 0.025, active: false, userRating: 4.4, predictionAccuracy: 96.5 },
    { id: 'marketmind', name: 'MarketMind', provider: 'Custom', description: 'Proprietary model focusing on macroeconomic trends and their market impact.', accuracy: 92, avgResponse: 1100, costPerQuery: 0.050, active: true, userRating: 4.5, predictionAccuracy: 93.1 },
    { id: 'quantbot', name: 'QuantBot 3', provider: 'QuantCo', description: 'Specialized in quantitative analysis and algorithmic trading signals.', accuracy: 95, avgResponse: 750, costPerQuery: 0.060, active: true, userRating: 4.7, predictionAccuracy: 97.1 },
    { id: 'finbert', name: 'FinBERT', provider: 'Bloomberg', description: 'A language model fine-tuned on extensive financial corpora for sentiment analysis.', accuracy: 89, avgResponse: 900, costPerQuery: 0.030, active: false, userRating: 4.3, predictionAccuracy: 90.5 },
    { id: 'oracleai', name: 'Oracle AI', provider: 'Refinitiv', description: 'Provides deep insights from Refinitiv\'s vast financial data.', accuracy: 93, avgResponse: 1300, costPerQuery: 0.055, active: true, userRating: 4.6, predictionAccuracy: 94.2 },
    { id: 'hedgehog', name: 'Hedgehog', provider: 'Bridgewater', description: 'Simulates investment strategies from top hedge funds.', accuracy: 87, avgResponse: 1500, costPerQuery: 0.070, active: false, userRating: 4.2, predictionAccuracy: 89.8 },
    { id: 'raven', name: 'Raven', provider: 'Two Sigma', description: 'Focuses on identifying statistical arbitrage opportunities.', accuracy: 96, avgResponse: 800, costPerQuery: 0.080, active: true, userRating: 4.9, predictionAccuracy: 98.0 },
    { id: 'capitalyst', name: 'Capitalyst', provider: 'BlackRock', description: 'Long-term investment and portfolio allocation specialist.', accuracy: 90, avgResponse: 1400, costPerQuery: 0.040, active: true, userRating: 4.5, predictionAccuracy: 91.5 },
    { id: 'economistai', name: 'Economist-AI', provider: 'The Economist', description: 'Global macroeconomic analysis and geopolitical risk assessment.', accuracy: 91, avgResponse: 1250, costPerQuery: 0.048, active: true, userRating: 4.6, predictionAccuracy: 92.1 },
    { id: 'trendspotter', name: 'TrendSpotter', provider: 'In-house', description: 'Technical analysis expert for identifying market trends.', accuracy: 85, avgResponse: 700, costPerQuery: 0.020, active: true, userRating: 4.1, predictionAccuracy: 88.8 },
    { id: 'alphaseeker', name: 'AlphaSeeker', provider: 'Goldman Sachs', description: 'High-conviction stock picking and alpha generation.', accuracy: 92, avgResponse: 1150, costPerQuery: 0.065, active: false, userRating: 4.7, predictionAccuracy: 94.8 },
    { id: 'portfoliopilot', name: 'PortfolioPilot', provider: 'Morgan Stanley', description: 'AI for portfolio construction and risk management.', accuracy: 93, avgResponse: 1350, costPerQuery: 0.058, active: true, userRating: 4.8, predictionAccuracy: 93.9 },
    { id: 'riskguard', name: 'RiskGuard', provider: 'Moody\'s', description: 'Credit risk and default probability analysis.', accuracy: 94, avgResponse: 1050, costPerQuery: 0.052, active: true, userRating: 4.5, predictionAccuracy: 95.5 },
    { id: 'newsscan', name: 'NewsScan', provider: 'Reuters AI', description: 'Real-time news sentiment and impact analysis.', accuracy: 89, avgResponse: 600, costPerQuery: 0.028, active: true, userRating: 4.4, predictionAccuracy: 90.2 },
    { id: 'deepvalue', name: 'DeepValue', provider: 'BuffettAI', description: 'Focuses on fundamental analysis and value investing principles.', accuracy: 86, avgResponse: 1600, costPerQuery: 0.035, active: false, userRating: 4.3, predictionAccuracy: 88.2 },
    { id: 'momentum', name: 'Momentum', provider: 'Jane Street', description: 'Identifies short-term momentum trading opportunities.', accuracy: 90, avgResponse: 550, costPerQuery: 0.075, active: true, userRating: 4.6, predictionAccuracy: 91.8 },
    { id: 'volalyzer', name: 'Volalyzer', provider: 'CBOE Labs', description: 'Analyzes market volatility and options strategies.', accuracy: 95, avgResponse: 950, costPerQuery: 0.068, active: true, userRating: 4.8, predictionAccuracy: 96.8 },
    { id: 'macrogpt', name: 'MacroGPT', provider: 'In-house', description: 'Generative AI for long-form macroeconomic reports.', accuracy: 88, avgResponse: 1800, costPerQuery: 0.042, active: true, userRating: 4.2, predictionAccuracy: 90.0 },
];

export const performanceData: PerformanceData[] = [
    { date: 'Jan 1', OpenAI: 92, Claude: 90, Gemini: 85 },
    { date: 'Jan 2', OpenAI: 94, Claude: 91, Gemini: 87 },
    { date: 'Jan 3', OpenAI: 93, Claude: 92, Gemini: 86 },
    { date: 'Jan 4', OpenAI: 95, Claude: 92, Gemini: 89 },
    { date: 'Jan 5', OpenAI: 96, Claude: 94, Gemini: 90 },
    { date: 'Jan 6', OpenAI: 97, Claude: 95, Gemini: 91 },
    { date: 'Jan 7', OpenAI: 96, Claude: 94, Gemini: 90 },
];

const genericAgentAnalytics = {
    kpis: { accuracy: 90, responseTime: 1000, totalQueries: 1000, userRating: 4.5 },
    performanceOverTime: [
      { week: 'Week 1', accuracy: 88, responseTime: 1050 },
      { week: 'Week 2', accuracy: 89, responseTime: 1020 },
      { week: 'Week 3', accuracy: 91, responseTime: 980 },
      { week: 'Week 4', accuracy: 90, responseTime: 1000 },
    ],
    queryDistribution: [
      { name: 'Stock Analysis', value: 40, fill: '#2F81F7' },
      { name: 'Market Trends', value: 25, fill: '#238636' },
      { name: 'Risk Assessment', value: 20, fill: '#8957E5' },
      { name: 'Other', value: 15, fill: '#FBBF24' },
    ],
    usagePatterns: { peakTime: '1:00 PM - 3:00 PM', mostActiveDay: 'Thursday', avgSessionLength: '10 minutes', repeatUsers: '80%' },
    costAnalysis: {
      totalCost: 100.0,
      costPerQuery: 0.050,
      projectedMonthly: 300.0,
      breakdown: [
        { name: 'API Calls', value: 65, fill: '#2F81F7' },
        { name: 'Data Access', value: 25, fill: '#238636' },
        { name: 'Storage', value: 5, fill: '#8957E5' },
        { name: 'Other', value: 5, fill: '#FBBF24' },
      ],
    },
    ratingDistribution: [
      { name: '5★', count: 130, fill: '#34D399' },
      { name: '4★', count: 70, fill: '#A3E635' },
      { name: '3★', count: 20, fill: '#FBBF24' },
      { name: '2★', count: 5, fill: '#F87171' },
      { name: '1★', count: 2, fill: '#DC2626' },
    ],
    recentFeedback: [
      { time: '4 hours ago', text: 'Solid performance, reliable.', rating: 5 },
      { time: '2 days ago', text: 'A bit generic sometimes but mostly useful.', rating: 4 },
    ],
};

export const agentAnalyticsData = {
  gpt4: {
    kpis: { accuracy: 94, responseTime: 1200, totalQueries: 1247, userRating: 4.6 },
    performanceOverTime: [
      { week: 'Week 1', accuracy: 92, responseTime: 1250 },
      { week: 'Week 2', accuracy: 93, responseTime: 1220 },
      { week: 'Week 3', accuracy: 91.8, responseTime: 1280 },
      { week: 'Week 4', accuracy: 94, responseTime: 1200 },
    ],
    queryDistribution: [
      { name: 'Stock Analysis', value: 45, fill: '#2F81F7' },
      { name: 'Market Trends', value: 30, fill: '#238636' },
      { name: 'Risk Assessment', value: 15, fill: '#8957E5' },
      { name: 'Portfolio Review', value: 10, fill: '#FBBF24' },
    ],
    usagePatterns: { peakTime: '2:00 PM - 4:00 PM', mostActiveDay: 'Tuesday', avgSessionLength: '12 minutes', repeatUsers: '78%' },
    costAnalysis: {
      totalCost: 127.5,
      costPerQuery: 0.045,
      projectedMonthly: 385.2,
      breakdown: [
        { name: 'API Calls', value: 70, fill: '#2F81F7' },
        { name: 'Data Access', value: 20, fill: '#238636' },
        { name: 'Storage', value: 7, fill: '#8957E5' },
        { name: 'Other', value: 3, fill: '#FBBF24' },
      ],
    },
    ratingDistribution: [
      { name: '5★', count: 145, fill: '#34D399' },
      { name: '4★', count: 67, fill: '#A3E635' },
      { name: '3★', count: 18, fill: '#FBBF24' },
      { name: '2★', count: 3, fill: '#F87171' },
      { name: '1★', count: 1, fill: '#DC2626' },
    ],
    recentFeedback: [
      { time: '2 hours ago', text: 'Excellent analysis of the market conditions. Very helpful for my trading decisions.', rating: 5 },
      { time: '5 hours ago', text: 'Good insights but could be faster. Overall satisfied with the quality.', rating: 4 },
      { time: '1 day ago', text: 'The risk assessment feature is outstanding. Saved me from a bad trade.', rating: 5 },
    ],
  },
  claude3: {
    kpis: { accuracy: 91, responseTime: 980, totalQueries: 972, userRating: 4.8 },
    performanceOverTime: [
      { week: 'Week 1', accuracy: 90, responseTime: 1000 },
      { week: 'Week 2', accuracy: 90.5, responseTime: 990 },
      { week: 'Week 3', accuracy: 92, responseTime: 950 },
      { week: 'Week 4', accuracy: 91, responseTime: 980 },
    ],
    queryDistribution: [
      { name: 'Fundamental Analysis', value: 50, fill: '#2F81F7' },
      { name: 'Economic Reports', value: 25, fill: '#238636' },
      { name: 'Sentiment Analysis', value: 15, fill: '#8957E5' },
      { name: 'Long-term Forecast', value: 10, fill: '#FBBF24' },
    ],
    usagePatterns: { peakTime: '10:00 AM - 12:00 PM', mostActiveDay: 'Wednesday', avgSessionLength: '15 minutes', repeatUsers: '85%' },
    costAnalysis: {
      totalCost: 95.8,
      costPerQuery: 0.038,
      projectedMonthly: 290.0,
      breakdown: [
        { name: 'API Calls', value: 75, fill: '#2F81F7' },
        { name: 'Data Access', value: 15, fill: '#238636' },
        { name: 'Storage', value: 8, fill: '#8957E5' },
        { name: 'Other', value: 2, fill: '#FBBF24' },
      ],
    },
    ratingDistribution: [
      { name: '5★', count: 180, fill: '#34D399' },
      { name: '4★', count: 55, fill: '#A3E635' },
      { name: '3★', count: 10, fill: '#FBBF24' },
      { name: '2★', count: 1, fill: '#F87171' },
      { name: '1★', count: 0, fill: '#DC2626' },
    ],
    recentFeedback: [
      { time: '30 minutes ago', text: 'Incredibly nuanced and detailed. Perfect for deep research.', rating: 5 },
      { time: '8 hours ago', text: 'The summaries of SEC filings are a game-changer for me.', rating: 5 },
      { time: '2 days ago', text: 'Sometimes a bit too verbose, but the quality is undeniable.', rating: 4 },
    ],
  },
  gemini: {
    kpis: { accuracy: 88, responseTime: 850, totalQueries: 1503, userRating: 4.4 },
    performanceOverTime: [
      { week: 'Week 1', accuracy: 87, responseTime: 880 },
      { week: 'Week 2', accuracy: 89, responseTime: 840 },
      { week: 'Week 3', accuracy: 88.5, responseTime: 855 },
      { week: 'Week 4', accuracy: 88, responseTime: 850 },
    ],
    queryDistribution: [
      { name: 'Real-time News Analysis', value: 40, fill: '#2F81F7' },
      { name: 'Chart Interpretation', value: 35, fill: '#238636' },
      { name: 'Quick Facts', value: 15, fill: '#8957E5' },
      { name: 'Price Targets', value: 10, fill: '#FBBF24' },
    ],
    usagePatterns: { peakTime: '9:30 AM - 10:30 AM', mostActiveDay: 'Monday', avgSessionLength: '8 minutes', repeatUsers: '72%' },
    costAnalysis: {
      totalCost: 72.4,
      costPerQuery: 0.025,
      projectedMonthly: 220.5,
      breakdown: [
        { name: 'API Calls', value: 65, fill: '#2F81F7' },
        { name: 'Data Access', value: 25, fill: '#238636' },
        { name: 'Storage', value: 5, fill: '#8957E5' },
        { name: 'Other', value: 5, fill: '#FBBF24' },
      ],
    },
    ratingDistribution: [
      { name: '5★', count: 110, fill: '#34D399' },
      { name: '4★', count: 82, fill: '#A3E635' },
      { name: '3★', count: 25, fill: '#FBBF24' },
      { name: '2★', count: 8, fill: '#F87171' },
      { name: '1★', count: 2, fill: '#DC2626' },
    ],
    recentFeedback: [
      { time: '1 hour ago', text: 'Super fast for news summaries. The best for real-time events.', rating: 5 },
      { time: '1 day ago', text: 'The chart reading feature is hit or miss sometimes.', rating: 3 },
      { time: '3 days ago', text: 'Great for quick checks, but I use Claude for deeper dives.', rating: 4 },
    ],
  },
  marketmind: { ...genericAgentAnalytics, kpis: { accuracy: 92, responseTime: 1100, totalQueries: 850, userRating: 4.5 } },
  quantbot: { ...genericAgentAnalytics, kpis: { accuracy: 95, responseTime: 750, totalQueries: 1500, userRating: 4.7 } },
  finbert: { ...genericAgentAnalytics, kpis: { accuracy: 89, responseTime: 900, totalQueries: 1100, userRating: 4.3 } },
  oracleai: { ...genericAgentAnalytics, kpis: { accuracy: 93, responseTime: 1300, totalQueries: 950, userRating: 4.6 } },
  hedgehog: { ...genericAgentAnalytics, kpis: { accuracy: 87, responseTime: 1500, totalQueries: 500, userRating: 4.2 } },
  raven: { ...genericAgentAnalytics, kpis: { accuracy: 96, responseTime: 800, totalQueries: 1800, userRating: 4.9 } },
  capitalyst: { ...genericAgentAnalytics, kpis: { accuracy: 90, responseTime: 1400, totalQueries: 700, userRating: 4.5 } },
  economistai: { ...genericAgentAnalytics, kpis: { accuracy: 91, responseTime: 1250, totalQueries: 900, userRating: 4.6 } },
  trendspotter: { ...genericAgentAnalytics, kpis: { accuracy: 85, responseTime: 700, totalQueries: 2000, userRating: 4.1 } },
  alphaseeker: { ...genericAgentAnalytics, kpis: { accuracy: 92, responseTime: 1150, totalQueries: 1300, userRating: 4.7 } },
  portfoliopilot: { ...genericAgentAnalytics, kpis: { accuracy: 93, responseTime: 1350, totalQueries: 1000, userRating: 4.8 } },
  riskguard: { ...genericAgentAnalytics, kpis: { accuracy: 94, responseTime: 1050, totalQueries: 1150, userRating: 4.5 } },
  newsscan: { ...genericAgentAnalytics, kpis: { accuracy: 89, responseTime: 600, totalQueries: 2500, userRating: 4.4 } },
  deepvalue: { ...genericAgentAnalytics, kpis: { accuracy: 86, responseTime: 1600, totalQueries: 600, userRating: 4.3 } },
  momentum: { ...genericAgentAnalytics, kpis: { accuracy: 90, responseTime: 550, totalQueries: 3000, userRating: 4.6 } },
  volalyzer: { ...genericAgentAnalytics, kpis: { accuracy: 95, responseTime: 950, totalQueries: 1400, userRating: 4.8 } },
  macrogpt: { ...genericAgentAnalytics, kpis: { accuracy: 88, responseTime: 1800, totalQueries: 400, userRating: 4.2 } },
};