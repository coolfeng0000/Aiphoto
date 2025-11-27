
import React, { useState } from 'react';
import Header from './components/Header';
import UploadArea from './components/UploadArea';
import BackgroundSelector from './components/ColorSelector';
import ResultPreview from './components/ResultPreview';
import { changeImageBackground } from './services/geminiService';
import { BACKGROUND_OPTIONS } from './constants';
import { BackgroundConfig } from './types';
import { Sparkles, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  
  // State for background configuration
  const [selectedConfig, setSelectedConfig] = useState<BackgroundConfig>(BACKGROUND_OPTIONS[0]); // Default to White
  const [customBackground, setCustomBackground] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(!!process.env.API_KEY);

  const handleImageSelected = (base64: string) => {
    setOriginalImage(base64);
    setProcessedImage(null);
    setError(null);
    // Auto start processing with current configuration
    processImage(base64, selectedConfig, customBackground || undefined);
  };

  const handleBackgroundChange = (config: BackgroundConfig, customFile?: string) => {
    // If selecting custom, we update the custom file state
    if (config.type === 'custom' && customFile) {
      setCustomBackground(customFile);
    }
    
    // Check if we are actually changing something
    const isSameConfig = config.id === selectedConfig.id;
    const isSameCustomBg = config.type === 'custom' && customFile === customBackground;

    if (isSameConfig && (config.type !== 'custom' || isSameCustomBg)) {
      return; 
    }

    setSelectedConfig(config);
    
    // Trigger processing if we have an image
    if (originalImage) {
      processImage(originalImage, config, customFile || customBackground || undefined);
    }
  };

  const processImage = async (
    image: string, 
    config: BackgroundConfig, 
    customBg?: string
  ) => {
    if (!hasApiKey) return;
    
    setIsProcessing(true);
    setError(null);
    try {
      // Pass the custom background if the type is custom
      const bgToUse = config.type === 'custom' ? customBg : undefined;
      
      const result = await changeImageBackground(image, config, bgToUse);
      setProcessedImage(result);
    } catch (err: any) {
      setError(err.message || '处理图片时发生错误，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = `id-photo-${selectedConfig.id}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    setSelectedConfig(BACKGROUND_OPTIONS[0]);
    setCustomBackground(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasApiKey && (
           <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
             <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
             <div>
               <h3 className="font-semibold text-amber-800">未检测到 API Key</h3>
               <p className="text-sm text-amber-700 mt-1">
                 请确保在环境变量中配置了 <code>API_KEY</code>。此应用依赖 Gemini API 进行图像处理。
               </p>
             </div>
           </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Controls & Upload */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Context Header */}
            <div className="mb-2">
              <h2 className="text-2xl font-bold text-slate-900">制作专业证件照</h2>
              <p className="text-slate-500 mt-2 leading-relaxed">
                上传您的照片，AI 将自动识别人物并更换背景。支持纯色、渐变模板、自定义背景及自动抠图。
              </p>
            </div>

            {/* Upload Area (Visible when no image) */}
            {!originalImage && (
              <UploadArea onImageSelected={handleImageSelected} />
            )}

            {/* Controls (Visible when image exists) */}
            {originalImage && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fade-in-up">
                 <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-500" />
                      背景设置
                    </h3>
                    <BackgroundSelector 
                      selectedBackgroundId={selectedConfig.id}
                      onSelect={handleBackgroundChange}
                      disabled={isProcessing}
                      customImage={customBackground}
                    />
                 </div>
                 
                 {error && (
                   <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                     <AlertTriangle className="w-4 h-4 shrink-0" />
                     {error}
                   </div>
                 )}

                 <div className="pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => processImage(originalImage, selectedConfig, customBackground || undefined)}
                      disabled={isProcessing}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      {isProcessing ? '处理中...' : '重新生成'}
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-3">
                      基于 Google Gemini Vision 模型
                    </p>
                 </div>
              </div>
            )}

            {/* Tips Section */}
            {!originalImage && (
               <div className="grid grid-cols-3 gap-4">
                 {[
                   { title: '自动抠图', desc: '支持透明背景' },
                   { title: '多种模板', desc: '渐变/城市/办公' },
                   { title: '自定义', desc: '上传任意背景' },
                 ].map((item, i) => (
                   <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
                     <div className="font-semibold text-slate-800 text-sm">{item.title}</div>
                     <div className="text-xs text-slate-500 mt-1">{item.desc}</div>
                   </div>
                 ))}
               </div>
            )}
          </div>

          {/* Right Column: Preview Area */}
          <div className="lg:col-span-7">
            {originalImage ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
                <ResultPreview 
                  originalImage={originalImage}
                  processedImage={processedImage}
                  isProcessing={isProcessing}
                  onReset={handleReset}
                  onDownload={handleDownload}
                />
              </div>
            ) : (
              // Empty State Illustration
              <div className="hidden lg:flex h-full min-h-[500px] bg-slate-100/50 rounded-2xl border-2 border-dashed border-slate-200 items-center justify-center">
                <div className="text-center max-w-xs">
                  <div className="w-48 h-64 bg-slate-200 rounded-lg mx-auto mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-300/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-slate-300 rounded-full"></div>
                    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-20 h-20 bg-slate-300 rounded-full"></div>
                  </div>
                  <h3 className="text-slate-400 font-medium">效果预览区域</h3>
                  <p className="text-slate-400 text-sm mt-2">上传照片后，此处将显示处理前后的对比效果</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-slate-200 mt-auto bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} 智能证件照. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
