import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/background.jpg';
import professorImage from '../assets/Professor.jpeg';
import meImage from '../assets/me.png';
import mem2Image from '../assets/mem2.jpeg';
import { requireAuth } from '../utils/authUtils';

const OurProjectPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative min-h-screen flex flex-col" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-0" />
      <div className="relative z-10">
        <header className="max-w-6xl mx-auto px-4 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center px-3 py-2 sm:px-4 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-full text-slate-300 hover:text-blue-400 font-medium transition-all duration-300 hover:shadow-lg hover:scale-102 text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </Link>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => {
                if (requireAuth(navigate)) {
                  navigate('/upload');
                }
              }}
              className="inline-flex items-center justify-center rounded-lg bg-blue-500 px-4 py-2 sm:px-6 text-sm sm:text-base font-semibold text-white shadow-md hover:bg-blue-600 transition-all duration-200 w-full sm:w-auto min-h-[44px]"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="hidden sm:inline">Start Diagnosis</span>
              <span className="sm:hidden">Start Diagnosis</span>
            </button>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
      
          <section className="mb-12 bg-slate-800/90 rounded-2xl shadow-xl p-4 sm:p-8 border border-slate-600/50">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">About Us</h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              At <span className="font-semibold text-blue-300">PanInsight</span>, we're focused on one goal, helping detect pancreatic cancer early, when it matters most. This type of cancer is hard to spot because the pancreas is buried deep in the body and early tumors are often small and easy to miss. Our AI system is built to tackle that. It enhances medical images, highlights subtle signs of cancer, and reduces motion blur caused by breathing or heartbeat. We work closely with radiologists and surgeons to give them clearer, more reliable images so they can make faster, more confident decisions. Behind everything we do is a belief that better tools can lead to better outcomes.
            </p>
          </section>

          <section id="team" className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
             
                <div className="bg-slate-800/90 rounded-2xl shadow-lg p-4 sm:p-8 border border-slate-600/50 flex flex-col items-center">
                  <img src={professorImage} alt="Dr. Debesh Jha" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-700 shadow-md mb-4" />
                  <h3 className="text-lg sm:text-xl font-bold text-blue-300 mb-1 text-center">Dr. Debesh Jha</h3>
                  <p className="text-slate-300 font-medium mb-1 text-center">Technical Lead</p>
                  <p className="text-slate-400 text-xs sm:text-sm mb-2 text-center">Ph.D. in Computer Science</p>
                  <p className="text-slate-400 text-center text-xs sm:text-sm">Specializes in deep learning architectures for medical image analysis.</p>
                </div>
 
                {/* Me */}
               
                <div className="bg-slate-800/90 rounded-2xl shadow-lg p-4 sm:p-8 border border-slate-600/50 flex flex-col items-center">
                  <img src={meImage} alt="Harshith Reddy Nalla" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-pink-700 shadow-md mb-4" />
                  <h3 className="text-lg sm:text-xl font-bold text-pink-300 mb-1 text-center">Harshith Reddy Nalla</h3>
                  <p className="text-slate-300 font-medium mb-1 text-center">Full-stack Developer</p>
                  <p className="text-slate-400 text-center text-xs sm:text-sm">A full-stack developer working on frontend, backend, and system architecture.</p>
                </div>
               
                <div className="bg-slate-800/90 rounded-2xl shadow-lg p-4 sm:p-8 border border-slate-600/50 flex flex-col items-center sm:col-span-2 lg:col-span-1">
                  <img src={mem2Image} alt="Sai Sankar Swarna" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-green-700 shadow-md mb-4" />
                  <h3 className="text-lg sm:text-xl font-bold text-green-300 mb-1 text-center">Sai Sankar Swarna</h3>
                  <p className="text-slate-300 font-medium mb-1 text-center">Backend & MLOps</p>
                  <p className="text-slate-400 text-center text-xs sm:text-sm">Manages backend services, API development, and MLOps workflows.</p>
                </div>
            </div>
          </section>

    
          <section className="mb-8 text-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-102 text-sm sm:text-base min-h-[44px] w-full sm:w-auto"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">Contact Us</span>
              <span className="sm:hidden">Contact</span>
            </Link>
          </section>
        </main>
        <footer className="bg-slate-950/90 px-4 py-6 sm:py-8 rounded-t-2xl shadow-inner mt-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs sm:text-sm text-slate-500">
              © 2025 PanInsight · Secure · Confidential · Medical-Grade
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default OurProjectPage; 