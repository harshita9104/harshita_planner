import React from 'react';

/**
 * 🌍 Real-time Services - Keeping Your Weekend Plans Current
 * 
 * This service handles real-time updates for time, weather, and location data.
 * I've designed it to be efficient and user-friendly, automatically updating
 * information without overwhelming the user with constant changes.
 */

// Real-time clock hook
export const useRealTime = () => {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 22) return 'Good Evening';
    return 'Good Night';
  };

  return {
    currentTime,
    formattedTime: formatTime(currentTime),
    formattedDate: formatDate(currentTime),
    greeting: getGreeting()
  };
};

// Enhanced weather service with more detailed forecasts
export const weatherService = {
  // Get user's current location
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          // Fallback to a default location (New York City)
          console.warn('Location access denied, using default location');
          resolve({
            latitude: 40.7128,
            longitude: -74.0060,
            accuracy: null,
            isDefault: true
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  },

  // Get detailed weather forecast
  async getDetailedWeather(latitude, longitude) {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto&forecast_days=7`
      );

      if (!response.ok) {
        throw new Error('Weather service unavailable');
      }

      const data = await response.json();
      
      return {
        current: {
          temperature: Math.round(data.current.temperature_2m),
          feelsLike: Math.round(data.current.apparent_temperature),
          humidity: data.current.relative_humidity_2m,
          windSpeed: Math.round(data.current.wind_speed_10m),
          windDirection: data.current.wind_direction_10m,
          pressure: data.current.pressure_msl,
          cloudCover: data.current.cloud_cover,
          weatherCode: data.current.weather_code,
          isDay: data.current.is_day,
          precipitation: data.current.precipitation
        },
        daily: data.daily.time.map((date, index) => ({
          date: date,
          weatherCode: data.daily.weather_code[index],
          maxTemp: Math.round(data.daily.temperature_2m_max[index]),
          minTemp: Math.round(data.daily.temperature_2m_min[index]),
          precipitationProbability: data.daily.precipitation_probability_max[index],
          sunrise: data.daily.sunrise[index],
          sunset: data.daily.sunset[index],
          uvIndex: data.daily.uv_index_max[index],
          windSpeed: Math.round(data.daily.wind_speed_10m_max[index])
        })),
        location: { latitude, longitude },
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Weather fetch failed:', error);
      
      // Return mock weather data if API fails
      return {
        current: {
          temperature: 22,
          feelsLike: 24,
          humidity: 65,
          windSpeed: 8,
          weatherCode: 1,
          isDay: 1
        },
        daily: Array.from({ length: 7 }, (_, index) => ({
          date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          weatherCode: Math.floor(Math.random() * 10) + 1,
          maxTemp: Math.floor(Math.random() * 10) + 20,
          minTemp: Math.floor(Math.random() * 10) + 10,
          precipitationProbability: Math.floor(Math.random() * 100)
        })),
        location: { latitude, longitude },
        lastUpdated: new Date().toISOString(),
        isOffline: true
      };
    }
  },

  // Get weather recommendations for activities
  getActivityRecommendations(weatherCode, temperature) {
    const recommendations = {
      excellent: [],
      good: [],
      caution: [],
      avoid: []
    };

    // Clear/sunny weather (0-1)
    if (weatherCode <= 1 && temperature > 15) {
      recommendations.excellent = ['Photography Expedition', 'Urban Cycling Tour', 'Outdoor Market Visit'];
      recommendations.good = ['All outdoor activities'];
    }
    // Partly cloudy (2-3)
    else if (weatherCode <= 3) {
      recommendations.good = ['Photography Expedition', 'Walking Tours', 'Outdoor Dining'];
      recommendations.excellent = ['Indoor activities'];
    }
    // Rain (51-67)
    else if (weatherCode >= 51 && weatherCode <= 67) {
      recommendations.excellent = ['Contemporary Art Gallery', 'Wine & Cheese Discovery', 'Artisan Brunch Experience'];
      recommendations.caution = ['Urban Cycling Tour'];
      recommendations.avoid = ['Photography Expedition (outdoor)'];
    }
    // Snow (71-77)
    else if (weatherCode >= 71 && weatherCode <= 77) {
      recommendations.excellent = ['Indoor cultural activities', 'Cozy cafe visits'];
      recommendations.good = ['Winter photography (with proper gear)'];
      recommendations.avoid = ['Cycling', 'Outdoor dining'];
    }

    return recommendations;
  }
};

// Location service for activity suggestions
export const locationService = {
  // Get nearby points of interest based on activity type
  async getNearbyPOIs(latitude, longitude, activityType) {
    // Mock POI data - in a real app, you'd use Google Places API or similar
    const mockPOIs = {
      'Artisan Brunch Experience': [
        { name: 'Farm Table Cafe', distance: 1.2, rating: 4.5, address: '123 Main St' },
        { name: 'Artisan Bakery', distance: 0.8, rating: 4.7, address: '456 Oak Ave' },
        { name: 'Weekend Market', distance: 2.1, rating: 4.3, address: 'Central Square' }
      ],
      'Photography Expedition': [
        { name: 'Historic District', distance: 1.5, rating: 4.6, type: 'Architecture' },
        { name: 'Riverside Park', distance: 2.3, rating: 4.4, type: 'Nature' },
        { name: 'Art Quarter', distance: 1.8, rating: 4.5, type: 'Street Art' }
      ],
      'Urban Cycling Tour': [
        { name: 'City Bike Trail', distance: 0.5, rating: 4.5, length: '12km loop' },
        { name: 'Waterfront Path', distance: 1.2, rating: 4.6, length: '8km one-way' },
        { name: 'Historic Tour Route', distance: 0.9, rating: 4.4, length: '15km' }
      ]
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return mockPOIs[activityType] || [];
  },

  // Calculate estimated travel time between locations
  calculateTravelTime(distance, mode = 'walking') {
    const speeds = {
      walking: 5, // km/h
      cycling: 15, // km/h
      driving: 30 // km/h (city average)
    };

    const timeInHours = distance / speeds[mode];
    const timeInMinutes = Math.round(timeInHours * 60);
    
    return {
      distance,
      mode,
      estimatedTime: timeInMinutes,
      formatted: timeInMinutes < 60 ? `${timeInMinutes} min` : `${Math.round(timeInHours * 10) / 10}h`
    };
  }
};
