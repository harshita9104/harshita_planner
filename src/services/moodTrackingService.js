/**
 *  Mood Tracking & Vibe Analysis Service
 * 
 * This service provides sophisticated mood tracking and vibe analysis to help users
 * understand their preferences and get personalized recommendations based on their
 * emotional patterns and desired experiences.
 * 
 * Features:
 * • Comprehensive mood tracking with multiple dimensions
 * • Vibe analysis and pattern recognition
 * • Personalized recommendations based on mood history
 * • Emotional journey mapping and insights
 * • Social mood sharing and comparison
 */

// Enhanced mood and vibe definitions
export const moodDefinitions = {
  // Primary Emotions
  energetic: {
    name: 'Energetic',
    emoji: '⚡',
    color: '#FF6B35',
    description: 'Feeling pumped and ready for high-energy activities',
    suggestedActivities: ['dance-workshop', 'mountain-expedition', 'urban-cycling', 'street-food-adventure'],
    opposites: ['relaxed', 'tired'],
    complementary: ['adventurous', 'social']
  },
  
  relaxed: {
    name: 'Relaxed',
    emoji: '😌',
    color: '#4ECDC4',
    description: 'Peaceful and looking for gentle, calming experiences',
    suggestedActivities: ['mindfulness-retreat', 'holistic-spa', 'botanical-picnic', 'wine-discovery'],
    opposites: ['energetic', 'stressed'],
    complementary: ['mindful', 'content']
  },

  creative: {
    name: 'Creative',
    emoji: '🎨',
    color: '#9B59B6',
    description: 'Inspired and eager to express yourself artistically',
    suggestedActivities: ['cultural-workshop', 'gallery-exploration', 'collaborative-cooking', 'photography-walk'],
    opposites: ['routine', 'analytical'],
    complementary: ['curious', 'expressive']
  },

  social: {
    name: 'Social',
    emoji: '👥',
    color: '#3498DB',
    description: 'Wanting to connect and share experiences with others',
    suggestedActivities: ['networking-meetup', 'farmers-market', 'trivia-championship', 'dance-workshop'],
    opposites: ['introverted', 'solitary'],
    complementary: ['energetic', 'happy']
  },

  contemplative: {
    name: 'Contemplative',
    emoji: '🤔',
    color: '#7F8C8D',
    description: 'Reflective and seeking meaningful, thought-provoking experiences',
    suggestedActivities: ['literary-journey', 'gallery-exploration', 'mindfulness-retreat', 'astronomy-night'],
    opposites: ['impulsive', 'scattered'],
    complementary: ['peaceful', 'curious']
  },

  adventurous: {
    name: 'Adventurous',
    emoji: '🗺️',
    color: '#E67E22',
    description: 'Ready to explore new places and try exciting experiences',
    suggestedActivities: ['photography-expedition', 'street-food-adventure', 'urban-cycling', 'mountain-expedition'],
    opposites: ['cautious', 'routine'],
    complementary: ['energetic', 'curious']
  },

  // Secondary Emotions
  romantic: {
    name: 'Romantic',
    emoji: '💕',
    color: '#E91E63',
    description: 'In the mood for intimate and loving experiences',
    suggestedActivities: ['wine-discovery', 'live-performance', 'botanical-picnic', 'cinema-experience'],
    opposites: ['platonic', 'solitary'],
    complementary: ['relaxed', 'happy']
  },

  curious: {
    name: 'Curious',
    emoji: '🔍',
    color: '#FF9800',
    description: 'Eager to learn and discover new things',
    suggestedActivities: ['gallery-exploration', 'cultural-workshop', 'photography-walk', 'farmers-market'],
    opposites: ['disinterested', 'familiar'],
    complementary: ['adventurous', 'creative']
  },

  nostalgic: {
    name: 'Nostalgic',
    emoji: '📻',
    color: '#795548',
    description: 'Longing for familiar comforts and cherished memories',
    suggestedActivities: ['cinema-experience', 'gourmet-brunch', 'literary-journey', 'live-performance'],
    opposites: ['futuristic', 'modern'],
    complementary: ['contemplative', 'romantic']
  },

  spontaneous: {
    name: 'Spontaneous',
    emoji: '🎲',
    color: '#607D8B',
    description: 'Ready for impromptu adventures and unexpected discoveries',
    suggestedActivities: ['street-food-adventure', 'photography-walk', 'farmers-market', 'urban-cycling'],
    opposites: ['planned', 'structured'],
    complementary: ['adventurous', 'energetic']
  }
};

