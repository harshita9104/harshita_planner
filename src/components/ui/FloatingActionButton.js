import React, { useState } from 'react';
import { Calendar, Compass, Share2, Sparkles, ChevronUp } from 'lucide-react';

const FloatingActionButton = ({ currentView, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actionButtons = [
    { 
      key: 'browse', 
      icon: Compass, 
      label: 'Discover',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      key: 'plan', 
      icon: Calendar, 
      label: 'Plan',
      color: 'from-blue-500 to-indigo-600'
    },
    { 
      key: 'share', 
      icon: Share2, 
      label: 'Share',
      color: 'from-green-500 to-teal-600'
    }
  ];

  const currentButton = actionButtons.find(btn => btn.key === currentView);
  const otherButtons = actionButtons.filter(btn => btn.key !== currentView);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        />
      )}
      
      <div className="relative">
        {/* Expanded Action Buttons */}
        {isExpanded && (
          <div className="absolute bottom-20 right-0 space-y-3 fade-in-scale">
            {otherButtons.map((button, index) => {
              const Icon = button.icon;
              return (
                <div
                  key={button.key}
                  className="slide-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <button
                    onClick={() => {
                      onClick(button.key);
                      setIsExpanded(false);
                    }}
                    className={`
                      flex items-center space-x-3 bg-gradient-to-r ${button.color} 
                      text-white px-4 py-3 rounded-2xl shadow-lg hover:shadow-xl 
                      transition-all duration-300 transform hover:scale-105
                      min-w-[120px] justify-start
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{button.label}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Main FAB */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            relative bg-gradient-to-r ${currentButton?.color || 'from-indigo-500 to-purple-600'} 
            text-white p-4 rounded-2xl shadow-lg hover:shadow-xl 
            transition-all duration-300 transform hover:scale-110 active:scale-95
            group overflow-hidden
          `}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" />
          
          {/* Icon */}
          <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-45' : ''}`}>
            {isExpanded ? (
              <ChevronUp className="w-6 h-6" />
            ) : currentButton ? (
              <currentButton.icon className="w-6 h-6" />
            ) : (
              <Sparkles className="w-6 h-6" />
            )}
          </div>

          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-30 transform scale-0 group-active:scale-100 transition-all duration-200 rounded-full" />
          </div>
        </button>

        {/* Current view label */}
        {!isExpanded && currentButton && (
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
              {currentButton.label}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingActionButton;
