/**
 * 🎯 Enhanced Drag & Drop Interface Component
 * 
 * This component provides advanced drag-and-drop functionality with visual feedback,
 * conflict detection, smart suggestions, and intuitive interactions. It makes 
 * planning activities feel natural and responsive.
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Move, Plus, AlertTriangle, CheckCircle, Clock,
  Calendar, Target, Sparkles, ArrowRight, X
} from 'lucide-react';

const DragDropInterface = ({ 
  children,
  onDrop,
  onDragOver,
  allowDrop = true,
  dropZoneId,
  conflictCheck,
  smartSuggestions = [],
  className = "",
  placeholder = "Drop activity here",
  showVisualFeedback = true
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dropPreview, setDropPreview] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const dropZoneRef = useRef(null);

  useEffect(() => {
    const handleGlobalDragEnd = () => {
      setIsDragOver(false);
      setDropPreview(null);
      setShowSuggestions(false);
      setConflicts([]);
    };

    document.addEventListener('dragend', handleGlobalDragEnd);
    return () => document.removeEventListener('dragend', handleGlobalDragEnd);
  }, []);

  const handleDragEnter = (e) => {
    e.preventDefault();
    if (!allowDrop) return;
    
    setIsDragOver(true);
    
    // Get drag data if available
    try {
      const dragData = e.dataTransfer.getData('application/json');
      if (dragData) {
        const activity = JSON.parse(dragData);
        setDropPreview(activity);
        
        // Check for conflicts
        if (conflictCheck) {
          const detectedConflicts = conflictCheck(activity);
          setConflicts(detectedConflicts || []);
        }
        
        // Show smart suggestions if conflicts exist
        if (conflicts.length > 0 && smartSuggestions.length > 0) {
          setShowSuggestions(true);
        }
      }
    } catch (error) {
      // Fallback for browsers that don't support drag data during dragenter
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Only trigger leave if we're actually leaving the drop zone
    if (!dropZoneRef.current?.contains(e.relatedTarget)) {
      setIsDragOver(false);
      setDropPreview(null);
      setShowSuggestions(false);
      setConflicts(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = allowDrop ? 'move' : 'none';
    
    // Track drag position for visual effects
    setDragPosition({ x: e.clientX, y: e.clientY });
    
    if (onDragOver) {
      onDragOver(e);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    setDropPreview(null);
    setShowSuggestions(false);
    setConflicts([]);
    
    if (!allowDrop) return;
    
    try {
      const dragData = e.dataTransfer.getData('application/json');
      if (dragData && onDrop) {
        const activity = JSON.parse(dragData);
        const rect = dropZoneRef.current.getBoundingClientRect();
        const dropInfo = {
          activity,
          position: {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          },
          dropZoneId,
          hasConflicts: conflicts.length > 0
        };
        onDrop(dropInfo);
      }
    } catch (error) {
      console.error('Drop failed:', error);
    }
  };

  const renderDropPreview = () => {
    if (!dropPreview || !showVisualFeedback) return null;

    return (
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border-2 border-dashed border-blue-500 min-w-64">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Move className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">{dropPreview.name}</div>
                <div className="text-sm text-gray-600">{dropPreview.duration}min • {dropPreview.vibe}</div>
              </div>
            </div>
            
            {conflicts.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-2">
                <div className="flex items-center space-x-2 text-red-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Conflicts detected</span>
                </div>
                <div className="text-xs text-red-600 mt-1">
                  {conflicts.slice(0, 2).map((conflict, index) => (
                    <div key={index}>• {conflict.message}</div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              <span>Release to add</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSmartSuggestions = () => {
    if (!showSuggestions || smartSuggestions.length === 0) return null;

    return (
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-800">Smart Suggestions</span>
          </div>
          <div className="space-y-1">
            {smartSuggestions.slice(0, 3).map((suggestion, index) => (
              <div key={index} className="text-xs text-gray-600 flex items-center">
                <ArrowRight className="w-3 h-3 mr-1" />
                {suggestion.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const getDropZoneStyles = () => {
    const baseStyles = `relative transition-all duration-300 ${className}`;
    
    if (!allowDrop) {
      return `${baseStyles} opacity-50 cursor-not-allowed`;
    }
    
    if (isDragOver) {
      if (conflicts.length > 0) {
        return `${baseStyles} bg-red-50/50 border-2 border-dashed border-red-400 scale-105`;
      } else {
        return `${baseStyles} bg-blue-50/50 border-2 border-dashed border-blue-400 scale-105`;
      }
    }
    
    return `${baseStyles} border-2 border-dashed border-transparent hover:border-gray-300`;
  };

  return (
    <div
      ref={dropZoneRef}
      className={getDropZoneStyles()}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      
      {/* Empty state placeholder */}
      {!children && isDragOver && (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <Plus className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-sm font-medium text-gray-700 mb-1">{placeholder}</div>
          <div className="text-xs text-gray-500">Release to add activity</div>
        </div>
      )}
      
      {/* Visual feedback overlays */}
      {renderDropPreview()}
      {renderSmartSuggestions()}
      
      {/* Drop zone indicator */}
      {isDragOver && showVisualFeedback && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-2 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50/20 flex items-center justify-center">
            <div className="text-blue-600 text-sm font-medium flex items-center space-x-2">
              {conflicts.length > 0 ? (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>Conflicts detected</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Drop here</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DragDropInterface;
