/**
 * 🎉 Holiday Recommendations Component
 * 
 * A beautiful, interactive component that showcases upcoming holidays and long weekend
 * opportunities with smart suggestions and planning tips. This component demonstrates
 * the holiday awareness feature and provides users with proactive planning assistance.
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, Sparkles, Gift, 
  TrendingUp, Users, Heart, Zap, ChevronRight,
  Star, Sun, Cloud, Snowflake, Flower2
} from 'lucide-react';

const HolidayRecommendations = ({ 
  holidayRecommendations, 
  suggestLongWeekendPlan, 
  applyTheme,
  selectedTheme,
  userLocation 
}) => {
  const [expandedHoliday, setExpandedHoliday] = useState(null);
  const [longWeekendSuggestion, setLongWeekendSuggestion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-check for long weekend opportunities on component mount
  useEffect(() => {
    checkLongWeekendOpportunities();
  }, []);

  const checkLongWeekendOpportunities = async () => {
    setIsLoading(true);
    try {
      const suggestion = await suggestLongWeekendPlan();
      setLongWeekendSuggestion(suggestion);
    } catch (error) {
      console.error('Failed to get long weekend suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyHolidayTheme = (holiday) => {
    // Map holiday vibes to existing themes
    const themeMapping = {
      'festive': 'socialButterfly',
      'reflective': 'mindfulEscape',
      'adventurous': 'urbanExplorer',
      'creative': 'creativeSoul',
      'nature': 'wellnessWarrior',
      'romantic': 'luxurySeeker',
      'family': 'socialButterfly',
      'cozy': 'mindfulEscape'
    };
    
    const suggestedTheme = themeMapping[holiday.vibe] || selectedTheme;
    applyTheme(suggestedTheme);
  };

  const getSeasonIcon = (season) => {
    const icons = {
      spring: <Flower2 className="w-5 h-5 text-green-500" />,
      summer: <Sun className="w-5 h-5 text-yellow-500" />,
      fall: <Cloud className="w-5 h-5 text-orange-500" />,
      winter: <Snowflake className="w-5 h-5 text-blue-500" />
    };
    return icons[season] || <Sun className="w-5 h-5" />;
  };

  const getVibeEmoji = (vibe) => {
    const vibes = {
      festive: '🎊',
      reflective: '🧘',
      adventurous: '🗺️',
      creative: '🎨',
      nature: '🌿',
      romantic: '💕',
      family: '👨‍👩‍👧‍👦',
      cozy: '🏠',
      energetic: '⚡',
      social: '👥'
    };
    return vibes[vibe] || '✨';
  };

  if (!holidayRecommendations || holidayRecommendations.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <Gift className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Upcoming Holidays</h3>
        <p className="text-gray-500">Check back later for holiday planning opportunities!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-2xl">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Holiday Planning Assistant
            </h2>
            <p className="text-gray-600">Smart suggestions for upcoming celebrations</p>
          </div>
        </div>
      </div>

      {/* Long Weekend Opportunity Banner */}
      {longWeekendSuggestion && (
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full transform translate-x-16 -translate-y-16" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8" />
                <div>
                  <h3 className="text-xl font-bold">Long Weekend Alert!</h3>
                  <p className="text-purple-100">{longWeekendSuggestion.holiday.name} in {longWeekendSuggestion.holiday.daysUntil} days</p>
                </div>
              </div>
              <button 
                onClick={() => applyTheme(longWeekendSuggestion.recommendedTheme || selectedTheme)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                Plan Now
              </button>
            </div>
            <p className="text-purple-100 mb-4">{longWeekendSuggestion.personalizedMessage}</p>
            <div className="flex flex-wrap gap-2">
              {longWeekendSuggestion.planningTips?.slice(0, 2).map((tip, index) => (
                <span key={index} className="bg-white bg-opacity-20 px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                  💡 {tip}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Holiday Cards */}
      <div className="grid gap-6">
        {holidayRecommendations.slice(0, 3).map((holiday, index) => (
          <div key={holiday.date.toISOString()} className="glass-card hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              {/* Holiday Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
                    <span className="text-2xl">{getVibeEmoji(holiday.vibe)}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{holiday.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{holiday.date.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{holiday.daysUntil} days away</span>
                      </div>
                      {holiday.seasonalContext && (
                        <div className="flex items-center space-x-1">
                          {getSeasonIcon(holiday.seasonalContext.season)}
                          <span className="capitalize">{holiday.seasonalContext.season}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedHoliday(expandedHoliday === index ? null : index)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className={`w-5 h-5 transition-transform ${expandedHoliday === index ? 'rotate-90' : ''}`} />
                </button>
              </div>

              {/* Holiday Type Badge */}
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  holiday.type === 'national' ? 'bg-red-100 text-red-800' :
                  holiday.type === 'cultural' ? 'bg-purple-100 text-purple-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {holiday.type.charAt(0).toUpperCase() + holiday.type.slice(1)}
                </span>
                <span className="text-sm text-gray-600">{holiday.vibe} vibes</span>
              </div>

              {/* Personalized Message */}
              <p className="text-gray-700 mb-4 italic">"{holiday.personalizedMessage}"</p>

              {/* Long Weekend Opportunity */}
              {holiday.longWeekendOpportunity && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-4 border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">{holiday.longWeekendOpportunity.type}</span>
                  </div>
                  <p className="text-green-700 text-sm mb-2">{holiday.longWeekendOpportunity.suggestion}</p>
                  <div className="flex flex-wrap gap-1">
                    {holiday.longWeekendOpportunity.days.map(day => (
                      <span key={day} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Expanded Content */}
              {expandedHoliday === index && (
                <div className="space-y-4 pt-4 border-t border-gray-200 fade-in">
                  {/* Recommended Activities */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Star className="w-4 h-4 mr-2 text-yellow-500" />
                      Perfect Activities for This Holiday
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {holiday.recommendedActivities?.slice(0, 4).map((activityId, actIndex) => (
                        <div key={actIndex} className="bg-gray-50 rounded-lg p-3 text-sm">
                          <span className="font-medium text-gray-800 capitalize">
                            {activityId.replace(/-/g, ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Planning Tips */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-blue-500" />
                      Smart Planning Tips
                    </h4>
                    <div className="space-y-2">
                      {holiday.planningTips?.map((tip, tipIndex) => (
                        <div key={tipIndex} className="flex items-start space-x-2 text-sm text-gray-700">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={() => handleApplyHolidayTheme(holiday)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 font-medium text-sm"
                    >
                      Apply Holiday Theme
                    </button>
                    {userLocation && (
                      <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-colors font-medium text-sm">
                        Find Local Events
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="loading-spinner mx-auto mb-3"></div>
          <p className="text-gray-600">Finding the best holiday opportunities...</p>
        </div>
      )}
    </div>
  );
};

export default HolidayRecommendations;
