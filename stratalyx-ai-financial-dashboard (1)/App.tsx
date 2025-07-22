




import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { HashRouter, Routes, Route, Navigate } = ReactRouterDOM;
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import AgentManagementPage from './pages/AgentManagementPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import { ChatPage } from './pages/ChatPage';
import LiveMarketsPage from './pages/LiveMarketsPage';
import CodePage from './pages/CodePage';
import ToolsPage from './pages/ToolsPage';
import TopNavbar from './components/TopNavbar';
import QuickActionsModal from './components/QuickActionsModal';
import GlobalToastContainer from './components/GlobalToastContainer';
import { Language, ToastMessage, ToastLevel } from './types';
import { AppContext } from './context/AppContext';
import { SettingsProvider } from './context/SettingsContext';

const translations: Record<string, Record<Language, string>> = {
    // Existing nav
    dashboard: { en: 'Dashboard', mn: 'Хяналтын самбар' },
    markets: { en: 'Live Markets', mn: 'Шууд Зах зээл' },
    agents: { en: 'Agents', mn: 'Агентууд' },
    chat: { en: 'AI Chat', mn: 'AI Чат' },
    tools: { en: 'Tools', mn: 'Багажууд' },
    settings: { en: 'Settings', mn: 'Тохиргоо' },
    admin: { en: 'Admin', mn: 'Админ' },
    navCode: { en: 'Code', mn: 'Код' },
    logout: { en: 'Logout', mn: 'Гарах' },
    
    // Dashboard Page
    marketDataDashboard: { en: 'Market Data Dashboard', mn: 'Зах зээлийн мэдээллийн самбар' },
    dashboardSubtitle: { en: 'Real-time financial information and market insights', mn: 'Бодит цагийн санхүүгийн мэдээлэл ба зах зээлийн ойлголт' },
    refresh: { en: 'Refresh', mn: 'Сэргээх' },
    refreshing: { en: 'Refreshing...', mn: 'Сэргээж байна...' },
    marketIndices: { en: 'Market Indices', mn: 'Зах зээлийн индексүүд' },
    live: { en: 'Live', mn: 'Шууд' },
    marketClosed: { en: 'Market Closed', mn: 'Зах зээл хаалттай' },
    keyStocks: { en: 'Key Stocks', mn: 'Гол хувьцаанууд' },
    topGainers: { en: 'Top Gainers', mn: 'Шилдэг өсөлттэй' },
    topLosers: { en: 'Top Losers', mn: 'Шилдэг уналттай' },
    mostActive: { en: 'Most Active', mn: 'Хамгийн идэвхтэй' },
    economicIndicators: { en: 'Economic Indicators', mn: 'Эдийн засгийн үзүүлэлтүүд' },
    marketNews: { en: 'Market News', mn: 'Зах зээлийн мэдээ' },
    
    // Country names for Econ Indicators
    unitedStates: { en: 'United States', mn: 'АНУ' },
    germany: { en: 'Germany', mn: 'Герман' },
    china: { en: 'China', mn: 'Хятад' },
    japan: { en: 'Japan', mn: 'Япон' },
    unitedKingdom: { en: 'United Kingdom', mn: 'Их Британи' },
    mongolia: { en: 'Mongolia', mn: 'Монгол' },
    
    // Sector/Heatmap components
    sectorPerformance: { en: 'Sector Performance', mn: 'Салбарын гүйцэтгэл' },
    marketHeatmap: { en: 'Market Heatmap', mn: 'Зах зээлийн дулааны зураг' },
    listView: { en: 'List View', mn: 'Жагсаалтаар харах' },
    heatMap: { en: 'Heat Map', mn: 'Дулааны зураг' },
    
    // Agent Management Page
    agentManagement: { en: 'Agent Management', mn: 'Агентын удирдлага' },
    agentManagementSubtitle: { en: 'Configure and monitor your AI agents for optimal market analysis performance.', mn: 'Зах зээлийн шинжилгээний оновчтой гүйцэтгэлийг хангахын тулд AI агентуудаа тохируулж, хянаарай.' },
    addAgent: { en: 'Add Agent', mn: 'Агент нэмэх' },
    activeAgents: { en: 'Active Agents', mn: 'Идэвхтэй агентууд' },
    queriesToday: { en: 'Queries Today', mn: 'Өнөөдрийн асуулга' },
    avgUserRating: { en: 'Avg. User Rating', mn: 'Хэрэглэгчийн дундаж үнэлгээ' },
    monthlyCost: { en: 'Monthly Cost', mn: 'Сарын зардал' },
    availableAgents: { en: 'Available Agents', mn: 'Боломжит агентууд' },
    performanceTrends: { en: 'Performance Trends', mn: 'Гүйцэтгэлийн чиг хандлага' },
    performanceSubtitle: { en: 'Accuracy (%) over the last 7 days.', mn: 'Сүүлийн 7 хоногийн нарийвчлал (%).' },

    // Chat Page
    aiInvestmentChat: { en: 'AI Investment Chat', mn: 'AI Хөрөнгө оруулалтын чат' },
    aiChatSubtitle: { en: 'Converse with Stratalyx AI for real-time market analysis.', mn: 'Бодит цагийн зах зээлийн шинжилгээ хийхийн тулд Stratalyx AI-тай ярилцаарай.' },
    
    // Settings Page
    settingsSubtitle: { en: 'Personalize your Stratalyx AI dashboard experience.', mn: 'Stratalyx AI хянах самбарынхаа тохиргоог өөрчлөөрэй.' },
    account: { en: 'Account', mn: 'Бүртгэл' },
    aiPreferences: { en: 'AI Preferences', mn: 'AI Сонголт' },
    notificationsSound: { en: 'Notifications & Sound', mn: 'Мэдэгдэл ба Дуу' },
    myStocks: { en: 'My Stocks', mn: 'Миний хувьцаа' },
    dataManagement: { en: 'Data Management', mn: 'Мэдээллийн удирдлага' },

    // Live Markets Page
    liveMarketsSubtitle: { en: 'Interactive charts for stocks and indices', mn: 'Хувьцаа болон индексийн интерактив график' },

    // Tools Page
    toolsTitle: { en: 'Financial Tools & Utilities', mn: 'Санхүүгийн хэрэгсэл ба Ютилити' },
    toolsSubtitle: { en: 'A suite of calculators, trackers, and AI-powered utilities.', mn: 'Тооцоолуур, хянах хэрэгсэл, AI-д суурилсан хэрэгслүүдийн цуглуулга.' },
    calculators: { en: 'Calculators', mn: 'Тооцоолуур' },
    marketUtils: { en: 'Market Utilities', mn: 'Зах зээлийн хэрэгслүүд' },
    mongoliaSpecific: { en: 'Mongolia Specific', mn: 'Монголд зориулсан' },
    aiExtras: { en: 'AI Extras', mn: 'AI Нэмэлт' },
    dcaVisualizer: { en: 'DCA Visualizer', mn: 'DCA Визуалчлагч' },
    compoundInterest: { en: 'Compound Interest', mn: 'Нийлмэл хүү' },
    investmentReturn: { en: 'Investment Return', mn: 'Хөрөнгө оруулалтын өгөөж' },
    riskQuiz: { en: 'Risk Tolerance Quiz', mn: 'Эрсдэл даах чадварын тест' },
    currencyConverter: { en: 'Currency Converter', mn: 'Валют хөрвүүлэгч' },
    economicCalendar: { en: 'Economic Calendar', mn: 'Эдийн засгийн хуанли' },
    earningsCalendar: { en: 'Earnings Calendar', mn: 'Орлогын хуанли' },
    commodityTracker: { en: 'Commodity Tracker', mn: 'Түүхий эдийн хяналт' },
    mseSectorTracker: { en: 'MSE Sector Tracker', mn: 'МХБ-ийн салбарын хяналт' },
    mntInsights: { en: 'MNT Insights', mn: 'Төгрөгийн тойм' },
    stockComparator: { en: 'Stock Comparator', mn: 'Хувьцаа харьцуулагч' },
    portfolioHealthCheck: { en: 'Portfolio Health Check', mn: 'Портфелийн эрүүл мэндийн шалгалт' },

    // ProfileSettings.tsx
    profileSubtitle: { en: 'Profile information and subscription', mn: 'Профайл мэдээлэл ба захиалга' },
    editProfile: { en: 'Edit Profile', mn: 'Профайл засах' },
    profile: { en: 'Profile', mn: 'Профайл' },
    fullName: { en: 'Full Name', mn: 'Бүтэн нэр' },
    emailAddress: { en: 'Email Address', mn: 'Имэйл хаяг' },
    phoneNumber: { en: 'Phone Number', mn: 'Утасны дугаар' },
    select: { en: 'Select', mn: 'Сонгох' },
    numberPlaceholder: { en: 'Number', mn: 'Дугаар' },
    timezone: { en: 'Timezone', mn: 'Цагийн бүс' },
    selectTimezone: { en: 'Select Timezone', mn: 'Цагийн бүс сонгоно уу' },
    subscription: { en: 'Subscription', mn: 'Захиалга' },
    currentPlan: { en: 'Current Plan', mn: 'Одоогийн төлөвлөгөө' },
    status: { en: 'Status', mn: 'Төлөв' },
    price: { en: 'Price', mn: 'Үнэ' },
    nextBilling: { en: 'Next Billing', mn: 'Дараагийн төлбөр' },
    planFeatures: { en: 'Plan Features', mn: 'Төлөвлөгөөний онцлогууд' },
    manageBilling: { en: 'Manage Billing', mn: 'Төлбөр удирдах' },
    upgradePlan: { en: 'Upgrade Plan', mn: 'Төлөвлөгөөг сайжруулах' },
    usageStatistics: { en: 'Usage Statistics', mn: 'Хэрэглээний статистик' },
    aiQueries: { en: 'AI Queries', mn: 'AI асуулгууд' },
    dataUsage: { en: 'Data Usage', mn: 'Дата хэрэглээ' },
    activeAgentsUsage: { en: 'Active Agents', mn: 'Идэвхтэй агентууд' },
    securitySettings: { en: 'Security Settings', mn: 'Аюулгүй байдлын тохиргоо' },
    twoFactorAuth: { en: 'Two-Factor Authentication', mn: 'Хоёр хүчин зүйлийн баталгаажуулалт' },
    twoFactorAuthDesc: { en: 'Add an extra layer of security to your account', mn: 'Бүртгэлдээ нэмэлт аюулгүй байдлын давхарга нэмэх' },
    enabled: { en: 'Enabled', mn: 'Идэвхжүүлсэн' },
    manage: { en: 'Manage', mn: 'Удирдах' },
    loginAlerts: { en: 'Login Alerts', mn: 'Нэвтрэлтийн анхааруулга' },
    loginAlertsDesc: { en: 'Get notified of new login attempts', mn: 'Шинэ нэвтрэлтийн оролдлогын талаар мэдэгдэл авах' },
    on: { en: 'On', mn: 'Асаалттай' },
    configure: { en: 'Configure', mn: 'Тохируулах' },
    sessionTimeout: { en: 'Session Timeout', mn: 'Сесс дуусах хугацаа' },
    sessionTimeoutDesc: { en: 'Automatically log out after inactivity', mn: 'Идэвхгүй байсны дараа автоматаар гарах' },
    changePassword: { en: 'Change Password', mn: 'Нууц үг солих' },
    downloadAccountData: { en: 'Download Account Data', mn: 'Бүртгэлийн мэдээлэл татах' },
    
    // --- NEW PLAN DETAILS ---
    planFree: { en: 'Free', mn: 'Үнэгүй' },
    planFreeDesc: { en: 'For students, casual learners, and new investors testing the waters.', mn: 'Оюутнууд, сонирхогчид, шинэ хөрөнгө оруулагчдад зориулав.' },
    planPlus: { en: 'Plus', mn: 'Plus' },
    planPlusDesc: { en: 'For part-time traders and hobbyists who need more power.', mn: 'Илүү их боломж хэрэгтэй цагийн арилжаачид, сонирхогчдод.' },
    planProAnalyst: { en: 'Pro Analyst', mn: 'Про Шинжээч' },
    planProAnalystDesc: { en: 'For active investors & financial analysts who need deep insights.', mn: 'Гүнзгий ойлголт хэрэгтэй идэвхтэй хөрөнгө оруулагчид, санхүүгийн шинжээчдэд.' },
    planUltra: { en: 'Ultra', mn: 'Ultra' },
    planUltraDesc: { en: 'For heavy users and fund managers requiring enterprise features.', mn: 'Байгууллагын боломж шаардлагатай хүнд хэрэглэгчид, сангийн менежерүүдэд.' },

    // Free Plan Features
    featureFreeQueries: { en: 'Up to 25 queries/day', mn: 'Өдөрт 25 хүртэлх асуулга' },
    featureFreeAgents: { en: '1 Active AI Agent', mn: '1 идэвхтэй AI агент' },
    featureFreeDashboard: { en: 'Basic Dashboard View', mn: 'Үндсэн хянах самбар' },
    featureFreeNews: { en: 'Limited Market News', mn: 'Хязгаарлагдмал зах зээлийн мэдээ' },

    // Plus Plan Features
    featurePlusQueries: { en: '100 queries/day', mn: 'Өдөрт 100 асуулга' },
    featurePlusAgents: { en: 'Up to 3 Active AI Agents', mn: '3 хүртэлх идэвхтэй AI агент' },
    featurePlusCharts: { en: 'Real-time Charts & Data', mn: 'Бодит цагийн график ба мэдээлэл' },
    featurePlusAlerts: { en: 'Custom Price Alerts', mn: 'Үнийн сэрүүлэг тохируулах' },

    // Pro Analyst Plan Features
    featureProQueries: { en: '500 queries/day', mn: 'Өдөрт 500 асуулга' },
    featureProAgents: { en: 'Up to 6 Active AI Agents', mn: '6 хүртэлх идэвхтэй AI агент' },
    featureProIntegrations: { en: 'Broker Integrations (TradingView)', mn: 'Брокерын интеграц (TradingView)' },
    featureProTools: { en: 'Advanced Financial Tools', mn: 'Дэвшилтэт санхүүгийн хэрэгслүүд' },

    // Ultra Plan Features
    featureUltraQueries: { en: 'Unlimited Queries', mn: 'Хязгааргүй асуулга' },
    featureUltraAgents: { en: 'Unlimited Custom Agents', mn: 'Хязгааргүй тусгай агент' },
    featureUltraApi: { en: 'API Access', mn: 'API хандалт' },
    featureUltraAllIntegrations: { en: 'All Broker Integrations', mn: 'Бүх брокерын интеграц' },


    // AiPreferencesSettings.tsx
    aiPreferencesSubtitle: { en: 'Customize AI behavior and responses', mn: 'AI-н ажиллах байдал, хариултыг тохируулах' },
    redeemCode: { en: 'Redeem Code', mn: 'Код идэвхжүүлэх' },
    quickSetupProfiles: { en: 'Quick Setup Profiles', mn: 'Хурдан тохиргооны профайлууд' },
    quickSetupProfilesDesc: { en: 'Choose a preset profile to quickly configure your settings based on your investment style and experience level.', mn: 'Өөрийн хөрөнгө оруулалтын хэв маяг, туршлагад үндэслэн тохиргоогоо хурдан тохируулахын тулд урьдчилан тохируулсан профайлыг сонгоно уу.' },
    simulateUserPlan: { en: 'Simulate User Plan:', mn: 'Хэрэглэгчийн төлөвлөгөөг дуурайх:' },
    applied: { en: 'Applied', mn: 'Хэрэглэсэн' },
    applyProfile: { en: 'Apply Profile', mn: 'Профайл хэрэглэх' },
    analysisPreferences: { en: 'Analysis Preferences', mn: 'Шинжилгээний тохиргоо' },
    responseTone: { en: 'Default Response Tone', mn: 'Үндсэн хариултын өнгө аяс' },
    responseFormat: { en: 'Response Format', mn: 'Хариултын формат' },
    riskTolerance: { en: 'Risk Tolerance', mn: 'Эрсдэл даах чадвар' },
    investmentGoal: { en: 'Investment Goal', mn: 'Хөрөнгө оруулалтын зорилго' },
    marketFocusAreas: { en: 'Market Focus Areas', mn: 'Зах зээлийн гол чиглэлүүд' },
    marketFocusAreasDesc: { en: 'Select the markets you\'re most interested in analyzing', mn: 'Шинжилгээ хийх сонирхолтой зах зээлээ сонгоно уу' },
    stocks: { en: 'Stocks', mn: 'Хувьцаа' },
    crypto: { en: 'Cryptocurrency', mn: 'Криптовалют' },
    forex: { en: 'Forex', mn: 'Форекс' },
    commodities: { en: 'Commodities', mn: 'Түүхий эд' },
    bonds: { en: 'Bonds', mn: 'Бонд' },
    etfs: { en: 'ETFs', mn: 'ETF' },
    preferredAgents: { en: 'Preferred AI Agents', mn: 'Илүүд үзэх AI агентууд' },
    preferredAgentsDesc: { en: 'Choose which AI agents to use for analysis', mn: 'Шинжилгээнд ашиглах AI агентуудаа сонгоно уу' },
    agentOpenAI: { en: 'OpenAI GPT-4', mn: 'OpenAI GPT-4' },
    agentClaude: { en: 'Anthropic Claude', mn: 'Anthropic Claude' },
    agentGemini: { en: 'Google Gemini', mn: 'Google Gemini' },
    customPromptTemplates: { en: 'Custom Prompt Templates', mn: 'Өөрийн промпт загварууд' },
    addTemplate: { en: 'Add Template', mn: 'Загвар нэмэх' },
    advancedSettings: { en: 'Advanced Settings', mn: 'Нарийвчилсан тохиргоо' },
    autoSuggestions: { en: 'Auto-Suggestions', mn: 'Автомат санал болголт' },
    autoSuggestionsDesc: { en: 'Show suggested follow-up questions', mn: 'Санал болгосон дараагийн асуултуудыг харуулах' },
    contextMemory: { en: 'Context Memory', mn: 'Контекст санах ой' },
    contextMemoryDesc: { en: 'Remember conversation context across sessions', mn: 'Сесс хооронд ярианы контекстийг санах' },
    realtimeData: { en: 'Real-Time Data', mn: 'Бодит цагийн мэдээлэл' },
    realtimeDataDesc: { en: 'Include live market data in responses', mn: 'Хариултад шууд зах зээлийн мэдээллийг оруулах' },
    resetToDefaults: { en: 'Reset to Defaults', mn: 'Анхны тохиргоонд буцаах' },
    savePreferences: { en: 'Save Preferences', mn: 'Тохиргоог хадгалах' },
    redeemACode: { en: 'Redeem a Code', mn: 'Код идэвхжүүлэх' },
    redeemDesc: { en: 'Enter a referral or subscription code here to unlock new features and upgrade your plan.', mn: 'Шинэ боломжуудыг нээж, төлөвлөгөөгөө сайжруулахын тулд лавлагаа эсвэл захиалгын кодоо энд оруулна уу.' },
    yourCode: { en: 'Your Code', mn: 'Таны код' },
    redeem: { en: 'Redeem', mn: 'Идэвхжүүлэх' },
    redeemSuccess: { en: 'Success! You have unlocked the {plan} plan.', mn: 'Амжилттай! Та {plan} төлөвлөгөөг нээлээ.' },
    redeemSuccessFreeMonth: { en: 'Success! You have unlocked one free month of the Trader plan.', mn: 'Амжилттай! Та Trader төлөвлөгөөний нэг сарын үнэгүй эрхийг нээлээ.' },
    redeemError: { en: 'Invalid code. Please try again.', mn: 'Буруу код. Дахин оролдоно уу.' },

    // NotificationSettings.tsx
    notifications: { en: 'Notifications', mn: 'Мэдэгдэл' },
    notificationsDesc: { en: 'Manage alerts and communication', mn: 'Сэрүүлэг, харилцааг удирдах' },
    emailNotifications: { en: 'Email Notifications', mn: 'Имэйл мэдэгдэл' },
    pushNotifications: { en: 'Push Notifications', mn: 'Түлхэх мэдэгдэл' },
    inAppNotifications: { en: 'In-App Notifications', mn: 'Апп доторх мэдэгдэл' },
    notificationTiming: { en: 'Notification Timing', mn: 'Мэдэгдлийн цаг' },
    notificationFrequency: { en: 'Notification Frequency', mn: 'Мэдэгдлийн давтамж' },
    notificationFrequencyDesc: { en: 'How often to receive notifications', mn: 'Мэдэгдэл хэр олон удаа авах' },
    freqImmediate: { en: 'Immediate', mn: 'Шууд' },
    freqHourly: { en: 'Hourly', mn: 'Цаг тутам' },
    freqDaily: { en: 'Daily', mn: 'Өдөр бүр' },
    timezoneDesc: { en: 'Your local timezone for scheduling', mn: 'Хуваарь гаргахад зориулсан таны орон нутгийн цагийн бүс' },
    quietHours: { en: 'Quiet Hours', mn: 'Чимээгүй цаг' },
    quietHoursDesc: { en: 'Disable notifications during specified hours', mn: 'Заасан цагуудад мэдэгдлийг идэвхгүй болгох' },
    quietStartTime: { en: 'Quiet Start Time', mn: 'Чимээгүй эхлэх цаг' },
    quietEndTime: { en: 'Quiet End Time', mn: 'Чимээгүй дуусах цаг' },
    quickActions: { en: 'Quick Actions', mn: 'Хурдан үйлдэл' },
    testNotifications: { en: 'Test Notifications', mn: 'Мэдэгдлийг шалгах' },
    disableAll: { en: 'Disable All', mn: 'Бүгдийг идэвхгүй болгох' },
    enableAll: { en: 'Enable All', mn: 'Бүгдийг идэвхжүүлэх' },
    cancelChanges: { en: 'Cancel Changes', mn: 'Өөрчлөлтийг цуцлах' },
    saveNotificationSettings: { en: 'Save Notification Settings', mn: 'Мэдэгдлийн тохиргоог хадгалах' },
    notificationMarketAlerts: { en: 'Market Alerts', mn: 'Зах зээлийн сэрүүлэг' },
    notificationMarketAlertsDesc: { en: 'Significant market movements and events', mn: 'Зах зээлийн чухал хөдөлгөөн, үйл явдал' },
    notificationAnalysisComplete: { en: 'Analysis Complete', mn: 'Шинжилгээ дууссан' },
    notificationAnalysisCompleteDesc: { en: 'When AI analysis finishes processing', mn: 'AI шинжилгээ дуусахад' },
    notificationSystemUpdates: { en: 'System Updates', mn: 'Системийн шинэчлэлт' },
    notificationSystemUpdatesDesc: { en: 'Platform updates and new features', mn: 'Платформын шинэчлэлт ба шинэ боломжууд' },
    notificationPriceTargets: { en: 'Price Targets', mn: 'Үнийн зорилт' },
    notificationPriceTargetsDesc: { en: 'When stocks hit your target prices', mn: 'Хувьцаа таны зорилтот үнэд хүрэхэд' },
    notificationPortfolioUpdates: { en: 'Portfolio Updates', mn: 'Портфелийн шинэчлэлт' },
    notificationPortfolioUpdatesDesc: { en: 'Changes to your watchlist and portfolio', mn: 'Таны ажиглалтын жагсаалт болон портфелийн өөрчлөлтүүд' },
    notificationNewsAlerts: { en: 'News Alerts', mn: 'Мэдээний сэрүүлэг' },
    notificationNewsAlertsDesc: { en: 'Breaking financial news and events', mn: 'Санхүүгийн шуурхай мэдээ, үйл явдал' },
    notificationWeeklyDigest: { en: 'Weekly Digest', mn: 'Долоо хоногийн тойм' },
    notificationWeeklyDigestDesc: { en: "Summary of your week's activity and insights", mn: 'Таны долоо хоногийн үйл ажиллагаа, ойлголтын хураангуй' },
    notificationMaintenanceNotices: { en: 'Maintenance Notices', mn: 'Засвар үйлчилгээний мэдэгдэл' },
    notificationMaintenanceNoticesDesc: { en: 'Scheduled maintenance and downtime alerts', mn: 'Төлөвлөгөөт засвар, зогсолтын сэрүүлэг' },
    notificationUrgentAlerts: { en: 'Urgent Alerts', mn: 'Яаралтай сэрүүлэг' },
    notificationUrgentAlertsDesc: { en: 'Critical market events requiring immediate attention', mn: 'Шуурхай анхаарал шаардсан зах зээлийн чухал үйл явдал' },
    notificationChatResponses: { en: 'Chat Responses', mn: 'Чатны хариулт' },
    notificationChatResponsesDesc: { en: 'New messages in AI chat sessions', mn: 'AI чат сесс дэх шинэ зурвасууд' },
    notificationAgentUpdates: { en: 'Agent Updates', mn: 'Агентын шинэчлэлт' },
    notificationAgentUpdatesDesc: { en: 'AI agent status and configuration changes', mn: 'AI агентын төлөв, тохиргооны өөрчлөлтүүд' },

    // SoundSettings.tsx
    soundSettings: { en: 'Sound Settings', mn: 'Дууны тохиргоо' },
    soundSettingsDesc: { en: 'Control audio feedback for the application.', mn: 'Аппликешны дуут дохиог удирдах.' },
    muteAllSounds: { en: 'Mute All Sounds', mn: 'Бүх дууг хаах' },
    muteAllSoundsDesc: { en: 'Silence all application audio.', mn: 'Аппликешны бүх дууг хаах.' },
    masterVolume: { en: 'Master Volume', mn: 'Ерөнхий дууны түвшин' },
    notificationVolume: { en: 'Notification Volume', mn: 'Мэдэгдлийн дууны түвшин' },
    uiVolume: { en: 'UI Interaction Volume', mn: 'UI харилцааны дууны түвшин' },
    soundPack: { en: 'Sound Pack', mn: 'Дууны багц' },
    soundPackDesc: { en: 'Change the set of sounds used for notifications and actions.', mn: 'Мэдэгдэл, үйлдлийн дууны багцыг өөрчлөх.' },
    soundPackDefault: { en: 'Default', mn: 'Үндсэн' },
    soundPackModern: { en: 'Modern', mn: 'Орчин үеийн' },
    soundPackClassic: { en: 'Classic', mn: 'Сонгодог' },
    soundPackSilent: { en: 'Silent (No sounds)', mn: 'Чимээгүй (Дуугүй)' },

    // ManageStocks.tsx
    manageKeyStocks: { en: 'Manage Key Stocks', mn: 'Гол хувьцааг удирдах' },
    manageKeyStocksDesc: { en: 'Customize the list of stocks displayed in the "Key Stocks" widget on your dashboard for each country.', mn: 'Улс бүрийн хяналтын самбар дээрх "Гол хувьцаа" виджетэд харагдах хувьцааны жагсаалтыг өөрчлөх.' },
    stockTicker: { en: 'Stock Ticker', mn: 'Хувьцааны тикер' },
    companyName: { en: 'Company Name', mn: 'Компанийн нэр' },
    remove: { en: 'Remove', mn: 'Устгах' },
    noCustomStocks: { en: 'No custom stocks added for this country.', mn: 'Энэ улсад нэмсэн хувьцаа байхгүй байна.' },

    // DataSettings.tsx
    dataManagementDesc: { en: 'Privacy, export, and API settings', mn: 'Нууцлал, экспорт, API тохиргоо' },
    dataRetention: { en: 'Data Retention', mn: 'Мэдээлэл хадгалах хугацаа' },
    retentionQueryHistory: { en: 'Query History', mn: 'Асуулгын түүх' },
    retentionQueryHistoryDesc: { en: 'Your AI chat queries and responses', mn: 'Таны AI чат асуулга, хариулт' },
    retentionChatSessions: { en: 'Chat Sessions', mn: 'Чат сесс' },
    retentionChatSessionsDesc: { en: 'Conversation threads and context', mn: 'Ярианы сэдэв, контекст' },
    retentionMarketCache: { en: 'Market Data Cache', mn: 'Зах зээлийн мэдээллийн кэш' },
    retentionMarketCacheDesc: { en: 'Cached financial data and charts', mn: 'Кэшлэгдсэн санхүүгийн мэдээлэл, график' },
    retentionUserPrefs: { en: 'User Preferences', mn: 'Хэрэглэгчийн тохиргоо' },
    retentionUserPrefsDesc: { en: 'Settings and customizations', mn: 'Тохиргоо, өөрчлөлтүүд' },
    retentionAnalytics: { en: 'Analytics Data', mn: 'Аналитик мэдээлэл' },
    retentionAnalyticsDesc: { en: 'Usage patterns and performance metrics', mn: 'Хэрэглээний хэв маяг, гүйцэтгэлийн үзүүлэлт' },
    retentionForever: { en: 'Forever', mn: 'Үүрд' },
    retention1Y: { en: '1 Year', mn: '1 жил' },
    retention6M: { en: '6 Months', mn: '6 сар' },
    retention3M: { en: '3 Months', mn: '3 сар' },
    retention30D: { en: '30 Days', mn: '30 хоног' },
    delete: { en: 'Delete', mn: 'Устгах' },
    privacyControls: { en: 'Privacy Controls', mn: 'Нууцлалын хяналт' },
    privacyShareAnalytics: { en: 'Share Analytics', mn: 'Аналитик хуваалцах' },
    privacyShareAnalyticsDesc: { en: 'Help improve the platform with anonymous usage data', mn: 'Нэргүй хэрэглээний мэдээллээр платформыг сайжруулахад туслах' },
    privacyAIImprovement: { en: 'AI Model Improvement', mn: 'AI загвар сайжруулалт' },
    privacyAIImprovementDesc: { en: 'Use your queries to improve AI responses (anonymized)', mn: 'AI хариултыг сайжруулахын тулд таны асуулгыг ашиглах (нэргүй)' },
    privacyMarketing: { en: 'Marketing Communications', mn: 'Маркетингийн харилцаа' },
    privacyMarketingDesc: { en: 'Receive promotional emails and product updates', mn: 'Сурталчилгааны имэйл, бүтээгдэхүүний шинэчлэлт авах' },
    privacyThirdParty: { en: 'Third-Party Data Sharing', mn: 'Гуравдагч этгээдтэй мэдээлэл хуваалцах' },
    privacyThirdPartyDesc: { en: 'Share data with trusted partners for enhanced features', mn: 'Нэмэлт боломжуудын тулд итгэмжлэгдсэн түншүүдтэй мэдээлэл хуваалцах' },
    privacyDataProcessing: { en: 'Data Processing', mn: 'Мэдээлэл боловсруулалт' },
    privacyDataProcessingDesc: { en: 'Allow processing of your data for core functionality', mn: 'Үндсэн үйлдлийн хувьд таны мэдээллийг боловсруулахыг зөвшөөрөх' },
    dataExport: { en: 'Data Export', mn: 'Мэдээлэл экспортлох' },
    exportFormat: { en: 'Export Format', mn: 'Экспортын формат' },
    formatJSON: { en: 'JSON', mn: 'JSON' },
    formatCSV: { en: 'CSV', mn: 'CSV' },
    dateRange: { en: 'Date Range', mn: 'Огнооны хязгаар' },
    rangeAll: { en: 'All Time', mn: 'Бүх цаг үе' },
    range1Y: { en: 'Last Year', mn: 'Сүүлийн жил' },
    range6M: { en: 'Last 6 Months', mn: 'Сүүлийн 6 сар' },
    range3M: { en: 'Last 3 Months', mn: 'Сүүлийн 3 сар' },
    range30D: { en: 'Last 30 Days', mn: 'Сүүлийн 30 хоног' },
    includeInExport: { en: 'Include in Export', mn: 'Экспортод оруулах' },
    exportChatHistory: { en: 'Chat History', mn: 'Чатны түүх' },
    exportQueryHistory: { en: 'Query History', mn: 'Асуулгын түүх' },
    exportUserPrefs: { en: 'User Preferences', mn: 'Хэрэглэгчийн тохиргоо' },
    exportAnalytics: { en: 'Analytics Data', mn: 'Аналитик мэдээлэл' },
    previewExport: { en: 'Preview Export', mn: 'Экспортыг урьдчилан харах' },
    exportData: { en: 'Export Data', mn: 'Мэдээлэл экспортлох' },
    apiAccess: { en: 'API Access', mn: 'API хандалт' },
    apiKeyStatus: { en: 'API Key Status', mn: 'API түлхүүрийн төлөв' },
    inactive: { en: 'Inactive', mn: 'Идэвхгүй' },
    noApiKeyGenerated: { en: 'No API key generated', mn: 'API түлхүүр үүсгээгүй байна' },
    generateApiKey: { en: 'Generate API Key', mn: 'API түлхүүр үүсгэх' },
    apiDocumentation: { en: 'API Documentation', mn: 'API баримт бичиг' },
    dangerZone: { en: 'Danger Zone', mn: 'Аюултай бүс' },
    deleteAllData: { en: 'Delete All Data', mn: 'Бүх мэдээллийг устгах' },
    deleteAllDataDesc: { en: 'Permanently remove all your data from our servers', mn: 'Манай серверүүдээс бүх мэдээллээ бүрмөсөн устгах' },
    deleteEverything: { en: 'Delete Everything', mn: 'Бүгдийг устгах' },
    closeAccount: { en: 'Close Account', mn: 'Бүртгэл хаах' },
    closeAccountDesc: { en: 'Permanently close your account and delete all associated data', mn: 'Бүртгэлээ бүрмөсөн хааж, холбогдох бүх мэдээллийг устгах' },
    resetSettings: { en: 'Reset Settings', mn: 'Тохиргоог анхны байдалд нь оруулах' },
    saveDataSettings: { en: 'Save Data Settings', mn: 'Мэдээллийн тохиргоог хадгалах' },
    
    // BillingModal.tsx
    paymentDetails: { en: 'Payment Details', mn: 'Төлбөрийн мэдээлэл' },
    invoiceHistory: { en: 'Invoice History', mn: 'Нэхэмжлэхийн түүх' },
    invoiceDate: { en: 'Date', mn: 'Огноо' },
    invoiceAmount: { en: 'Amount', mn: 'Дүн' },
    invoiceStatus: { en: 'Status', mn: 'Төлөв' },
    invoiceDownload: { en: 'Download', mn: 'Татах' },
    statusPaid: { en: 'Paid', mn: 'Төлсөн' },
    payViaMonpay: { en: 'Pay via MonPay', mn: 'MonPay-ээр төлөх' },
    sendPaymentTo: { en: 'Send payment to:', mn: 'Төлбөрийг илгээх данс:' },
    currentPrice: { en: 'Current Price:', mn: 'Одоогийн үнэ:' },
    perMonth: { en: '/ month', mn: '/ сар' },
    subscriptionPlan: { en: 'Subscription Plan', mn: 'Захиалгын төлөвлөгөө' },
    planNameSuffix: { en: '{planName} Plan', mn: '{planName} төлөвлөгөө' },
    confirmYourPayment: { en: 'Confirm Your Payment', mn: 'Төлбөрөө баталгаажуулах' },
    confirmYourPaymentDesc: { en: 'After sending payment, please fill out this form to get your subscription activated.', mn: 'Төлбөр илгээсний дараа захиалгаа идэвхжүүлэхийн тулд энэ маягтыг бөглөнө үү.' },
    mustMatchAccountName: { en: 'Must match your account name', mn: 'Таны бүртгэлийн нэртэй таарах ёстой' },
    paymentScreenshot: { en: 'Payment Screenshot', mn: 'Төлбөрийн баримтын зураг' },
    uploadScreenshot: { en: 'Upload Screenshot', mn: 'Баримтын зураг хуулах' },
    notesOptional: { en: 'Notes (Optional)', mn: 'Тэмдэглэл (заавал биш)' },
    notesPlaceholder: { en: 'Any additional information...', mn: 'Бусад нэмэлт мэдээлэл...' },
    submitForVerification: { en: 'Submit for Verification', mn: 'Шалгуулахаар илгээх' },
    paymentPending: { en: 'Payment Verification Pending', mn: 'Төлбөрийн баталгаажуулалт хүлээгдэж байна' },
    paymentPendingDesc: { en: 'Your payment is being verified. Please allow up to 12 hours for manual approval. Once confirmed, your subscription will be activated and you’ll receive an email.', mn: 'Таны төлбөрийг шалгаж байна. Гараар баталгаажуулахад 12 цаг хүртэл хугацаа шаардагдана. Баталгаажсаны дараа таны захиалга идэвхжиж, танд имэйл ирнэ.' },
    close: { en: 'Close', mn: 'Хаах' },

    // Admin Panel
    adminPanel: { en: 'Admin Panel', mn: 'Админ самбар' },
    adminPanelSubtitle: { en: 'Platform management and oversight.', mn: 'Платформын удирдлага ба хяналт.' },
    
    // Admin Sidebar
    adminDashboard: { en: 'Dashboard', mn: 'Хяналтын самбар' },
    userManagement: { en: 'User Management', mn: 'Хэрэглэгчийн удирдлага' },
    aiAgentManagement: { en: 'AI Agent Management', mn: 'AI Агент удирдлага' },
    subscriptionControl: { en: 'Subscription Control', mn: 'Захиалгын хяналт' },
    billingVerifications: { en: 'Billing Verifications', mn: 'Төлбөрийн баталгаажуулалт' },
    codeManager: { en: 'Code Manager', mn: 'Код менежер' },
    feedbackManager: { en: 'Feedback Manager', mn: 'Санал хүсэлтийн менежер' },
    contentManager: { en: 'Content Manager', mn: 'Контент менежер' },
    notificationEngine: { en: 'Notification Engine', mn: 'Мэдэгдлийн хөдөлгүүр' },
    logAnalytics: { en: 'Logs & Analytics', mn: 'Лог ба аналитик' },
    
    // Admin Dashboard
    totalUsers: { en: 'Total Users', mn: 'Нийт хэрэглэгчид' },
    paidSubscribers: { en: 'Paid Subscribers', mn: 'Төлбөртэй захиалагчид' },
    activeApiRequests: { en: 'Active API Requests', mn: 'Идэвхтэй API хүсэлт' },
    avgAgentVoteTime: { en: 'Avg. Agent Vote Time', mn: 'Агентийн санал өгөх дундаж хугацаа' },
    systemWarnings: { en: 'System Warnings', mn: 'Системийн анхааруулга' },
    apiRateLimit: { en: 'API rate limits approaching 80%.', mn: 'API-н хурдны хязгаар 80%-д хүрч байна.' },
    failedWebhooks: { en: '3 failed webhooks in the last hour.', mn: 'Сүүлийн нэг цагт 3 webhook амжилтгүй боллоо.' },
    subscriptionsByPlan: { en: 'Subscriptions by Plan', mn: 'Төлөвлөгөөгөөрх захиалга' },
    dailyQueries: { en: 'Daily AI Queries', mn: 'Өдөр тутмын AI асуулга' },
    pendingVerifications: { en: 'Pending Verifications', mn: 'Хүлээгдэж буй баталгаажуулалт' },
    viewAll: { en: 'View All', mn: 'Бүгдийг харах' },
    recentPendingVerifications: { en: 'Recent Pending Verifications', mn: 'Сүүлийн үеийн хүлээгдэж буй баталгаажуулалт' },
    
    // Admin User Management
    searchUsers: { en: 'Search users...', mn: 'Хэрэглэгч хайх...' },
    allPlans: { en: 'All Plans', mn: 'Бүх төлөвлөгөө' },
    allStatuses: { en: 'All Statuses', mn: 'Бүх төлөв' },
    active: { en: 'Active', mn: 'Идэвхтэй' },
    deactivated: { en: 'Deactivated', mn: 'Идэвхгүй' },
    banned: { en: 'Banned', mn: 'Хориглосон' },
    userId: { en: 'User ID', mn: 'Хэрэглэгчийн ID' },
    user: { en: 'User', mn: 'Хэрэглэгч' },
    plan: { en: 'Plan', mn: 'Төлөвлөгөө' },
    joinedDate: { en: 'Joined Date', mn: 'Бүртгүүлсэн огноо' },
    actions: { en: 'Actions', mn: 'Үйлдэл' },
    edit: { en: 'Edit', mn: 'Засах' },
    warn: { en: 'Warn', mn: 'Сануулах' },
    ban: { en: 'Ban', mn: 'Хориглох' },
    
    // Admin Billing Verifications
    approve: { en: 'Approve', mn: 'Зөвшөөрөх' },
    reject: { en: 'Reject', mn: 'Татгалзах' },
    submissionId: { en: 'Submission ID', mn: 'Илгээлтийн ID' },
    submissionDate: { en: 'Submission Date', mn: 'Илгээсэн огноо' },
    viewProof: { en: 'View Proof', mn: 'Баримт харах' },

    // Other Admin sections
    activateDeactivateAgents: { en: 'Activate/Deactivate Agents', mn: 'Агентуудыг идэвхжүүлэх/идэвхгүйжүүлэх' },
    agentStatus: { en: 'Agent Status', mn: 'Агентын төлөв' },
    transactions: { en: 'Transactions', mn: 'Гүйлгээ' },
    forceUserUpgrade: { en: 'Force User Upgrade', mn: 'Хэрэглэгчийн төлөвлөгөөг албадан сайжруулах' },
    selectUser: { en: 'Select User', mn: 'Хэрэглэгч сонгох' },
    selectPlan: { en: 'Select Plan', mn: 'Төлөвлөгөө сонгох' },
    upgradeUser: { en: 'Upgrade User', mn: 'Хэрэглэгчийг сайжруулах' },
    generateNewCode: { en: 'Generate New Code', mn: 'Шинэ код үүсгэх' },
    code: { en: 'Code', mn: 'Код' },
    type: { en: 'Type', mn: 'Төрөл' },
    value: { en: 'Value', mn: 'Утга' },
    uses: { en: 'Uses', mn: 'Хэрэглээ' },
    expires: { en: 'Expires', mn: 'Дуусах хугацаа' },
    generate: { en: 'Generate', mn: 'Үүсгэх' },
    userReviews: { en: 'User Reviews', mn: 'Хэрэглэгчийн сэтгэгдэл' },
    rating: { en: 'Rating', mn: 'Үнэлгээ' },
    review: { en: 'Review', mn: 'Сэтгэгдэл' },
    approveAll: { en: 'Approve All', mn: 'Бүгдийг зөвшөөрөх' },
    rejectAll: { en: 'Reject All', mn: 'Бүгдийг татгалзах' },
    postPlatformUpdate: { en: 'Post Platform Update', mn: 'Платформын шинэчлэлт нийтлэх' },
    title: { en: 'Title', mn: 'Гарчиг' },
    content: { en: 'Content', mn: 'Агуулга' },
    postUpdate: { en: 'Post Update', mn: 'Шинэчлэлт нийтлэх' },
    sendGlobalNotification: { en: 'Send Global Notification', mn: 'Дэлхий нийтийн мэдэгдэл илгээх' },
    message: { en: 'Message', mn: 'Зурвас' },
    level: { en: 'Level', mn: 'Түвшин' },
    sendNotification: { en: 'Send Notification', mn: 'Мэдэгдэл илгээх' },
    success: { en: 'Success', mn: 'Амжилттай' },
    info: { en: 'Info', mn: 'Мэдээлэл' },
    warning: { en: 'Warning', mn: 'Анхааруулга' },
    critical: { en: 'Critical', mn: 'Ноцтой' },
    queryLogs: { en: 'Query Logs', mn: 'Асуулгын лог' },
    adminActivity: { en: 'Admin Activity', mn: 'Админы үйл ажиллагаа' },
    performanceGraphs: { en: 'Performance Graphs', mn: 'Гүйцэтгэлийн график' },
    deleteUser: { en: 'Delete User', mn: 'Хэрэглэгч устгах' },
    wipeData: { en: 'Wipe Data', mn: 'Мэдээлэл арчих' },
    resetConfig: { en: 'Reset AI Configs', mn: 'AI тохиргоог анхны байдалд нь оруулах' },
    systemShutdown: { en: 'System Shutdown', mn: 'Системийг унтраах' },
    
    // Integration Settings
    integrations: { en: 'Integrations', mn: 'Интеграц' },
    integrationsSubtitle: { en: 'Connect your accounts from other platforms to sync data.', mn: 'Бусад платформоос дансаа холбож, мэдээллээ синк хийнэ үү.' },
    connectAccount: { en: 'Connect Account', mn: 'Данс холбох' },
    disconnect: { en: 'Disconnect', mn: 'Салгах' },
    connected: { en: 'Connected', mn: 'Холбогдсон' },
    connecting: { en: 'Connecting...', mn: 'Холбож байна...' },
    comingSoon: { en: 'Coming Soon', mn: 'Тун удахгүй' },
    upgradeToPro: { en: 'Upgrade to Pro', mn: 'Pro болгох' },
    metatraderTitle: { en: 'MetaTrader 5', mn: 'MetaTrader 5' },
    metatraderDesc: { en: 'Link your MT5 account for live trade analysis and portfolio sync.', mn: 'Шууд арилжааны шинжилгээ, портфелийн синк хийхийн тулд MT5 дансаа холбоно уу.' },
    tradingviewTitle: { en: 'TradingView', mn: 'TradingView' },
    tradingviewDesc: { en: 'Sync your watchlists and get AI analysis on your favorite charts.', mn: 'Ажиглалтын жагсаалтаа синк хийж, дуртай графикууд дээрээ AI шинжилгээ аваарай.' },
    binanceTitle: { en: 'Binance', mn: 'Binance' },
    binanceDesc: { en: 'Connect your Binance account for portfolio tracking and trade insights.', mn: 'Портфель хянах, арилжааны ойлголт авахын тулд Binance дансаа холбоно уу.' },
    loginId: { en: 'Login ID', mn: 'Нэвтрэх ID' },
    password: { en: 'Password', mn: 'Нууц үг' },
    server: { en: 'Server', mn: 'Сервер' },
    apiKey: { en: 'API Key', mn: 'API Түлхүүр' },
    secretKey: { en: 'Secret Key', mn: 'Нууц Түлхүүр' },
    usernameToken: { en: 'Username / Token', mn: 'Хэрэглэгчийн нэр / Токен' },
    credentialsNote: { en: 'Your credentials are encrypted and used only for a secure session link.', mn: 'Таны мэдээлэл шифрлэгдэж, зөвхөн аюулгүй сесс холболтод ашиглагдана.' },
};

