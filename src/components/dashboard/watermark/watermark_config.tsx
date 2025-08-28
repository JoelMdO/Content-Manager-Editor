//==========================================
// Original Code (Preserved for Reference)
//==========================================
// This is a new file for watermark UI component

'use client';

import React, { useState, useRef } from 'react';

//------------------------------------------
// Purpose: React component for watermark configuration and preview
// Provides user interface for AI watermark customization
//------------------------------------------

interface WatermarkConfigProps {
  onConfigChange: (config: WatermarkConfig) => void;
  initialConfig?: Partial<WatermarkConfig>;
  disabled?: boolean;
}

interface WatermarkConfig {
  enabled: boolean;
  type: 'text' | 'logo';
  text: string;
  fontSize: number;
  color: string;
  opacity: number;
  logoFile?: File;
}

const WatermarkConfig: React.FC<WatermarkConfigProps> = ({
  onConfigChange,
  initialConfig = {},
  disabled = false
}) => {
  const [config, setConfig] = useState<WatermarkConfig>({
    enabled: initialConfig.enabled ?? false,
    type: initialConfig.type ?? 'text',
    text: initialConfig.text ?? 'Sample Watermark',
    fontSize: initialConfig.fontSize ?? 48,
    color: initialConfig.color ?? '#ffffff',
    opacity: initialConfig.opacity ?? 0.3,
    logoFile: initialConfig.logoFile
  });

  const logoInputRef = useRef<HTMLInputElement>(null);

  //------------------------------------------
  // Purpose: Update configuration and notify parent component
  //------------------------------------------
  const updateConfig = (updates: Partial<WatermarkConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  //------------------------------------------
  // Purpose: Handle logo file selection
  //------------------------------------------
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Logo file must be smaller than 5MB');
        return;
      }

      updateConfig({ logoFile: file });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">AI Watermark Configuration</h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => updateConfig({ enabled: e.target.checked })}
            disabled={disabled}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">Enable Watermark</span>
        </label>
      </div>

      {config.enabled && (
        <div className="space-y-4">
          {/* Watermark Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Watermark Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="text"
                  checked={config.type === 'text'}
                  onChange={(e) => updateConfig({ type: e.target.value as 'text' | 'logo' })}
                  disabled={disabled}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">Text</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="logo"
                  checked={config.type === 'logo'}
                  onChange={(e) => updateConfig({ type: e.target.value as 'text' | 'logo' })}
                  disabled={disabled}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">Logo</span>
              </label>
            </div>
          </div>

          {/* Text Watermark Options */}
          {config.type === 'text' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={config.text}
                  onChange={(e) => updateConfig({ text: e.target.value })}
                  disabled={disabled}
                  placeholder="Enter watermark text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Font Size
                  </label>
                  <input
                    type="range"
                    min="24"
                    max="72"
                    value={config.fontSize}
                    onChange={(e) => updateConfig({ fontSize: parseInt(e.target.value) })}
                    disabled={disabled}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">{config.fontSize}px</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={config.color}
                    onChange={(e) => updateConfig({ color: e.target.value })}
                    disabled={disabled}
                    className="w-full h-10 rounded border border-gray-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Logo Watermark Options */}
          {config.type === 'logo' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo File
              </label>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {config.logoFile && (
                <p className="text-xs text-gray-500 mt-1">
                  Selected: {config.logoFile.name}
                </p>
              )}
            </div>
          )}

          {/* Common Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opacity
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={config.opacity}
              onChange={(e) => updateConfig({ opacity: parseFloat(e.target.value) })}
              disabled={disabled}
              className="w-full"
            />
            <span className="text-xs text-gray-500">{Math.round(config.opacity * 100)}%</span>
          </div>

          {/* AI Features Info */}
          <div className="bg-blue-50 p-3 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>AI Features:</strong> Our system automatically analyzes your image to find the optimal watermark position and adjusts opacity based on image complexity for maximum visibility without compromising the image quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatermarkConfig;