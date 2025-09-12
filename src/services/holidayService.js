/**
 * 🎉 Holiday Awareness Service - Smart Weekend Planning
 * 
 * This service provides intelligent holiday detection and long weekend suggestions.
 * It helps users discover upcoming opportunities for extended weekend planning,
 * making Weekendly proactive rather than reactive.
 * 
 * Features:
 * • Automatic holiday detection for multiple countries
 * • Long weekend opportunity identification  
 * • Smart weekend extension suggestions
 * • Cultural event and seasonal activity recommendations
 */

// Enhanced holiday database with cultural context
const holidays2025 = {
  us: [
    { date: '2025-01-01', name: 'New Year\'s Day', type: 'national', vibe: 'reflective', suggestedActivities: ['mindfulness-retreat', 'digital-detox'] },
    { date: '2025-01-20', name: 'Martin Luther King Jr. Day', type: 'national', vibe: 'community', suggestedActivities: ['networking-meetup', 'cultural-workshop'] },
    { date: '2025-02-17', name: 'Presidents\' Day', type: 'national', vibe: 'adventurous', suggestedActivities: ['photography-walk', 'gallery-exploration'] },
    { date: '2025-05-26', name: 'Memorial Day', type: 'national', vibe: 'social', suggestedActivities: ['farmers-market', 'botanical-picnic'] },
    { date: '2025-07-04', name: 'Independence Day', type: 'national', vibe: 'energetic', suggestedActivities: ['dance-workshop', 'street-food-adventure'] },
    { date: '2025-09-01', name: 'Labor Day', type: 'national', vibe: 'relaxed', suggestedActivities: ['holistic-spa', 'gourmet-brunch'] },
    { date: '2025-10-13', name: 'Columbus Day', type: 'national', vibe: 'explorer', suggestedActivities: ['urban-cycling', 'photography-expedition'] },
    { date: '2025-11-11', name: 'Veterans Day', type: 'national', vibe: 'grateful', suggestedActivities: ['mindfulness-retreat', 'literary-journey'] },
    { date: '2025-11-27', name: 'Thanksgiving', type: 'national', vibe: 'family', suggestedActivities: ['collaborative-cooking', 'trivia-championship'] },
    { date: '2025-12-25', name: 'Christmas Day', type: 'national', vibe: 'cozy', suggestedActivities: ['wine-discovery', 'cinema-experience'] }
  ],
  international: [
    { date: '2025-03-17', name: 'St. Patrick\'s Day', type: 'cultural', vibe: 'festive', suggestedActivities: ['dance-workshop', 'street-food-adventure'] },
    { date: '2025-04-22', name: 'Earth Day', type: 'awareness', vibe: 'nature', suggestedActivities: ['botanical-picnic', 'mountain-expedition'] },
    { date: '2025-10-31', name: 'Halloween', type: 'cultural', vibe: 'creative', suggestedActivities: ['cultural-workshop', 'cinema-experience'] },
    { date: '2025-02-14', name: 'Valentine\'s Day', type: 'cultural', vibe: 'romantic', suggestedActivities: ['wine-discovery', 'live-performance'] }
  ]
};

// Seasonal activity recommendations
const seasonalSuggestions = {
  spring: {
    months: [3, 4, 5],
    vibe: 'fresh',
    activities: ['botanical-picnic', 'photography-walk', 'farmers-market', 'sunrise-yoga'],
    description: 'Spring awakening calls for outdoor renewal and fresh experiences'
  },
  summer: {
    months: [6, 7, 8],
    vibe: 'energetic',
    activities: ['mountain-expedition', 'urban-cycling', 'street-food-adventure', 'dance-workshop'],
    description: 'Summer energy invites adventure and outdoor exploration'
  },
  fall: {
    months: [9, 10, 11],
    vibe: 'cozy',
    activities: ['wine-discovery', 'cultural-workshop', 'gallery-exploration', 'gourmet-brunch'],
    description: 'Fall transition brings perfect weather for cultural immersion'
  },
  winter: {
    months: [12, 1, 2],
    vibe: 'reflective',
    activities: ['mindfulness-retreat', 'literary-journey', 'holistic-spa', 'cinema-experience'],
    description: 'Winter invites introspection and cozy indoor experiences'
  }
};

