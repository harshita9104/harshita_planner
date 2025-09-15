import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { themes, activityCategories, weekendOptions } from '../constants';
import holidayService from '../services/holidayService';
import smartIntegrationsService from '../services/smartIntegrations';
import persistenceService from '../services/persistenceService';
import moodTrackingService from '../services/moodTrackingService';

/**
 * Weekend Planner Hook - The Brain of Our Application
 * 
 * This custom React hook manages all the complex state logic for our weekend planning app.
 * I've organized it to handle everything from drag-and-drop interactions. 
 * Key responsibilities:
 * • Managing weekend schedules with conflict detection
 * • Providing intelligent activity recommendations based on user behavior  
 * • Integrating real-time weather data for smarter planning
 * • Handling all the drag-and-drop magic you see in the UI
 * • Persisting your plans so you never lose your perfect weekend
 * 
 */

const useWeekendPlanner = () => {
  const [selectedTheme, setSelectedTheme] = useState('wellnessWarrior');
  const [weather, setWeather] = useState(null);
  const [weekendOption, setWeekendOption] = useState('twoDays');
  const [scheduledActivities, setScheduledActivities] = useState(() => {
    const saved = localStorage.getItem('weekendly-schedule');
    const initialSchedule = {};
    weekendOptions[weekendOption].days.forEach(day => {
      initialSchedule[day] = [];
    });
    return saved ? JSON.parse(saved) : initialSchedule;
  });
  const [draggedActivity, setDraggedActivity] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentView, setCurrentView] = useState('plan');
  const [activityBucket, setActivityBucket] = useState(() => {
    const saved = localStorage.getItem('weekendly-bucket');
    return saved ? JSON.parse(saved) : [];
  });
  const [isBucketOpen, setIsBucketOpen] = useState(false);

  // Advanced features state
  const [userLocation, setUserLocation] = useState(null);
  const [holidayRecommendations, setHolidayRecommendations] = useState([]);
  const [localEvents, setLocalEvents] = useState([]);
  const [currentMood, setCurrentMood] = useState([]);
  const [moodInsights, setMoodInsights] = useState(null);
  const [isOfflineMode, setIsOfflineMode] = useState(!navigator.onLine);
  const [smartSuggestions, setSmartSuggestions] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    totalActivities: 0,
    loadTime: 0,
    userEngagement: 0
  });

  // Persist scheduled activities to local storage
  useEffect(() => {
    localStorage.setItem('weekendly-schedule', JSON.stringify(scheduledActivities));
  }, [scheduledActivities]);

  // Persist activity bucket to local storage
  useEffect(() => {
    localStorage.setItem('weekendly-bucket', JSON.stringify(activityBucket));
  }, [activityBucket]);

  // Fetch weather data based on user's geolocation
  useEffect(() => {
    const fetchWeather = async (latitude, longitude) => {
      try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode&timezone=auto`);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setWeather({
          saturday: data.daily.weathercode[0],
          sunday: data.daily.weathercode[1],
        });
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeather(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error("Error getting location:", error);
            // Fallback to a default location if user denies access
            fetchWeather(28.6139, 77.2090); // New Delhi
          }
        );
      } else {
        // Fallback to a default location if geolocation is not supported
        fetchWeather(28.6139, 77.2090); // New Delhi
      }
    };

    getLocation();
  }, []);

  // Suggest activity alternatives based on weather conditions
  useEffect(() => {
    if (!weather) return;

    const suggestAlternatives = (day) => {
      const dayWeather = weather[day];
      if (dayWeather >= 51) { // Rainy, snowy, or stormy
        const outdoorActivities = scheduledActivities[day].filter(a => a.category === 'Outdoor');
        
        if (outdoorActivities.length > 0) {
          const allActivities = getAllActivities();
          const indoorAlternatives = allActivities.filter(a => 
            a.category === 'Indoor' && 
            !scheduledActivities[day].some(sa => sa.id === a.id) &&
            outdoorActivities.some(oa => Math.abs(oa.duration - a.duration) <= 30) // Similar duration
          );

          if (indoorAlternatives.length > 0) {
            const bestAlternative = indoorAlternatives[0];
            const affectedActivity = outdoorActivities[0];

            toast((t) => (
              <div className="flex flex-col space-y-2">
                <span className="font-semibold">
                  🌧️ Weather Alert for {day.charAt(0).toUpperCase() + day.slice(1)}
                </span>
                <span className="text-sm">
                  Rainy weather detected! Consider swapping <b>{affectedActivity.name}</b> for <b>{bestAlternative.name}</b>
                </span>
                <div className="flex space-x-2 mt-2">
                  <button
                    className="px-3 py-1 bg-indigo-500 text-white rounded-lg text-xs font-medium hover:bg-indigo-600 transition-colors"
                    onClick={() => {
                      // Remove outdoor activity and add indoor alternative directly
                      setScheduledActivities(prev => {
                        const newSchedule = { ...prev };
                        newSchedule[day] = newSchedule[day].filter(a => a.id !== affectedActivity.id);
                        newSchedule[day] = [...newSchedule[day], bestAlternative];
                        return newSchedule;
                      });
                      toast.success('Activity swapped for better weather!');
                      toast.dismiss(t.id);
                    }}
                  >
                    Smart Swap
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-400 transition-colors"
                    onClick={() => toast.dismiss(t.id)}
                  >
                    Keep Original
                  </button>
                </div>
              </div>
            ), { 
              duration: 12000,
              style: {
                minWidth: '300px',
              }
            });
          }
        }
      } else if (dayWeather >= 0 && dayWeather <= 1) {
        // Perfect weather - suggest outdoor activities if too many indoor ones
        const indoorActivities = scheduledActivities[day].filter(a => a.category === 'Indoor');
        const totalActivities = scheduledActivities[day].length;
        
        if (indoorActivities.length > totalActivities / 2 && totalActivities > 0) {
          toast((t) => (
            <div className="flex items-center space-x-2">
              <span>Perfect weather for {day}! Consider adding some outdoor activities to enjoy the sunshine.</span>
              <button
                className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-xs"
                onClick={() => toast.dismiss(t.id)}
              >
                Got it!
              </button>
            </div>
          ), { duration: 6000 });
        }
      }
    };

    // Check weather for all days in the weekend
    Object.keys(scheduledActivities).forEach(day => {
      if (scheduledActivities[day].length > 0) {
        suggestAlternatives(day);
      }
    });
  }, [weather, scheduledActivities]);

  // Utility function to get all activities from categories
  const getAllActivities = () => {
    return Object.values(activityCategories).flatMap(category =>
      category.activities.map(activity => ({ ...activity, category: category.name, categoryColor: category.color }))
    );
  };

  // Check for time conflicts with existing activities
  // Smart conflict detection - because nobody wants to be in two places at once!
  // This function checks if adding an activity would create a time overlap with existing ones.
  // I'm using a clever time interval overlap algorithm that feels natural to understand.
  const isConflict = useCallback((day, activity, newTime) => {
    const newStartTime = newTime || activity.time;
    const newEndTime = new Date(new Date(`1970-01-01T${newStartTime}`).getTime() + activity.duration * 60000).toTimeString().slice(0, 5);

    return scheduledActivities[day].find(a => {
      // Skip checking against itself - that would be silly!
      if (a.id === activity.id) return false;
      
      const existingStartTime = a.time;
      const existingEndTime = new Date(new Date(`1970-01-01T${existingStartTime}`).getTime() + a.duration * 60000).toTimeString().slice(0, 5);
      
      // Mathematical overlap detection: two intervals overlap if one starts before the other ends
      return (newStartTime < existingEndTime && newEndTime > existingStartTime);
    });
  }, [scheduledActivities]);

  // Apply a selected theme to the weekend schedule
  const applyTheme = (themeKey) => {
    setSelectedTheme(themeKey);
    const theme = themes[themeKey];
    const allActivities = getAllActivities();

    const themeActivities = theme.activities.map(activityId =>
      allActivities.find(a => a.id === activityId)
    ).filter(Boolean);

    const days = weekendOptions[weekendOption].days;
    const newSchedule = {};
    days.forEach(day => {
      newSchedule[day] = [];
    });

    themeActivities.forEach((activity, index) => {
      const dayIndex = index % days.length;
      const day = days[dayIndex];
      newSchedule[day].push(activity);
    });

    setScheduledActivities(newSchedule);
    toast.success(`${theme.name} added to plan`);
  };

  // Handle drag start event for activities
  const handleDragStart = (e, activity) => {
    setDraggedActivity(activity);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    if (currentView === 'browse') {
      setIsBucketOpen(true);
    }
  };

  // Handle drag end event
  const handleDragEnd = () => {
    setIsDragging(false);
    if (currentView === 'browse') {
      setIsBucketOpen(false);
    }
  };

  // Handle drag over event to allow dropping
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop event on schedule days
  const handleDrop = (e, day) => {
    e.preventDefault();
    if (draggedActivity) {
      const originalDay = Object.keys(scheduledActivities).find(d =>
        scheduledActivities[d].some(a => a.id === draggedActivity.id)
      );

      if (originalDay && originalDay !== day) {
        const conflict = isConflict(day, draggedActivity);
        if (conflict) {
          toast.error(`Time conflict on ${day} with ${conflict.name}.`);
          setDraggedActivity(null);
          return;
        }
        removeActivity(draggedActivity.id, originalDay);
      }

      addActivity(draggedActivity, day);
      setDraggedActivity(null);
    }
  };

  // Handle drop event on activity bucket
  const handleDropOnBucket = (e) => {
    e.preventDefault();
    if (draggedActivity) {
      addActivityToBucket(draggedActivity);
      setDraggedActivity(null);
    }
  };

  // Add an activity to a specific day
  const addActivity = useCallback((activity, day) => {
    if (!day) {
      // Find the first day with no conflict
      const availableDay = weekendOptions[weekendOption].days.find(d => !isConflict(d, activity));
      if (availableDay) {
        day = availableDay;
      } else {
        toast.error(`No available slot for ${activity.name}.`);
        return;
      }
    }

    const isAlreadyOnDay = scheduledActivities[day] && scheduledActivities[day].some(a => a.id === activity.id);

    if (isAlreadyOnDay) {
      // If it's already on the target day, do nothing.
      return;
    }

    const conflict = isConflict(day, activity);
    if (conflict) {
      toast.error(`Time conflict on ${day} with ${conflict.name}.`);
      return;
    }

    setScheduledActivities(prev => ({
      ...prev,
      [day]: [...prev[day], activity]
    }));
  }, [weekendOption, scheduledActivities, isConflict]);

  // Add an activity to the bucket
  const addActivityToBucket = useCallback(async (activity, customTime = null) => {
    const enhancedActivity = {
      ...activity,
      id: activity.id || `activity_${Date.now()}`,
      time: customTime || activity.time || '12:00',
      addedAt: new Date().toISOString(),
      source: activity.source || 'user_selected'
    };

    const newBucket = [...activityBucket, enhancedActivity];
    setActivityBucket(newBucket);
    
    // Persist to advanced storage
    await persistenceService.saveUserPreference('activityBucket', newBucket);
    
    // Log action for analytics
    await persistenceService.logAction('add_to_bucket', {
      activityId: enhancedActivity.id,
      activityName: enhancedActivity.name,
      source: enhancedActivity.source,
      currentMood: currentMood
    });
    
    // Update performance metrics
    setPerformanceMetrics(prev => ({
      ...prev,
      totalActivities: prev.totalActivities + 1,
      userEngagement: prev.userEngagement + 1
    }));

    toast.success(`Added "${activity.name}" to your bucket!`);
  }, [activityBucket, currentMood]);

  // Holiday-aware weekend planning
  const suggestLongWeekendPlan = useCallback(async () => {
    try {
      const upcomingHolidays = holidayService.getUpcomingLongWeekends(60, userLocation); // Next 60 days
      
      if (upcomingHolidays.length === 0) {
        toast.info('No upcoming long weekends in the next 60 days');
        return null;
      }
      
      const nextHoliday = upcomingHolidays[0];
      
      if (nextHoliday.longWeekendOpportunity) {
        const suggestion = {
          holiday: nextHoliday,
          recommendedWeekendOption: nextHoliday.longWeekendOpportunity.weekendOption,
          personalizedMessage: nextHoliday.personalizedMessage,
          suggestedActivities: nextHoliday.recommendedActivities,
          planningTips: nextHoliday.planningTips
        };
        
        toast.success(` Long weekend opportunity: ${nextHoliday.name}!`, {
          duration: 5000
        });
        
        return suggestion;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to suggest long weekend plan:', error);
      return null;
    }
  }, []);

  // Enhanced local event integration
  const discoverNearbyEvents = useCallback(async (category = 'all') => {
    if (!userLocation || isOfflineMode) {
      // Try to load cached events
      const cached = await persistenceService.loadCachedEvents(userLocation || { city: 'default' });
      if (cached) {
        setLocalEvents(cached);
        return cached;
      }
      return [];
    }
    
    try {
      const events = await smartIntegrationsService.discoverLocalEvents(userLocation, category);
      setLocalEvents(events);
      
      // Cache for offline use
      await persistenceService.cacheEvents(userLocation, events);
      
      toast.success(`Found ${events.length} events near ${userLocation.city}!`);
      return events;
    } catch (error) {
      console.error('Failed to discover events:', error);
      toast.error('Could not load local events');
      return [];
    }
  }, [userLocation, isOfflineMode]);

  // Initialize advanced features
  useEffect(() => {
    initializeAdvancedFeatures();
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize all advanced features
  const initializeAdvancedFeatures = useCallback(async () => {
    const startTime = performance.now();
    
    try {
      // Get user location for smart integrations
      const location = await smartIntegrationsService.getCurrentLocation();
      setUserLocation(location);
      
      // Set location for holiday service to detect correct region
      holidayService.setUserLocation(location);
      
      // Load holiday recommendations
      const holidays = holidayService.getHolidayRecommendations(selectedTheme);
      setHolidayRecommendations(holidays);
      
      // Load local events
      const events = await smartIntegrationsService.discoverLocalEvents(location);
      setLocalEvents(events);
      
      // Load mood insights
      const insights = moodTrackingService.getMoodInsights();
      setMoodInsights(insights);
      
      // Log performance
      const loadTime = performance.now() - startTime;
      setPerformanceMetrics(prev => ({ ...prev, loadTime }));
      
      // Log initialization
      await persistenceService.logAction('app_initialized', {
        location: location.city,
        theme: selectedTheme,
        loadTime,
        hasOfflineSupport: true
      });
      
      toast.success(' Advanced features loaded!', { 
        duration: 2000,
        position: 'bottom-center'
      });
      
    } catch (error) {
      console.error('Advanced features initialization failed:', error);
      toast.error('Some features may be limited offline');
    }
  }, [selectedTheme]);

  // Enhanced mood tracking
  const trackUserMood = useCallback(async (moods, context = {}) => {
    try {
      const moodEntry = await moodTrackingService.trackMood(moods, {
        ...context,
        currentTheme: selectedTheme,
        plannedActivities: Object.values(scheduledActivities).flat().map(a => a.id),
        location: userLocation?.city
      });
      
      setCurrentMood(moods);
      
      // Generate mood-based suggestions
      const suggestions = await generateMoodBasedSuggestions(moods);
      setSmartSuggestions(suggestions);
      
      toast.success(`Mood tracked: ${moods.map(m => moodTrackingService.constructor.moodDefinitions?.[m]?.emoji || '😊').join(' ')}`, {
        duration: 3000
      });
      
      return moodEntry;
    } catch (error) {
      console.error('Mood tracking failed:', error);
      toast.error('Failed to track mood');
    }
  }, [selectedTheme, scheduledActivities, userLocation]);

  // Generate mood-based activity suggestions
  const generateMoodBasedSuggestions = useCallback(async (moods) => {
    try {
      const allActivities = Object.values(activityCategories)
        .flatMap(category => category.activities);
      
      const moodFilteredActivities = moodTrackingService.filterActivitiesByMood(allActivities, moods);
      
      // Get weather-based suggestions if available
      let weatherSuggestions = [];
      if (userLocation && !isOfflineMode) {
        const weatherData = await smartIntegrationsService.getWeatherBasedSuggestions(userLocation, moodFilteredActivities);
        weatherSuggestions = weatherData.suggestions;
      }
      
      return {
        moodBased: moodFilteredActivities.slice(0, 6),
        weatherBased: weatherSuggestions,
        local: localEvents.slice(0, 3),
        holiday: holidayRecommendations.length > 0 ? holidayRecommendations[0].recommendedActivities : []
      };
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      return { moodBased: [], weatherBased: [], local: [], holiday: [] };
    }
  }, [userLocation, isOfflineMode, localEvents, holidayRecommendations]);

  // Performance monitoring
  const getPerformanceInsights = useCallback(async () => {
    try {
      const analytics = await persistenceService.getUsageAnalytics(30);
      const moodData = moodTrackingService.exportMoodData();
      
      return {
        ...performanceMetrics,
        analytics,
        moodData,
        isOptimizedFor50Plus: performanceMetrics.totalActivities >= 50,
        offlineSupport: !isOfflineMode || 'Available',
        location: userLocation?.city || 'Unknown'
      };
    } catch (error) {
      console.error('Failed to get performance insights:', error);
      return performanceMetrics;
    }
  }, [performanceMetrics, isOfflineMode, userLocation]);

  // Enhanced save functionality with backup
  const saveWeekendPlan = useCallback(async (planName = null) => {
    try {
      const plan = {
        id: `plan_${Date.now()}`,
        name: planName || `${themes[selectedTheme].name} Weekend`,
        theme: selectedTheme,
        scheduledActivities,
        activityBucket,
        userLocation,
        mood: currentMood,
        createdAt: new Date().toISOString(),
        weekendOption,
        metadata: {
          totalActivities: Object.values(scheduledActivities).flat().length,
          estimatedDuration: Object.values(scheduledActivities).flat()
            .reduce((sum, activity) => sum + (activity.duration || 120), 0),
          categories: [...new Set(Object.values(scheduledActivities).flat()
            .map(activity => activity.category))],
          vibes: [...new Set(Object.values(scheduledActivities).flat()
            .map(activity => activity.vibe))]
        }
      };
      
      await persistenceService.saveWeekendPlan(plan);
      
      toast.success(`Weekend plan "${plan.name}" saved successfully!`);
      return plan;
    } catch (error) {
      console.error('Failed to save weekend plan:', error);
      toast.error('Failed to save plan');
      throw error;
    }
  }, [selectedTheme, scheduledActivities, activityBucket, userLocation, currentMood, weekendOption]);

  // Remove an activity from the bucket
  const removeActivityFromBucket = useCallback(async (activityId) => {
    const newBucket = activityBucket.filter(activity => activity.id !== activityId);
    setActivityBucket(newBucket);
    
    // Persist to advanced storage
    await persistenceService.saveUserPreference('activityBucket', newBucket);
    
    // Log action for analytics
    await persistenceService.logAction('remove_from_bucket', {
      activityId,
      currentMood: currentMood
    });
    
    toast.success('Activity removed from bucket');
  }, [activityBucket, currentMood]);

  // Remove an activity from scheduled activities
  const removeActivity = useCallback(async (activityId, day) => {
    const newScheduledActivities = {
      ...scheduledActivities,
      [day]: scheduledActivities[day].filter(activity => activity.id !== activityId)
    };
    setScheduledActivities(newScheduledActivities);
    
    // Persist to advanced storage
    await persistenceService.saveUserPreference('scheduledActivities', newScheduledActivities);
    
    // Log action for analytics
    await persistenceService.logAction('remove_activity', {
      activityId,
      day,
      currentMood: currentMood
    });
    
    toast.success('Activity removed from plan');
  }, [scheduledActivities, currentMood]);

  // Push all activities from the bucket to the plan
  const pushBucketToPlan = () => {
    let newScheduledActivities = { ...scheduledActivities };
    let bucket = [...activityBucket];
    let changesMade = false;

    // 1. Sort activities by start time
    bucket.sort((a, b) => a.time.localeCompare(b.time));

    const days = weekendOptions[weekendOption].days;
    let dayIndex = 0;

    bucket.forEach(activity => {
      const isAlreadyScheduled = Object.values(newScheduledActivities).flat().some(a => a.id === activity.id);

      if (isAlreadyScheduled) {
        toast.error(`${activity.name} is already planned for the weekend.`);
        return; // continue to next activity in forEach
      }

      let assigned = false;
      // Start from the current dayIndex and try all days
      for (let i = 0; i < days.length; i++) {
        const currentDay = days[(dayIndex + i) % days.length];

        if (!isConflict(currentDay, activity)) {
          newScheduledActivities = {
            ...newScheduledActivities,
            [currentDay]: [...newScheduledActivities[currentDay], activity]
          };
          changesMade = true;
          assigned = true;
          // For the next activity, we want to start with the next day
          dayIndex = (dayIndex + i + 1) % days.length;
          break; // Activity assigned, move to the next one
        }
      }

      if (!assigned) {
        toast.error(`No available slot for ${activity.name}.`);
      }
    });

    if (changesMade) {
      setScheduledActivities(newScheduledActivities);
      toast.success('Activities from the bucket have been added to your plan!');
    }
    setActivityBucket([]);
  };

  // Update the time of a scheduled activity
  const updateActivityTime = (activityId, dayOrNewTime, newTime) => {
    // Handle both old signature (activityId, day, newTime) and new signature (activityId, newTime)
    let day = dayOrNewTime;
    let timeToSet = newTime;
    
    // If only 2 parameters are passed, it means we need to find the activity across all days
    if (newTime === undefined) {
      timeToSet = dayOrNewTime;
      day = null;
      
      // First check if it's in the bucket
      const bucketActivity = activityBucket.find(a => a.id === activityId);
      if (bucketActivity) {
        updateActivityBucketTime(activityId, timeToSet);
        toast.success('Activity time updated in your bucket!');
        return;
      }
      
      // Find which day the activity is on
      for (const [dayKey, activities] of Object.entries(scheduledActivities)) {
        const foundActivity = activities.find(a => a.id === activityId);
        if (foundActivity) {
          day = dayKey;
          break;
        }
      }
      
      if (!day) {
        toast.error('Activity not found!');
        return;
      }
    }

    const activityToUpdate = scheduledActivities[day]?.find(a => a.id === activityId);
    if (!activityToUpdate) {
      toast.error('Activity not found on the specified day!');
      return;
    }

    if (isConflict(day, activityToUpdate, timeToSet)) {
      toast.error('Time conflict with another activity!');
      return;
    }

    setScheduledActivities(prev => ({
      ...prev,
      [day]: prev[day].map(a =>
        a.id === activityId ? { ...a, time: timeToSet } : a
      )
    }));
    
    toast.success('Activity time updated successfully!');
  };

  // Update the time of an activity in the bucket
  const updateActivityBucketTime = (activityId, newTime) => {
    setActivityBucket(prev =>
      prev.map(a =>
        a.id === activityId ? { ...a, time: newTime } : a
      )
    );
  };

  // Generate a summary of the weekend plan
  const generateSummary = () => {
    const totalActivities = Object.values(scheduledActivities).flat().length;
    if (totalActivities === 0) return "Plan your perfect weekend with Weekendly!";

    // Get theme name safely with fallback
    const currentTheme = themes[selectedTheme];
    const themeName = currentTheme?.name || 'Amazing Weekend';
    
    return `My ${themeName.toLowerCase()} includes ${totalActivities} amazing activities! `;
  };

  // Handle changes to the weekend option (e.g., twoDays, threeDays)
  const handleWeekendOptionChange = (option) => {
    setWeekendOption(option);
    const newSchedule = {};
    const newDays = weekendOptions[option].days;
    newDays.forEach(day => {
      newSchedule[day] = scheduledActivities[day] || [];
    });

    const oldDays = Object.keys(scheduledActivities);
    const removedDays = oldDays.filter(day => !newDays.includes(day));
    const activitiesToReassign = removedDays.flatMap(day => scheduledActivities[day]);

    activitiesToReassign.forEach(activity => {
      let assigned = false;
      for (const day of newDays) {
        const newStartTime = activity.time;
        const newEndTime = new Date(new Date(`1970-01-01T${newStartTime}`).getTime() + activity.duration * 60000).toTimeString().slice(0, 5);

        const conflict = newSchedule[day].find(a => {
          if (a.id === activity.id) return false;
          const existingStartTime = a.time;
          const existingEndTime = new Date(new Date(`1970-01-01T${existingStartTime}`).getTime() + a.duration * 60000).toTimeString().slice(0, 5);
          return (newStartTime < existingEndTime && newEndTime > existingStartTime);
        });

        if (!conflict) {
          newSchedule[day].push(activity);
          assigned = true;
          break;
        }
      }

      if (!assigned) {
        addActivityToBucket(activity);
      }
    });

    setScheduledActivities(newSchedule);
  };

  // Smart recommendation system based on user preferences and activity patterns
  // I built this to learn from your choices and suggest activities you'll actually enjoy.
  // It's like having a friend who really knows your taste in weekend activities.
  const generateSmartRecommendations = useCallback(() => {
    const allActivities = getAllActivities();
    const currentActivities = Object.values(scheduledActivities).flat();
    
    // Let's analyze what makes you tick by looking at your current activity choices
    const preferences = {
      vibes: {},          // What moods do you gravitate toward?
      categories: {},     // Indoor person or outdoor adventurer?
      energyLevels: {},   // High energy or more chill?
      durations: []       // Quick activities or longer experiences?
    };

    currentActivities.forEach(activity => {
      // Track vibe preferences
      preferences.vibes[activity.vibe] = (preferences.vibes[activity.vibe] || 0) + 1;
      
      // Track category preferences  
      preferences.categories[activity.category] = (preferences.categories[activity.category] || 0) + 1;
      
      // Track energy level preferences
      if (activity.energyLevel) {
        preferences.energyLevels[activity.energyLevel] = (preferences.energyLevels[activity.energyLevel] || 0) + 1;
      }
      
      // Track duration preferences
      preferences.durations.push(activity.duration);
    });

    // Calculate average preferred duration
    const avgDuration = preferences.durations.length > 0 
      ? preferences.durations.reduce((sum, d) => sum + d, 0) / preferences.durations.length
      : 120;

    // Find activities similar to user preferences that aren't already scheduled
    const recommendations = allActivities
      .filter(activity => !currentActivities.some(ca => ca.id === activity.id))
      .map(activity => {
        let score = 0;
        
        // Score based on vibe preference
        if (preferences.vibes[activity.vibe]) {
          score += preferences.vibes[activity.vibe] * 3;
        }
        
        // Score based on category preference
        if (preferences.categories[activity.category]) {
          score += preferences.categories[activity.category] * 2;
        }
        
        // Score based on energy level preference
        if (activity.energyLevel && preferences.energyLevels[activity.energyLevel]) {
          score += preferences.energyLevels[activity.energyLevel] * 2;
        }
        
        // Score based on duration similarity
        const durationDiff = Math.abs(activity.duration - avgDuration);
        if (durationDiff <= 30) score += 2;
        else if (durationDiff <= 60) score += 1;
        
        // Weather-based scoring
        Object.keys(scheduledActivities).forEach(day => {
          if (weather && weather[day]) {
            const weatherCode = weather[day];
            if (weatherCode >= 51 && activity.category === 'Indoor') {
              score += 3; // Boost indoor activities for rainy days
            } else if (weatherCode <= 1 && activity.category === 'Outdoor') {
              score += 3; // Boost outdoor activities for sunny days
            }
          }
        });
        
        return { ...activity, recommendationScore: score };
      })
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 5); // Top 5 recommendations

    return recommendations;
  }, [scheduledActivities, weather]);

  // Function to show smart recommendations
  const showSmartRecommendations = useCallback(() => {
    const recommendations = generateSmartRecommendations();
    
    if (recommendations.length > 0 && Object.values(scheduledActivities).flat().length > 0) {
      const topRecommendation = recommendations[0];
      
      toast((t) => (
        <div className="flex flex-col space-y-3 min-w-[320px]">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🎯</span>
            <span className="font-semibold">Smart Recommendation</span>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg">
            <div className="font-medium text-gray-900">{topRecommendation.name}</div>
            <div className="text-sm text-gray-600 mt-1">{topRecommendation.description}</div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                {topRecommendation.vibe}
              </span>
              <span className="text-xs text-gray-500">
                {topRecommendation.duration} min
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              className="flex-1 px-3 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors"
              onClick={() => {
                addActivityToBucket(topRecommendation);
                toast.success('Added to your bucket!');
                toast.dismiss(t.id);
              }}
            >
              Add to Bucket
            </button>
            <button
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
              onClick={() => toast.dismiss(t.id)}
            >
              Maybe Later
            </button>
          </div>
        </div>
      ), { 
        duration: 15000,
        position: 'bottom-right'
      });
    }
  }, [scheduledActivities, addActivityToBucket, generateSmartRecommendations]);

  // Show recommendations when user has some activities but not too many
  useEffect(() => {
    const totalActivities = Object.values(scheduledActivities).flat().length;
    const totalPossibleSlots = Object.keys(scheduledActivities).length * 4; // Assume 4 activities per day max
    
    // Show recommendations when user has 2-6 activities (engaged but not overwhelmed)
    if (totalActivities >= 2 && totalActivities <= 6 && totalActivities < totalPossibleSlots * 0.7) {
      const timer = setTimeout(() => {
        showSmartRecommendations();
      }, 6000); // Show after 6 seconds of activity
      
      return () => clearTimeout(timer);
    }
  }, [scheduledActivities, showSmartRecommendations]);

  return {
    // Existing functionality
    selectedTheme,
    scheduledActivities,
    weekendOption,
    handleWeekendOptionChange,
    weather,
    currentView,
    setCurrentView,
    applyTheme,
    handleDragStart,
    handleDragEnd,
    isDragging,
    handleDragOver,
    handleDrop,
    addActivity,
    addActivityToBucket,
    activityBucket,
    handleDropOnBucket,
    removeActivityFromBucket,
    pushBucketToPlan,
    removeActivity,
    updateActivityTime,
    updateActivityBucketTime,
    generateSummary,
    themes,
    activityCategories,
    weekendOptions,
    isBucketOpen,
    setIsBucketOpen,
    
    // Advanced features - Holiday Awareness
    holidayRecommendations,
    suggestLongWeekendPlan,
    
    // Advanced features - Smart Integrations
    userLocation,
    localEvents,
    discoverNearbyEvents,
    
    // Advanced features - Mood Tracking
    currentMood,
    moodInsights,
    trackUserMood,
    smartSuggestions,
    
    // Advanced features - Performance & Persistence
    isOfflineMode,
    performanceMetrics,
    getPerformanceInsights,
    saveWeekendPlan,
    
    // Services for components to use directly
    persistenceService,
    moodTrackingService,
    holidayService,
    smartIntegrationsService
  };
};

export default useWeekendPlanner;
