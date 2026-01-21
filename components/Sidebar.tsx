import React, { useCallback, useState } from 'react';
import { Palette, Languages, Shuffle, LayoutDashboard, Bot, FileText, PieChart, Key, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { AppSettings, Language, PainterStyle, Theme } from '../types';
import { LABELS, PAINTERS } from '../constants';

interface SidebarProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  settings, 
  setSettings, 
  currentTab, 
  setCurrentTab, 
  apiKey,
  setApiKey,
  isCollapsed,
  toggleSidebar
}) => {
  const t = (key: string) => LABELS[key] ? LABELS[key][settings.language] : key;
  const [showKey, setShowKey] = useState(false);

  const handleJackpot = useCallback(() => {
    const randomPainter = PAINTERS[Math.floor(Math.random() * PAINTERS.length)];
    setSettings(prev => ({ ...prev, painterStyle: randomPainter }));
  }, [setSettings]);

  const toggleTheme = () => {
    setSettings(prev => ({ ...prev, theme: prev.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT }));
  };

  const toggleLanguage = () => {
    setSettings(prev => ({ ...prev, language: prev.language === Language.ENGLISH ? Language.TRADITIONAL_CHINESE : Language.ENGLISH }));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'agents', label: 'Agents', icon: Bot },
    { id: 'reports', label: 'Reports', icon: PieChart },
  ];

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-80'} sidebar-transition h-screen flex flex-col transition-all duration-300 border-r ${
      settings.theme === Theme.DARK ? 'bg-gray-900/80 border-gray-700 text-gray-100' : 'bg-white/80 border-gray-200 text-gray-800'
    } backdrop-blur-md z-50 sticky top-0 relative`}>
      
      {/* Collapse Toggle */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-8 bg-blue-600 text-white p-1 rounded-full shadow-lg z-50 hover:bg-blue-700 transition"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={`p-6 mb-4 ${isCollapsed ? 'items-center justify-center' : ''} flex flex-col`}>
        {!isCollapsed ? (
          <>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-2 truncate">
              AI Workspace
            </h1>
            <p className="text-xs opacity-60 uppercase tracking-widest truncate">{t('Style')}: {settings.painterStyle}</p>
          </>
        ) : (
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-xl">
             AI
           </div>
        )}
      </div>

      <nav className="flex-1 space-y-2 px-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            title={isCollapsed ? t(item.label) : ''}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
              currentTab === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
            }`}
          >
            <item.icon size={20} className="min-w-[20px]" />
            {!isCollapsed && <span className="font-medium truncate">{t(item.label)}</span>}
          </button>
        ))}
      </nav>

      <div className={`space-y-4 p-6 border-t border-gray-200 dark:border-gray-700 ${isCollapsed ? 'items-center flex flex-col px-2' : ''}`}>
        
        {/* API Key Input */}
        <div className={`w-full ${isCollapsed ? 'hidden' : 'block'}`}>
           <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase opacity-70 flex items-center gap-1">
                <Key size={12} /> API Key
              </label>
              <button onClick={() => setShowKey(!showKey)} className="opacity-50 hover:opacity-100">
                {showKey ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
           </div>
           <input 
             type={showKey ? "text" : "password"}
             value={apiKey}
             onChange={(e) => setApiKey(e.target.value)}
             placeholder="Paste API Key..."
             className="w-full text-xs p-2 rounded bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-blue-500 outline-none transition-colors"
           />
        </div>

        {/* Theme Toggle */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Palette size={16} />
              <span className="text-sm font-semibold">{t('Theme')}</span>
            </div>
          )}
          <button 
            onClick={toggleTheme}
            className="px-3 py-1 rounded-full text-xs font-bold bg-gray-200 dark:bg-gray-700"
            title={settings.theme}
          >
            {isCollapsed ? (settings.theme === Theme.DARK ? 'D' : 'L') : settings.theme}
          </button>
        </div>

        {/* Language Toggle */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
           {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Languages size={16} />
              <span className="text-sm font-semibold">{t('Language')}</span>
            </div>
           )}
          <button 
            onClick={toggleLanguage}
            className="px-3 py-1 rounded-full text-xs font-bold bg-gray-200 dark:bg-gray-700"
          >
            {settings.language === Language.ENGLISH ? 'EN' : '繁中'}
          </button>
        </div>

        {/* Style Selector */}
        {!isCollapsed && (
          <div className="space-y-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{t('Style')}</span>
              <button 
                onClick={handleJackpot}
                className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:underline"
              >
                <Shuffle size={12} /> {t('Jackpot')}
              </button>
            </div>
            <select 
              className="w-full p-2 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              value={settings.painterStyle}
              onChange={(e) => setSettings(prev => ({ ...prev, painterStyle: e.target.value as PainterStyle }))}
            >
              {PAINTERS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
