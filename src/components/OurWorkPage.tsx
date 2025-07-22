import React from 'react';
import { Link } from 'react-router-dom';

const OurProjectPage: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col" style={{ backgroundImage: `url('/background.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-0" />
      <div className="relative z-10">
        <header className="max-w-6xl mx-auto px-4 pt-8 flex justify-between items-center">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-full text-slate-300 hover:text-blue-400 font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <Link to="/upload" className="inline-flex items-center rounded-lg bg-blue-500 px-6 py-2 text-base font-semibold text-white shadow-md hover:bg-blue-600 transition-all duration-200">Start Diagnosis</Link>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
      
          <section className="mb-12 bg-slate-800/90 rounded-2xl shadow-xl p-8 border border-slate-600/50">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">About Us</h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              At <span className="font-semibold text-blue-300">PanInsight</span>, we're focused on one goal, helping detect pancreatic cancer early, when it matters most. This type of cancer is hard to spot because the pancreas is buried deep in the body and early tumors are often small and easy to miss. Our AI system is built to tackle that. It enhances medical images, highlights subtle signs of cancer, and reduces motion blur caused by breathing or heartbeat. We work closely with radiologists and surgeons to give them clearer, more reliable images so they can make faster, more confident decisions. Behind everything we do is a belief that better tools can lead to better outcomes.
            </p>
          </section>

          <section id="team" className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
             
                <div className="bg-slate-800/90 rounded-2xl shadow-lg p-8 border border-slate-600/50 flex flex-col items-center">
                  <img src="/Professor.jpeg" alt="Dr. Debesh Jha" className="w-32 h-32 rounded-full object-cover border-4 border-blue-700 shadow-md mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-1">Dr. Debesh Jha</h3>
                  <p className="text-slate-300 font-medium mb-1">Technical Lead</p>
                  <p className="text-slate-400 text-sm mb-2">Ph.D. in Computer Science</p>
                  <p className="text-slate-400 text-center text-sm">Specializes in deep learning architectures for medical image analysis.</p>
                </div>
 
                {/* Me */}
               
                <div className="bg-slate-800/90 rounded-2xl shadow-lg p-8 border border-slate-600/50 flex flex-col items-center">
                  <img src="/me.png" alt="Harshith Reddy Nalla" className="w-32 h-32 rounded-full object-cover border-4 border-pink-700 shadow-md mb-4" />
                  <h3 className="text-xl font-bold text-pink-300 mb-1">Harshith Reddy Nalla</h3>
                  <p className="text-slate-300 font-medium mb-1">Full-stack Developer</p>
                  <p className="text-slate-400 text-center text-sm">A full-stack developer working on frontend, backend, and system architecture.</p>
                </div>
               
                <div className="bg-slate-800/90 rounded-2xl shadow-lg p-8 border border-slate-600/50 flex flex-col items-center">
                  <img src="/mem2.jpeg" alt="Sai Sankar Swarna" className="w-32 h-32 rounded-full object-cover border-4 border-green-700 shadow-md mb-4" />
                  <h3 className="text-xl font-bold text-green-300 mb-1">Sai Sankar Swarna</h3>
                  <p className="text-slate-300 font-medium mb-1">Backend & MLOps</p>
                  <p className="text-slate-400 text-center text-sm">Manages backend services, API development, and MLOps workflows.</p>
                </div>
            </div>
          </section>

    
          <section className="mb-8 text-center">
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-105"
            >
              Contact Us
            </Link>
          </section>
        </main>
        <footer className="bg-slate-950/90 px-4 py-8 rounded-t-2xl shadow-inner mt-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm text-slate-500">
              © 2025 PanInsight · Secure · Confidential · Medical-Grade
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default OurProjectPage; 