import React, { useState, useCallback, useRef } from 'react';
import { Play, Loader2, Save, FileText, Upload, Download, Settings, RefreshCw } from 'lucide-react';
import { AppSettings, Language, Agent } from '../types';
import { AGENTS, LABELS, MODELS } from '../constants';
import { generateContent, repairAgentYaml } from '../services/geminiService';
import yaml from 'js-yaml';

interface AgentRunnerProps {
  settings: AppSettings;
  apiKey: string;
}

// Extend global AGENTS for local state management
const INITIAL_AGENTS = [...AGENTS];

const AgentRunner: React.FC<AgentRunnerProps> = ({ settings, apiKey }) => {
  const t = (key: string) => LABELS[key] ? LABELS[key][settings.language] : key;

  // View Mode: 'run' or 'manage'
  const [viewMode, setViewMode] = useState<'run' | 'manage'>('run');

  // Agent State
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || '');

  // Run State
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(agents[0]?.model || MODELS[0]);

  // Manage State
  const [yamlContent, setYamlContent] = useState(yaml.dump(INITIAL_AGENTS));
  const [repairing, setRepairing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const handleRun = useCallback(async () => {
    if (!prompt.trim() || !apiKey || !currentAgent) return;

    setLoading(true);
    setOutput('');

    const systemPrompt = `You are the ${currentAgent.name_en}. ${currentAgent.description_tc}. Language Preference: ${settings.language}.`;
    
    try {
      const result = await generateContent(apiKey, selectedModel, prompt, systemPrompt);
      setOutput(result);
    } catch (e: any) {
      setOutput(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [prompt, selectedModel, currentAgent, settings.language, apiKey]);

  const handleDownloadYaml = () => {
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agents.yaml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleUploadYaml = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      setYamlContent(content);
      
      try {
        const parsed = yaml.load(content) as Agent[];
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id) {
          setAgents(parsed);
          setSelectedAgentId(parsed[0].id);
          alert("Agents loaded successfully!");
        } else {
           throw new Error("Invalid structure");
        }
      } catch (err) {
        if (confirm("The uploaded YAML seems invalid or non-standard. Would you like the AI to attempt to repair and standardize it?")) {
           await handleRepair(content);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleRepair = async (content: string) => {
    setRepairing(true);
    try {
      const repairedYaml = await repairAgentYaml(apiKey, content);
      setYamlContent(repairedYaml);
      const parsed = yaml.load(repairedYaml) as Agent[];
      if (Array.isArray(parsed)) {
        setAgents(parsed);
        setSelectedAgentId(parsed[0]?.id || '');
        alert("Agents repaired and loaded!");
      }
    } catch (e: any) {
      alert(`Repair failed: ${e.message}`);
    } finally {
      setRepairing(false);
    }
  };

  const updateAgentsFromEditor = () => {
      try {
        const parsed = yaml.load(yamlContent) as Agent[];
        if (Array.isArray(parsed)) {
            setAgents(parsed);
            alert("Agents updated from editor.");
        }
      } catch (e) {
          alert("Invalid YAML in editor.");
      }
  };

  if (viewMode === 'manage') {
    return (
      <div className="glass-panel rounded-2xl p-6 h-full flex flex-col space-y-4">
        <div className="flex justify-between items-center border-b border-gray-200/20 pb-4">
          <h3 className="text-xl font-bold flex items-center gap-2"><Settings size={20}/> Agent Studio Manager</h3>
          <button onClick={() => setViewMode('run')} className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg">
            Back to Runner
          </button>
        </div>

        <div className="flex gap-4">
           <button onClick={handleDownloadYaml} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition">
             <Download size={16} /> Download YAML
           </button>
           <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition">
             <Upload size={16} /> Upload YAML
           </button>
           <input type="file" ref={fileInputRef} className="hidden" accept=".yaml,.yml,.txt" onChange={handleUploadYaml} />
           
           <button onClick={() => handleRepair(yamlContent)} disabled={repairing} className="ml-auto flex items-center gap-2 px-4 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg transition">
             {repairing ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />} 
             {repairing ? "Repairing..." : "Repair / Format"}
           </button>
        </div>

        <div className="flex-1 flex flex-col">
          <label className="text-sm font-semibold mb-2 opacity-70">agents.yaml Editor</label>
          <textarea 
            className="flex-1 font-mono text-sm p-4 rounded-xl bg-black/20 border border-gray-700 outline-none resize-none focus:bg-black/30 transition-colors"
            value={yamlContent}
            onChange={(e) => setYamlContent(e.target.value)}
          />
        </div>
        
        <button onClick={updateAgentsFromEditor} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition">
            Save & Apply Changes
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[600px]">
      {/* Configuration Column */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col space-y-6">
        <div className="flex justify-between items-center border-b border-gray-200/20 pb-4">
           <h3 className="text-xl font-bold">{t('Agents')}</h3>
           <button onClick={() => setViewMode('manage')} title="Manage Agents" className="p-2 hover:bg-white/10 rounded-full">
             <Settings size={18} />
           </button>
        </div>
        
        {agents.length === 0 ? (
            <div className="text-center opacity-50 py-10">No agents loaded. Go to settings to upload agents.yaml</div>
        ) : (
        <>
            <div>
            <label className="block text-sm font-semibold mb-2 opacity-70">Select Agent</label>
            <select 
                className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedAgentId}
                onChange={(e) => {
                setSelectedAgentId(e.target.value);
                const agent = agents.find(a => a.id === e.target.value);
                if (agent) setSelectedModel(agent.model);
                }}
            >
                {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                    {settings.language === Language.TRADITIONAL_CHINESE ? agent.name_tc : agent.name_en}
                </option>
                ))}
            </select>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
            <p className="text-sm font-medium">
                {settings.language === Language.TRADITIONAL_CHINESE ? currentAgent?.category_tc : 'Category: ' + currentAgent?.category_tc}
            </p>
            <p className="text-xs mt-2 opacity-80 leading-relaxed">
                {currentAgent?.description_tc}
            </p>
            </div>

            <div>
            <label className="block text-sm font-semibold mb-2 opacity-70">Model Override</label>
            <select 
                className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
            >
                {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            </div>

            <div className="mt-auto">
            <button 
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25'
                }`}
                onClick={handleRun}
                disabled={loading}
            >
                {loading ? <Loader2 className="animate-spin" /> : <Play size={20} />}
                {loading ? 'Processing...' : t('Run')}
            </button>
            </div>
        </>
        )}
      </div>

      {/* IO Column */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col min-h-[250px]">
          <label className="flex items-center gap-2 text-sm font-semibold mb-2 opacity-70">
            <FileText size={16} /> {t('Input')}
          </label>
          <textarea 
            className="flex-1 w-full bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed"
            placeholder="Enter your text or requirements here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col min-h-[350px] relative overflow-hidden">
           <div className="flex justify-between items-center mb-4 border-b border-gray-200/20 pb-2">
            <label className="flex items-center gap-2 text-sm font-semibold opacity-70">
              <Save size={16} /> {t('Output')}
            </label>
            {output && <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-1 rounded">Completed</span>}
           </div>
           
           <div className="flex-1 overflow-auto">
             {loading ? (
               <div className="flex flex-col items-center justify-center h-full opacity-50">
                 <Loader2 className="w-10 h-10 animate-spin mb-4" />
                 <p className="animate-pulse">The painter is thinking...</p>
               </div>
             ) : (
               <textarea
                 readOnly={false}
                 className="w-full h-full bg-transparent outline-none resize-none font-mono text-sm leading-relaxed"
                 value={output}
                 onChange={(e) => setOutput(e.target.value)}
                 placeholder="Results will appear here..."
               />
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AgentRunner;