class HolidayService {
  constructor() {
    this.userCountry = this.detectUserCountry();
  }

  // Intelligent country detection with fallback
  detectUserCountry() {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const locale = navigator.language || 'en-US';
      
      // Smart country mapping based on timezone and locale
      if (timezone.includes('America') || locale.includes('US')) return 'us';
      if (timezone.includes('Europe')) return 'europe';
      if (timezone.includes('Asia')) return 'asia';
      
      return 'us'; // Default fallback
    } catch {
      return 'us';
    }
  }

  // Get current season with enhanced logic
  getCurrentSeason() {
    const month = new Date().getMonth() + 1;
    
    for (const [season, data] of Object.entries(seasonalSuggestions)) {
      if (data.months.includes(month)) {
        return { season, ...data };
      }
    }
    
    return seasonalSuggestions.spring; // Fallback
  }

  // Find upcoming long weekends with intelligent analysis
  getUpcomingLongWeekends(lookAheadDays = 90) {
    const today = new Date();
    const lookAheadDate = new Date(today.getTime() + lookAheadDays * 24 * 60 * 60 * 1000);
    
    const relevantHolidays = [
      ...holidays2025.us,
      ...holidays2025.international
    ].filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate >= today && holidayDate <= lookAheadDate;
    });

    return relevantHolidays.map(holiday => {
      const holidayDate = new Date(holiday.date);
      const dayOfWeek = holidayDate.getDay();
      
      let longWeekendOpportunity = null;
      
      // Smart long weekend detection
      if (dayOfWeek === 1) { // Monday holiday
        longWeekendOpportunity = {
          type: '3-day weekend',
          days: ['Saturday', 'Sunday', 'Monday'],
          suggestion: 'Take advantage of this Monday holiday for a 3-day adventure!',
          weekendOption: 'threeDaysMonday'
        };
      } else if (dayOfWeek === 5) { // Friday holiday
        longWeekendOpportunity = {
          type: '3-day weekend',
          days: ['Friday', 'Saturday', 'Sunday'],
          suggestion: 'Perfect Friday holiday for an extended weekend getaway!',
          weekendOption: 'threeDaysFriday'
        };
      } else if (dayOfWeek === 4 || dayOfWeek === 2) { // Thursday or Tuesday
        longWeekendOpportunity = {
          type: '4-day weekend opportunity',
          days: dayOfWeek === 4 ? ['Thursday', 'Friday', 'Saturday', 'Sunday'] : ['Friday', 'Saturday', 'Sunday', 'Monday'],
          suggestion: 'Consider taking an extra day off for a mini-vacation!',
          weekendOption: dayOfWeek === 4 ? 'fourDaysThursday' : 'fourDaysMonday'
        };
      }

      return {
        ...holiday,
        date: holidayDate,
        daysUntil: Math.ceil((holidayDate - today) / (1000 * 60 * 60 * 24)),
        longWeekendOpportunity,
        seasonalContext: this.getCurrentSeason()
      };
    }).sort((a, b) => a.daysUntil - b.daysUntil);
  }

  // Generate personalized holiday recommendations
  getHolidayRecommendations(userTheme = 'wellnessWarrior') {
    const upcomingHolidays = this.getUpcomingLongWeekends();
    const currentSeason = this.getCurrentSeason();
    
    return upcomingHolidays.slice(0, 3).map(holiday => ({
      ...holiday,
      personalizedMessage: this.generatePersonalizedMessage(holiday, userTheme, currentSeason),
      recommendedActivities: this.getRecommendedActivities(holiday, currentSeason),
      planningTips: this.getPlanningTips(holiday)
    }));
  }

  // AI-like personalized message generation
  generatePersonalizedMessage(holiday, userTheme, season) {
    const themeMessages = {
      wellnessWarrior: `Perfect timing for your wellness journey! ${holiday.name} offers a great opportunity to`,
      urbanExplorer: `Adventure awaits! This ${holiday.name} is ideal for discovering`,
      creativeSoul: `Inspiration calls! ${holiday.name} presents a wonderful chance to`,
      socialButterfly: `Connect and celebrate! ${holiday.name} is perfect for`,
      luxurySeeker: `Indulge in excellence! This ${holiday.name} invites you to`,
      mindfulEscape: `Find peace and clarity! ${holiday.name} offers time to`
    };

    const baseMessage = themeMessages[userTheme] || themeMessages.wellnessWarrior;
    const seasonalTouch = season.description.toLowerCase();
    
    return `${baseMessage} embrace ${seasonalTouch} during your ${holiday.longWeekendOpportunity?.type || 'special weekend'}.`;
  }

  // Smart activity recommendations based on holiday and season
  getRecommendedActivities(holiday, season) {
    const holidayActivities = holiday.suggestedActivities || [];
    const seasonalActivities = season.activities || [];
    
    // Merge and deduplicate
    const combinedActivities = [...new Set([...holidayActivities, ...seasonalActivities])];
    
    // Return top 4 most relevant activities
    return combinedActivities.slice(0, 4);
  }

  // Practical planning tips
  getPlanningTips(holiday) {
    const tips = [
      'Book accommodations early for holiday weekends',
      'Check local event calendars for special celebrations',
      'Consider weather patterns for outdoor activities',
      'Plan transportation in advance for popular destinations'
    ];

    if (holiday.longWeekendOpportunity) {
      tips.unshift(`Take advantage of the ${holiday.longWeekendOpportunity.type} - ${holiday.longWeekendOpportunity.suggestion}`);
    }

    return tips.slice(0, 3);
  }

  // Check if a given date is a holiday
  isHoliday(date) {
    const dateStr = date.toISOString().split('T')[0];
    return [...holidays2025.us, ...holidays2025.international].find(h => h.date === dateStr);
  }

  // Get holiday context for a specific date
  getHolidayContext(date) {
    const holiday = this.isHoliday(date);
    if (!holiday) return null;

    return {
      ...holiday,
      isLongWeekend: this.isPartOfLongWeekend(date),
      celebrations: this.getLocalCelebrations(holiday),
      culturalTips: this.getCulturalTips(holiday)
    };
  }

  // Enhanced long weekend detection
  isPartOfLongWeekend(date) {
    const dayOfWeek = date.getDay();
    const holiday = this.isHoliday(date);
    
    if (!holiday) return false;
    
    return dayOfWeek === 1 || dayOfWeek === 5; // Monday or Friday holidays create long weekends
  }

  // Local celebration suggestions
  getLocalCelebrations(holiday) {
    const celebrations = {
      'Independence Day': ['Fireworks displays', 'Outdoor BBQ events', 'Patriotic parades'],
      'Halloween': ['Costume parties', 'Haunted attractions', 'Fall festivals'],
      'Valentine\'s Day': ['Wine tastings', 'Art exhibitions', 'Live music venues'],
      'St. Patrick\'s Day': ['Cultural festivals', 'Irish music events', 'Traditional food tastings']
    };

    return celebrations[holiday.name] || ['Local community events', 'Cultural celebrations', 'Special themed activities'];
  }

  // Cultural context and tips
  getCulturalTips(holiday) {
    const tips = {
      'Independence Day': 'Perfect time for outdoor activities and community gatherings',
      'Halloween': 'Great opportunity for creative and artistic activities',
      'Valentine\'s Day': 'Ideal for intimate and romantic experiences',
      'Earth Day': 'Focus on nature-based and eco-friendly activities'
    };

    return tips[holiday.name] || 'Embrace the cultural significance of this special day';
  }
}

// Export singleton instance
export default new HolidayService();