// Vibe categories with enhanced attributes
export const vibeCategories = {
  chill: {
    name: 'Chill Vibes',
    emoji: '🌊',
    gradient: 'from-blue-400 to-teal-500',
    description: 'Low-key, peaceful, and unhurried experiences',
    intensity: 'low',
    socialLevel: 'flexible',
    timeOfDay: ['morning', 'afternoon'],
    weather: ['any'],
    duration: 'flexible'
  },

  vibrant: {
    name: 'Vibrant Energy',
    emoji: '🌟',
    gradient: 'from-orange-400 to-red-500',
    description: 'High-energy, dynamic, and stimulating activities',
    intensity: 'high',
    socialLevel: 'group',
    timeOfDay: ['afternoon', 'evening'],
    weather: ['sunny', 'clear'],
    duration: 'extended'
  },

  sophisticated: {
    name: 'Sophisticated',
    emoji: '🥂',
    gradient: 'from-purple-500 to-indigo-600',
    description: 'Refined, cultured, and elegant experiences',
    intensity: 'medium',
    socialLevel: 'intimate',
    timeOfDay: ['evening', 'night'],
    weather: ['any'],
    duration: 'moderate'
  },

  whimsical: {
    name: 'Whimsical',
    emoji: '🎪',
    gradient: 'from-pink-400 to-purple-500',
    description: 'Playful, imaginative, and delightfully unexpected',
    intensity: 'medium',
    socialLevel: 'small-group',
    timeOfDay: ['afternoon'],
    weather: ['pleasant'],
    duration: 'moderate'
  },

  grounding: {
    name: 'Grounding',
    emoji: '🌱',
    gradient: 'from-green-400 to-blue-500',
    description: 'Centering, mindful, and connecting with nature',
    intensity: 'low',
    socialLevel: 'solo-or-pair',
    timeOfDay: ['morning', 'afternoon'],
    weather: ['mild', 'sunny'],
    duration: 'flexible'
  },

  mysterious: {
    name: 'Mysterious',
    emoji: '🌙',
    gradient: 'from-gray-700 to-purple-800',
    description: 'Intriguing, enigmatic, and thought-provoking',
    intensity: 'medium',
    socialLevel: 'intimate',
    timeOfDay: ['evening', 'night'],
    weather: ['any'],
    duration: 'extended'
  }
};

class MoodTrackingService {
  constructor() {
    this.moodHistory = new Map();
    this.vibePatterns = new Map();
    this.recommendations = new Map();
    this.loadMoodData();
  }

  // Load existing mood data
  async loadMoodData() {
    try {
      const savedMoods = localStorage.getItem('weekendly-mood-history');
      if (savedMoods) {
        const moodData = JSON.parse(savedMoods);
        this.moodHistory = new Map(Object.entries(moodData));
      }

      const savedVibes = localStorage.getItem('weekendly-vibe-patterns');
      if (savedVibes) {
        const vibeData = JSON.parse(savedVibes);
        this.vibePatterns = new Map(Object.entries(vibeData));
      }
    } catch (error) {
      console.warn('Failed to load mood data:', error);
    }
  }

  // Save mood data
  async saveMoodData() {
    try {
      localStorage.setItem('weekendly-mood-history', JSON.stringify(Object.fromEntries(this.moodHistory)));
      localStorage.setItem('weekendly-vibe-patterns', JSON.stringify(Object.fromEntries(this.vibePatterns)));
    } catch (error) {
      console.error('Failed to save mood data:', error);
    }
  }

  // Track user's current mood
  async trackMood(moods, context = {}) {
    const moodEntry = {
      id: `mood_${Date.now()}`,
      moods: Array.isArray(moods) ? moods : [moods],
      timestamp: new Date().toISOString(),
      context: {
        timeOfDay: this.getTimeOfDay(),
        weather: context.weather || 'unknown',
        location: context.location || 'unknown',
        socialSituation: context.socialSituation || 'unknown',
        energy: context.energy || 'medium',
        ...context
      },
      activities: context.plannedActivities || []
    };

    // Store in mood history
    this.moodHistory.set(moodEntry.id, moodEntry);

    // Update vibe patterns
    this.updateVibePatterns(moodEntry);

    // Save to storage
    await this.saveMoodData();

    // Generate fresh recommendations
    this.generateMoodBasedRecommendations(moodEntry);

    return moodEntry;
  }

