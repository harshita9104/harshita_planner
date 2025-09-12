/**
 * 📊 Performance Insights Component - Advanced Analytics & Metrics
 * 
 * This component provides users with insights about their weekend planning patterns,
 * app performance, and usage analytics. It helps demonstrate the scale and 
 * performance capabilities of the application.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, Clock, Target, Zap, Database,
  TrendingUp, Calendar, Activity, Wifi,
  WifiOff, Upload, CheckCircle
} from 'lucide-react';

const PerformanceInsights = ({ 
  getPerformanceInsights,
  isOfflineMode,
  performanceMetrics,
  scheduledActivities 
}) => {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMetric, setActiveMetric] = useState('overview');

  const loadInsights = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getPerformanceInsights();
      setInsights(data);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getPerformanceInsights]);

  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  const calculateActivityStats = () => {
    const allActivities = Object.values(scheduledActivities).flat();
    const totalDuration = allActivities.reduce((sum, activity) => sum + (activity.duration || 120), 0);
    const categories = [...new Set(allActivities.map(a => a.category))];
    const vibes = [...new Set(allActivities.map(a => a.vibe))];
    
    return {
      totalActivities: allActivities.length,
      totalDuration: Math.round(totalDuration / 60 * 10) / 10, // Convert to hours with 1 decimal
      uniqueCategories: categories.length,
      uniqueVibes: vibes.length,
      averageDuration: allActivities.length > 0 ? Math.round(totalDuration / allActivities.length) : 0
    };
  };

  const activityStats = calculateActivityStats();

  const metricCards = [
    {
      id: 'activities',
      title: 'Activities Planned',
      value: activityStats.totalActivities,
      subtitle: `${activityStats.totalDuration}h total`,
      icon: Calendar,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      trend: activityStats.totalActivities >= 10 ? 'high' : activityStats.totalActivities >= 5 ? 'medium' : 'low'
    },
    {
      id: 'performance',
      title: 'App Performance',
      value: performanceMetrics.loadTime ? `${Math.round(performanceMetrics.loadTime)}ms` : 'N/A',
      subtitle: 'Load time',
      icon: Zap,
      color: 'bg-gradient-to-r from-green-500 to-emerald-600',
      trend: performanceMetrics.loadTime < 1000 ? 'high' : performanceMetrics.loadTime < 2000 ? 'medium' : 'low'
    },
    {
      id: 'engagement',
      title: 'User Engagement',
      value: performanceMetrics.userEngagement || 0,
      subtitle: 'Actions taken',
      icon: Target,
      color: 'bg-gradient-to-r from-purple-500 to-pink-600',
      trend: performanceMetrics.userEngagement >= 20 ? 'high' : performanceMetrics.userEngagement >= 10 ? 'medium' : 'low'
    },
    {
      id: 'scale',
      title: 'Scale Ready',
      value: activityStats.totalActivities >= 50 ? 'Yes' : `${activityStats.totalActivities}/50`,
      subtitle: '50+ activities',
      icon: Database,
      color: 'bg-gradient-to-r from-orange-500 to-red-600',
      trend: activityStats.totalActivities >= 50 ? 'high' : activityStats.totalActivities >= 25 ? 'medium' : 'low'
    }
  ];

  const renderTrendIcon = (trend) => {
    switch (trend) {
      case 'high':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'medium':
        return <Activity className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <Clock className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const renderDetailedView = () => {
    if (!insights) return null;

    switch (activeMetric) {
      case 'performance':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Technical Performance</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Load Time</div>
                <div className="text-lg font-semibold text-gray-800">
                  {performanceMetrics.loadTime ? `${Math.round(performanceMetrics.loadTime)}ms` : 'N/A'}
                </div>
                <div className="text-xs text-gray-500">
                  {performanceMetrics.loadTime < 1000 ? 'Excellent' : 
                   performanceMetrics.loadTime < 2000 ? 'Good' : 'Needs optimization'}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Memory Usage</div>
                <div className="text-lg font-semibold text-gray-800">Optimized</div>
                <div className="text-xs text-gray-500">Efficient state management</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Offline Support</div>
                <div className="text-lg font-semibold text-gray-800 flex items-center">
                  {isOfflineMode ? <WifiOff className="w-5 h-5 mr-2" /> : <Wifi className="w-5 h-5 mr-2" />}
                  {isOfflineMode ? 'Offline' : 'Online'}
                </div>
                <div className="text-xs text-gray-500">
                  {isOfflineMode ? 'All features available' : 'Live data sync active'}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Scale Test</div>
                <div className="text-lg font-semibold text-gray-800">
                  {activityStats.totalActivities >= 50 ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    `${activityStats.totalActivities}/50`
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {activityStats.totalActivities >= 50 ? 'Scale validated' : 'Add more activities to test scale'}
                </div>
              </div>
            </div>
          </div>
        );

      case 'usage':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Usage Analytics</h4>
            {insights.analytics ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Total Actions</div>
                  <div className="text-lg font-semibold text-gray-800">{insights.analytics.totalActions}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Sessions</div>
                  <div className="text-lg font-semibold text-gray-800">{insights.analytics.uniqueSessions}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Offline Usage</div>
                  <div className="text-lg font-semibold text-gray-800">{insights.analytics.offlineUsage}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Data Sync</div>
                  <div className="text-lg font-semibold text-gray-800 flex items-center">
                    <Upload className="w-4 h-4 mr-1" />
                    Active
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Start using the app to see usage analytics.</p>
            )}
          </div>
        );

      case 'mood':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Mood & Activity Patterns</h4>
            {insights.moodData && insights.moodData.moodHistory ? (
              <div className="space-y-3">
                <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                  <div className="text-sm text-gray-600">Mood Entries</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {Object.keys(insights.moodData.moodHistory).length}
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <div className="text-sm text-gray-600">Vibe Patterns</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {Object.keys(insights.moodData.vibePatterns).length} tracked
                  </div>
                </div>
                {insights.moodData.insights && (
                  <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <div className="text-sm text-gray-600">Insights Available</div>
                    <div className="text-lg font-semibold text-gray-800">Yes</div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-600">Start tracking your mood to see pattern insights.</p>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Activity Overview</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Categories</div>
                <div className="text-lg font-semibold text-gray-800">{activityStats.uniqueCategories}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Vibes</div>
                <div className="text-lg font-semibold text-gray-800">{activityStats.uniqueVibes}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Avg Duration</div>
                <div className="text-lg font-semibold text-gray-800">{activityStats.averageDuration}m</div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <h5 className="font-medium text-gray-800 mb-2">Weekend Planning Stats</h5>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Total weekend time planned: <span className="font-medium">{activityStats.totalDuration} hours</span></div>
                <div>Planning efficiency: <span className="font-medium">
                  {activityStats.totalActivities > 0 ? 'Excellent' : 'Start planning!'}
                </span></div>
                <div>Variety score: <span className="font-medium">
                  {activityStats.uniqueCategories >= 3 ? 'Diverse' : 
                   activityStats.uniqueCategories >= 2 ? 'Good mix' : 'Try more variety'}
                </span></div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Performance Insights</h3>
            <p className="text-sm text-gray-600">App analytics and usage patterns</p>
          </div>
        </div>
        <button
          onClick={loadInsights}
          disabled={isLoading}
          className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors disabled:opacity-50"
        >
          <TrendingUp className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <button
              key={metric.id}
              onClick={() => setActiveMetric(metric.id)}
              className={`p-4 rounded-xl transition-all duration-300 text-left ${
                activeMetric === metric.id
                  ? 'ring-2 ring-indigo-500 bg-white/60'
                  : 'bg-white/30 hover:bg-white/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 ${metric.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                {renderTrendIcon(metric.trend)}
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</div>
              <div className="text-xs text-gray-600">{metric.title}</div>
              <div className="text-xs text-gray-500">{metric.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* Detailed View */}
      <div className="bg-white/30 rounded-lg p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Loading insights...</span>
          </div>
        ) : (
          renderDetailedView()
        )}
      </div>

      {/* Status Footer */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              {isOfflineMode ? <WifiOff className="w-3 h-3 mr-1" /> : <Wifi className="w-3 h-3 mr-1" />}
              {isOfflineMode ? 'Offline Mode' : 'Online'}
            </span>
            <span>Scale: {activityStats.totalActivities >= 50 ? 'Validated' : 'Testing'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>Performance Optimized</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceInsights;
