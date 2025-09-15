/**
 * Holiday Awareness Service - Smart Weekend Planning
 * 
 * This service provides intelligent holiday detection and long weekend suggestions.
 * It helps users discover upcoming opportunities for extended weekend planning,
 * making Weekendly proactive rather than reactive.
 * 
 * Features:
 * • Automatic holiday detection for multiple countries based on user location
 * • Long weekend opportunity identification  
 * • Smart weekend extension suggestions
 * • Cultural event and seasonal activity recommendations
 */

//  holiday database with regional support
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
  
  india: [
    { date: '2025-01-01', name: 'New Year\'s Day', type: 'national', vibe: 'celebratory', suggestedActivities: ['family-gathering', 'cultural-workshop'] },
    { date: '2025-01-14', name: 'Makar Sankranti', type: 'cultural', vibe: 'festive', suggestedActivities: ['cultural-workshop', 'street-food-adventure'] },
    { date: '2025-01-26', name: 'Republic Day', type: 'national', vibe: 'patriotic', suggestedActivities: ['cultural-workshop', 'photography-walk'] },
    { date: '2025-02-26', name: 'Maha Shivratri', type: 'religious', vibe: 'spiritual', suggestedActivities: ['mindfulness-retreat', 'cultural-workshop'] },
    { date: '2025-03-13', name: 'Holi', type: 'cultural', vibe: 'festive', suggestedActivities: ['dance-workshop', 'street-food-adventure'] },
    { date: '2025-03-31', name: 'Ram Navami', type: 'religious', vibe: 'spiritual', suggestedActivities: ['mindfulness-retreat', 'cultural-workshop'] },
    { date: '2025-04-14', name: 'Baisakhi', type: 'cultural', vibe: 'harvest', suggestedActivities: ['dance-workshop', 'farmers-market'] },
    { date: '2025-07-07', name: 'Guru Purnima', type: 'spiritual', vibe: 'grateful', suggestedActivities: ['mindfulness-retreat', 'literary-journey'] },
    { date: '2025-08-15', name: 'Independence Day', type: 'national', vibe: 'patriotic', suggestedActivities: ['cultural-workshop', 'photography-walk'] },
    { date: '2025-08-16', name: 'Janmashtami', type: 'religious', vibe: 'devotional', suggestedActivities: ['cultural-workshop', 'dance-workshop'] },
    { date: '2025-08-19', name: 'Raksha Bandhan', type: 'cultural', vibe: 'family', suggestedActivities: ['family-gathering', 'collaborative-cooking'] },
    { date: '2025-08-31', name: 'Ganesh Chaturthi', type: 'religious', vibe: 'joyous', suggestedActivities: ['cultural-workshop', 'street-food-adventure'] },
    { date: '2025-10-02', name: 'Gandhi Jayanti', type: 'national', vibe: 'reflective', suggestedActivities: ['mindfulness-retreat', 'literary-journey'] },
    { date: '2025-10-12', name: 'Dussehra', type: 'cultural', vibe: 'triumphant', suggestedActivities: ['cultural-workshop', 'live-performance'] },
    { date: '2025-10-20', name: 'Karva Chauth', type: 'cultural', vibe: 'romantic', suggestedActivities: ['wine-discovery', 'gourmet-brunch'] },
    { date: '2025-11-01', name: 'Diwali', type: 'cultural', vibe: 'joyous', suggestedActivities: ['family-gathering', 'cultural-workshop'] },
    { date: '2025-11-15', name: 'Guru Nanak Jayanti', type: 'religious', vibe: 'peaceful', suggestedActivities: ['mindfulness-retreat', 'cultural-workshop'] },
    { date: '2025-12-25', name: 'Christmas Day', type: 'religious', vibe: 'peaceful', suggestedActivities: ['wine-discovery', 'cinema-experience'] }
  ],

  uk: [
    { date: '2025-01-01', name: 'New Year\'s Day', type: 'national', vibe: 'fresh-start', suggestedActivities: ['mindfulness-retreat', 'digital-detox'] },
    { date: '2025-04-18', name: 'Good Friday', type: 'religious', vibe: 'contemplative', suggestedActivities: ['literary-journey', 'gallery-exploration'] },
    { date: '2025-04-21', name: 'Easter Monday', type: 'religious', vibe: 'renewal', suggestedActivities: ['botanical-picnic', 'photography-walk'] },
    { date: '2025-05-05', name: 'Early May Bank Holiday', type: 'national', vibe: 'spring', suggestedActivities: ['farmers-market', 'botanical-picnic'] },
    { date: '2025-05-26', name: 'Spring Bank Holiday', type: 'national', vibe: 'outdoor', suggestedActivities: ['urban-cycling', 'photography-expedition'] },
    { date: '2025-08-25', name: 'Summer Bank Holiday', type: 'national', vibe: 'relaxed', suggestedActivities: ['holistic-spa', 'gourmet-brunch'] },
    { date: '2025-12-25', name: 'Christmas Day', type: 'national', vibe: 'cozy', suggestedActivities: ['wine-discovery', 'cinema-experience'] },
    { date: '2025-12-26', name: 'Boxing Day', type: 'national', vibe: 'leisurely', suggestedActivities: ['gourmet-brunch', 'live-performance'] }
  ],

  canada: [
    { date: '2025-01-01', name: 'New Year\'s Day', type: 'national', vibe: 'fresh-start', suggestedActivities: ['mindfulness-retreat', 'digital-detox'] },
    { date: '2025-02-17', name: 'Family Day', type: 'provincial', vibe: 'family', suggestedActivities: ['family-gathering', 'collaborative-cooking'] },
    { date: '2025-04-18', name: 'Good Friday', type: 'religious', vibe: 'contemplative', suggestedActivities: ['literary-journey', 'gallery-exploration'] },
    { date: '2025-05-19', name: 'Victoria Day', type: 'national', vibe: 'spring', suggestedActivities: ['botanical-picnic', 'photography-walk'] },
    { date: '2025-07-01', name: 'Canada Day', type: 'national', vibe: 'patriotic', suggestedActivities: ['cultural-workshop', 'street-food-adventure'] },
    { date: '2025-09-01', name: 'Labour Day', type: 'national', vibe: 'relaxed', suggestedActivities: ['holistic-spa', 'gourmet-brunch'] },
    { date: '2025-10-13', name: 'Thanksgiving', type: 'national', vibe: 'grateful', suggestedActivities: ['collaborative-cooking', 'family-gathering'] },
    { date: '2025-11-11', name: 'Remembrance Day', type: 'national', vibe: 'respectful', suggestedActivities: ['mindfulness-retreat', 'literary-journey'] },
    { date: '2025-12-25', name: 'Christmas Day', type: 'national', vibe: 'cozy', suggestedActivities: ['wine-discovery', 'cinema-experience'] },
    { date: '2025-12-26', name: 'Boxing Day', type: 'national', vibe: 'leisurely', suggestedActivities: ['gourmet-brunch', 'live-performance'] }
  ],

  australia: [
    { date: '2025-01-01', name: 'New Year\'s Day', type: 'national', vibe: 'celebratory', suggestedActivities: ['beach-day', 'outdoor-adventure'] },
    { date: '2025-01-26', name: 'Australia Day', type: 'national', vibe: 'patriotic', suggestedActivities: ['barbecue-gathering', 'beach-volleyball'] },
    { date: '2025-04-18', name: 'Good Friday', type: 'religious', vibe: 'contemplative', suggestedActivities: ['literary-journey', 'gallery-exploration'] },
    { date: '2025-04-21', name: 'Easter Monday', type: 'religious', vibe: 'renewal', suggestedActivities: ['botanical-picnic', 'photography-walk'] },
    { date: '2025-04-25', name: 'ANZAC Day', type: 'national', vibe: 'commemorative', suggestedActivities: ['mindfulness-retreat', 'cultural-workshop'] },
    { date: '2025-06-09', name: 'Queen\'s Birthday', type: 'national', vibe: 'traditional', suggestedActivities: ['cultural-workshop', 'live-performance'] },
    { date: '2025-12-25', name: 'Christmas Day', type: 'national', vibe: 'summer-celebration', suggestedActivities: ['beach-picnic', 'outdoor-barbecue'] },
    { date: '2025-12-26', name: 'Boxing Day', type: 'national', vibe: 'leisurely', suggestedActivities: ['beach-day', 'outdoor-sports'] }
  ],

  international: [
    { date: '2025-03-17', name: 'St. Patrick\'s Day', type: 'cultural', vibe: 'festive', suggestedActivities: ['dance-workshop', 'street-food-adventure'] },
    { date: '2025-04-22', name: 'Earth Day', type: 'awareness', vibe: 'nature', suggestedActivities: ['botanical-picnic', 'mountain-expedition'] },
    { date: '2025-10-31', name: 'Halloween', type: 'cultural', vibe: 'creative', suggestedActivities: ['cultural-workshop', 'cinema-experience'] },
    { date: '2025-02-14', name: 'Valentine\'s Day', type: 'cultural', vibe: 'romantic', suggestedActivities: ['wine-discovery', 'live-performance'] }
  ]
};

