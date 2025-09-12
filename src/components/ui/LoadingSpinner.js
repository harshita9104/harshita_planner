import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';

const LoadingSpinner = ({ message = "Planning your perfect weekend..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      {/* Animated logo */}
      <div className="relative">
        <div className="absolute inset-0 animate-ping">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 opacity-75">
            <Calendar className="w-12 h-12 text-white" />
          </div>
        </div>
        <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4">
          <Calendar className="w-12 h-12 text-white" />
        </div>
      </div>

      {/* Loading message */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <span>{message}</span>
        </h3>
        <p className="text-gray-600">This won't take long!</p>
      </div>

      {/* Loading dots */}
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"
            style={{ animationDelay: `${index * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
