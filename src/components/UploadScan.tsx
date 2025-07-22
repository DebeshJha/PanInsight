import React, { useState, useRef, useCallback, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../theme/ThemeContext';
import ImageViewer from './ImageViewer';
import ThemeToggle from './ThemeToggle';

interface UploadScanProps {
  onAnalyze?: (file: File) => void;
}

interface FileInfo {
  file: File;
  preview?: string;
  size: string;
}

const UploadScan: React.FC<UploadScanProps> = ({ onAnalyze }) => {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const acceptedTypes = ['.dcm', '.nii', '.nii.gz', '.nrrd'];
  const acceptedMimeTypes = [
    'application/dicom',
    'application/octet-stream',
    'application/x-nifti',
    'application/gzip',
    'application/x-nrrd',
    'application/nii',
    'application/nii.gz',
    'application/nrrd',
  ];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): boolean => {
    const isValidType = acceptedTypes.some(type => 
      file.name.toLowerCase().endsWith(type)
    ) || acceptedMimeTypes.includes(file.type);
    
    const isValidSize = file.size <= 50 * 1024 * 1024;
    
    return isValidType && isValidSize;
  };

  const createFilePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.name.toLowerCase().endsWith('.dcm')) {
        resolve(undefined);
      } else if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const handleFileSelect = useCallback(async (file: File) => {
    if (!validateFile(file)) {
      alert('Please select a valid medical image file (.dcm, .nii, .nii.gz, .nrrd) under 50MB.');
      return;
    }

    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 1000);

    const preview = await createFilePreview(file);
    setFileInfo({
      file,
      preview,
      size: formatFileSize(file.size)
    });
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter <= 1) {
      setIsDragOver(false);
    }
  }, [dragCounter]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!fileInfo || !hasConsent) return;

    setIsAnalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate sample report data
      const sampleReportData = {
        scanType: fileInfo.file.name.toLowerCase().endsWith('.dcm') ? 'DICOM CT Scan' : 'Medical Image',
        analysisDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        confidence: Math.floor(Math.random() * 30) + 70, // 70-99%
        findings: [
          "No significant abnormalities detected in the pancreatic region",
          "Normal pancreatic tissue density and structure observed",
          "Vascular structures appear within normal limits",
          "No evidence of mass lesions or calcifications",
          "Pancreatic duct appears normal in caliber"
        ],
        recommendations: [
          "Continue routine monitoring as recommended by your healthcare provider",
          "Maintain healthy lifestyle habits including balanced diet and regular exercise",
          "Schedule follow-up imaging in 6-12 months as per standard protocols",
          "Consider annual screening if you have family history of pancreatic conditions",
          "Report any new symptoms to your healthcare provider promptly"
        ],
        riskLevel: 'Low' as const,
        nextSteps: [
          "Share this report with your primary care physician",
          "Schedule follow-up appointment within 3-6 months",
          "Maintain regular health check-ups",
          "Monitor for any new symptoms or changes",
          "Consider genetic counseling if family history is present"
        ],
        followUpTimeline: "Recommended follow-up in 6-12 months with repeat imaging and consultation with your healthcare provider."
      };
      
      // Store report data in localStorage and navigate to report page
      localStorage.setItem('paninsight-report', JSON.stringify(sampleReportData));
      navigate('/report', { state: { reportData: sampleReportData } });
      
      if (onAnalyze) {
        onAnalyze(fileInfo.file);
      }
    } catch (error) {
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFileInfo(null);
    setHasConsent(false);
    setIsAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveImage = (editedImageData: string) => {
    if (fileInfo) {
      setFileInfo({
        ...fileInfo,
        preview: editedImageData
      });
    }
    
    alert('Image saved successfully! Your edited image has been updated.');
    
    setShowViewer(false);
  };

  const { isDark, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('paninsight-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('paninsight-theme', 'light');
    }
  }, [isDark]);

  const canAnalyze = fileInfo && hasConsent && !isAnalyzing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      
      <div className="relative max-w-6xl mx-auto px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group inline-flex items-center px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-full text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent sm:text-5xl lg:text-6xl mb-6">
            Upload Medical Scan
          </h1>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-4">
              Upload your CT/MRI scans for AI-powered analysis with advanced medical imaging technology
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm text-blue-700 dark:text-blue-300">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Secure Upload
              </div>
              <div className="flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm text-purple-700 dark:text-purple-300">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                AI Analysis
              </div>
              <div className="flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-sm text-green-700 dark:text-green-300">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Privacy First
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-700/50 rounded-2xl backdrop-blur-sm shadow-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                Privacy & Security First
              </h3>
              <p className="mt-2 text-blue-700 dark:text-blue-300">
                We respect your privacy. Your scan will be analyzed only with your consent and never stored without approval. All data is encrypted and processed securely.
              </p>
            </div>
          </div>
        </div>

        <div className={`grid gap-8 ${fileInfo ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
          <div className={`space-y-6 ${fileInfo ? 'lg:col-span-1' : 'lg:col-span-1'}`}>
            <div
              className={`relative border-2 border-dashed rounded-2xl text-center transition-all duration-500 transform hover:scale-105 ${
                isDragOver
                  ? 'p-8 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-2xl scale-105'
                  : 'p-8 border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm shadow-lg'
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="mb-6">
                <div className={`mx-auto bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 transform hover:scale-110 ${
                  isPulsing ? 'animate-ping' : 'animate-pulse'
                } w-20 h-20`}>
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-xl">
                  {isDragOver ? 'Drop your file here' : 'Drag & drop your scan here'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-base">
                  or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors duration-200 underline decoration-2 underline-offset-4"
                  >
                    browse files
                  </button>
                </p>
                <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 dark:text-slate-500 mt-4">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">.dcm</span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">.nii</span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">.nii.gz</span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">.nrrd</span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">max 50MB</span>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".dcm,.nii,.nii.gz,.nrrd"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>

            <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200/50 dark:border-amber-700/50 rounded-2xl backdrop-blur-sm shadow-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-800/50 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200">
                    Medical Disclaimer
                  </h3>
                  <p className="mt-2 text-amber-700 dark:text-amber-300">
                    Do not upload images with personal data unless you have permission. This is not a replacement for professional medical advice.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`space-y-6 ${fileInfo ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
            {fileInfo && (
              <div className="bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-700/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-slate-200/50 dark:border-slate-600/50">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Selected File
                </h3>
                
                <div className="space-y-3">
                  {fileInfo.preview ? (
                    <div className="w-48 h-48 bg-white dark:bg-slate-700 rounded-lg overflow-hidden shadow-md relative group mx-auto">
                      <img
                        src={fileInfo.preview}
                        alt="File preview"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-2">
                        <button
                          onClick={() => setShowViewer(true)}
                          className="text-white text-xs font-medium"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-48 h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center shadow-md mx-auto">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          {fileInfo.file.name.toLowerCase().endsWith('.dcm') ? 'DICOM' : 'Image'}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Name:</span>
                      <span className="text-xs text-slate-900 dark:text-white font-semibold truncate ml-2 max-w-32">
                        {fileInfo.file.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Size:</span>
                      <span className="text-xs text-slate-900 dark:text-white font-semibold">
                        {fileInfo.size}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Type:</span>
                      <span className="text-xs text-slate-900 dark:text-white font-semibold">
                        {fileInfo.file.name.split('.').pop()?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-700/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200/50 dark:border-slate-600/50">
              <div className="flex items-start">
                <input
                  id="consent"
                  type="checkbox"
                  checked={hasConsent}
                  onChange={(e) => setHasConsent(e.target.checked)}
                  className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-500 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2 transition-all duration-200"
                />
                <label htmlFor="consent" className="ml-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  I give consent to analyze this scan with PanInsight AI. I understand that this analysis is for informational purposes only and should not replace professional medical advice.
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                  canAnalyze
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                }`}
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing with AI...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Analyze with AI
                  </div>
                )}
              </button>

              <button
                onClick={handleReset}
                className="w-full py-4 px-6 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {showViewer && fileInfo && (
        <ImageViewer
          imageSrc={fileInfo.preview || ''}
          fileName={fileInfo.file.name}
          onClose={() => setShowViewer(false)}
          onSave={handleSaveImage}
        />
      )}

      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

    </div>
  );
};

export default UploadScan; 