import React, { useState, useEffect } from 'react';

const Loader = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [particles, setParticles] = useState([]);
  
  const messages = [
    "🛍️ Scanning millions of products...",
    "💎 Finding the best deals...",
    "🚀 Hunting for premium quality...",
    "✨ Curating perfect matches...",
    "🎯 Almost there..."
  ];

  const productIcons = ['👕', '👟', '📱', '💻', '⌚', '🎧', '📷', '🛒'];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 1500);

    // Create floating particles
    const createParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 12; i++) {
        newParticles.push({
          id: i,
          icon: productIcons[Math.floor(Math.random() * productIcons.length)],
          delay: i * 0.3,
          size: Math.random() * 0.5 + 0.5
        });
      }
      setParticles(newParticles);
    };

    createParticles();
    return () => clearInterval(messageInterval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-[#252836] p-8">
      
      {/* Floating background particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute text-2xl opacity-20 animate-float"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            transform: `scale(${particle.size})`
          }}
        >
          {particle.icon}
        </div>
      ))}

      {/* Main shopping cart animation */}
      <div className="relative mb-8">
        {/* Cart body */}
        <div className="relative">
          <div className="w-24 h-20 border-4 border-[#EA7C69] rounded-lg bg-[#252836] shadow-2xl transform animate-bounce-gentle">
            {/* Cart items dropping in */}
            <div className="absolute -top-2 left-2 w-4 h-4 bg-[#EA7C69] rounded animate-drop-1"></div>
            <div className="absolute -top-1 left-8 w-3 h-3 bg-orange-400 rounded animate-drop-2"></div>
            <div className="absolute top-1 left-5 w-5 h-3 bg-red-400 rounded animate-drop-3"></div>
            
            {/* Shopping items inside */}
            <div className="p-2 space-y-1">
              <div className="w-full h-1 bg-[#EA7C69] rounded animate-pulse"></div>
              <div className="w-3/4 h-1 bg-orange-300 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-1/2 h-1 bg-red-300 rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
          
          {/* Cart handle */}
          <div className="absolute -right-1 top-2 w-6 h-8 border-4 border-[#EA7C69] border-l-0 rounded-r-lg bg-transparent"></div>
          
          {/* Cart wheels */}
          <div className="absolute -bottom-4 left-2 w-4 h-4 border-2 border-[#EA7C69] rounded-full bg-[#252836] animate-spin-slow"></div>
          <div className="absolute -bottom-4 right-4 w-4 h-4 border-2 border-[#EA7C69] rounded-full bg-[#252836] animate-spin-slow"></div>
        </div>

        {/* Magic sparkles around cart */}
        <div className="absolute -top-2 -left-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute -top-4 right-0 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-2 -right-6 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-2 -left-4 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* Progress ring */}
      <div className="relative w-32 h-32 mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#374151"
            strokeWidth="2"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#EA7C69"
            strokeWidth="3"
            strokeDasharray="100, 100"
            strokeLinecap="round"
            className="animate-progress"
          />
        </svg>
        
        {/* Percentage in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs font-bold text-[#EA7C69] animate-count">almost there</div>
            <div className="text-xs text-gray-300">fetching results</div>
          </div>
        </div>
      </div>

      {/* Dynamic messages */}
      <div className="text-center space-y-4 max-w-sm">
        <div className="h-8 flex items-center justify-center">
          <p className="text-lg font-semibold text-white animate-slide-up" key={currentMessage}>
            {messages[currentMessage]}
          </p>
        </div>
        
        {/* Loading dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-[#EA7C69] rounded-full animate-pulse-wave"
              style={{animationDelay: `${i * 0.2}s`}}
            ></div>
          ))}
        </div>
      </div>

      {/* Bottom stats */}
      <div className="absolute bottom-8 flex space-x-8 text-sm text-gray-300">
        <div className="text-center">
          <div className="font-bold text-[#EA7C69] animate-count-up">2.4M+</div>
          <div>Products</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-[#EA7C69] animate-count-up" style={{animationDelay: '0.5s'}}>500K+</div>
          <div>Brands</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-[#EA7C69] animate-count-up" style={{animationDelay: '1s'}}>99.9%</div>
          <div>Uptime</div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes drop-1 {
          0% { transform: translateY(-30px); opacity: 0; }
          50% { transform: translateY(5px); opacity: 1; }
          100% { transform: translateY(0px); opacity: 1; }
        }
        
        @keyframes drop-2 {
          0% { transform: translateY(-25px); opacity: 0; }
          60% { transform: translateY(3px); opacity: 1; }
          100% { transform: translateY(0px); opacity: 1; }
        }
        
        @keyframes drop-3 {
          0% { transform: translateY(-20px); opacity: 0; }
          70% { transform: translateY(2px); opacity: 1; }
          100% { transform: translateY(0px); opacity: 1; }
        }
        
        @keyframes progress {
          0% { stroke-dasharray: 0, 100; }
          100% { stroke-dasharray: 97, 100; }
        }
        
        @keyframes slide-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0px); opacity: 1; }
        }
        
        @keyframes pulse-wave {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }
        
        @keyframes count-up {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        .animate-drop-1 { animation: drop-1 1.5s ease-out 0.5s both; }
        .animate-drop-2 { animation: drop-2 1.5s ease-out 1s both; }
        .animate-drop-3 { animation: drop-3 1.5s ease-out 1.5s both; }
        .animate-progress { animation: progress 4s ease-out infinite; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        .animate-pulse-wave { animation: pulse-wave 1.5s ease-in-out infinite; }
        .animate-count-up { animation: count-up 1s ease-out both; }
        .animate-spin-slow { animation: spin 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default Loader;
