import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PanInsightLogo from './PanInsightLogo';
import ThemeToggle from './ThemeToggle';
import { ThemeContext } from '../theme/ThemeContext';
import { requireAuth, isOAuth2User, getLoginType } from '../utils/authUtils';
import Notification from './Notification';

const HomePage: React.FC = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    const userDataStr = localStorage.getItem('userData');
    setIsAuthenticated(authStatus);
    if (userDataStr) {
      setUserData(JSON.parse(userDataStr));
    }
    
    // Check if user just logged in (show welcome message)
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    if (justLoggedIn === 'true') {
      setNotification({
        message: 'Logged in successfully! 🎉',
        type: 'success',
        isVisible: true
      });
      sessionStorage.removeItem('justLoggedIn');
    }
  }, []);

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleLogout = async () => {
    try {
      console.log('Attempting logout...');
      
      // Clear local storage first (client-side logout)
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userData');
      setIsAuthenticated(false);
      setUserData(null);
      
      // Try to call backend logout endpoint
      const response = await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('Logout response status:', response.status);
      
      if (response.ok) {
        console.log('Backend logout successful');
        // Additional cleanup if needed
        sessionStorage.clear();
      } else {
        console.log('Backend logout failed, but client-side logout completed');
        // Even if backend fails, we've already logged out client-side
      }
      
      // Show success message and navigate to home page
      setNotification({
        message: 'Logged out successfully! 👋',
        type: 'success',
        isVisible: true
      });
      navigate('/');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, clear client-side data and redirect
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userData');
      setIsAuthenticated(false);
      setUserData(null);
      setNotification({
        message: 'Logged out successfully! 👋',
        type: 'success',
        isVisible: true
      });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={closeNotification}
        duration={5000}
      />
      <header className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/our-work"
              className="inline-flex items-center px-3 py-2 sm:px-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-full text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:shadow-lg hover:scale-102 text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Our Project</span>
              <span className="sm:hidden">Project</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 sm:gap-6">
                {/* Stylish Welcome Message */}
                <div className="relative group">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800/80 dark:to-slate-700/80 backdrop-blur-sm border border-blue-200/50 dark:border-slate-600/50 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-sm">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {isOAuth2User() ? 'Google Account' : 'Email Account'}
                      </span>
                      <span className="text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {userData?.firstName || 'User'}
                      </span>
                    </div>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Mobile Welcome Message */}
                  <div className="sm:hidden flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800/80 dark:to-slate-700/80 backdrop-blur-sm border border-blue-200/50 dark:border-slate-600/50 rounded-full shadow-md">
                    <div className="flex items-center justify-center w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Hi, {userData?.firstName || 'User'}
                    </span>
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                    {isOAuth2User() && (
                      <svg className="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                  </div>
                </div>
                
                {/* Enhanced Logout Button */}
                <button
                  onClick={handleLogout}
                  className="group relative inline-flex items-center px-3 py-1.5 sm:px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-full shadow-md transition-all duration-300 hover:shadow-lg transform hover:scale-105 text-xs sm:text-sm overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg className="relative w-3 h-3 sm:w-4 sm:h-4 mr-1.5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="relative hidden sm:inline">Logout</span>
                  <span className="relative sm:hidden">Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-3 py-2 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-103 text-sm sm:text-base"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Login</span>
                <span className="sm:hidden">In</span>
              </Link>
            )}
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
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
            <button
              onClick={() => {
                if (requireAuth(navigate)) {
                  navigate('/upload');
                }
              }}
              className="inline-flex items-center rounded-lg bg-blue-600 dark:bg-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              Start Diagnosis
            </button>
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