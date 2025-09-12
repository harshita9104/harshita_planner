/**
 * 🎨 Theme Customizer Component - Advanced Personalization
 * 
 * This component provides users with advanced theme customization options,
 * including color schemes, mood-based themes, and personalized preferences.
 * It demonstrates the personalization capabilities of the application.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Palette, Settings, Moon, Sun, Sparkles, Heart,
  Eye, Download, Upload, RefreshCw, Check,
  Star, Wand2, Lightbulb, Flower2
} from 'lucide-react';

const ThemeCustomizer = ({ 
  selectedTheme,
  applyTheme,
  themes,
  currentMood = [],
  saveCustomTheme,
  loadCustomThemes
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColors, setCustomColors] = useState({
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    background: '#f8fafc'
  });
  const [customTheme, setCustomTheme] = useState({
    name: '',
    description: '',
    mood: 'energetic',
    colors: customColors
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [savedThemes, setSavedThemes] = useState([]);

  useEffect(() => {
    loadSavedThemes();
  }, []);

  const loadSavedThemes = async () => {
    try {
      if (loadCustomThemes) {
        const themes = await loadCustomThemes();
        setSavedThemes(themes || []);
      }
    } catch (error) {
      console.error('Failed to load custom themes:', error);
    }
  };

  const moodBasedThemes = {
    energetic: {
      name: 'Energetic Burst',
      colors: { primary: '#f59e0b', secondary: '#ef4444', accent: '#10b981', background: '#fff7ed' },
      description: 'Vibrant and energizing colors for high-energy activities'
    },
    peaceful: {
      name: 'Serene Calm',
      colors: { primary: '#06b6d4', secondary: '#0ea5e9', accent: '#10b981', background: '#f0f9ff' },
      description: 'Calming blues and greens for peaceful moments'
    },
    creative: {
      name: 'Creative Flow',
      colors: { primary: '#8b5cf6', secondary: '#a855f7', accent: '#ec4899', background: '#faf5ff' },
      description: 'Inspiring purples and pinks for creative pursuits'
    },
    adventurous: {
      name: 'Adventure Ready',
      colors: { primary: '#dc2626', secondary: '#ea580c', accent: '#84cc16', background: '#fef2f2' },
      description: 'Bold reds and oranges for exciting adventures'
    },
    contemplative: {
      name: 'Deep Thought',
      colors: { primary: '#374151', secondary: '#6b7280', accent: '#6366f1', background: '#f9fafb' },
      description: 'Sophisticated grays for reflective activities'
    }
  };

  const timeBasedThemes = {
    morning: {
      name: 'Morning Light',
      colors: { primary: '#fbbf24', secondary: '#f59e0b', accent: '#10b981', background: '#fffbeb' },
      icon: Sun,
      description: 'Warm sunrise colors for morning activities'
    },
    afternoon: {
      name: 'Afternoon Sky',
      colors: { primary: '#3b82f6', secondary: '#1d4ed8', accent: '#06b6d4', background: '#eff6ff' },
      icon: Eye,
      description: 'Clear blue skies for afternoon adventures'
    },
    evening: {
      name: 'Golden Hour',
      colors: { primary: '#f97316', secondary: '#ea580c', accent: '#fbbf24', background: '#fff7ed' },
      icon: Star,
      description: 'Warm golden tones for evening relaxation'
    },
    night: {
      name: 'Midnight Mode',
      colors: { primary: '#4c1d95', secondary: '#5b21b6', accent: '#7c3aed', background: '#1e1b4b' },
      icon: Moon,
      description: 'Deep purples for nighttime activities'
    }
  };

  const seasonalThemes = {
    spring: {
      name: 'Spring Bloom',
      colors: { primary: '#10b981', secondary: '#059669', accent: '#f59e0b', background: '#ecfdf5' },
      icon: Flower2,
      description: 'Fresh greens and yellow for spring renewal'
    },
    summer: {
      name: 'Summer Vibes',
      colors: { primary: '#0ea5e9', secondary: '#0284c7', accent: '#eab308', background: '#f0f9ff' },
      icon: Sun,
      description: 'Bright blues and yellows for summer fun'
    },
    autumn: {
      name: 'Autumn Leaves',
      colors: { primary: '#ea580c', secondary: '#dc2626', accent: '#f59e0b', background: '#fff7ed' },
      icon: Sparkles,
      description: 'Warm oranges and reds for autumn comfort'
    },
    winter: {
      name: 'Winter Frost',
      colors: { primary: '#6366f1', secondary: '#4338ca', accent: '#06b6d4', background: '#f8fafc' },
      icon: Star,
      description: 'Cool blues and purples for winter elegance'
    }
  };

  const handleColorChange = (colorKey, value) => {
    setCustomColors(prev => ({ ...prev, [colorKey]: value }));
    setCustomTheme(prev => ({ ...prev, colors: { ...prev.colors, [colorKey]: value } }));
  };

  const applyMoodTheme = (mood) => {
    const theme = moodBasedThemes[mood];
    if (theme) {
      setCustomColors(theme.colors);
      setCustomTheme(prev => ({ ...prev, ...theme, mood }));
      if (previewMode) {
        applyTemporaryTheme(theme.colors);
      }
    }
  };

  const applyTimeTheme = (time) => {
    const theme = timeBasedThemes[time];
    if (theme) {
      setCustomColors(theme.colors);
      setCustomTheme(prev => ({ ...prev, ...theme, mood: time }));
      if (previewMode) {
        applyTemporaryTheme(theme.colors);
      }
    }
  };

  const applySeasonalTheme = (season) => {
    const theme = seasonalThemes[season];
    if (theme) {
      setCustomColors(theme.colors);
      setCustomTheme(prev => ({ ...prev, ...theme, mood: season }));
      if (previewMode) {
        applyTemporaryTheme(theme.colors);
      }
    }
  };

  const applyTemporaryTheme = (colors) => {
    // Apply colors to CSS custom properties for preview
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-secondary', colors.secondary);
    root.style.setProperty('--theme-accent', colors.accent);
    root.style.setProperty('--theme-background', colors.background);
  };

  const resetToDefault = () => {
    const defaultTheme = themes[selectedTheme];
    if (defaultTheme) {
      // Reset CSS custom properties
      const root = document.documentElement;
      root.style.removeProperty('--theme-primary');
      root.style.removeProperty('--theme-secondary');
      root.style.removeProperty('--theme-accent');
      root.style.removeProperty('--theme-background');
    }
  };

  const handleSaveTheme = async () => {
    if (!customTheme.name.trim()) {
      alert('Please enter a theme name');
      return;
    }

    try {
      if (saveCustomTheme) {
        await saveCustomTheme(customTheme);
        await loadSavedThemes();
        alert('Theme saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save theme:', error);
      alert('Failed to save theme');
    }
  };

  const getCurrentTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  };

  const suggestedMood = currentMood.length > 0 ? currentMood[0] : 'energetic';
  const currentTime = getCurrentTime();
  const currentSeason = getCurrentSeason();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 flex items-center justify-center group"
      >
        <Palette className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Theme Customizer</h2>
                <p className="text-sm text-gray-600">Personalize your Weekendly experience</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  previewMode
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Eye className="w-4 h-4 inline mr-1" />
                {previewMode ? 'Previewing' : 'Preview'}
              </button>
              <button
                onClick={() => {
                  resetToDefault();
                  setIsOpen(false);
                }}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Smart Suggestions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" />
              Smart Suggestions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Mood-based suggestion */}
              {moodBasedThemes[suggestedMood] && (
                <button
                  onClick={() => applyMoodTheme(suggestedMood)}
                  className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg text-left hover:shadow-md transition-all"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span className="text-sm font-medium text-gray-800">Based on your mood</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-1">
                    {moodBasedThemes[suggestedMood].name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {moodBasedThemes[suggestedMood].description}
                  </div>
                </button>
              )}

              {/* Time-based suggestion */}
              <button
                onClick={() => applyTimeTheme(currentTime)}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg text-left hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-2 mb-2">
                  {React.createElement(timeBasedThemes[currentTime].icon, { className: "w-4 h-4 text-blue-500" })}
                  <span className="text-sm font-medium text-gray-800">Perfect for now</span>
                </div>
                <div className="text-lg font-semibold text-gray-800 mb-1">
                  {timeBasedThemes[currentTime].name}
                </div>
                <div className="text-xs text-gray-600">
                  {timeBasedThemes[currentTime].description}
                </div>
              </button>

              {/* Seasonal suggestion */}
              <button
                onClick={() => applySeasonalTheme(currentSeason)}
                className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg text-left hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-2 mb-2">
                  {React.createElement(seasonalThemes[currentSeason].icon, { className: "w-4 h-4 text-green-500" })}
                  <span className="text-sm font-medium text-gray-800">Seasonal choice</span>
                </div>
                <div className="text-lg font-semibold text-gray-800 mb-1">
                  {seasonalThemes[currentSeason].name}
                </div>
                <div className="text-xs text-gray-600">
                  {seasonalThemes[currentSeason].description}
                </div>
              </button>
            </div>
          </div>

          {/* Custom Color Picker */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Wand2 className="w-5 h-5 mr-2" />
              Custom Colors
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(customColors).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {key}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Custom Theme */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Save Custom Theme
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme Name</label>
                <input
                  type="text"
                  value={customTheme.name}
                  onChange={(e) => setCustomTheme(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Awesome Theme"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={customTheme.description}
                  onChange={(e) => setCustomTheme(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Perfect for relaxing weekends"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <button
              onClick={handleSaveTheme}
              disabled={!customTheme.name.trim()}
              className="mt-3 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 inline mr-2" />
              Save Theme
            </button>
          </div>

          {/* Saved Themes */}
          {savedThemes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Your Saved Themes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {savedThemes.map((theme, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCustomColors(theme.colors);
                      setCustomTheme(theme);
                      if (previewMode) {
                        applyTemporaryTheme(theme.colors);
                      }
                    }}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-left hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-medium text-gray-800 mb-1">{theme.name}</div>
                    <div className="text-xs text-gray-600 mb-2">{theme.description}</div>
                    <div className="flex space-x-1">
                      {Object.values(theme.colors).map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="w-4 h-4 rounded border border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {previewMode ? 'Preview mode active - changes are temporary' : 'Click Preview to see changes'}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={resetToDefault}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Reset
              </button>
              <button
                onClick={() => {
                  if (previewMode) {
                    resetToDefault();
                  }
                  setIsOpen(false);
                }}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Check className="w-4 h-4 inline mr-2" />
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
