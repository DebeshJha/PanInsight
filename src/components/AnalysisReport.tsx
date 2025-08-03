import React, { useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../theme/ThemeContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PancreasIcon from '../assets/pancreas-icon.png';
import ThemeToggle from './ThemeToggle';

interface ReportData {
  scanType: string;
  analysisDate: string;
  confidence: number;
  findings: string[];
  recommendations: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  nextSteps: string[];
  followUpTimeline: string;
}

const AnalysisReport: React.FC = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'findings' | 'recommendations' | 'next-steps'>('overview');
  const [reportData, setReportData] = React.useState<ReportData | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'findings', label: 'AI Findings', icon: '🔍' },
    { id: 'recommendations', label: 'Recommendations', icon: '💡' },
    { id: 'next-steps', label: 'Next Steps', icon: '🎯' }
  ];

  useEffect(() => {
    
    const data = location.state?.reportData || JSON.parse(localStorage.getItem('paninsight-report') || 'null');
    if (data) {
      setReportData(data);
    } else {
      
      navigate('/upload');
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'High':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 dark:text-green-400';
    if (confidence >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  
  const getBase64Image = (imgUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No canvas context');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = imgUrl;
    });
  };

  const handleDownloadPDF = async () => {
    if (!reportData) return;
    const doc = new jsPDF();
    
    try {
      const logoBase64 = await getBase64Image(PancreasIcon);
      doc.addImage(logoBase64, 'PNG', 10, 10, 20, 20);
    } catch (e) {
      
    }
    doc.setFontSize(18);
    doc.text('PanInsight AI Analysis Report', 35, 20);
    doc.setFontSize(11);
    doc.text('PanInsight is an advanced AI-powered platform for early detection and analysis of pancreatic conditions.\nThis report provides actionable insights and recommendations based on your medical scan.', 10, 35);
    doc.setFontSize(10);
    doc.text('AI Model Creator: Debesh Jha', 10, 47);
    doc.setLineWidth(0.5);
    doc.line(10, 50, 200, 50);
    
    doc.setFontSize(13);
    doc.text('Overview', 10, 58);
    doc.setFontSize(10);
    doc.text(`Scan Type: ${reportData.scanType}`, 10, 65);
    doc.text(`Analysis Date: ${reportData.analysisDate}`, 10, 71);
    doc.text(`Confidence: ${reportData.confidence}%`, 10, 77);
    doc.text(`Risk Level: ${reportData.riskLevel}`, 10, 83);
    
    doc.setFontSize(13);
    doc.text('Findings', 10, 93);
    autoTable(doc, {
      startY: 96,
      head: [['#', 'Finding']],
      body: reportData.findings.map((f, i) => [i + 1, f]),
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 },
    });
    let nextY = (doc as any).lastAutoTable.finalY + 6;
    
    doc.setFontSize(13);
    doc.text('Recommendations', 10, nextY);
    nextY += 3;
    autoTable(doc, {
      startY: nextY,
      head: [['#', 'Recommendation']],
      body: reportData.recommendations.map((r, i) => [i + 1, r]),
      theme: 'striped',
      headStyles: { fillColor: [142, 68, 173] },
      styles: { fontSize: 10 },
    });
    nextY = (doc as any).lastAutoTable.finalY + 6;
    
    doc.setFontSize(13);
    doc.text('Next Steps', 10, nextY);
    nextY += 3;
    autoTable(doc, {
      startY: nextY,
      head: [['#', 'Next Step']],
      body: reportData.nextSteps.map((s, i) => [i + 1, s]),
      theme: 'striped',
      headStyles: { fillColor: [39, 174, 96] },
      styles: { fontSize: 10 },
    });
    nextY = (doc as any).lastAutoTable.finalY + 6;
  
    doc.setFontSize(13);
    doc.text('Follow-up Timeline', 10, nextY);
    doc.setFontSize(10);
    doc.text(reportData.followUpTimeline, 10, nextY + 7);
    doc.save('PanInsight-Report.pdf');
  };

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      
      <div className="relative max-w-7xl mx-auto px-4 pt-8 sm:px-6 lg:px-8 pb-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Link
              to="/upload"
              className="group inline-flex items-center px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-full text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:shadow-lg hover:scale-103"
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Upload
            </Link>
            <Link
              to="/"
              className="group inline-flex items-center px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-full text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:shadow-lg hover:scale-103"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-103"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Login
            </Link>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent sm:text-5xl lg:text-6xl mb-4">
            AI Analysis Report
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Receive detailed reports with actionable insights and recommendations from our advanced AI algorithms
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-103 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700/80 border border-slate-200/50 dark:border-slate-700/50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-600/50 p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">Scan Type</h3>
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{reportData.scanType}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-6 border border-green-200/50 dark:border-green-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-green-700 dark:text-green-300">Confidence</h3>
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className={`text-2xl font-bold ${getConfidenceColor(reportData.confidence)}`}>
                    {reportData.confidence}%
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-6 border border-purple-200/50 dark:border-purple-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">Risk Level</h3>
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getRiskLevelColor(reportData.riskLevel)}`}>
                    {reportData.riskLevel} Risk
                  </span>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl p-6 border border-amber-200/50 dark:border-amber-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-amber-700 dark:text-amber-300">Analysis Date</h3>
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-amber-900 dark:text-amber-100">{reportData.analysisDate}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/30 rounded-xl p-6 border border-slate-200/50 dark:border-slate-600/50">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Summary
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Our advanced AI algorithms have analyzed your medical scan for early detection indicators. 
                  The analysis shows a <span className="font-semibold">{reportData.riskLevel.toLowerCase()}</span> risk level 
                  with <span className="font-semibold">{reportData.confidence}%</span> confidence. 
                  Based on the findings, we've provided specific recommendations and next steps for your healthcare provider.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'findings' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                AI Analysis Findings
              </h3>
              
              <div className="grid gap-4">
                {reportData.findings.map((finding, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center mr-4">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{finding}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Actionable Recommendations
              </h3>
              
              <div className="grid gap-4">
                {reportData.recommendations.map((recommendation, index) => (
                  <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200/50 dark:border-purple-700/50">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-800/50 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{recommendation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'next-steps' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Next Steps & Timeline
              </h3>
              
              <div className="grid gap-4">
                {reportData.nextSteps.map((step, index) => (
                  <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200/50 dark:border-green-700/50">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center mr-4">
                        <span className="text-green-600 dark:text-green-400 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{step}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl p-6 border border-amber-200/50 dark:border-amber-700/50">
                <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Follow-up Timeline
                </h4>
                <p className="text-amber-700 dark:text-amber-300">{reportData.followUpTimeline}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <button
            onClick={() => {
              if (!reportData) return;
              const printWindow = window.open('', '_blank');
              if (!printWindow) return;
              printWindow.document.write(`
                <html>
                  <head>
                    <title>PanInsight AI Analysis Report</title>
                    <style>
                      body { font-family: Arial, sans-serif; margin: 40px; color: #222; }
                      .logo { width: 60px; height: 60px; margin-bottom: 10px; }
                      .header { display: flex; align-items: center; gap: 16px; }
                      .title { font-size: 2rem; font-weight: bold; margin-bottom: 0; }
                      .intro { font-size: 1rem; margin-bottom: 10px; }
                      .section { margin-top: 24px; }
                      .section-title { font-size: 1.2rem; font-weight: bold; margin-bottom: 8px; }
                      table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
                      th, td { border: 1px solid #bbb; padding: 8px; text-align: left; }
                      th { background: #e3e8f0; }
                      .footer { margin-top: 32px; font-size: 0.95rem; color: #555; }
                    </style>
                  </head>
                  <body>
                    <div class="header">
                      <img src="${PancreasIcon}" class="logo" alt="PanInsight Logo" />
                      <div>
                        <div class="title">PanInsight AI Analysis Report</div>
                        <div class="intro">PanInsight is an advanced AI-powered platform for early detection and analysis of pancreatic conditions.<br/>This report provides actionable insights and recommendations based on your medical scan.</div>
                        <div style="font-size:0.95rem; color:#666;">AI Model Creator: Debesh Jha</div>
                      </div>
                    </div>
                    <hr/>
                    <div class="section">
                      <div class="section-title">Overview</div>
                      <div>Scan Type: <b>${reportData.scanType}</b></div>
                      <div>Analysis Date: <b>${reportData.analysisDate}</b></div>
                      <div>Confidence: <b>${reportData.confidence}%</b></div>
                      <div>Risk Level: <b>${reportData.riskLevel}</b></div>
                    </div>
                    <div class="section">
                      <div class="section-title">Findings</div>
                      <table><thead><tr><th>#</th><th>Finding</th></tr></thead><tbody>
                        ${reportData.findings.map((f, i) => `<tr><td>${i + 1}</td><td>${f}</td></tr>`).join('')}
                      </tbody></table>
                    </div>
                    <div class="section">
                      <div class="section-title">Recommendations</div>
                      <table><thead><tr><th>#</th><th>Recommendation</th></tr></thead><tbody>
                        ${reportData.recommendations.map((r, i) => `<tr><td>${i + 1}</td><td>${r}</td></tr>`).join('')}
                      </tbody></table>
                    </div>
                    <div class="section">
                      <div class="section-title">Next Steps</div>
                      <table><thead><tr><th>#</th><th>Next Step</th></tr></thead><tbody>
                        ${reportData.nextSteps.map((s, i) => `<tr><td>${i + 1}</td><td>${s}</td></tr>`).join('')}
                      </tbody></table>
                    </div>
                    <div class="section">
                      <div class="section-title">Follow-up Timeline</div>
                      <div>${reportData.followUpTimeline}</div>
                    </div>
                    <div class="footer">Generated by PanInsight | AI Model Creator: Debesh Jha</div>
                  </body>
                </html>
              `);
              printWindow.document.close();
              printWindow.focus();
              setTimeout(() => printWindow.print(), 500);
            }}
            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-103 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Report
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-103 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport; 