  // Update vibe patterns for learning
  updateVibePatterns(moodEntry) {
    moodEntry.moods.forEach(mood => {
      const pattern = this.vibePatterns.get(mood) || {
        frequency: 0,
        contexts: {},
        outcomes: {},
        timePatterns: {},
        seasonalPatterns: {},
        socialPatterns: {}
      };

      pattern.frequency++;
      
      // Track context patterns
      const timeOfDay = moodEntry.context.timeOfDay;
      pattern.timePatterns[timeOfDay] = (pattern.timePatterns[timeOfDay] || 0) + 1;

      const season = this.getCurrentSeason();
      pattern.seasonalPatterns[season] = (pattern.seasonalPatterns[season] || 0) + 1;

      const social = moodEntry.context.socialSituation;
      pattern.socialPatterns[social] = (pattern.socialPatterns[social] || 0) + 1;

      this.vibePatterns.set(mood, pattern);
    });
  }

  // Get personalized mood-based recommendations
  generateMoodBasedRecommendations(moodEntry) {
    const recommendations = [];

    moodEntry.moods.forEach(mood => {
      const moodDef = moodDefinitions[mood];
      if (!moodDef) return;

      // Get base activity suggestions
      const activities = moodDef.suggestedActivities;

      // Enhance with context-aware filtering
      const contextualActivities = this.filterActivitiesByContext(activities, moodEntry.context);

      // Add complementary mood suggestions
      const complementaryMoods = moodDef.complementary || [];
      const complementaryActivities = complementaryMoods.flatMap(complementaryMood => 
        moodDefinitions[complementaryMood]?.suggestedActivities || []
      );

      recommendations.push({
        mood,
        primaryActivities: contextualActivities,
        complementaryActivities: [...new Set(complementaryActivities)],
        reasoning: this.generateRecommendationReasoning(mood, moodEntry.context),
        confidence: this.calculateRecommendationConfidence(mood, moodEntry.context)
      });
    });

    this.recommendations.set(moodEntry.id, recommendations);
    return recommendations;
  }

  // Filter activities based on context
  filterActivitiesByContext(activities, context) {
    return activities.filter(activity => {
      // Time of day filtering
      if (context.timeOfDay === 'evening' && activity.includes('sunrise')) return false;
      if (context.timeOfDay === 'morning' && activity.includes('night')) return false;

      // Weather filtering
      if (context.weather === 'rainy' && activity.includes('expedition')) return false;
      if (context.weather === 'rainy' && activity.includes('cycling')) return false;

      // Energy level filtering
      if (context.energy === 'low' && activity.includes('expedition')) return false;
      if (context.energy === 'high' && activity.includes('spa')) return false;

      return true;
    });
  }

  // Generate explanation for recommendations
  generateRecommendationReasoning(mood, context) {
    const moodDef = moodDefinitions[mood];
    const timeOfDay = context.timeOfDay;
    const weather = context.weather;
    const energy = context.energy;

    let reasoning = `Based on your ${moodDef.name.toLowerCase()} mood`;

    if (timeOfDay) {
      reasoning += ` and the fact that it's ${timeOfDay}`;
    }

    if (weather && weather !== 'unknown') {
      reasoning += `, considering the ${weather} weather`;
    }

    if (energy && energy !== 'medium') {
      reasoning += ` and your ${energy} energy level`;
    }

    reasoning += ', here are activities that match your vibe.';

    return reasoning;
  }

  // Calculate confidence score for recommendations
  calculateRecommendationConfidence(mood, context) {
    let confidence = 0.5; // Base confidence

    // Increase confidence based on data availability
    const pattern = this.vibePatterns.get(mood);
    if (pattern) {
      confidence += Math.min(pattern.frequency * 0.1, 0.3); // Max 0.3 boost from frequency

      // Context match bonuses
      if (pattern.timePatterns[context.timeOfDay]) {
        confidence += 0.1;
      }
      if (pattern.socialPatterns[context.socialSituation]) {
        confidence += 0.1;
      }
    }

    return Math.min(confidence, 1.0);
  }

