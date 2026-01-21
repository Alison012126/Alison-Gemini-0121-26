export enum Language {
  ENGLISH = 'English',
  TRADITIONAL_CHINESE = '繁體中文',
}

export enum Theme {
  LIGHT = 'Light',
  DARK = 'Dark',
}

export type PainterStyle = 
  | 'Van Gogh' | 'Monet' | 'Picasso' | 'Da Vinci' | 'Rembrandt'
  | 'Matisse' | 'Kandinsky' | 'Hokusai' | 'Yayoi Kusama' | 'Frida Kahlo'
  | 'Salvador Dali' | 'Rothko' | 'Pollock' | 'Chagall' | 'Basquiat'
  | 'Haring' | 'Georgia O\'Keeffe' | 'Turner' | 'Seurat' | 'Escher';

export interface Agent {
  id: string;
  name_en: string;
  name_tc: string;
  category_tc: string;
  description_tc: string;
  model: string;
  default_temperature: number;
}

export interface AppSettings {
  theme: Theme;
  language: Language;
  painterStyle: PainterStyle;
  defaultModel: string;
}

export interface RunHistoryItem {
  id: string;
  tab: string;
  agentName: string;
  model: string;
  timestamp: Date;
  tokens: number;
  status: 'running' | 'completed' | 'error';
}

export interface ChartDataPoint {
  name: string;
  value: number;
}