const AuthenticatedApp: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [isNavbarVisible, setIsNavbarVisible] = useState(true); // Keep it visible for simplicity now
    const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setIsQuickActionsOpen(prev => !prev);
            }
            if (event.key === 'Escape') {
                setIsQuickActionsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="flex flex-col h-screen bg-background">
            <TopNavbar
                onLogout={onLogout}
                isVisible={isNavbarVisible}
                onOpenQuickActions={() => setIsQuickActionsOpen(true)}
            />
            
            <main className="flex-grow overflow-y-auto">
                <Routes>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/markets" element={<LiveMarketsPage />} />
                    <Route path="/agents" element={<AgentManagementPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/tools" element={<ToolsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/code" element={<CodePage />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </main>

            <QuickActionsModal
                isOpen={isQuickActionsOpen}
                onClose={() => setIsQuickActionsOpen(false)}
            />
            <GlobalToastContainer />
        </div>
    );
};

const UnauthenticatedApp: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
            <Route path="/signup" element={<SignUpPage onLogin={onLogin} />} />
            <Route path="/*" element={<LandingPage />} />
        </Routes>
    );
};

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Set to false to start on landing page
    const [language, setLanguage] = useState<Language>(Language.EN);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => setIsAuthenticated(false);
    
    const t = (key: string) => translations[key]?.[language] || key;
    
    const addToast = (message: string, level: ToastLevel) => {
        const id = Date.now().toString() + Math.random().toString();
        setToasts(prevToasts => [...prevToasts, { id, message, level }]);
    };

    const removeToast = (id: string) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    };

    return (
        <AppContext.Provider value={{ language, setLanguage, t, toasts, addToast, removeToast }}>
            <SettingsProvider>
                <HashRouter>
                    {isAuthenticated ? (
                        <AuthenticatedApp onLogout={handleLogout} />
                    ) : (
                        <UnauthenticatedApp onLogin={handleLogin} />
                    )}
                </HashRouter>
            </SettingsProvider>
        </AppContext.Provider>
    );
};

export default App;