
import React, { useRef } from 'react';
import { Check, Upload, Image as ImageIcon, Layers, Palette } from 'lucide-react';
import { BackgroundConfig } from '../types';
import { BACKGROUND_OPTIONS } from '../constants';

interface BackgroundSelectorProps {
  selectedBackgroundId: string;
  onSelect: (config: BackgroundConfig, customFileBase64?: string) => void;
  disabled: boolean;
  customImage: string | null;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ 
  selectedBackgroundId, 
  onSelect, 
  disabled,
  customImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          // Create a temporary custom config
          const customConfig: BackgroundConfig = {
            id: 'custom-upload',
            type: 'custom',
            name: '自定义背景',
            value: 'custom',
            category: 'creative'
          };
          onSelect(customConfig, event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderOption = (option: BackgroundConfig) => {
    const isSelected = selectedBackgroundId === option.id;
    return (
      <button
        key={option.id}
        disabled={disabled}
        onClick={() => onSelect(option)}
        className={`
          group relative aspect-square rounded-xl overflow-hidden border transition-all duration-200
          ${isSelected ? 'ring-2 ring-offset-2 ring-blue-600 border-blue-600 shadow-md' : 'border-slate-200 hover:border-blue-300 hover:shadow-sm'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        title={option.name}
      >
        <div className="w-full h-full" style={option.previewStyle} />
        
        {/* Selection Indicator */}
        <div className={`
          absolute inset-0 flex items-center justify-center transition-all duration-200
          ${isSelected ? 'bg-black/10' : 'bg-transparent group-hover:bg-black/5'}
        `}>
          {isSelected && (
            <div className="bg-white rounded-full p-1 shadow-sm">
              <Check className="w-3 h-3 text-blue-600" />
            </div>
          )}
        </div>
        
        <span className="absolute bottom-0 left-0 right-0 bg-white/90 text-[10px] text-center py-1 font-medium text-slate-600 truncate px-1 backdrop-blur-sm">
          {option.name}
        </span>
      </button>
    );
  };

  const standardOptions = BACKGROUND_OPTIONS.filter(o => o.category === 'standard');
  const creativeOptions = BACKGROUND_OPTIONS.filter(o => o.category === 'creative');

  return (
    <div className="space-y-6">
      
      {/* Section 1: Standard Colors & Transparency */}
      <div>
        <label className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-blue-500" />
          标准底色 & 抠图
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {standardOptions.map(renderOption)}
        </div>
      </div>

      {/* Section 2: Creative Templates */}
      <div>
        <label className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-purple-500" />
          高级背景模板
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {creativeOptions.map(renderOption)}
        </div>
      </div>

      {/* Section 3: Custom Upload */}
      <div>
        <label className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-3">
          <ImageIcon className="w-4 h-4 text-green-500" />
          自定义背景
        </label>
        
        <div 
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`
            relative rounded-xl border-2 border-dashed transition-all duration-200 flex items-center justify-center gap-3 p-4
            ${selectedBackgroundId === 'custom-upload' 
              ? 'border-blue-500 bg-blue-50/50' 
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50 cursor-pointer'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            disabled={disabled}
            onChange={handleFileUpload}
          />

          {customImage ? (
             <div className="flex items-center gap-3 w-full">
                <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                  <img src={customImage} alt="Custom bg" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">已上传背景图</p>
                  <p className="text-xs text-slate-500">点击更换</p>
                </div>
                {selectedBackgroundId === 'custom-upload' && <Check className="w-5 h-5 text-blue-500 shrink-0" />}
             </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Upload className="w-5 h-5 text-slate-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-700">上传背景图</p>
                <p className="text-xs text-slate-400">支持 JPG/PNG</p>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default BackgroundSelector;
