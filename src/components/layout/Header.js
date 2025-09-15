import React, { useState, useEffect } from 'react';
import { Calendar, Share2, MapPin, Clock, BarChart3 } from 'lucide-react';
import { useRealTime } from '../../services/realTimeServices';
import { useLocation } from '../../contexts/LocationContext';


const Search = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const Header = ({ currentView, setCurrentView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { formattedTime, greeting } = useRealTime();
  const { formatLocation, locationPermission } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`bg-white shadow-sm border-b border-blue-100 sticky-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Weekendly
              </h1>
              <div className="hidden sm:flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formattedTime}</span>
                </div>
                <span>•</span>
                <span>{greeting}!</span>
                {locationPermission === 'granted' && (
                  <>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{formatLocation()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <nav className="flex items-center space-x-1">
            {[
              { key: 'browse', label: 'Browse', icon: Search },
              { key: 'plan', label: 'Plan', icon: Calendar },
              { key: 'insights', label: 'Insights', icon: BarChart3 },
              { key: 'share', label: 'Share', icon: Share2 }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setCurrentView(key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${currentView === key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-blue-700 hover:bg-blue-100'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:block">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
