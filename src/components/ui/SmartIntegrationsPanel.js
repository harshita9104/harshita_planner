/**
 * 🎯 Smart Integrations Panel - Local Events & Context-Aware Suggestions
 * 
 * This component provides intelligent recommendations based on location, weather,
 * and local events. It makes Weekendly feel connected to the real world around you.
 */

import React, { useState, useEffect } from 'react';
import { 
  MapPin, Calendar, ExternalLink, Navigation, Search,
  Cloud, Sun, Utensils, Music, Star, Clock,
  RefreshCw, Zap, TrendingUp, Heart
} from 'lucide-react';

const SmartIntegrationsPanel = ({ 
  userLocation,
  localEvents,
  discoverNearbyEvents,
  smartSuggestions,
  weather,
  onEventToActivity,
  isOfflineMode 
}) => {
  const [activeTab, setActiveTab] = useState('events');
  const [isLoading, setIsLoading] = useState(false);
  const [eventFilter, setEventFilter] = useState('all');

  const eventCategories = [
    { value: 'all', label: 'All Events', icon: Calendar },
    { value: 'food', label: 'Food & Dining', icon: Utensils },
    { value: 'entertainment', label: 'Entertainment', icon: Music },
    { value: 'cultural', label: 'Cultural', icon: Star },
    { value: 'sports', label: 'Sports & Recreation', icon: Zap }
  ];

  useEffect(() => {
    // Auto-check for location availability when component mounts
  }, [userLocation]);

  const handleRefreshEvents = async () => {
    if (!userLocation || isOfflineMode) return;
    
    setIsLoading(true);
    try {
      await discoverNearbyEvents(eventFilter);
    } catch (error) {
      console.error('Failed to refresh events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = async (category) => {
    setEventFilter(category);
    if (userLocation && !isOfflineMode) {
      setIsLoading(true);
      try {
        await discoverNearbyEvents(category);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  const getEventTypeIcon = (type) => {
    const iconMap = {
      food: Utensils,
      entertainment: Music,
      cultural: Star,
      sports: Zap,
      default: Calendar
    };
    return iconMap[type] || iconMap.default;
  };

  const renderLocationPrompt = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <MapPin className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Enable Location for Smart Suggestions</h3>
      <p className="text-sm text-gray-600 mb-4">
        We'll discover local events and personalize your experience based on your location.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Navigation className="w-4 h-4" />
          <span>Allow Location Access</span>
        </div>
      </button>
    </div>
  );

  const renderOfflineMode = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
        <Cloud className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">You're Offline</h3>
      <p className="text-sm text-gray-600">
        Local events and real-time suggestions are not available offline, but your saved plans are still accessible.
      </p>
    </div>
  );

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Smart Discoveries</h3>
              {userLocation && (
                <p className="text-sm text-gray-600">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  {userLocation.city}, {userLocation.country}
                </p>
              )}
            </div>
          </div>
          {userLocation && !isOfflineMode && (
            <button
              onClick={handleRefreshEvents}
              disabled={isLoading}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'events'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Local Events
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'suggestions'
              ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Smart Suggestions
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {!userLocation ? (
          renderLocationPrompt()
        ) : isOfflineMode ? (
          renderOfflineMode()
        ) : (
          <>
            {/* Events Tab */}
            {activeTab === 'events' && (
              <div>
                {/* Event Filters */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {eventCategories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.value}
                          onClick={() => handleFilterChange(category.value)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            eventFilter === category.value
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Icon className="w-3 h-3 inline mr-1" />
                          {category.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Events List */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2 text-gray-600">Finding events...</span>
                  </div>
                ) : localEvents && localEvents.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {localEvents.slice(0, 8).map((event, index) => {
                      const TypeIcon = getEventTypeIcon(event.type);
                      return (
                        <div
                          key={index}
                          className="p-3 bg-white/30 rounded-lg border border-white/20 hover:bg-white/40 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <TypeIcon className="w-4 h-4 text-gray-600" />
                                <h4 className="text-sm font-semibold text-gray-800">{event.name}</h4>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{event.description}</p>
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {formatEventDate(event.date)}
                                </span>
                                {event.location && (
                                  <span className="flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {typeof event.location === 'string' ? event.location : event.location.name || event.location.address || 'Unknown location'}
                                  </span>
                                )}
                                {event.distance && (
                                  <span>{event.distance}km away</span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col space-y-1">
                              {event.url && (
                                <a
                                  href={event.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                              {onEventToActivity && (
                                <button
                                  onClick={() => onEventToActivity(event)}
                                  className="p-1 text-green-600 hover:text-green-800"
                                  title="Add as custom activity"
                                >
                                  <Heart className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No events found in your area.</p>
                    <p className="text-sm text-gray-500">Try changing the filter or check back later.</p>
                  </div>
                )}
              </div>
            )}

            {/* Suggestions Tab */}
            {activeTab === 'suggestions' && (
              <div>
                {smartSuggestions && Object.keys(smartSuggestions).length > 0 ? (
                  <div className="space-y-4">
                    {/* Weather-Based Suggestions */}
                    {smartSuggestions.weatherBased && smartSuggestions.weatherBased.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                          <Sun className="w-4 h-4 mr-2" />
                          Weather-Optimized
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {smartSuggestions.weatherBased.slice(0, 4).map((activity, index) => (
                            <div
                              key={index}
                              className="p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                            >
                              <div className="text-sm font-medium text-gray-800">{activity.name}</div>
                              <div className="text-xs text-gray-600">{activity.reason}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Local Suggestions */}
                    {smartSuggestions.local && smartSuggestions.local.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Nearby Favorites
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {smartSuggestions.local.slice(0, 3).map((event, index) => (
                            <div
                              key={index}
                              className="p-3 bg-green-50 rounded-lg border border-green-200"
                            >
                              <div className="text-sm font-medium text-gray-800">{event.name}</div>
                              <div className="text-xs text-gray-600">
                                {typeof event.location === 'string' ? event.location : 
                                 (event.location?.name || event.location?.address || 'Location not specified')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Holiday Suggestions */}
                    {smartSuggestions.holiday && smartSuggestions.holiday.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                          <Star className="w-4 h-4 mr-2" />
                          Holiday Special
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {smartSuggestions.holiday.slice(0, 4).map((activityId, index) => (
                            <div
                              key={index}
                              className="p-3 bg-purple-50 rounded-lg border border-purple-200"
                            >
                              <div className="text-sm font-medium text-gray-800">{activityId}</div>
                              <div className="text-xs text-gray-600">Holiday themed</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No smart suggestions available</p>
                    <p className="text-sm text-gray-500">Track your mood and add activities to get personalized recommendations</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SmartIntegrationsPanel;
