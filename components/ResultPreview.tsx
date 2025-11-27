import React from 'react';
import { Download, RefreshCw, X } from 'lucide-react';

interface ResultPreviewProps {
  originalImage: string;
  processedImage: string | null;
  isProcessing: boolean;
  onReset: () => void;
  onDownload: () => void;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ 
  originalImage, 
  processedImage, 
  isProcessing, 
  onReset,
  onDownload 
}) => {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Images Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Original */}
        <div className="relative group rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm aspect-[3/4]">
          <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-md z-10">
            原图
          </div>
          <img 
            src={originalImage} 
            alt="Original" 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onReset}
            className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full text-slate-600 hover:text-red-500 hover:bg-white shadow-sm transition-all md:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Processed / Loading */}
        <div className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm aspect-[3/4] flex items-center justify-center">
           <div className="absolute top-3 left-3 bg-blue-600/90 text-white text-xs px-2 py-1 rounded backdrop-blur-md z-10 shadow-sm">
            效果预览
          </div>

          {isProcessing ? (
            <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="relative mb-4">
                <div className="w-12 h-12 rounded-full border-4 border-slate-200"></div>
                <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
              </div>
              <h3 className="text-slate-800 font-medium mb-1">AI 正在处理中...</h3>
              <p className="text-slate-500 text-sm">正在精准抠图并替换背景</p>
            </div>
          ) : processedImage ? (
            <img 
              src={processedImage} 
              alt="Processed" 
              className="w-full h-full object-cover animate-fade-in"
            />
          ) : (
            <div className="text-slate-400 text-sm px-8 text-center">
              等待生成...
            </div>
          )}
        </div>
      </div>

      {/* Action Bar - Desktop */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          重新上传
        </button>

        {processedImage && !isProcessing && (
           <button
            onClick={onDownload}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            下载高清照片
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultPreview;