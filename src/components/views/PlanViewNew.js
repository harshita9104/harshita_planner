import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, Home, ChevronDown, AlertTriangle, 
  Plus, Sparkles, Coffee, Sun, Target
} from 'lucide-react';
import ActivityCard from '../ui/ActivityCard';
import WeatherIcon from '../ui/WeatherIcon';
import { weekendOptions } from '../../constants';

const PlanView = ({
  scheduledActivities,
  weather,
  handleDragStart,
  handleDragOver,
  handleDrop,
  removeActivity,
  updateActivityTime,
  weekendOption,
  handleWeekendOptionChange
}) => {
  const [expandedDay, setExpandedDay] = useState(null);

  const getWeatherMessage = (day) => {
    if (!weather || !weather[day]) return null;
    const weatherCode = weather[day];
    
    if (weatherCode >= 51 && weatherCode < 70) {
      return {
        type: 'warning',
        message: 'Rain expected - consider indoor activities or bring an umbrella!'
      };
    } else if (weatherCode >= 71 && weatherCode < 80) {
      return {
        type: 'info',
        message: 'Snow possible - dress warmly and check road conditions!'
      };
    }
    return null;
  };

  const calculateDayStats = (day) => {
    const activities = scheduledActivities[day] || [];
    const totalDuration = activities.reduce((sum, activity) => sum + (activity.duration || 60), 0);
    const outdoorCount = activities.filter(activity => activity.category === 'Outdoor').length;
    const indoorCount = activities.length - outdoorCount;
    const completionPercentage = Math.min((totalDuration / 480) * 100, 100); // 8 hours = 480 min
    
    return {
      totalActivities: activities.length,
      totalDuration,
      outdoorCount,
      indoorCount,
      completionPercentage
    };
  };

  const days = Object.keys(scheduledActivities);
  const dayGradients = [
    'from-indigo-400 via-purple-400 to-pink-400',
    'from-orange-400 via-red-400 to-pink-400', 
    'from-green-400 via-teal-400 to-blue-400',
    'from-yellow-400 via-orange-400 to-red-400',
    'from-purple-400 via-pink-400 to-rose-400',
    'from-blue-400 via-indigo-400 to-purple-400'
  ];

  return (
    <div className="space-y-8 fade-in-scale max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Your Perfect Weekend
            </h2>
            <p className="text-gray-600 mt-2 text-lg">Craft your ideal weekend experience</p>
          </div>
        </div>
        
        {/* Weekend Duration Selector */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-w-md mx-auto">
          <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center justify-center">
            <Target className="w-5 h-5 mr-2 text-indigo-500" />
            Weekend Duration
          </label>
          <select
            value={weekendOption}
            onChange={(e) => handleWeekendOptionChange(e.target.value)}
            className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 text-gray-700 
                     focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                     transition-all duration-200 font-medium text-center"
          >
            {Object.entries(weekendOptions).map(([key, option]) => (
              <option key={key} value={key}>
                {option.name} ({option.days.length} days)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Days Grid - Clean Layout */}
      <div className={`grid gap-6 ${
        days.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' :
        days.length === 2 ? 'grid-cols-1 lg:grid-cols-2' :
        'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
      }`}>
        {days.map((day, index) => {
          const stats = calculateDayStats(day);
          const weatherMsg = getWeatherMessage(day);
          const isExpanded = expandedDay === day;
          
          return (
            <div
              key={day}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Day Header */}
              <div className={`bg-gradient-to-r ${dayGradients[index % dayGradients.length]} p-6 text-white relative`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold capitalize mb-2">{day}</h3>
                    <div className="text-white/90 text-sm space-y-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{Math.floor(stats.totalDuration / 60)}h {stats.totalDuration % 60}m</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{stats.totalActivities} activities</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{stats.outdoorCount} outdoor</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Home className="w-4 h-4" />
                          <span>{stats.indoorCount} indoor</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <WeatherIcon day={day} weather={weather} />
                    <button
                      onClick={() => setExpandedDay(isExpanded ? null : day)}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="bg-white/20 rounded-full h-2 mb-2">
                  <div 
                    className="bg-white rounded-full h-full transition-all duration-500"
                    style={{ width: `${Math.min(stats.completionPercentage, 100)}%` }}
                  />
                </div>
                <div className="text-white/80 text-xs">
                  {Math.round(stats.completionPercentage)}% of day planned
                </div>
              </div>

              {/* Weather Alert */}
              {weatherMsg && (
                <div className={`mx-6 mt-4 p-3 rounded-xl flex items-center space-x-2 ${
                  weatherMsg.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                  weatherMsg.type === 'danger' ? 'bg-red-50 border border-red-200' :
                  'bg-blue-50 border border-blue-200'
                }`}>
                  <AlertTriangle className={`w-4 h-4 ${
                    weatherMsg.type === 'warning' ? 'text-yellow-500' :
                    weatherMsg.type === 'danger' ? 'text-red-500' :
                    'text-blue-500'
                  }`} />
                  <span className="text-gray-700 text-sm font-medium">{weatherMsg.message}</span>
                </div>
              )}

              {/* Drop Zone & Activities */}
              <div
                className={`p-6 min-h-[400px] transition-all duration-200 ${
                  stats.totalActivities === 0 
                    ? 'border-2 border-dashed border-gray-200 bg-gray-50/50 hover:border-indigo-300 hover:bg-indigo-50/30' 
                    : ''
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, day)}
              >
                {stats.totalActivities > 0 ? (
                  <div className="space-y-4">
                    {scheduledActivities[day]
                      .sort((a, b) => (a.time || '12:00').localeCompare(b.time || '12:00'))
                      .map((activity) => (
                        <ActivityCard
                          key={activity.id}
                          activity={activity}
                          day={day}
                          onRemove={removeActivity}
                          onTimeChange={updateActivityTime}
                          showTime={true}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 py-16">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                        <Calendar className="w-10 h-10 text-indigo-400" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                        <Plus className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h4 className="text-xl font-semibold mb-3 text-gray-600">Plan Your {day}</h4>
                    <div className="text-center space-y-2">
                      <p className="text-sm text-gray-500">
                        Drag activities here from the Browse section
                      </p>
                      <p className="text-sm text-gray-500">
                        or choose from our curated themes
                      </p>
                    </div>
                    <div className="mt-6 flex items-center space-x-2 text-xs text-gray-400">
                      <Sparkles className="w-4 h-4" />
                      <span>Drop zone ready</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Tips */}
      <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <div className="flex items-start space-x-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl flex-shrink-0">
            <Coffee className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Planning Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span>Click activity cards for detailed information and location suggestions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Weather updates automatically suggest indoor alternatives</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Drag and drop activities between days to reorganize</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Progress bars show how full each day is planned</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanView;
