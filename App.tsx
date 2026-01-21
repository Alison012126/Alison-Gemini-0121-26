import React, { useState } from 'react';
import { AppSettings, Language, PainterStyle, Theme } from './types';
import { PAINTER_CSS } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AgentRunner from './components/AgentRunner';
import DocumentProcessor from './components/DocumentProcessor';
import { Lock } from 'lucide-react';

const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    theme: Theme.DARK,
    language: Language.ENGLISH,
    painterStyle: 'Van Gogh',
    defaultModel: 'gemini-3-flash-preview',
  });

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [apiKey, setApiKey] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Combine Theme and Painter CSS
  const appStyle: React.CSSProperties = {
    ...PAINTER_CSS[settings.painterStyle],
    transition: 'background 0.5s ease-in-out',
  };

  return (
    <div className={settings.theme === Theme.DARK ? 'dark' : ''}>
      <div 
        className="min-h-screen flex text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 relative"
        style={appStyle}
      >
        {/* Overlay to ensure readability */}
        <div className="absolute inset-0 bg-white/60 dark:bg-black/60 pointer-events-none z-0 mix-blend-overlay" />
        <div className="absolute inset-0 bg-white/40 dark:bg-black/40 pointer-events-none z-0" />

        <div className="relative z-10 flex w-full">
          <Sidebar 
            settings={settings} 
            setSettings={setSettings} 
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            apiKey={apiKey}
            setApiKey={setApiKey}
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />

          <main className="flex-1 p-8 overflow-y-auto h-screen relative transition-all duration-300">
             <header className="flex justify-between items-center mb-8">
               <div>
                 <h2 className="text-3xl font-bold drop-shadow-sm">
                   {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
                 </h2>
                 <p className="opacity-70 text-sm mt-1">
                   {settings.language === Language.ENGLISH ? 'Welcome back, User.' : '歡迎回來，使用者。'}
                 </p>
               </div>
               
               <div className="glass-panel px-4 py-2 rounded-full text-xs font-mono">
                 System Status: <span className={apiKey ? "text-green-500" : "text-red-500"}>
                    {apiKey ? "Operational" : "Key Missing"}
                 </span>
               </div>
             </header>

             <div className="animate-fade-in-up">
               {currentTab === 'dashboard' && <Dashboard settings={settings} />}
               
               {currentTab === 'agents' && (
                 <AgentRunner settings={settings} apiKey={apiKey} />
               )}

               {currentTab === 'documents' && (
                 <DocumentProcessor settings={settings} apiKey={apiKey} />
               )}

               {currentTab === 'reports' && (
                 <div className="glass-panel p-12 text-center rounded-2xl">
                    <p className="text-lg opacity-60">Report generation module is ready. Connect agents to populate this view.</p>
                 </div>
               )}
             </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
