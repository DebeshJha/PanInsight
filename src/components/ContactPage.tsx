import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    

    setTimeout(() => {
      alert('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

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
        <main className="max-w-4xl mx-auto px-4 py-12">
    
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Contact PanInsight</h2>
            <p className="text-lg text-slate-300 text-center mb-8">
              We'd love to hear from you! Reach out with any inquiries, collaboration opportunities, or to report a problem.
            </p>
            
            <div className="bg-slate-800/90 rounded-2xl shadow-lg p-8 border border-slate-600/50 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-6 text-center">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 text-white"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Your Email ID
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 text-white"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                    Your Problem/Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Describe your problem or message here..."
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 text-white resize-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    'Send'
                  )}
                </button>
              </form>
            </div>
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

export default ContactPage; 