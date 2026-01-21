import React from 'react';
import { Agent, Language, PainterStyle } from './types';

export const PAINTERS: PainterStyle[] = [
  'Van Gogh', 'Monet', 'Picasso', 'Da Vinci', 'Rembrandt',
  'Matisse', 'Kandinsky', 'Hokusai', 'Yayoi Kusama', 'Frida Kahlo',
  'Salvador Dali', 'Rothko', 'Pollock', 'Chagall', 'Basquiat',
  'Haring', 'Georgia O\'Keeffe', 'Turner', 'Seurat', 'Escher'
];

export const MODELS = [
  "gemini-3-pro-preview",
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gpt-4o-mini",
  "claude-3-5-sonnet",
  "grok-beta"
];

// CSS styles for each painter to create the WOW effect
export const PAINTER_CSS: Record<PainterStyle, React.CSSProperties> = {
  'Van Gogh': {
    backgroundImage: 'linear-gradient(135deg, #1a237e 0%, #283593 40%, #fdd835 100%)',
    fontFamily: '"Playfair Display", serif',
  },
  'Monet': {
    backgroundImage: 'linear-gradient(to right top, #a8e063, #56ab2f)', // Simplified pastel
    background: 'radial-gradient(circle at 50% 50%, #e0f7fa, #80deea, #a5d6a7)',
    fontFamily: '"Inter", sans-serif',
  },
  'Picasso': {
    backgroundImage: 'conic-gradient(from 90deg at 50% 50%, #f44336 0%, #2196f3 33%, #ffeb3b 66%, #f44336 100%)',
    filter: 'contrast(1.1)',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  'Da Vinci': {
    backgroundColor: '#d7c4a1',
    backgroundImage: 'repeating-linear-gradient(45deg, #d7c4a1 0px, #d7c4a1 10px, #cbb085 10px, #cbb085 11px)',
    fontFamily: '"Cinzel", serif',
    color: '#3e2723',
  },
  'Rembrandt': {
    backgroundImage: 'radial-gradient(circle at 30% 30%, #5d4037, #3e2723, #000000)',
    fontFamily: '"Playfair Display", serif',
  },
  'Matisse': {
    backgroundColor: '#ff5722',
    backgroundImage: 'radial-gradient(circle at 20% 80%, #2196f3 20%, transparent 21%), radial-gradient(circle at 80% 20%, #ffeb3b 20%, transparent 21%)',
    backgroundSize: '100px 100px',
    fontFamily: '"Inter", sans-serif',
  },
  'Kandinsky': {
    backgroundColor: '#fff',
    backgroundImage: 'linear-gradient(45deg, rgba(255,0,0,0.2) 25%, transparent 25%, transparent 50%, rgba(255,0,0,0.2) 50%, rgba(255,0,0,0.2) 75%, transparent 75%, transparent), linear-gradient(-45deg, rgba(0,0,255,0.2) 25%, transparent 25%, transparent 50%, rgba(0,0,255,0.2) 50%, rgba(0,0,255,0.2) 75%, transparent 75%, transparent)',
    backgroundSize: '40px 40px',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  'Hokusai': {
    backgroundImage: 'linear-gradient(180deg, #e3f2fd 0%, #90caf9 30%, #1565c0 80%, #e0e0e0 100%)',
    fontFamily: '"Inter", sans-serif',
  },
  'Yayoi Kusama': {
    backgroundColor: '#ffff00',
    backgroundImage: 'radial-gradient(#000 20%, transparent 20%)',
    backgroundSize: '30px 30px',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  'Frida Kahlo': {
    backgroundImage: 'linear-gradient(to bottom right, #c62828, #388e3c, #fbc02d)',
    fontFamily: '"Playfair Display", serif',
  },
  'Salvador Dali': {
    backgroundImage: 'linear-gradient(to bottom, #ffecb3, #ffcc80, #ef6c00)',
    filter: 'saturate(1.2)',
    fontFamily: '"Cinzel", serif',
  },
  'Rothko': {
    backgroundImage: 'linear-gradient(to bottom, #b71c1c 0%, #b71c1c 40%, #ff9800 40%, #ff9800 70%, #212121 70%, #212121 100%)',
    fontFamily: '"Inter", sans-serif',
  },
  'Pollock': {
    backgroundColor: '#e0e0e0',
    backgroundImage: 'url("https://www.transparenttextures.com/patterns/splatter.png")', // Fallback or simulate noise
    filter: 'contrast(1.2)',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  'Chagall': {
    backgroundImage: 'linear-gradient(120deg, #3f51b5, #9c27b0, #009688)',
    fontFamily: '"Playfair Display", serif',
  },
  'Basquiat': {
    backgroundColor: '#212121',
    border: '4px solid #ffeb3b',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  'Haring': {
    backgroundColor: '#ffffff',
    backgroundImage: 'linear-gradient(90deg, #000 2px, transparent 2px), linear-gradient(#000 2px, transparent 2px)',
    backgroundSize: '40px 40px',
    border: '5px solid #000',
    fontFamily: '"Space Grotesk", sans-serif',
  },
  'Georgia O\'Keeffe': {
    backgroundImage: 'radial-gradient(ellipse at center, #fce4ec, #f8bbd0, #f48fb1)',
    fontFamily: '"Playfair Display", serif',
  },
  'Turner': {
    backgroundImage: 'linear-gradient(to right, #cfd9df 0%, #e2ebf0 100%)',
    filter: 'blur(0.5px) contrast(0.9)',
    fontFamily: '"Cinzel", serif',
  },
  'Seurat': {
    backgroundColor: '#fff',
    backgroundImage: 'radial-gradient(#9e9e9e 15%, transparent 16%)',
    backgroundSize: '4px 4px',
    fontFamily: '"Inter", sans-serif',
  },
  'Escher': {
    backgroundColor: '#eeeeee',
    backgroundImage: 'repeating-linear-gradient(45deg, #424242 0, #424242 1px, transparent 0, transparent 50%)',
    backgroundSize: '20px 20px',
    fontFamily: '"Space Grotesk", sans-serif',
  }
};

export const LABELS: Record<string, Record<Language, string>> = {
  'Dashboard': {
    [Language.ENGLISH]: 'Dashboard',
    [Language.TRADITIONAL_CHINESE]: '儀表板',
  },
  'Agents': {
    [Language.ENGLISH]: 'Agent Studio',
    [Language.TRADITIONAL_CHINESE]: '代理工作室',
  },
  'Documents': {
    [Language.ENGLISH]: 'Document Intelligence',
    [Language.TRADITIONAL_CHINESE]: '文件智慧',
  },
  'Reports': {
    [Language.ENGLISH]: 'Reports',
    [Language.TRADITIONAL_CHINESE]: '報告生成',
  },
  'Settings': {
    [Language.ENGLISH]: 'Settings',
    [Language.TRADITIONAL_CHINESE]: '設定',
  },
  'Run': {
    [Language.ENGLISH]: 'Run Agent',
    [Language.TRADITIONAL_CHINESE]: '執行代理',
  },
  'Input': {
    [Language.ENGLISH]: 'Input',
    [Language.TRADITIONAL_CHINESE]: '輸入內容',
  },
  'Output': {
    [Language.ENGLISH]: 'Output',
    [Language.TRADITIONAL_CHINESE]: '輸出結果',
  },
  'Jackpot': {
    [Language.ENGLISH]: 'Jackpot!',
    [Language.TRADITIONAL_CHINESE]: '手氣不錯！',
  },
  'Theme': {
    [Language.ENGLISH]: 'Theme',
    [Language.TRADITIONAL_CHINESE]: '主題',
  },
  'Language': {
    [Language.ENGLISH]: 'Language',
    [Language.TRADITIONAL_CHINESE]: '語言',
  },
  'Style': {
    [Language.ENGLISH]: 'Painter Style',
    [Language.TRADITIONAL_CHINESE]: '畫家風格',
  }
};

// 31 Agents (Subset for demo, structure matches spec)
export const AGENTS: Agent[] = [
  {
    id: 'fda_search_agent',
    name_en: 'FDA Search Agent',
    name_tc: 'FDA 510(k) 情資搜尋與綜合分析代理',
    category_tc: '510(k) 情資與背景分析',
    description_tc: '根據裝置名稱、510(k) 編號、申請人等資訊，彙整公開資料與指引，產出審查導向摘要。',
    model: 'gemini-3-flash-preview',
    default_temperature: 0.2
  },
  {
    id: 'pdf_to_markdown',
    name_en: 'PDF to Markdown',
    name_tc: 'PDF 轉 Markdown 結構化代理',
    category_tc: '文件轉換與清整',
    description_tc: '將 PDF 抽取的原始文字整理為可閱讀的 Markdown，保留標題階層與表格。',
    model: 'gemini-2.5-flash',
    default_temperature: 0.1
  },
  {
    id: 'review_memo_builder',
    name_en: 'Review Memo Builder',
    name_tc: '510(k) 審查備忘錄 / 報告生成代理',
    category_tc: '審查報告與備忘錄',
    description_tc: '依據 Checklist 與審查結果，生成正式風格的 510(k) 審查備忘錄。',
    model: 'gemini-3-pro-preview',
    default_temperature: 0.2
  },
  {
    id: 'risk_benefit',
    name_en: 'Risk-Benefit Balancer',
    name_tc: '效益–風險平衡敘述代理',
    category_tc: '風險與差距分析',
    description_tc: '根據風險與性能/效益資訊，撰寫效益–風險平衡敘述段落。',
    model: 'gpt-4o-mini',
    default_temperature: 0.25
  },
  {
    id: 'translation_agent',
    name_en: 'Translator',
    name_tc: '雙語翻譯與用語統一代理',
    category_tc: '語言與在地化',
    description_tc: '提供英語與繁體中文間的高品質翻譯，並統一專有名詞用語。',
    model: 'gemini-3-flash-preview',
    default_temperature: 0.2
  }
];