  // Get mood insights and patterns
  getMoodInsights(timeRange = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRange);

    const recentMoods = Array.from(this.moodHistory.values())
      .filter(entry => new Date(entry.timestamp) >= cutoffDate);

    if (recentMoods.length === 0) {
      return {
        message: 'Start tracking your moods to see personalized insights!',
        suggestions: this.getDefaultMoodSuggestions()
      };
    }

    // Analyze patterns
    const moodFrequency = {};
    const timePatterns = {};
    const weatherPatterns = {};
    const outcomes = {};

    recentMoods.forEach(entry => {
      entry.moods.forEach(mood => {
        moodFrequency[mood] = (moodFrequency[mood] || 0) + 1;
        
        const hour = new Date(entry.timestamp).getHours();
        const timeSlot = this.getTimeSlot(hour);
        timePatterns[`${mood}_${timeSlot}`] = (timePatterns[`${mood}_${timeSlot}`] || 0) + 1;
        
        if (entry.context.weather && entry.context.weather !== 'unknown') {
          weatherPatterns[`${mood}_${entry.context.weather}`] = (weatherPatterns[`${mood}_${entry.context.weather}`] || 0) + 1;
        }
      });
    });

    // Find dominant moods
    const sortedMoods = Object.entries(moodFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    // Generate insights
    const insights = {
      dominantMoods: sortedMoods.map(([mood, count]) => ({
        mood,
        count,
        percentage: Math.round((count / recentMoods.length) * 100),
        definition: moodDefinitions[mood]
      })),
      timePatterns: this.analyzeTimePatterns(timePatterns),
      weatherInfluence: this.analyzeWeatherPatterns(weatherPatterns),
      moodEvolution: this.analyzeMoodEvolution(recentMoods),
      recommendations: this.generateInsightRecommendations(sortedMoods, timePatterns)
    };

    return insights;
  }

  // Analyze time-based mood patterns
  analyzeTimePatterns(timePatterns) {
    const patterns = {};
    const timeSlots = ['morning', 'afternoon', 'evening', 'night'];

    timeSlots.forEach(slot => {
      const slotMoods = Object.entries(timePatterns)
        .filter(([key]) => key.endsWith(`_${slot}`))
        .map(([key, count]) => ({ mood: key.split('_')[0], count }))
        .sort((a, b) => b.count - a.count);

      if (slotMoods.length > 0) {
        patterns[slot] = slotMoods[0].mood;
      }
    });

    return patterns;
  }

  // Analyze weather influence on mood
  analyzeWeatherPatterns(weatherPatterns) {
    const patterns = {};
    const weathers = ['sunny', 'cloudy', 'rainy', 'windy'];

    weathers.forEach(weather => {
      const weatherMoods = Object.entries(weatherPatterns)
        .filter(([key]) => key.endsWith(`_${weather}`))
        .map(([key, count]) => ({ mood: key.split('_')[0], count }))
        .sort((a, b) => b.count - a.count);

      if (weatherMoods.length > 0) {
        patterns[weather] = weatherMoods[0].mood;
      }
    });

    return patterns;
  }

  // Analyze mood evolution over time
  analyzeMoodEvolution(recentMoods) {
    const evolution = recentMoods
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .slice(-10) // Last 10 entries
      .map(entry => ({
        date: entry.timestamp.split('T')[0],
        moods: entry.moods,
        primary: entry.moods[0] // First mood as primary
      }));

    return evolution;
  }

  // Generate recommendations based on insights
  generateInsightRecommendations(dominantMoods, timePatterns) {
    const recommendations = [];

    // Recommendation based on dominant mood
    if (dominantMoods.length > 0) {
      const [primaryMood] = dominantMoods[0];
      const moodDef = moodDefinitions[primaryMood];
      
      if (moodDef) {
        recommendations.push({
          type: 'dominant_mood',
          title: `Embrace Your ${moodDef.name} Nature`,
          description: `You often feel ${moodDef.name.toLowerCase()}. Try planning activities that match this energy.`,
          activities: moodDef.suggestedActivities.slice(0, 3),
          priority: 'high'
        });

        // Recommend exploring opposite moods for balance
        if (moodDef.opposites && moodDef.opposites.length > 0) {
          const oppositeMood = moodDef.opposites[0];
          const oppositeDef = moodDefinitions[oppositeMood];
          
          if (oppositeDef) {
            recommendations.push({
              type: 'balance',
              title: `Find Balance with ${oppositeDef.name} Activities`,
              description: `Since you're often ${moodDef.name.toLowerCase()}, try some ${oppositeDef.name.toLowerCase()} activities for balance.`,
              activities: oppositeDef.suggestedActivities.slice(0, 2),
              priority: 'medium'
            });
          }
        }
      }
    }

    return recommendations;
  }

