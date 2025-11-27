import React from 'react';

export type BackgroundType = 'solid' | 'template' | 'custom' | 'transparent';

export interface BackgroundConfig {
  id: string;
  type: BackgroundType;
  name: string;
  value: string; // Hex for solid, description for template
  previewStyle?: React.CSSProperties; // For rendering the button preview
  category: 'standard' | 'color' | 'creative';
}

export interface ProcessingState {
  isProcessing: boolean;
  error: string | null;
}

export type IDPhotoSize = {
  width: number;
  height: number;
  name: string;
};