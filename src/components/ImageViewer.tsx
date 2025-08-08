import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ImageViewerProps {
  imageSrc: string;
  fileName: string;
  onClose?: () => void;
  onSave?: (editedImageData: string) => void;
}

interface ViewerState {
  zoom: number;
  rotation: number;
  contrast: number;
  brightness: number;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageSrc, fileName, onClose, onSave }) => {
  const [viewerState, setViewerState] = useState<ViewerState>({
    zoom: 1,
    rotation: 0,
    contrast: 100,
    brightness: 100,
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);


  const handleZoom = useCallback((direction: 'in' | 'out') => {
    setViewerState(prev => ({
      ...prev,
      zoom: direction === 'in' 
        ? Math.min(prev.zoom * 1.2, 5) 
        : Math.max(prev.zoom / 1.2, 0.1)
    }));
  }, []);

  const handleRotate = useCallback(() => {
    setViewerState(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360
    }));
  }, []);

  const handleContrastChange = useCallback((value: number) => {
    setViewerState(prev => ({
      ...prev,
      contrast: value
    }));
  }, []);

  const handleBrightnessChange = useCallback((value: number) => {
    setViewerState(prev => ({
      ...prev,
      brightness: value
    }));
  }, []);

  const handleReset = useCallback(() => {
    setViewerState({
      zoom: 1,
      rotation: 0,
      contrast: 100,
      brightness: 100,
    });
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (viewerState.zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  }, [viewerState.zoom, panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && viewerState.zoom > 1) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart, viewerState.zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (viewerState.zoom > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ 
        x: e.touches[0].clientX - panOffset.x, 
        y: e.touches[0].clientY - panOffset.y 
      });
    }
  }, [viewerState.zoom, panOffset]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging && viewerState.zoom > 1 && e.touches.length === 1) {
      e.preventDefault();
      setPanOffset({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart, viewerState.zoom]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== document.body) return;
      
      switch (e.key) {
        case '+':
        case '=':
          e.preventDefault();
          handleZoom('in');
          break;
        case '-':
          e.preventDefault();
          handleZoom('out');
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleRotate();
          break;
        case '0':
          e.preventDefault();
          handleReset();
          break;
        case 'Escape':
          e.preventDefault();
          onClose?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleZoom, handleRotate, handleReset, onClose]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const handleSave = useCallback(() => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    
    const scaledWidth = img.naturalWidth * viewerState.zoom;
    const scaledHeight = img.naturalHeight * viewerState.zoom;
    
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    ctx.filter = `contrast(${viewerState.contrast}%) brightness(${viewerState.brightness}%)`;
    
    if (viewerState.rotation !== 0) {
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((viewerState.rotation * Math.PI) / 180);
      ctx.drawImage(img, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
      ctx.restore();
    } else {

      ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
    }
    const editedImageData = canvas.toDataURL('image/png');
    
    if (onSave) {
      onSave(editedImageData);
    }
  }, [viewerState.contrast, viewerState.brightness, viewerState.rotation, viewerState.zoom, onSave]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-7xl h-full max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Medical Image Viewer
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {fileName}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors duration-200"
            aria-label="Close viewer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        
        <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
          
          
          <div className="flex-1 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
            <div 
              ref={containerRef}
              className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onContextMenu={handleContextMenu}
            >
              {isImageError ? (
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Image Not Previewable
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    This file type cannot be previewed in the browser.
                  </p>
                </div>
              ) : (
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt={`Medical scan: ${fileName}`}
                  className={`max-w-none max-h-none object-contain transition-all duration-300 ${
                    isImageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    transform: `scale(${viewerState.zoom}) rotate(${viewerState.rotation}deg) translate(${panOffset.x / viewerState.zoom}px, ${panOffset.y / viewerState.zoom}px)`,
                    filter: `contrast(${viewerState.contrast}%) brightness(${viewerState.brightness}%)`,
                    maxWidth: 'none',
                    maxHeight: 'none',
                  }}
                  onLoad={() => setIsImageLoaded(true)}
                  onError={() => setIsImageError(true)}
                  draggable={false}
                />
              )}

              
              <div className="absolute inset-0 pointer-events-none z-10">
                
              </div>

              
              {!isImageLoaded && !isImageError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-slate-600 dark:text-slate-400">Loading image...</span>
                  </div>
                </div>
              )}
            </div>

            
            <div className="absolute bottom-4 left-4 right-4 lg:right-auto lg:w-80">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <div className="flex items-start">
                  <svg className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    This viewer is for visual assistance only. Your scan is displayed locally and never stored.
                  </p>
                </div>
              </div>
            </div>
          </div>

          
          <div className="lg:w-80 bg-slate-50 dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 p-6 overflow-y-auto max-h-full">
            
            
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                Zoom Controls
              </h3>
              
              <div className="flex items-center space-x-3 mb-4">
                <button
                  onClick={() => handleZoom('out')}
                  className="w-12 h-12 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:scale-103"
                  aria-label="Zoom out"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </button>
                
                <div className="flex-1 text-center">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {Math.round(viewerState.zoom * 100)}%
                  </span>
                </div>
                
                <button
                  onClick={() => handleZoom('in')}
                  className="w-12 h-12 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:scale-103"
                  aria-label="Zoom in"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10v4m0 0h4m-4 0H6" />
                  </svg>
                </button>
              </div>
            </div>

            
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Rotation
              </h3>
              
              <button
                onClick={handleRotate}
                className="w-full h-12 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:scale-103"
                aria-label="Rotate 90 degrees"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Rotate ({viewerState.rotation}°)
              </button>
            </div>

            
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
                Contrast
              </h3>
              
              <input
                type="range"
                min="50"
                max="200"
                value={viewerState.contrast}
                onChange={(e) => handleContrastChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>50%</span>
                <span>{viewerState.contrast}%</span>
                <span>200%</span>
              </div>
            </div>

            
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Brightness
              </h3>
              
              <input
                type="range"
                min="50"
                max="200"
                value={viewerState.brightness}
                onChange={(e) => handleBrightnessChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>50%</span>
                <span>{viewerState.brightness}%</span>
                <span>200%</span>
              </div>
            </div>

            
            <div className="mb-6">
              <button
                onClick={handleReset}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-103 flex items-center justify-center"
                aria-label="Reset all controls"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset All
              </button>
            </div>

            
            <div className="mb-6">
              <button
                onClick={handleSave}
                className="w-full h-12 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-103 flex items-center justify-center"
                aria-label="Save edited image"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Image
              </button>
            </div>

            
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <h4 className="font-medium mb-2">Keyboard Shortcuts:</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Zoom In:</span>
                  <span className="font-mono">+ / =</span>
                </div>
                <div className="flex justify-between">
                  <span>Zoom Out:</span>
                  <span className="font-mono">-</span>
                </div>
                <div className="flex justify-between">
                  <span>Rotate:</span>
                  <span className="font-mono">R</span>
                </div>
                <div className="flex justify-between">
                  <span>Reset:</span>
                  <span className="font-mono">0</span>
                </div>
                <div className="flex justify-between">
                  <span>Close:</span>
                  <span className="font-mono">Esc</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer; 