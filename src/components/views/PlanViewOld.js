import React, { useState } from 'react';
import { Calendar, AlertTriangle, Plus, TrendingUp, Clock, MapPin } from 'lucide-react';
import ActivityCard from '../ui/ActivityCard';
import WeatherIcon from '../ui/WeatherIcon';
import { weekendOptions } from '../../constants';
import './PlanView.css';

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
      return { type: 'warning', message: 'Light rain expected - consider indoor alternatives' };
    } else if (weatherCode >= 70) {
      return { type: 'danger', message: 'Heavy rain/snow expected - indoor activities recommended' };
    } else if (weatherCode >= 20 && weatherCode < 30) {
      return { type: 'info', message: 'Perfect weather for outdoor activities!' };
    }
    return null;
  };

  const calculateDayStats = (day) => {
    const activities = scheduledActivities[day];
    const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0);
    const outdoorCount = activities.filter(activity => activity.category === 'Outdoor').length;
    const indoorCount = activities.length - outdoorCount;
    
    return { totalDuration, outdoorCount, indoorCount, totalActivities: activities.length };
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
    <div className="space-y-8 fade-in-scale">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-2xl">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Your Perfect Weekend
            </h2>
            <p className="text-gray-600 mt-1">Craft your ideal weekend experience</p>
          </div>
        </div>
        
        {/* Weekend Duration Selector */}
        <div className="glass-card inline-block p-6 max-w-md mx-auto">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Weekend Duration</label>
          <select
            value={weekendOption}
            onChange={(e) => handleWeekendOptionChange(e.target.value)}
            className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 text-gray-700 
                     focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                     transition-all duration-200 font-medium"
          >
            {Object.entries(weekendOptions).map(([key, option]) => (
              <option key={key} value={key}>
                {option.name} ({option.days.length} days)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Days Grid */}
      <div className={`grid gap-8 ${
        days.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' :
        days.length === 2 ? 'grid-cols-1 lg:grid-cols-2' :
        days.length === 3 ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' :
        'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
      }`}>
        {days.map((day, index) => {
          const stats = calculateDayStats(day);
          const weatherMsg = getWeatherMessage(day);
          const isExpanded = expandedDay === day;
          
          return (
            <div
              key={day}
              className={`
                relative overflow-hidden rounded-3xl min-h-[500px]
                bg-gradient-to-br ${dayGradients[index % dayGradients.length]}
                shadow-xl hover:shadow-2xl transform hover:-translate-y-1
                transition-all duration-300 ease-out
                ${isExpanded ? 'col-span-full lg:col-span-2' : ''}
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-32 -translate-y-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full transform -translate-x-24 translate-y-24"></div>
              </div>

              {/* Drop Zone */}
              <div
                className="relative h-full p-6 drop-zone"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, day)}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <WeatherIcon day={day} weather={weather} />
                    <div>
                      <h3 className="text-2xl font-bold text-white capitalize tracking-wide">
                        {day}
                      </h3>
                      <div className="flex items-center space-x-4 text-white text-sm opacity-90">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{Math.floor(stats.totalDuration / 60)}h {stats.totalDuration % 60}m</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{stats.outdoorCount} outdoor, {stats.indoorCount} indoor</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Activity Counter */}
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-4 py-2">
                    <span className="text-white font-bold text-lg">
                      {stats.totalActivities}
                    </span>
                    <span className="text-white text-sm opacity-80 ml-1">activities</span>
                  </div>
                </div>

                {/* Weather Alert */}
                {weatherMsg && (
                  <div className={`
                    mb-4 p-3 rounded-xl backdrop-blur-sm flex items-center space-x-2
                    ${weatherMsg.type === 'warning' ? 'bg-yellow-400 bg-opacity-20 border border-yellow-300' :
                      weatherMsg.type === 'danger' ? 'bg-red-400 bg-opacity-20 border border-red-300' :
                      'bg-green-400 bg-opacity-20 border border-green-300'}
                  `}>
                    <AlertTriangle className={`w-4 h-4 ${
                      weatherMsg.type === 'warning' ? 'text-yellow-100' :
                      weatherMsg.type === 'danger' ? 'text-red-100' :
                      'text-green-100'
                    }`} />
                    <span className="text-white text-sm font-medium">{weatherMsg.message}</span>
                  </div>
                )}

                {/* Activities List */}
                <div className="space-y-4 flex-1">
                  {stats.totalActivities > 0 ? (
                    scheduledActivities[day]
                      .sort((a, b) => (a.time || '12:00').localeCompare(b.time || '12:00'))
                      .map((activity, activityIndex) => (
                        <div
                          key={activity.id}
                          className="slide-in-up"
                          style={{ animationDelay: `${(index + activityIndex) * 150}ms` }}
                        >
                          <ActivityCard
                            activity={activity}
                            day={day}
                            onDragStart={handleDragStart}
                            onRemove={removeActivity}
                            onTimeChange={updateActivityTime}
                          />
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-16 text-white">
                      <div className="bg-white bg-opacity-20 rounded-full p-6 mx-auto mb-4 w-24 h-24 flex items-center justify-center">
                        <Plus className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-semibold mb-2">Ready for Activities!</h4>
                      <p className="opacity-80">Drag activities here or browse to discover new ones</p>
                    </div>
                  )}
                </div>

                {/* Day Summary Footer */}
                {stats.totalActivities > 0 && (
                  <div className="mt-6 pt-4 border-t border-white border-opacity-20">
                    <div className="flex items-center justify-between text-white text-sm">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Day Completion: {Math.min(100, (stats.totalDuration / 480) * 100).toFixed(0)}%</span>
                      </div>
                      <button
                        onClick={() => setExpandedDay(isExpanded ? null : day)}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-lg transition-colors"
                      >
                        {isExpanded ? 'Collapse' : 'Expand'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanView;
