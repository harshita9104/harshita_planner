import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';

const WeatherIcon = ({ day, weather, showDetails = false }) => {
  const getWeatherData = (code) => {
    // Clear sky
    if (code >= 0 && code <= 1) {
      return {
        icon: <Sun className="w-6 h-6 text-yellow-400" />,
        label: 'Sunny',
        description: 'Perfect weather for outdoor activities',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100'
      };
    }
    
    // Partly cloudy
    if (code >= 2 && code <= 3) {
      return {
        icon: <Cloud className="w-6 h-6 text-gray-400" />,
        label: 'Cloudy',
        description: 'Good weather with some clouds',
        color: 'text-gray-500',
        bgColor: 'bg-gray-100'
      };
    }
    
    // Light rain
    if (code >= 51 && code <= 61) {
      return {
        icon: <CloudRain className="w-6 h-6 text-blue-400" />,
        label: 'Light Rain',
        description: 'Consider indoor activities or bring an umbrella',
        color: 'text-blue-500',
        bgColor: 'bg-blue-100'
      };
    }
    
    // Heavy rain
    if (code >= 63 && code <= 67) {
      return {
        icon: <CloudRain className="w-6 h-6 text-blue-600" />,
        label: 'Heavy Rain',
        description: 'Indoor activities recommended',
        color: 'text-blue-600',
        bgColor: 'bg-blue-200'
      };
    }
    
    // Snow
    if (code >= 71 && code <= 77) {
      return {
        icon: <CloudSnow className="w-6 h-6 text-blue-200" />,
        label: 'Snow',
        description: 'Bundle up for winter activities',
        color: 'text-blue-300',
        bgColor: 'bg-blue-50'
      };
    }
    
    // Thunderstorm
    if (code >= 95 && code <= 99) {
      return {
        icon: <CloudLightning className="w-6 h-6 text-purple-500" />,
        label: 'Storms',
        description: 'Stay indoors for safety',
        color: 'text-purple-500',
        bgColor: 'bg-purple-100'
      };
    }
    
    // Default sunny weather
    return {
      icon: <Sun className="w-6 h-6 text-yellow-400" />,
      label: 'Clear',
      description: 'Great weather for any activity',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    };
  };

  if (!weather || !weather[day]) {
    const defaultWeather = getWeatherData(0);
    return showDetails ? (
      <div className="weather-indicator">
        {defaultWeather.icon}
        <span className="text-sm font-medium">Clear Weather</span>
      </div>
    ) : defaultWeather.icon;
  }

  const weatherData = getWeatherData(weather[day]);

  if (showDetails) {
    return (
      <div className={`weather-indicator ${weatherData.bgColor} border ${weatherData.color.replace('text-', 'border-')}`}>
        <div className="flex items-center space-x-2">
          {weatherData.icon}
          <div>
            <div className={`font-semibold text-sm ${weatherData.color}`}>
              {weatherData.label}
            </div>
            <div className="text-xs text-gray-600">
              {weatherData.description}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-2 rounded-xl ${weatherData.bgColor} group-hover:scale-110 transition-transform duration-200`}>
      {weatherData.icon}
    </div>
  );
};

export default WeatherIcon;
