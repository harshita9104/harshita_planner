import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Header from './components/layout/Header';
import BrowseView from './components/views/BrowseView';
import PlanView from './components/views/PlanView';
import ShareView from './components/views/ShareView';
import FloatingActionButton from './components/ui/FloatingActionButton';
import ActivityDetailModal from './components/ui/ActivityDetailModal';
import HolidayRecommendations from './components/ui/HolidayRecommendations';
import MoodTracker from './components/ui/MoodTracker';
import SmartIntegrationsPanel from './components/ui/SmartIntegrationsPanel';
import PerformanceInsights from './components/ui/PerformanceInsights';
import ThemeCustomizer from './components/ui/ThemeCustomizer';
import useWeekendPlanner from './hooks/useWeekendPlanner';
import LocationProvider from './contexts/LocationContext';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Super Stretch: Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Weekendly Error:', error, errorInfo);
    // In production, send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              Don't worry, your weekend plans are safe. Try refreshing the page.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  // State for managing app-wide effects and animations
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Super Stretch: Offline support state
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [componentLoadTimes, setComponentLoadTimes] = useState({});
  
  // Modal state management at App level for proper z-index
  const [modalActivity, setModalActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const {
    selectedTheme,
    scheduledActivities,
    currentView,
    setCurrentView,
    applyTheme,
    handleDragStart,
    handleDragOver,
    handleDrop,
    removeActivity,
    updateActivityTime,
    updateActivityBucketTime,
    generateSummary,
    themes,
    activityCategories,
    addActivityToBucket,
    activityBucket,
    handleDropOnBucket,
    removeActivityFromBucket,
    pushBucketToPlan,
    isDragging,
    handleDragEnd,
    weather,
    weekendOption,
    handleWeekendOptionChange,
    isBucketOpen,
    setIsBucketOpen,
    // Advanced features
    holidayRecommendations,
    suggestLongWeekendPlan,
    userLocation,
    localEvents,
    discoverNearbyEvents,
    currentMood,
    moodInsights,
    trackUserMood,
    smartSuggestions,
    isOfflineMode,
    getPerformanceInsights,
    performanceMetrics,
    saveWeekendPlan,
    persistenceService,
    moodTrackingService
  } = useWeekendPlanner();

  // Initialize app loading effect and mouse tracking
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Super Stretch: Monitor component mount times for performance
  const registerComponentLoad = useCallback((componentName, startTime) => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;

    setComponentLoadTimes((prev) => ({
      ...prev,
      [componentName]: loadTime,
    }));
  }, []);

  // Log performance metrics to console (could be sent to an analytics endpoint)
  useEffect(() => {
    if (Object.keys(componentLoadTimes).length > 0) {
      console.log('Component Load Times:', componentLoadTimes);
    }
  }, [componentLoadTimes]);

  // Super Stretch: Performance monitoring
  const trackComponentLoad = useCallback((componentName, loadTime) => {
    setComponentLoadTimes(prev => ({
      ...prev,
      [componentName]: loadTime
    }));
  }, []);

  // Super Stretch: Offline/Online detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('🌐 App is back online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('📱 App is now offline - using cached data');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Performance metrics are now handled by the useWeekendPlanner hook

  // Modal handling functions
  const openActivityModal = (activity) => {
    setModalActivity(activity);
    setIsModalOpen(true);
  };

  const closeActivityModal = () => {
    setIsModalOpen(false);
    setModalActivity(null);
  };

  const handleModalTimeChange = (activityId, newTime) => {
    if (modalActivity) {
      updateActivityTime(activityId, newTime);
      // Update the modal activity with the new time so it's reflected in the modal
      setModalActivity(prev => ({
        ...prev,
        time: newTime
      }));
      // Don't close the modal automatically - let the modal handle that
    }
  };

  // Dynamic cursor effect based on interactions
  const cursorStyle = {
    background: isDragging 
      ? 'radial-gradient(circle at center, rgba(102, 126, 234, 0.4) 0%, transparent 70%)'
      : 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
    left: mousePosition.x - 50,
    top: mousePosition.y - 50,
  };

  return (
    <ErrorBoundary>
      <LocationProvider>
        <div className={`app min-h-screen ${selectedTheme}`} data-testid="weekendly-app">
          {/* Super Stretch: Offline notification banner */}
          {!isOnline && (
            <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white text-center py-2 text-sm font-medium">
              📱 You're offline - Using cached data. Changes will sync when you're back online.
            </div>
          )}
          
          {/* Performance monitoring indicator (development mode) */}
          {process.env.NODE_ENV === 'development' && Object.keys(performanceMetrics).length > 0 && (
            <div className="fixed bottom-4 right-4 z-40 bg-gray-900 text-white text-xs p-2 rounded opacity-75">
              Load: {Math.round(performanceMetrics.loadTime)}ms | 
              Activities: {performanceMetrics.activitiesCount} | 
              {performanceMetrics.memoryUsage && `Memory: ${Math.round(performanceMetrics.memoryUsage.used / 1024 / 1024)}MB`}
            </div>
          )}

          {/* Global toast notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }
            }} 
          />

          <Header currentView={currentView} setCurrentView={setCurrentView} />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
            <div className={`transition-all duration-500 ease-out ${isLoaded ? 'slide-in-up' : 'opacity-0'}`}>
              
              {/* Advanced Features Dashboard */}
              {currentView === 'insights' && (
                <div className="space-y-8">
                  {/* Holiday Recommendations */}
                  <HolidayRecommendations
                    holidayRecommendations={holidayRecommendations}
                    suggestLongWeekendPlan={suggestLongWeekendPlan}
                    applyTheme={applyTheme}
                    selectedTheme={selectedTheme}
                    userLocation={userLocation}
                  />
                  
                  {/* Mood Tracker */}
                  <MoodTracker
                    trackUserMood={trackUserMood}
                    currentMood={currentMood}
                    moodInsights={moodInsights}
                    smartSuggestions={smartSuggestions}
                    selectedTheme={selectedTheme}
                    onMoodBasedActivityRequest={(activity) => {
                      addActivityToBucket(activity);
                      setCurrentView('browse');
                    }}
                  />
                  
                  {/* Smart Integrations Panel */}
                  <SmartIntegrationsPanel
                    userLocation={userLocation}
                    localEvents={localEvents}
                    discoverNearbyEvents={discoverNearbyEvents}
                    smartSuggestions={smartSuggestions}
                    weather={weather}
                    onEventToActivity={(event) => {
                      // Convert event to activity format and add to bucket
                      const customActivity = {
                        id: `event_${Date.now()}`,
                        name: event.name,
                        duration: 120,
                        vibe: 'social',
                        time: '14:00',
                        category: 'Social',
                        description: event.description,
                        location: event.location,
                        source: 'local_event'
                      };
                      addActivityToBucket(customActivity);
                      setCurrentView('browse');
                    }}
                    isOfflineMode={isOfflineMode}
                  />
                  
                  {/* Performance Insights */}
                  <PerformanceInsights
                    getPerformanceInsights={getPerformanceInsights}
                    isOfflineMode={isOfflineMode}
                    performanceMetrics={performanceMetrics}
                    scheduledActivities={scheduledActivities}
                  />
                </div>
              )}

              {/* Original Views */}
              {currentView === 'browse' && (
                <BrowseView
                  themes={themes}
                  selectedTheme={selectedTheme}
                  applyTheme={applyTheme}
                  activityCategories={activityCategories}
                  addActivityToBucket={addActivityToBucket}
                  activityBucket={activityBucket}
                  handleDropOnBucket={handleDropOnBucket}
                  handleDragOver={handleDragOver}
                  handleDragStart={handleDragStart}
                  handleDragEnd={handleDragEnd}
                  isDragging={isDragging}
                  removeActivityFromBucket={removeActivityFromBucket}
                  pushBucketToPlan={pushBucketToPlan}
                  updateActivityBucketTime={updateActivityBucketTime}
                  isBucketOpen={isBucketOpen}
                  setIsBucketOpen={setIsBucketOpen}
                  openActivityModal={openActivityModal}
                />
              )}
              {currentView === 'plan' && (
                <PlanView
                  scheduledActivities={scheduledActivities}
                  handleDragOver={handleDragOver}
                  handleDrop={handleDrop}
                  removeActivity={removeActivity}
                  updateActivityTime={updateActivityTime}
                  handleDragStart={handleDragStart}
                  weather={weather}
                  weekendOption={weekendOption}
                  handleWeekendOptionChange={handleWeekendOptionChange}
                  openActivityModal={openActivityModal}
                />
              )}
              {currentView === 'share' && (
                <ShareView
                  themes={themes}
                  selectedTheme={selectedTheme}
                  scheduledActivities={scheduledActivities}
                  generateSummary={generateSummary}
                />
              )}
            </div>
          </main>

          <FloatingActionButton
            currentView={currentView}
            onClick={() => setCurrentView(currentView === 'browse' ? 'plan' : 'browse')}
          />

          {/* Theme Customizer */}
          <ThemeCustomizer
            selectedTheme={selectedTheme}
            applyTheme={applyTheme}
            themes={themes}
            currentMood={currentMood}
            saveCustomTheme={async (theme) => {
              try {
                await persistenceService.saveUserPreference(`custom_theme_${theme.name}`, theme);
                return true;
              } catch (error) {
                console.error('Failed to save custom theme:', error);
                throw error;
              }
            }}
            loadCustomThemes={async () => {
              try {
                // Load all custom themes from persistence
                const allPrefs = await persistenceService.loadUserPreference('custom_themes', []);
                return allPrefs;
              } catch (error) {
                console.error('Failed to load custom themes:', error);
                return [];
              }
            }}
          />

          {/* Global Activity Detail Modal - Rendered at App level for proper z-index */}
          {modalActivity && (
            <ActivityDetailModal
              activity={modalActivity}
              isOpen={isModalOpen}
              onClose={closeActivityModal}
              onTimeChange={handleModalTimeChange}
            />
          )}
        </div>
      </LocationProvider>
    </ErrorBoundary>
  );
};

export default App;
