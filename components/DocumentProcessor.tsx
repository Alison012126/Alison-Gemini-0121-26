import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2, Play, Edit3, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { AppSettings } from '../types';
import { LABELS } from '../constants';
import { generateContent } from '../services/geminiService';

interface DocumentProcessorProps {
  settings: AppSettings;
  apiKey: string;
}

type InputMode = 'upload' | 'paste';
type DownloadFormat = 'markdown' | 'text';

const DocumentProcessor: React.FC<DocumentProcessorProps> = ({ settings, apiKey }) => {
  const t = (key: string) => LABELS[key] ? LABELS[key][settings.language] : key;
  
  const [mode, setMode] = useState<InputMode>('upload');
  
  // Upload State
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null); // For text based files
  
  // Paste State
  const [pastedText, setPastedText] = useState('');

  const [prompt, setPrompt] = useState('Analyze this document and summarize the key findings.');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>('markdown');
  const [fontSize, setFontSize] = useState(14);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(null);
      setFileContent(null);

      const isImage = selectedFile.type.startsWith('image/');
      const isText = selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.md') || selectedFile.name.endsWith('.txt');

      if (isImage) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(selectedFile);
      } else if (isText) {
        const reader = new FileReader();
        reader.onloadend = () => setFileContent(reader.result as string);
        reader.readAsText(selectedFile);
      } else {
        // PDF or others - read as Base64 for API, but no specific preview other than icon
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!apiKey) return;
    setLoading(true);
    setOutput('');

    try {
      let result = '';

      if (mode === 'paste') {
        // Text Only Analysis
        const fullPrompt = `Document Content:\n${pastedText}\n\nTask:\n${prompt}`;
        result = await generateContent(apiKey, 'gemini-3-flash-preview', fullPrompt);
      } else {
        // File Analysis
        if (!file) return;

        if (fileContent) {
           // It was a text file
           const fullPrompt = `Document Content:\n${fileContent}\n\nTask:\n${prompt}`;
           result = await generateContent(apiKey, 'gemini-3-flash-preview', fullPrompt);
        } else if (previewUrl) {
           // Image or PDF (Base64)
           const base64Data = previewUrl.split(',')[1];
           result = await generateContent(
            apiKey,
            'gemini-2.5-flash',
            prompt,
            'You are a document analyst.',
            { mimeType: file.type, data: base64Data }
           );
        }
      }

      setOutput(result);
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setFileContent(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document_analysis.${downloadFormat === 'markdown' ? 'md' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleZoomIn = () => setFontSize(prev => Math.min(prev + 2, 32));
  const handleZoomOut = () => setFontSize(prev => Math.max(prev - 2, 10));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[600px]">
      {/* Input Column */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200/20 pb-4">
           <h3 className="text-xl font-bold">{t('Documents')}</h3>
           <div className="flex bg-gray-200/50 dark:bg-black/30 p-1 rounded-lg">
             <button 
               onClick={() => setMode('upload')}
               className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mode === 'upload' ? 'bg-white dark:bg-gray-700 shadow' : 'opacity-60'}`}
             >
               Upload
             </button>
             <button 
               onClick={() => setMode('paste')}
               className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mode === 'paste' ? 'bg-white dark:bg-gray-700 shadow' : 'opacity-60'}`}
             >
               Paste Text
             </button>
           </div>
        </div>

        <div className="flex-1 flex flex-col min-h-[300px]">
          {mode === 'upload' ? (
            <div 
              className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                file ? 'border-green-500/50 bg-green-500/5' : 'border-gray-400/30 hover:border-blue-500/50 hover:bg-blue-500/5'
              }`}
            >
              {file ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                  <button 
                    onClick={clearFile}
                    className="absolute top-2 right-2 p-1 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors z-10"
                  >
                    <X size={16} />
                  </button>
                  
                  {file.type.startsWith('image/') && previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="max-h-[250px] object-contain rounded shadow-lg mb-4" />
                  ) : fileContent ? (
                    <div className="w-full h-full max-h-[250px] overflow-auto bg-white/50 dark:bg-black/50 p-2 text-xs font-mono rounded">
                      {fileContent}
                    </div>
                  ) : (
                    <FileText size={64} className="text-blue-500 mb-4" />
                  )}
                  
                  <p className="font-mono text-sm mt-2 text-center truncate max-w-[80%]">{file.name}</p>
                  <p className="text-xs opacity-60">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              ) : (
                <div 
                  className="text-center p-8 cursor-pointer w-full h-full flex flex-col items-center justify-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={48} className="opacity-50 mb-4" />
                  <p className="font-semibold">Click to Upload</p>
                  <p className="text-xs opacity-60 mt-2">TXT, MD, PDF, PNG, JPG</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".txt,.md,.pdf,image/*"
                onChange={handleFileChange}
              />
            </div>
          ) : (
             <textarea 
               className="flex-1 w-full p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
               placeholder="Paste your text or Markdown content here..."
               value={pastedText}
               onChange={(e) => setPastedText(e.target.value)}
             />
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 opacity-70">Analysis Prompt</label>
          <textarea 
            className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20 text-sm"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <button 
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
            (mode === 'upload' && !file) || (mode === 'paste' && !pastedText) || loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/25'
          }`}
          onClick={handleAnalyze}
          disabled={loading || (mode === 'upload' && !file) || (mode === 'paste' && !pastedText)}
        >
          {loading ? <Loader2 className="animate-spin" /> : <Play size={20} />}
          {loading ? 'Analyzing...' : 'Analyze Document'}
        </button>
      </div>

      {/* Results Column */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col relative overflow-hidden">
        <div className="flex flex-wrap justify-between items-center mb-4 border-b border-gray-200/20 pb-2 gap-2">
          <label className="flex items-center gap-2 text-sm font-semibold opacity-70">
            <Edit3 size={16} /> Markdown Editor
          </label>
          
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mr-2 border border-gray-200 dark:border-gray-700">
               <button onClick={handleZoomOut} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors" title="Zoom Out">
                 <ZoomOut size={14} />
               </button>
               <span className="text-xs w-8 text-center font-mono opacity-70">{fontSize}px</span>
               <button onClick={handleZoomIn} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors" title="Zoom In">
                 <ZoomIn size={14} />
               </button>
            </div>

            {output && (
              <>
                <select 
                  className="bg-gray-200 dark:bg-gray-800 border-none text-xs rounded px-2 py-1 outline-none cursor-pointer"
                  value={downloadFormat}
                  onChange={(e) => setDownloadFormat(e.target.value as DownloadFormat)}
                >
                  <option value="markdown">.md</option>
                  <option value="text">.txt</option>
                </select>
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors shadow"
                >
                  <Download size={12} /> Save
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="animate-pulse">Processing content...</p>
            </div>
          ) : (
            <textarea
              className="flex-1 w-full bg-transparent border border-gray-200/20 rounded-xl p-4 outline-none resize-none font-mono leading-relaxed focus:bg-white/10 dark:focus:bg-black/10 transition-colors"
              style={{ fontSize: `${fontSize}px` }}
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder="Analysis results will appear here. You can edit this text directly."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentProcessor;