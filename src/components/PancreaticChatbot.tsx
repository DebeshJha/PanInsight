import React, { useState, useRef, useEffect, useContext } from 'react';
import { ThemeContext } from '../theme/ThemeContext';
import pancreasIcon from '../assets/pancreas-icon.png';

interface ChatMessage {
  id: string;
  message: string;
  timestamp: string;
  isUserMessage: boolean;
}

const PancreaticChatbot: React.FC = () => {
  const { isDark } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId] = useState(() => 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: "Hello there!, How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUserMessage: false
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUserMessage: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage.message,
          sessionId: sessionId 
        }),
      });

      const data = await response.json();

      if (data.reply) {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          message: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isUserMessage: false
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('No reply received');
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUserMessage: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
     
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 group flex items-center gap-3 px-6 py-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-103 border-2 ${
          isOpen
            ? 'bg-green-400 hover:bg-green-500 text-white border-green-300 shadow-green-400/40'
            : isDark 
              ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-400 shadow-orange-500/30' 
              : 'bg-orange-500 hover:bg-orange-600 text-white border-orange-400 shadow-orange-500/40'
        }`}
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <>
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-sm font-semibold whitespace-nowrap">Close Chat</span>
          </>
        ) : (
          <>
            <img 
              src={pancreasIcon} 
              alt="Pancreas Icon" 
              className="w-6 h-6 flex-shrink-0"
            />
            <span className="text-sm font-semibold whitespace-nowrap">Need clarity? Ask our AI</span>
          </>
        )}
      </button>

      
      {isOpen && (
        <div className={`fixed bottom-28 right-6 z-40 w-80 h-96 sm:w-96 sm:h-[500px] rounded-2xl shadow-2xl border transition-all duration-300 ${
          isDark 
            ? 'bg-slate-800 border-slate-600' 
            : 'bg-white border-gray-200'
        }`}>
          
          <div className={`flex items-center justify-between p-4 rounded-t-2xl ${
            isDark ? 'bg-slate-700' : 'bg-gradient-to-r from-green-400 to-green-400'
          } text-white`}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Pancreatic Health Assistant</h3>
                <p className="text-xs opacity-90">Ask me about pancreatic health</p>
              </div>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>

          
          <div className="flex-1 p-4 overflow-y-auto h-80 sm:h-96">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUserMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs sm:max-w-sm px-4 py-2 rounded-2xl ${
                      message.isUserMessage
                        ? isDark
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500 text-white'
                        : isDark
                        ? 'bg-slate-700 text-slate-200'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.isUserMessage 
                        ? 'text-blue-100' 
                        : isDark ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                    isDark ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          
          <div className={`p-4 border-t ${
            isDark ? 'border-slate-600 bg-slate-800' : 'border-gray-200 bg-white'
          }`}>
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about pancreatic health..."
                disabled={isLoading}
                className={`flex-1 px-4 py-2 rounded-full text-sm border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className={`p-2 rounded-full transition-all duration-200 ${
                  inputMessage.trim() && !isLoading
                    ? isDark
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                    : isDark
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PancreaticChatbot; 