// Region detection based on location coordinates
const regionMapping = {
  // US bounds (approximate)
  us: { latMin: 24, latMax: 49, lonMin: -125, lonMax: -66 },
  // India bounds
  india: { latMin: 8, latMax: 37, lonMin: 68, lonMax: 97 },
  // UK bounds
  uk: { latMin: 49, latMax: 61, lonMin: -8, lonMax: 2 },
  // Canada bounds
  canada: { latMin: 42, latMax: 70, lonMin: -141, lonMax: -52 },
  // Australia bounds
  australia: { latMin: -44, latMax: -10, lonMin: 113, lonMax: 154 }
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
    this.userRegion = 'india'; // Default to India
    this.userLocation = null;
    console.log(` Holiday Service initialized with default region: ${this.userRegion.toUpperCase()}`);
  }

  // Set user location and determine region
  setUserLocation(location) {
    console.log(` Setting user location:`, location);
    this.userLocation = location;
    
    this.userRegion = 'india';
    console.log(`Region set to: ${this.userRegion.toUpperCase()}`);
  }

  // Detect region based on latitude/longitude coordinates
  detectRegionFromLocation(location) {
    console.log(` Detecting region from location:`, location);
    
    if (!location) {
      console.log(`No location provided, defaulting to India`);
      return 'india';
    }

    const { latitude, longitude, lat, lng, source } = location;
    // Handle both latitude/longitude and lat/lng formats
    const lat_coord = latitude || lat;
    const lng_coord = longitude || lng;
    
    console.log(`Checking location coordinates: ${lat_coord}, ${lng_coord} (source: ${source})`);

    // If it's the default fallback location, but it's set to New Delhi
    if (source === 'default' && lat_coord === 28.6139 && lng_coord === 77.2090) {
      console.log(`Default location is New Delhi, using India region`);
      return 'india';
    }

    // Check each region's bounds
    for (const [region, bounds] of Object.entries(regionMapping)) {
      if (lat_coord >= bounds.latMin && lat_coord <= bounds.latMax &&
          lng_coord >= bounds.lonMin && lng_coord <= bounds.lonMax) {
        console.log(` Location matches region: ${region.toUpperCase()}`);
        return region;
      }
    }

    console.log(` No region match found for coordinates, defaulting to India`);
    return 'india'; 
  }

  // Get region-specific holidays
  getRegionalHolidays() {
    console.log(`Getting holidays for region: ${this.userRegion}`);
    const regionalHolidays = holidays2025[this.userRegion] || holidays2025.india; // Default to India 
    const internationalHolidays = holidays2025.international;
    
    console.log(`Found ${regionalHolidays.length} regional holidays for ${this.userRegion}`);
    return [...regionalHolidays, ...internationalHolidays];
  }

  // Intelligent country detection with fallback (legacy method)
  detectUserCountry() {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const locale = navigator.language || 'en-US';
      
    
      if (timezone.includes('Asia/Kolkata') || 
          timezone.includes('Asia/Calcutta') ||
          timezone.includes('Asia/Delhi') ||
          timezone.includes('Asia/Mumbai') ||
          locale.includes('hi') ||
          locale.includes('IN')) {
        return 'india';
      }
      
      // Smart country mapping based on timezone and locale
      if (timezone.includes('America') || locale.includes('US')) return 'us';
      if (timezone.includes('Europe')) return 'uk';
      if (timezone.includes('Australia')) return 'australia';
      if (timezone.includes('Canada')) return 'canada';
      
      // Additional Asian country detection - default to India for unspecified Asian regions
      if (timezone.includes('Asia/')) return 'india';
      
      return 'india'; // Default to India 
    } catch {
      return 'india'; // Default to India on error
    }
  }

  // Get current season with enhanced logic
  getCurrentSeason() {
    const month = new Date().getMonth() + 1;
    
    // Southern hemisphere seasons (Australia) are opposite
    if (this.userRegion === 'australia') {
      if (month >= 3 && month <= 5) return seasonalSuggestions.autumn || seasonalSuggestions.fall;
      if (month >= 6 && month <= 8) return seasonalSuggestions.winter;
      if (month >= 9 && month <= 11) return seasonalSuggestions.spring;
      return seasonalSuggestions.summer;
    }
    
    // Northern hemisphere seasons
    for (const [season, data] of Object.entries(seasonalSuggestions)) {
      if (data.months && data.months.includes(month)) {
        return { season, ...data };
      }
    }
    
    return seasonalSuggestions.spring; // Fallback
  }

  // Find upcoming long weekends with intelligent analysis
  getUpcomingLongWeekends(lookAheadDays = 90, userLocation = null) {
    // Update location if provided
    if (userLocation) {
      this.setUserLocation(userLocation);
    }

    const today = new Date();
    const lookAheadDate = new Date(today.getTime() + lookAheadDays * 24 * 60 * 60 * 1000);
    
    // Get region-specific holidays
    const relevantHolidays = this.getRegionalHolidays().filter(holiday => {
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
        seasonalContext: this.getCurrentSeason(),
        region: this.userRegion
      };
    }).sort((a, b) => a.daysUntil - b.daysUntil);
  }

  // Generate personalized holiday recommendations
  getHolidayRecommendations(userTheme = 'wellnessWarrior') {
    console.log(` Getting holiday recommendations for theme: ${userTheme}, region: ${this.userRegion}`);
    
    if (!this.userRegion || this.userRegion === 'us') {
      console.log(` Correcting region to India`);
      this.userRegion = 'india';
    }
    
    const upcomingHolidays = this.getUpcomingLongWeekends();
    const currentSeason = this.getCurrentSeason();
    
    console.log(` Found ${upcomingHolidays.length} upcoming holidays`);
    
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
