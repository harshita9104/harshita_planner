import React, { useState } from 'react';
import { Star, X, Clock, Zap, Battery, Info } from 'lucide-react';
import * as Icons from 'lucide-react';

const vibeColors = {
  sophisticated: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white',
  creative: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white',
  refined: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white',
  adventurous: 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
  authentic: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
  challenging: 'bg-gradient-to-r from-red-600 to-orange-600 text-white',
  serene: 'bg-gradient-to-r from-teal-400 to-blue-500 text-white',
  dynamic: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
  mystical: 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white',
  artistic: 'bg-gradient-to-r from-pink-400 to-purple-500 text-white',
  thoughtful: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white',
  electrifying: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
  inspiring: 'bg-gradient-to-r from-purple-400 to-pink-400 text-white',
  competitive: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
  rejuvenating: 'bg-gradient-to-r from-green-400 to-teal-500 text-white',
  energizing: 'bg-gradient-to-r from-orange-400 to-red-400 text-white',
  centering: 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white',
  contemplative: 'bg-gradient-to-r from-gray-500 to-blue-500 text-white',
  liberating: 'bg-gradient-to-r from-teal-400 to-cyan-500 text-white',
  meaningful: 'bg-gradient-to-r from-green-600 to-blue-600 text-white',
  expressive: 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
};

const energyLevelIcons = {
  low: Battery,
  medium: Clock,
  high: Zap
};

const energyLevelColors = {
  low: 'text-green-500',
  medium: 'text-yellow-500',
  high: 'text-red-500'
};

const ActivityCard = ({ 
  activity, 
  day, 
  showTime = true, 
  isDraggable = true, 
  onDragStart, 
  onDragEnd, 
  onRemove, 
  onTimeChange,
  showDetailButton = false, // New prop to control detail button visibility
  onCardClick // New prop for external modal handling
}) => {
  const IconComponent = Icons[activity.icon] || Star;
  const EnergyIcon = energyLevelIcons[activity.energyLevel] || Clock;
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    if (isDraggable && onDragStart) {
      setIsDragging(true);
      onDragStart(e, activity);
    }
  };

  const handleDragEnd = () => {
    if (isDraggable && onDragEnd) {
      setIsDragging(false);
      onDragEnd();
    }
  };

  const handleCardClick = (e) => {
    // Prevent modal from opening if clicking on action buttons or external buttons
    if (!isDragging && 
        e.target.closest('.card-action-button') === null && 
        e.target.closest('button') === null) {
      
      // Use external onCardClick if provided
      if (onCardClick) {
        onCardClick(activity);
      }
    }
  };

  return (
    <>
      <div
        className={`
          activity-card group relative 
          ${showDetailButton ? 'cursor-pointer hover:scale-[1.02]' : ''} 
          ${isDraggable && !showDetailButton ? 'cursor-grab active:cursor-grabbing' : ''}
          ${isDragging ? 'opacity-50 scale-95' : ''}
          ${isHovered ? 'shake' : ''}
          transform-gpu transition-all duration-300 ease-out
        `}
        draggable={isDraggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onMouseEnter={() => setIsHovered(false)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
      {/* Activity Icon and Title Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className={`relative p-3 rounded-xl ${activity.categoryColor || 'bg-gradient-to-r from-gray-500 to-gray-600'} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 mb-1 truncate group-hover:text-indigo-600 transition-colors duration-300">
              {activity.name}
            </h3>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{activity.duration} min</span>
              </div>
              <div className={`flex items-center space-x-1 ${energyLevelColors[activity.energyLevel]}`}>
                <EnergyIcon className="w-3 h-3" />
                <span className="capitalize">{activity.energyLevel}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute -top-2 -right-2 flex space-x-1">
          {/* Detail Button - Only show if enabled */}
          {showDetailButton && onCardClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCardClick(activity);
              }}
              className="card-action-button bg-white rounded-full p-1.5 shadow-md 
                       text-gray-400 hover:text-indigo-500 hover:bg-indigo-50
                       transform scale-0 group-hover:scale-100 transition-all duration-200
                       border border-gray-200 hover:border-indigo-200"
              title="View Details"
            >
              <Info className="w-3 h-3" />
            </button>
          )}
          
          {/* Remove Button */}
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(activity.id, day);
              }}
              className="card-action-button bg-white rounded-full p-1.5 shadow-md 
                       text-gray-400 hover:text-red-500 hover:bg-red-50
                       transform scale-0 group-hover:scale-100 transition-all duration-200
                       border border-gray-200 hover:border-red-200"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              title="Remove Activity"
            >
            <X className="w-3 h-3" />
          </button>
        )}
        </div>
      </div>

      {/* Description */}
      {activity.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {activity.description}
        </p>
      )}

      {/* Bottom Section */}
      <div className="flex items-center justify-between">
        {/* Vibe Badge */}
        <span className={`
          px-3 py-1.5 rounded-full text-xs font-semibold 
          ${vibeColors[activity.vibe] || 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'}
          shadow-sm transform group-hover:scale-105 transition-transform duration-200
        `}>
          {activity.vibe}
        </span>
        
        {/* Time Input */}
        {showTime && onTimeChange && (
          <div className="relative">
            <input
              type="time"
              value={activity.time || '12:00'}
              onChange={(e) => onTimeChange(activity.id, day, e.target.value)}
              className="
                text-sm border-2 border-gray-200 rounded-lg px-3 py-2
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                transition-all duration-200 outline-none
                bg-white hover:border-gray-300
                font-medium text-gray-700
              "
            />
          </div>
        )}
      </div>

      {/* Category Badge */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="bg-white bg-opacity-90 backdrop-blur-sm text-xs px-2 py-1 rounded-md font-medium text-gray-600 border border-gray-200">
          {activity.category}
        </span>
      </div>

      {/* Click hint for browse view */}
      {showDetailButton && !onRemove && (
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-md font-medium">
            Click for details
          </span>
        </div>
      )}
    </div>
  </>
  );
};

export default ActivityCard;