  // Get mood compatibility for group planning
  calculateGroupMoodCompatibility(userMoods, friendMoods) {
    const compatibility = {
      score: 0,
      sharedMoods: [],
      conflictingMoods: [],
      recommendedActivities: [],
      compromiseActivities: []
    };

    // Find shared moods
    compatibility.sharedMoods = userMoods.filter(mood => friendMoods.includes(mood));
    compatibility.score += compatibility.sharedMoods.length * 20;

    // Find conflicting moods
    userMoods.forEach(userMood => {
      const userMoodDef = moodDefinitions[userMood];
      if (userMoodDef && userMoodDef.opposites) {
        const conflicts = friendMoods.filter(friendMood => 
          userMoodDef.opposites.includes(friendMood)
        );
        compatibility.conflictingMoods.push(...conflicts);
      }
    });

    compatibility.score -= compatibility.conflictingMoods.length * 10;

    // Find complementary moods
    const complementaryMatches = userMoods.filter(userMood => {
      const userMoodDef = moodDefinitions[userMood];
      return userMoodDef && userMoodDef.complementary && 
             userMoodDef.complementary.some(comp => friendMoods.includes(comp));
    });

    compatibility.score += complementaryMatches.length * 15;

    // Generate activity recommendations
    if (compatibility.sharedMoods.length > 0) {
      const sharedActivities = compatibility.sharedMoods.flatMap(mood => 
        moodDefinitions[mood]?.suggestedActivities || []
      );
      compatibility.recommendedActivities = [...new Set(sharedActivities)].slice(0, 5);
    }

    // Generate compromise activities if there are conflicts
    if (compatibility.conflictingMoods.length > 0 && compatibility.sharedMoods.length === 0) {
      // Find neutral activities that work for both
      const neutralActivities = ['farmers-market', 'gourmet-brunch', 'gallery-exploration'];
      compatibility.compromiseActivities = neutralActivities;
    }

    // Normalize score to 0-100
    compatibility.score = Math.max(0, Math.min(100, compatibility.score + 50));

    return compatibility;
  }

  // Utility methods
  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }

  getTimeSlot(hour) {
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }

  getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }

  getDefaultMoodSuggestions() {
    return [
      {
        type: 'explore_moods',
        title: 'Discover Your Mood Patterns',
        description: 'Start by selecting how you feel today and see personalized activity recommendations.',
        actions: ['Track your current mood', 'Plan activities based on feelings', 'See mood insights over time']
      }
    ];
  }

  // Mood-based activity filtering for existing activities
  filterActivitiesByMood(activities, selectedMoods) {
    if (!selectedMoods || selectedMoods.length === 0) return activities;

    return activities.filter(activity => {
      const activityVibes = activity.vibe ? [activity.vibe] : [];
      const activityEnergy = activity.energyLevel;

      // Check if activity matches any selected mood
      return selectedMoods.some(mood => {
        const moodDef = moodDefinitions[mood];
        if (!moodDef) return false;

        // Direct activity match
        if (moodDef.suggestedActivities.includes(activity.id)) return true;

        // Vibe compatibility
        if (activityVibes.some(vibe => moodDef.complementary?.includes(vibe))) return true;

        // Energy level compatibility
        if (mood === 'energetic' && activityEnergy === 'high') return true;
        if (mood === 'relaxed' && activityEnergy === 'low') return true;
        if (mood === 'creative' && activity.category === 'Cultural') return true;
        if (mood === 'social' && activity.description?.includes('group')) return true;

        return false;
      });
    });
  }

  // Export mood data for analysis
  exportMoodData() {
    return {
      moodHistory: Object.fromEntries(this.moodHistory),
      vibePatterns: Object.fromEntries(this.vibePatterns),
      exportedAt: new Date().toISOString(),
      insights: this.getMoodInsights()
    };
  }
}

// Export singleton instance
export default new MoodTrackingService();
