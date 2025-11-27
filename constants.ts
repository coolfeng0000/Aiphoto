
import { BackgroundConfig, IDPhotoSize } from './types';

export const BACKGROUND_OPTIONS: BackgroundConfig[] = [
  // Standard Solids
  { 
    id: 'white', 
    type: 'solid', 
    name: '纯白', 
    value: '#FFFFFF', 
    category: 'standard',
    previewStyle: { backgroundColor: '#FFFFFF', border: '1px solid #e2e8f0' }
  },
  { 
    id: 'transparent', 
    type: 'transparent', 
    name: '透明/抠图', 
    value: 'transparent', 
    category: 'standard',
    previewStyle: { 
      backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
      backgroundSize: '10px 10px',
      backgroundColor: '#fff',
      backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
    }
  },
  { 
    id: 'blue', 
    type: 'solid', 
    name: '标准蓝', 
    value: '#438EDB', 
    category: 'standard',
    previewStyle: { backgroundColor: '#438EDB' }
  },
  { 
    id: 'red', 
    type: 'solid', 
    name: '标准红', 
    value: '#D9001B', 
    category: 'standard',
    previewStyle: { backgroundColor: '#D9001B' }
  },
  { 
    id: 'gray', 
    type: 'solid', 
    name: '标准灰', 
    value: '#808080', 
    category: 'standard',
    previewStyle: { backgroundColor: '#808080' }
  },

  // Templates
  { 
    id: 'grad-blue', 
    type: 'template', 
    name: '渐变蓝', 
    value: 'a professional gradient blue studio background', 
    category: 'creative',
    previewStyle: { background: 'linear-gradient(180deg, #66B3FF 0%, #438EDB 100%)' }
  },
  { 
    id: 'grad-gray', 
    type: 'template', 
    name: '渐变灰', 
    value: 'a professional gradient gray studio background', 
    category: 'creative',
    previewStyle: { background: 'linear-gradient(180deg, #f1f5f9 0%, #94a3b8 100%)' }
  },
  { 
    id: 'office', 
    type: 'template', 
    name: '模糊办公', 
    value: 'a blurred modern bright office background', 
    category: 'creative',
    previewStyle: { background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',  } // Simplified preview
  },
  { 
    id: 'city', 
    type: 'template', 
    name: '城市剪影', 
    value: 'a blurred city skyline background during daytime', 
    category: 'creative',
    previewStyle: { background: 'linear-gradient(to bottom, #bae6fd 0%, #e2e8f0 100%)' }
  },
];

export const COMMON_SIZES: IDPhotoSize[] = [
  { name: '一寸 (25mm x 35mm)', width: 295, height: 413 },
  { name: '二寸 (35mm x 49mm)', width: 413, height: 579 },
  { name: '小二寸 (35mm x 45mm)', width: 413, height: 531 },
];
