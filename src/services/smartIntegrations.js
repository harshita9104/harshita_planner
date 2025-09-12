/**
 * 🌟 Smart Integrations Service - External API Connections
 * 
 * This service connects Weekendly with external APIs to enrich the user experience
 * with real-world data, making weekend planning more dynamic and contextual.
 * 
 * Features:
 * • Event discovery through multiple APIs
 * • Restaurant and dining recommendations  
 * • Location mapping and distance calculations
 * • Real-time availability and pricing information
 * • Cultural event recommendations based on user preferences
 */

class SmartIntegrationsService {
  constructor() {
    this.apiKeys = {
      openWeather: 'demo_key', // In production, use environment variables
      mapbox: 'demo_key',
      eventbrite: 'demo_key'
    };
    
    this.cache = new Map();
    this.cacheExpiry = 30 * 60 * 1000; // 30 minutes
  }

  // Enhanced location detection with fallback strategies
  async getCurrentLocation() {
    const cacheKey = 'user_location';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      // Primary: GPS location
      if (navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true,
            maximumAge: 600000 // 10 minutes
          });
        });

        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          source: 'gps'
        };

        // Reverse geocoding for city name
        const cityInfo = await this.reverseGeocode(location.lat, location.lng);
        location.city = cityInfo.city;
        location.country = cityInfo.country;

        this.cache.set(cacheKey, { data: location, timestamp: Date.now() });
        return location;
      }
    } catch (error) {
      console.warn('GPS location failed, using fallback:', error.message);
    }

    // Fallback: IP-based location
    try {
      const response = await fetch('https://ipapi.co/json/', { timeout: 5000 });
      const data = await response.json();
      
      const location = {
        lat: data.latitude,
        lng: data.longitude,
        city: data.city,
        country: data.country_name,
        source: 'ip'
      };

      this.cache.set(cacheKey, { data: location, timestamp: Date.now() });
      return location;
    } catch (error) {
      console.warn('IP location failed, using default:', error.message);
    }

    // Ultimate fallback: Default location (San Francisco)
    const defaultLocation = {
      lat: 37.7749,
      lng: -122.4194,
      city: 'San Francisco',
      country: 'United States',
      source: 'default'
    };

    this.cache.set(cacheKey, { data: defaultLocation, timestamp: Date.now() });
    return defaultLocation;
  }

  // Reverse geocoding using multiple providers
  async reverseGeocode(lat, lng) {
    try {
      // Try OpenStreetMap Nominatim (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Weekendly-App'
          }
        }
      );
      
      const data = await response.json();
      
      return {
        city: data.address?.city || data.address?.town || data.address?.village || 'Unknown City',
        country: data.address?.country || 'Unknown Country',
        neighborhood: data.address?.neighbourhood || data.address?.suburb
      };
    } catch (error) {
      console.warn('Reverse geocoding failed:', error.message);
      return { city: 'Unknown City', country: 'Unknown Country' };
    }
  }

  // Discover local events using multiple sources
  async discoverLocalEvents(location, category = 'all', radius = 25) {
    const cacheKey = `events_${location.city}_${category}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    const events = [];

    try {
      // Mock Eventbrite-style API (replace with real API in production)
      const mockEvents = await this.getMockLocalEvents(location, category);
      events.push(...mockEvents);

      // Mock Meetup-style events
      const socialEvents = await this.getMockSocialEvents(location);
      events.push(...socialEvents);

      // Cultural events from mock cultural API
      const culturalEvents = await this.getMockCulturalEvents(location);
      events.push(...culturalEvents);

    } catch (error) {
      console.warn('Event discovery failed:', error.message);
    }

    // Sort by relevance and date
    const sortedEvents = events
      .filter(event => new Date(event.date) >= new Date())
      .sort((a, b) => {
        // Prioritize closer events and sooner dates
        const dateScore = (new Date(a.date) - new Date(b.date)) / (1000 * 60 * 60 * 24);
        const distanceScore = (a.distance || 0) - (b.distance || 0);
        return dateScore * 0.7 + distanceScore * 0.3;
      })
      .slice(0, 20);

    this.cache.set(cacheKey, { data: sortedEvents, timestamp: Date.now() });
    return sortedEvents;
  }

  // Mock local events (replace with real API)
  async getMockLocalEvents(location, category) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const eventTemplates = [
      {
        name: 'Weekend Farmers Market',
        category: 'food',
        description: 'Fresh local produce and artisan foods',
        vibe: 'social',
        energyLevel: 'medium',
        price: 'free',
        duration: 120
      },
      {
        name: 'Art Gallery Opening',
        category: 'culture',
        description: 'Contemporary local artists showcase',
        vibe: 'sophisticated',
        energyLevel: 'low',
        price: '$15-25',
        duration: 180
      },
      {
        name: 'Live Jazz Performance',
        category: 'music',
        description: 'Intimate jazz club with local musicians',
        vibe: 'sophisticated',
        energyLevel: 'medium',
        price: '$20-35',
        duration: 150
      },
      {
        name: 'Outdoor Yoga Class',
        category: 'wellness',
        description: 'Morning yoga in the park',
        vibe: 'mindful',
        energyLevel: 'medium',
        price: '$10-15',
        duration: 90
      },
      {
        name: 'Food Truck Festival',
        category: 'food',
        description: 'Diverse culinary offerings from local food trucks',
        vibe: 'adventurous',
        energyLevel: 'high',
        price: '$15-30',
        duration: 180
      }
    ];

    return eventTemplates.map((template, index) => ({
      id: `local_event_${index}`,
      ...template,
      location: {
        name: `${location.city} ${template.category === 'food' ? 'Market Square' : 'Cultural District'}`,
        address: `${100 + index} Main Street, ${location.city}`,
        distance: Math.random() * 15 + 2 // 2-17 miles
      },
      date: this.getRandomUpcomingDate(),
      time: this.getRandomTime(),
      attendees: Math.floor(Math.random() * 200) + 20,
      rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0 rating
      source: 'Local Events API'
    }));
  }

  // Mock social events
  async getMockSocialEvents(location) {
    await new Promise(resolve => setTimeout(resolve, 300));

    const socialEvents = [
      {
        name: 'Weekend Photography Walk',
        category: 'photography',
        description: 'Explore the city through your lens with fellow photographers',
        vibe: 'creative',
        energyLevel: 'medium',
        price: 'free',
        duration: 180,
        groupSize: '8-15 people'
      },
      {
        name: 'Board Game Café Meetup',
        category: 'social',
        description: 'Connect with locals over strategy games and coffee',
        vibe: 'social',
        energyLevel: 'low',
        price: '$5-10',
        duration: 150,
        groupSize: '12-20 people'
      },
      {
        name: 'Hiking Group Adventure',
        category: 'outdoor',
        description: 'Discover scenic trails with an experienced group',
        vibe: 'adventurous',
        energyLevel: 'high',
        price: 'free',
        duration: 240,
        groupSize: '6-12 people'
      }
    ];

    return socialEvents.map((event, index) => ({
      id: `social_event_${index}`,
      ...event,
      location: {
        name: `${location.city} Community Center`,
        address: `${200 + index} Community Blvd, ${location.city}`,
        distance: Math.random() * 10 + 1
      },
      date: this.getRandomUpcomingDate(),
      time: this.getRandomTime(),
      attendees: Math.floor(Math.random() * 50) + 10,
      organizer: 'Local Community Group',
      source: 'Social Meetups API'
    }));
  }

  // Mock cultural events
  async getMockCulturalEvents(location) {
    await new Promise(resolve => setTimeout(resolve, 400));

    const culturalEvents = [
      {
        name: 'Museum Night Tour',
        category: 'culture',
        description: 'After-hours exclusive access to local museum collections',
        vibe: 'sophisticated',
        energyLevel: 'low',
        price: '$25-40',
        duration: 120
      },
      {
        name: 'Street Art Festival',
        category: 'art',
        description: 'Live mural painting and urban art celebration',
        vibe: 'creative',
        energyLevel: 'medium',
        price: 'free',
        duration: 300
      },
      {
        name: 'Cultural Food Tour',
        category: 'food',
        description: 'Guided tour through ethnic neighborhoods',
        vibe: 'adventurous',
        energyLevel: 'medium',
        price: '$45-60',
        duration: 210
      }
    ];

    return culturalEvents.map((event, index) => ({
      id: `cultural_event_${index}`,
      ...event,
      location: {
        name: `${location.city} Cultural Quarter`,
        address: `${300 + index} Arts District, ${location.city}`,
        distance: Math.random() * 12 + 3
      },
      date: this.getRandomUpcomingDate(),
      time: this.getRandomTime(),
      attendees: Math.floor(Math.random() * 100) + 30,
      highlights: ['Professional guide', 'Small group size', 'Local insights'],
      source: 'Cultural Events API'
    }));
  }

  // Find restaurants and dining options
  async findDiningOptions(location, cuisine = 'all', priceRange = 'all') {
    const cacheKey = `dining_${location.city}_${cuisine}_${priceRange}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    // Mock restaurant data (replace with real API like Yelp/Google Places)
    const restaurants = [
      {
        id: 'rest_1',
        name: 'Farm-to-Table Bistro',
        cuisine: 'American',
        priceRange: '$$',
        rating: 4.6,
        description: 'Locally sourced ingredients with seasonal menu',
        specialties: ['Weekend Brunch', 'Craft Cocktails', 'Vegetarian Options'],
        distance: Math.random() * 8 + 1,
        estimatedWait: '20-30 min',
        reservationRequired: true
      },
      {
        id: 'rest_2',
        name: 'Artisan Coffee Roastery',
        cuisine: 'Café',
        priceRange: '$',
        rating: 4.4,
        description: 'Small-batch coffee with house-made pastries',
        specialties: ['Single Origin Coffee', 'Fresh Pastries', 'Laptop Friendly'],
        distance: Math.random() * 5 + 0.5,
        estimatedWait: '5-10 min',
        reservationRequired: false
      },
      {
        id: 'rest_3',
        name: 'Mediterranean Garden',
        cuisine: 'Mediterranean',
        priceRange: '$$',
        rating: 4.5,
        description: 'Authentic Mediterranean with outdoor seating',
        specialties: ['Fresh Seafood', 'Wine Selection', 'Outdoor Dining'],
        distance: Math.random() * 10 + 2,
        estimatedWait: '15-25 min',
        reservationRequired: true
      }
    ];

    this.cache.set(cacheKey, { data: restaurants, timestamp: Date.now() });
    return restaurants;
  }

  // Calculate optimal routes between activities
  async calculateOptimalRoute(activities, startLocation) {
    if (activities.length < 2) return activities;

    // Simple distance-based optimization (in production, use routing APIs)
    const optimized = [...activities];
    
    // Sort by proximity to create a more logical route
    optimized.sort((a, b) => {
      const distA = this.calculateDistance(startLocation, a.location || startLocation);
      const distB = this.calculateDistance(startLocation, b.location || startLocation);
      return distA - distB;
    });

    return optimized.map((activity, index) => ({
      ...activity,
      routeOrder: index + 1,
      estimatedTravelTime: index === 0 ? 0 : Math.random() * 20 + 5, // 5-25 minutes
      travelMethod: this.suggestTravelMethod(activities[index - 1], activity)
    }));
  }

  // Suggest best travel method between two points
  suggestTravelMethod(fromActivity, toActivity) {
    if (!fromActivity || !toActivity) return 'walk';
    
    const distance = this.calculateDistance(
      fromActivity.location || { lat: 0, lng: 0 },
      toActivity.location || { lat: 0, lng: 0 }
    );

    if (distance < 0.5) return 'walk';
    if (distance < 2) return 'bike';
    if (distance < 10) return 'transit';
    return 'drive';
  }

  // Simple distance calculation (Haversine formula)
  calculateDistance(point1, point2) {
    const R = 3958.8; // Earth's radius in miles
    const lat1Rad = point1.lat * Math.PI / 180;
    const lat2Rad = point2.lat * Math.PI / 180;
    const deltaLat = (point2.lat - point1.lat) * Math.PI / 180;
    const deltaLng = (point2.lng - point1.lng) * Math.PI / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Helper methods
  getRandomUpcomingDate() {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + Math.floor(Math.random() * 30)); // Next 30 days
    return futureDate.toISOString().split('T')[0];
  }

  getRandomTime() {
    const hours = Math.floor(Math.random() * 12) + 8; // 8 AM to 8 PM
    const minutes = ['00', '30'][Math.floor(Math.random() * 2)];
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  // Enhanced weather integration with activity suggestions
  async getWeatherBasedSuggestions(location, activities) {
    try {
      // Mock weather data (integrate with real weather API)
      const weather = {
        current: {
          temperature: Math.random() * 40 + 40, // 40-80°F
          condition: ['sunny', 'cloudy', 'rainy', 'windy'][Math.floor(Math.random() * 4)],
          humidity: Math.random() * 40 + 30,
          windSpeed: Math.random() * 15 + 5
        },
        forecast: []
      };

      const suggestions = [];

      if (weather.current.condition === 'rainy') {
        suggestions.push({
          type: 'weather_warning',
          message: 'Rain expected - consider indoor alternatives',
          indoorAlternatives: activities.filter(a => a.category === 'Indoor').slice(0, 3)
        });
      } else if (weather.current.condition === 'sunny' && weather.current.temperature > 75) {
        suggestions.push({
          type: 'weather_opportunity',
          message: 'Perfect weather for outdoor activities!',
          outdoorRecommendations: activities.filter(a => a.category === 'Outdoor').slice(0, 3)
        });
      }

      return {
        weather,
        suggestions,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.warn('Weather integration failed:', error.message);
      return { weather: null, suggestions: [], error: error.message };
    }
  }
}

// Export singleton instance
export default new SmartIntegrationsService();
