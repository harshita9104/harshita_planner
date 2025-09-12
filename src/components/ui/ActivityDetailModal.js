import React, { useState, useEffect } from 'react';
import { 
  X, Clock, MapPin, Star, Calendar, Users, 
  Heart, Compass, Sunset, Camera as Photo
} from 'lucide-react';

// Location suggestions based on activity type
const locationSuggestions = {
  'Artisan Brunch Experience': {
    locations: ['Local Farm-to-Table Cafe', 'Artisan Bakery District', 'Weekend Farmers Market'],
    benefits: ['Support local businesses', 'Fresh, seasonal ingredients', 'Meet local artisans']
  },
  'Photography Expedition': {
    locations: ['Historic Downtown', 'Botanical Gardens', 'Waterfront Promenade', 'Local Architecture District'],
    benefits: ['Improve composition skills', 'Document memories', 'Explore hidden gems', 'Build photography portfolio']
  },
  'Urban Cycling Tour': {
    locations: ['City Bike Trail', 'Riverside Path', 'Historic Neighborhoods', 'Park Circuit'],
    benefits: ['Cardiovascular exercise', 'Eco-friendly exploration', 'Discover new areas', 'Fresh air and vitamin D']
  },
  'Wine & Cheese Discovery': {
    locations: ['Local Winery', 'Artisan Cheese Shop', 'Wine Bar District', 'Specialty Food Market'],
    benefits: ['Palate development', 'Learn about wine regions', 'Social experience', 'Cultural appreciation']
  },
  'Contemporary Art Gallery': {
    locations: ['Modern Art Museum', 'Local Gallery District', 'Artist Studios', 'Cultural Center'],
    benefits: ['Cultural enrichment', 'Spark creativity', 'Support local artists', 'Broaden perspectives']
  }
};

const ActivityDetailModal = ({ activity, isOpen, onClose, onTimeChange, userLocation }) => {
  const [selectedTime, setSelectedTime] = useState(activity.time || '12:00');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [hasTimeUpdated, setHasTimeUpdated] = useState(false);

  // Update selectedTime when activity.time changes (important for reflecting updates)
  useEffect(() => {
    if (activity?.time) {
      setSelectedTime(activity.time);
    }
  }, [activity?.time]);

  // Reset hasTimeUpdated when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setHasTimeUpdated(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const activityInfo = locationSuggestions[activity.name] || {
    locations: ['Local Area', 'City Center', 'Nearby Parks'],
    benefits: ['Personal enjoyment', 'Stress relief', 'New experiences', 'Memory creation']
  };

  const handleTimeUpdate = () => {
    onTimeChange(activity.id, selectedTime);
    setHasTimeUpdated(true);
    // Don't close the modal - let user see the update and choose when to close
  };

  const handleSaveAndClose = () => {
    if (hasTimeUpdated) {
      // Time was already updated, just close
      onClose();
    } else {
      // Update time and then close
      onTimeChange(activity.id, selectedTime);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-lg z-[100] flex items-center justify-center p-2 md:p-4 modal-fade-in">
      <div className="bg-white rounded-2xl md:rounded-3xl max-w-7xl w-full max-h-[95vh] overflow-y-auto shadow-2xl transform animate-scaleIn border border-gray-200 relative mx-2">
        {/* Close button overlay */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onClose}
            className="p-3 bg-white/90 backdrop-blur-md hover:bg-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl group border border-gray-200"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-700 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>
        
        {/* Enhanced Header with better visual hierarchy */}
        <div className="relative overflow-hidden rounded-t-2xl md:rounded-t-3xl">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500"></div>
          
          {/* Content */}
          <div className="relative p-6 md:p-8 text-white">
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm flex-shrink-0">
                <Star className="w-12 h-12 md:w-16 md:h-16" />
              </div>
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">{activity.name}</h2>
                <p className="text-white/90 text-base md:text-lg leading-relaxed">
                  {activity.description}
                </p>
                
                {/* Enhanced Activity Metadata - Responsive Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6">
                  <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">{activity.duration} min</div>
                    <div className="text-xs opacity-80">Duration</div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium capitalize">{activity.category}</div>
                    <div className="text-xs opacity-80">Category</div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
                    <Heart className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium capitalize">{activity.energyLevel}</div>
                    <div className="text-xs opacity-80">Energy Level</div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
                    <Users className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium capitalize">{activity.vibe || 'Social'}</div>
                    <div className="text-xs opacity-80">Vibe</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content with better mobile experience */}
        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
          {/* Time Selection - Improved mobile layout */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 md:p-6 border border-indigo-100">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 mr-3 text-indigo-500" />
              Schedule Time
            </h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg font-medium flex-1 sm:flex-initial"
              />
              <button
                onClick={handleTimeUpdate}
                className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors font-medium text-lg shadow-lg hover:shadow-xl flex-shrink-0"
              >
                {hasTimeUpdated ? '✓ Time Updated' : 'Update Time'}
              </button>
            </div>
          </div>

          {/* Location Suggestions - Enhanced Responsive Grid */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 md:p-6 border border-blue-100">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Compass className="w-5 h-5 md:w-6 md:h-6 mr-3 text-blue-500" />
              Recommended Locations
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
              {activityInfo.locations.map((location, index) => (
                <label key={index} className="flex items-center space-x-3 cursor-pointer p-3 md:p-4 bg-white rounded-xl hover:bg-blue-50 transition-colors border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-md">
                  <input
                    type="radio"
                    name="location"
                    value={location}
                    checked={selectedLocation === location}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="text-blue-500 focus:ring-blue-500 w-4 h-4 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-gray-800 font-medium text-sm md:text-base block truncate">{location}</span>
                    {userLocation && (
                      <div className="text-xs text-gray-500 mt-1">
                        📍 ~{Math.floor(Math.random() * 5) + 1}km away
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Benefits - Enhanced Responsive Grid */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 md:p-6 border border-green-100">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Heart className="w-5 h-5 md:w-6 md:h-6 mr-3 text-green-500" />
              Why You'll Love This Experience
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
              {activityInfo.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 md:p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 mt-1"></div>
                  <span className="text-gray-700 font-medium text-sm md:text-base">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Consideration */}
          {activity.category === 'Outdoor' && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <Sunset className="w-6 h-6 mr-3 text-yellow-500" />
                Weather Considerations
              </h3>
              <div className="bg-white rounded-xl p-4 border border-yellow-200">
                <p className="text-gray-700 font-medium">
                  This is an outdoor activity. Check the weather forecast and consider bringing 
                  appropriate gear. We'll notify you if conditions aren't ideal for your planned time!
                </p>
              </div>
            </div>
          )}

          {/* Pro Tips */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Photo className="w-6 h-6 mr-3 text-purple-500" />
              Pro Tips for Maximum Enjoyment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 font-medium">Arrive 10-15 minutes early to fully enjoy the experience</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 font-medium">Bring a camera or use your phone to capture memories</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 font-medium">Consider combining with nearby activities for a fuller day</span>
                </div>
              </div>
              {activity.vibe === 'social' && (
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 font-medium">Invite friends or meet new people during this activity!</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Action Buttons - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full sm:flex-1 px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold text-lg shadow-md hover:shadow-lg order-2 sm:order-1"
            >
              Close
            </button>
            <button
              onClick={handleSaveAndClose}
              className="w-full sm:flex-1 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 order-1 sm:order-2"
            >
              {hasTimeUpdated ? 'Close & Apply' : 'Save Changes & Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailModal;
