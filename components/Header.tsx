import React from 'react';
import { Camera, Wand2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">智能证件照</h1>
            <p className="text-xs text-slate-500 font-medium">AI 驱动背景更换</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <span className="hidden sm:flex items-center gap-1">
            <Wand2 className="w-4 h-4 text-blue-500" />
            Gemini 2.5 Flash Image
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;