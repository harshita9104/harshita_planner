/**
 * 🎭 Mood Tracker Component - Advanced Emotional Intelligence
 * 
 * This component provides an intuitive mood tracking interface that helps users
 * understand their emotional patterns and get personalized activity recommendations.
 * It integrates seamlessly with the mood tracking service to provide insights.
 */

import React, { useState, useEffect } from 'react';
import { 
  Heart, Smile, Zap, Compass, Palette, Users, 
  Brain, Sun, TrendingUp, Target,
  BarChart3, Sparkles, ChevronRight
} from 'lucide-react';
import { moodDefinitions } from '../../services/moodTrackingService';

const MoodTracker = ({ 
  trackUserMood, 
  currentMood, 
  moodInsights,
  smartSuggestions,
  selectedTheme,
  onMoodBasedActivityRequest
}) => {
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [showInsights, setShowInsights] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [contextualInfo, setContextualInfo] = useState({
    energy: 'medium',
    socialSituation: 'flexible',
    weather: 'unknown'
  });

  // Quick mood selections - most common combinations
  const quickMoodSets = [
    { label: 'Energetic & Social', moods: ['energetic', 'social'], icon: Zap, color: 'bg-gradient-to-r from-orange-400 to-red-500' },
    { label: 'Peaceful & Creative', moods: ['peaceful', 'creative'], icon: Palette, color: 'bg-gradient-to-r from-green-400 to-blue-500' },
    { label: 'Adventurous & Curious', moods: ['adventurous', 'curious'], icon: Compass, color: 'bg-gradient-to-r from-purple-400 to-pink-500' },
    { label: 'Contemplative & Calm', moods: ['contemplative', 'relaxed'], icon: Brain, color: 'bg-gradient-to-r from-indigo-400 to-purple-500' }
  ];

  useEffect(() => {
    if (currentMood && currentMood.length > 0) {
      setSelectedMoods(currentMood);
    }
  }, [currentMood]);

  const handleMoodToggle = (moodKey) => {
    setSelectedMoods(prev => 
      prev.includes(moodKey) 
        ? prev.filter(m => m !== moodKey)
        : [...prev, moodKey]
    );
  };

  const handleQuickMoodSet = (moodSet) => {
    setSelectedMoods(moodSet.moods);
  };

  const handleTrackMood = async () => {
    if (selectedMoods.length === 0) return;
    
    setIsTracking(true);
    try {
      await trackUserMood(selectedMoods, contextualInfo);
      setShowInsights(true);
    } catch (error) {
      console.error('Failed to track mood:', error);
    } finally {
      setIsTracking(false);
    }
  };

  const getMoodIcon = (moodKey) => {
    const iconMap = {
      energetic: Zap,
      peaceful: Heart,
      creative: Palette,
      social: Users,
      adventurous: Compass,
      contemplative: Brain,
      curious: Sparkles,
      relaxed: Sun
    };
    return iconMap[moodKey] || Smile;
  };

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">How are you feeling?</h3>
            <p className="text-sm text-gray-600">Track your mood for personalized suggestions</p>
          </div>
        </div>
        {moodInsights && (
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="flex items-center space-x-2 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-medium">Insights</span>
          </button>
        )}
      </div>

      {/* Quick Mood Sets */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick selections:</h4>
        <div className="grid grid-cols-2 gap-3">
          {quickMoodSets.map((set, index) => {
            const Icon = set.icon;
            const isSelected = set.moods.every(mood => selectedMoods.includes(mood));
            return (
              <button
                key={index}
                onClick={() => handleQuickMoodSet(set)}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  isSelected 
                    ? `${set.color} text-white shadow-lg scale-105` 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{set.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Individual Mood Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Or choose specific moods:</h4>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(moodDefinitions).map(([key, mood]) => {
            const Icon = getMoodIcon(key);
            const isSelected = selectedMoods.includes(key);
            return (
              <button
                key={key}
                onClick={() => handleMoodToggle(key)}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  isSelected 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md scale-105' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                }`}
                title={mood.description}
              >
                <div className="text-center">
                  <div className="text-lg mb-1">{mood.emoji}</div>
                  <div className="text-xs font-medium">{mood.name}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Context Settings */}
      {selectedMoods.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50/50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Context (optional):</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Energy Level</label>
              <select
                value={contextualInfo.energy}
                onChange={(e) => setContextualInfo(prev => ({ ...prev, energy: e.target.value }))}
                className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low Energy</option>
                <option value="medium">Medium Energy</option>
                <option value="high">High Energy</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Social Setting</label>
              <select
                value={contextualInfo.socialSituation}
                onChange={(e) => setContextualInfo(prev => ({ ...prev, socialSituation: e.target.value }))}
                className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="solo">Solo Time</option>
                <option value="pair">With Partner</option>
                <option value="small-group">Small Group</option>
                <option value="large-group">Large Group</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Weather Feel</label>
              <select
                value={contextualInfo.weather}
                onChange={(e) => setContextualInfo(prev => ({ ...prev, weather: e.target.value }))}
                className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="unknown">Unknown</option>
                <option value="sunny">Sunny</option>
                <option value="cloudy">Cloudy</option>
                <option value="rainy">Rainy</option>
                <option value="windy">Windy</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Track Mood Button */}
      {selectedMoods.length > 0 && (
        <button
          onClick={handleTrackMood}
          disabled={isTracking}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTracking ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Tracking...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Track Mood & Get Suggestions</span>
            </div>
          )}
        </button>
      )}

      {/* Mood Insights */}
      {showInsights && moodInsights && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Your Mood Patterns
          </h4>
          
          {moodInsights.dominantMoods && moodInsights.dominantMoods.length > 0 ? (
            <div className="space-y-3">
              <div>
                <h5 className="text-xs font-medium text-gray-600 mb-2">Most Frequent Moods:</h5>
                <div className="flex flex-wrap gap-2">
                  {moodInsights.dominantMoods.slice(0, 3).map(({ mood, percentage }) => (
                    <span
                      key={mood}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                    >
                      {moodDefinitions[mood]?.emoji} {moodDefinitions[mood]?.name} ({percentage}%)
                    </span>
                  ))}
                </div>
              </div>
              
              {moodInsights.recommendations && moodInsights.recommendations.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-gray-600 mb-2">Personalized Tips:</h5>
                  <ul className="space-y-1">
                    {moodInsights.recommendations.slice(0, 2).map((rec, index) => (
                      <li key={index} className="text-xs text-gray-700 flex items-start">
                        <ChevronRight className="w-3 h-3 mt-0.5 mr-1 text-gray-500" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-600">Track your mood a few times to see personalized insights!</p>
          )}
        </div>
      )}

      {/* Smart Suggestions Preview */}
      {smartSuggestions && smartSuggestions.moodBased && smartSuggestions.moodBased.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            Mood-Based Suggestions
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {smartSuggestions.moodBased.slice(0, 3).map((activity, index) => (
              <button
                key={index}
                onClick={() => onMoodBasedActivityRequest && onMoodBasedActivityRequest(activity)}
                className="p-3 bg-white/50 rounded-lg border border-gray-200 hover:bg-white/70 transition-colors text-left"
              >
                <div className="text-xs font-medium text-gray-800 mb-1">{activity.name}</div>
                <div className="text-xs text-gray-600">{activity.vibe}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
