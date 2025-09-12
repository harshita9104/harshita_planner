import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Star, ShoppingCart, ArrowRight, Sparkles } from 'lucide-react';
import ActivityCard from '../ui/ActivityCard';
import ActivityBucket from '../ui/ActivityBucket';
import * as Icons from 'lucide-react';

const BrowseView = ({
  themes,
  selectedTheme,
  applyTheme,
  activityCategories,
  addActivityToBucket,
  activityBucket,
  handleDropOnBucket,
  handleDragOver,
  handleDragStart,
  handleDragEnd,
  isDragging,
  removeActivityFromBucket,
  pushBucketToPlan,
  updateActivityBucketTime,
  isBucketOpen,
  setIsBucketOpen,
  openActivityModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [energyFilter, setEnergyFilter] = useState('all');
  const [vibeFilter, setVibeFilter] = useState('all');

  // Get all unique vibes and energy levels for filters
  const allVibes = useMemo(() => {
    const vibes = new Set();
    Object.values(activityCategories).forEach(category => {
      category.activities.forEach(activity => {
        vibes.add(activity.vibe);
      });
    });
    return Array.from(vibes);
  }, [activityCategories]);

  const allEnergyLevels = useMemo(() => {
    const levels = new Set();
    Object.values(activityCategories).forEach(category => {
      category.activities.forEach(activity => {
        if (activity.energyLevel) levels.add(activity.energyLevel);
      });
    });
    return Array.from(levels);
  }, [activityCategories]);

  // Filter activities based on search and filters
  const filteredCategories = useMemo(() => {
    const filtered = {};
    
    Object.entries(activityCategories).forEach(([categoryKey, category]) => {
      const filteredActivities = category.activities.filter(activity => {
        const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            activity.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || categoryKey === selectedCategory;
        const matchesEnergy = energyFilter === 'all' || activity.energyLevel === energyFilter;
        const matchesVibe = vibeFilter === 'all' || activity.vibe === vibeFilter;
        
        return matchesSearch && matchesCategory && matchesEnergy && matchesVibe;
      });
      
      if (filteredActivities.length > 0) {
        filtered[categoryKey] = { ...category, activities: filteredActivities };
      }
    });
    
    return filtered;
  }, [activityCategories, searchTerm, selectedCategory, energyFilter, vibeFilter]);

  return (
    <div className="space-y-8 fade-in-scale">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-2xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Discover Your Perfect Weekend
            </h2>
            <p className="text-gray-600 mt-1">Choose themes or craft your own unique experience</p>
          </div>
        </div>
      </div>

      {/* Activity Bucket */}
      <ActivityBucket
        bucket={activityBucket}
        onDrop={handleDropOnBucket}
        onDragOver={handleDragOver}
        onRemove={removeActivityFromBucket}
        isDragging={isDragging}
        onTimeChange={updateActivityBucketTime}
        isBucketOpen={isBucketOpen}
      />

      {/* Bucket Controls */}
      {activityBucket.length > 0 && (
        <div className="glass-card p-4 flex items-center justify-between max-w-md mx-auto">
          <button 
            onClick={() => setIsBucketOpen(!isBucketOpen)}
            className="flex items-center space-x-2 text-indigo-600 font-medium"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{activityBucket.length} activities selected</span>
          </button>
          <button 
            onClick={pushBucketToPlan} 
            className="btn-primary flex items-center space-x-2"
          >
            <span>Add to Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Theme Selection */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-500" />
          Curated Themes
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(themes).map(([key, theme]) => {
            const IconComponent = Icons[theme.icon];
            return (
              <button
                key={key}
                onClick={() => applyTheme(key)}
                className={`
                  relative p-4 rounded-2xl border-2 transition-all duration-300 text-center group
                  ${selectedTheme === key
                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg transform scale-105'
                    : 'border-gray-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-1'
                  }
                `}
              >
                <div className={`p-3 rounded-xl mb-3 mx-auto w-fit ${theme.color} group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="font-bold text-sm text-gray-900 mb-1">{theme.name}</div>
                <div className="text-xs text-gray-600 mb-2">{theme.description}</div>
                <div className="flex justify-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    theme.mood === 'serene' ? 'bg-green-100 text-green-700' :
                    theme.mood === 'adventurous' ? 'bg-orange-100 text-orange-700' :
                    theme.mood === 'inspiring' ? 'bg-purple-100 text-purple-700' :
                    theme.mood === 'energetic' ? 'bg-red-100 text-red-700' :
                    theme.mood === 'balanced' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {theme.mood}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none transition-colors"
            >
              <option value="all">All Categories</option>
              {Object.entries(activityCategories).map(([key, category]) => (
                <option key={key} value={key}>{category.name}</option>
              ))}
            </select>

            <select
              value={energyFilter}
              onChange={(e) => setEnergyFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none transition-colors"
            >
              <option value="all">Any Energy Level</option>
              {allEnergyLevels.map(level => (
                <option key={level} value={level}>{level} energy</option>
              ))}
            </select>

            <select
              value={vibeFilter}
              onChange={(e) => setVibeFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none transition-colors"
            >
              <option value="all">Any Vibe</option>
              {allVibes.map(vibe => (
                <option key={vibe} value={vibe}>{vibe}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Activity Categories */}
      <div className="space-y-8">
        {Object.entries(filteredCategories).map(([categoryKey, category], categoryIndex) => {
          const IconComponent = Icons[category.icon];
          return (
            <div 
              key={categoryKey} 
              className="slide-in-up"
              style={{ animationDelay: `${categoryIndex * 100}ms` }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className={`p-3 rounded-2xl ${category.color} shadow-lg`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.activities.length} activities available</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.activities.map((activity, activityIndex) => (
                  <div 
                    key={activity.id} 
                    className="relative fade-in-scale"
                    style={{ animationDelay: `${(categoryIndex + activityIndex) * 50}ms` }}
                  >
                    <ActivityCard
                      activity={{ ...activity, categoryColor: category.color }}
                      isDraggable={true}
                      showTime={true}
                      showDetailButton={false}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onTimeChange={(activityId, _, newTime) => {
                        const activityToUpdate = category.activities.find(a => a.id === activityId);
                        if (activityToUpdate) {
                          addActivityToBucket({ ...activityToUpdate, time: newTime, categoryColor: category.color });
                        }
                      }}
                      onCardClick={() => openActivityModal({ ...activity, categoryColor: category.color })}
                    />
                    <button
                      onClick={() => addActivityToBucket({ ...activity, categoryColor: category.color })}
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full p-2 
                               shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200
                               border-2 border-white"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results Message */}
      {Object.keys(filteredCategories).length === 0 && (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 mx-auto mb-6 w-24 h-24 flex items-center justify-center">
            <Filter className="w-8 h-8 text-gray-500" />
          </div>
          <h4 className="text-xl font-semibold text-gray-700 mb-2">No activities found</h4>
          <p className="text-gray-600">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
};

export default BrowseView;
