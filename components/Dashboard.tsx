import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { AppSettings, Language } from '../types';
import { LABELS } from '../constants';
import { Activity, Zap, CheckCircle, Clock } from 'lucide-react';

interface DashboardProps {
  settings: AppSettings;
}

const mockData = [
  { name: 'Jan', usage: 400, tokens: 2400 },
  { name: 'Feb', usage: 300, tokens: 1398 },
  { name: 'Mar', usage: 200, tokens: 9800 },
  { name: 'Apr', usage: 278, tokens: 3908 },
  { name: 'May', usage: 189, tokens: 4800 },
];

const mockModelUsage = [
  { name: 'Gemini 3', value: 45 },
  { name: 'GPT-5', value: 30 },
  { name: 'Claude', value: 25 },
];

const Dashboard: React.FC<DashboardProps> = ({ settings }) => {
  const t = (key: string) => LABELS[key] ? LABELS[key][settings.language] : key;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Runs', value: '1,234', icon: Zap, color: 'text-yellow-500' },
          { label: 'Active Agents', value: '31', icon: Activity, color: 'text-blue-500' },
          { label: 'Success Rate', value: '98.5%', icon: CheckCircle, color: 'text-green-500' },
          { label: 'Avg Latency', value: '1.2s', icon: Clock, color: 'text-purple-500' },
        ].map((metric, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-sm opacity-70 mb-1">{metric.label}</p>
              <h3 className="text-2xl font-bold">{metric.value}</h3>
            </div>
            <metric.icon className={`${metric.color} w-8 h-8 opacity-80`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl h-[400px]">
          <h3 className="text-lg font-bold mb-6">Token Usage Trends</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: settings.theme === 'Dark' ? '#1f2937' : '#fff',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Line type="monotone" dataKey="tokens" stroke="#8884d8" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel p-6 rounded-2xl h-[400px]">
          <h3 className="text-lg font-bold mb-6">Model Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockModelUsage}>
               <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                 contentStyle={{ 
                  backgroundColor: settings.theme === 'Dark' ? '#1f2937' : '#fff',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Bar dataKey="value" fill="#82ca9d" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
