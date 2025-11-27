import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface UploadAreaProps {
  onImageSelected: (base64: string) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件 (JPG, PNG)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('图片大小不能超过 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        onImageSelected(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
      // Reset value so selecting the same file again works
      e.target.value = '';
    }
  };

  return (
    <div 
      className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out p-12 text-center
        ${isDragging 
          ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' 
          : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleChange}
        accept="image/png, image/jpeg, image/jpg"
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-blue-100' : 'bg-slate-100 group-hover:bg-blue-50'}`}>
          <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">点击或拖拽上传照片</h3>
          <p className="text-slate-500 mt-1 text-sm">支持 JPG, PNG (最大 5MB)</p>
          <p className="text-slate-400 text-xs mt-2">建议上传正面、光线均匀的人像照片</p>
        </div>
      </div>

      {error && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-1 rounded-full animate-fade-in">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
};

export default UploadArea;