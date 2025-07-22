import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import PanInsightLogo from './PanInsightLogo';
import ThemeToggle from './ThemeToggle';
import { ThemeContext } from '../theme/ThemeContext';

const HomePage: React.FC = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      
    
      <header className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              to="/our-work"
              className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-full text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:shadow-lg hover:scale-102"
            >
              Our Project
            </Link>
          </div>
        </div>
      </header>
      
      <section className="relative px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-8">
            <PanInsightLogo size={80} className="drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            PanInsight
          </h1>
          <p className="mt-6 text-xl font-semibold text-slate-700 dark:text-slate-300 sm:text-2xl">
            AI-Powered Early Detection of Pancreatic Cancer
          </p>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 sm:text-xl">
            Secure, reliable, and clear medical imaging assistance for radiologists and surgeons.
          </p>
          <div className="mt-10">
            <Link
              to="/upload"
              className="inline-flex items-center rounded-lg bg-blue-600 dark:bg-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              Start Diagnosis
            </Link>
          </div>
        </div>
      </section>

      
      <section className="bg-slate-50 dark:bg-slate-800 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Simple, secure, and efficient diagnostic workflow
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
                  <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Upload Scan
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Securely upload your medical imaging scans through our encrypted platform.
                </p>
              </div>
            </div>

            
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
                  <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  AI Analysis
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Our advanced AI algorithms analyze the scans for early detection indicators.
                </p>
              </div>
            </div>

        
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
                  <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Report & Assist
                </h3>
                <p className="text-slate-400 dark:text-slate-400">
                  Receive detailed reports with actionable insights and recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 dark:bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            © 2025 PanInsight · Secure · Confidential · Medical-Grade
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 