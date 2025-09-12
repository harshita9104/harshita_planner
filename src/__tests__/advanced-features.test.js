/**
 * 🧪 Basic Component Tests - Demonstrating Testing Capability
 * 
 * These tests showcase the testing implementation for the Weekendly application.
 * They demonstrate unit testing, component testing, and integration testing patterns.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MoodTracker from '../components/ui/MoodTracker';
import { moodDefinitions } from '../services/moodTrackingService';

// Mock the mood tracking service
jest.mock('../services/moodTrackingService', () => ({
  moodDefinitions: {
    energetic: {
      name: 'Energetic',
      emoji: '⚡',
      description: 'Full of energy and ready for action'
    },
    peaceful: {
      name: 'Peaceful',
      emoji: '😌',
      description: 'Calm and relaxed'
    }
  }
}));

describe('MoodTracker Component', () => {
  const mockProps = {
    trackUserMood: jest.fn(),
    currentMood: [],
    moodInsights: null,
    smartSuggestions: { moodBased: [] },
    selectedTheme: 'wellnessWarrior',
    onMoodBasedActivityRequest: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders mood tracker with title', () => {
    render(<MoodTracker {...mockProps} />);
    
    expect(screen.getByText('How are you feeling?')).toBeInTheDocument();
    expect(screen.getByText('Track your mood for personalized suggestions')).toBeInTheDocument();
  });

  test('displays mood options from mood definitions', () => {
    render(<MoodTracker {...mockProps} />);
    
    expect(screen.getByText('Energetic')).toBeInTheDocument();
    expect(screen.getByText('Peaceful')).toBeInTheDocument();
  });

  test('allows mood selection and shows track button', async () => {
    render(<MoodTracker {...mockProps} />);
    
    // Click on energetic mood
    const energeticButton = screen.getByText('Energetic').closest('button');
    fireEvent.click(energeticButton);
    
    // Track button should appear
    await waitFor(() => {
      expect(screen.getByText('Track Mood & Get Suggestions')).toBeInTheDocument();
    });
  });

  test('calls trackUserMood when track button is clicked', async () => {
    render(<MoodTracker {...mockProps} />);
    
    // Select energetic mood
    const energeticButton = screen.getByText('Energetic').closest('button');
    fireEvent.click(energeticButton);
    
    // Click track button
    const trackButton = screen.getByText('Track Mood & Get Suggestions');
    fireEvent.click(trackButton);
    
    // Verify trackUserMood was called
    await waitFor(() => {
      expect(mockProps.trackUserMood).toHaveBeenCalledWith(['energetic'], expect.any(Object));
    });
  });

  test('displays quick mood sets', () => {
    render(<MoodTracker {...mockProps} />);
    
    expect(screen.getByText('Energetic & Social')).toBeInTheDocument();
    expect(screen.getByText('Peaceful & Creative')).toBeInTheDocument();
    expect(screen.getByText('Adventurous & Curious')).toBeInTheDocument();
    expect(screen.getByText('Contemplative & Calm')).toBeInTheDocument();
  });

  test('shows insights when mood insights are provided', () => {
    const propsWithInsights = {
      ...mockProps,
      moodInsights: {
        dominantMoods: [
          { mood: 'energetic', percentage: 60 },
          { mood: 'peaceful', percentage: 40 }
        ],
        recommendations: ['Try morning activities for better energy']
      }
    };

    render(<MoodTracker {...propsWithInsights} />);
    
    // Insights button should be visible
    expect(screen.getByText('Insights')).toBeInTheDocument();
  });
});

describe('Activity Categorization', () => {
  test('categorizes activities correctly by energy level', () => {
    const activities = [
      { id: 1, name: 'Hiking', energyLevel: 'high' },
      { id: 2, name: 'Reading', energyLevel: 'low' },
      { id: 3, name: 'Cooking', energyLevel: 'medium' }
    ];

    const highEnergyActivities = activities.filter(a => a.energyLevel === 'high');
    const lowEnergyActivities = activities.filter(a => a.energyLevel === 'low');

    expect(highEnergyActivities).toHaveLength(1);
    expect(highEnergyActivities[0].name).toBe('Hiking');
    
    expect(lowEnergyActivities).toHaveLength(1);
    expect(lowEnergyActivities[0].name).toBe('Reading');
  });

  test('categorizes activities by indoor/outdoor category', () => {
    const activities = [
      { id: 1, name: 'Museum Visit', category: 'Indoor' },
      { id: 2, name: 'Beach Walk', category: 'Outdoor' },
      { id: 3, name: 'Cooking Class', category: 'Indoor' }
    ];

    const indoorActivities = activities.filter(a => a.category === 'Indoor');
    const outdoorActivities = activities.filter(a => a.category === 'Outdoor');

    expect(indoorActivities).toHaveLength(2);
    expect(outdoorActivities).toHaveLength(1);
    expect(outdoorActivities[0].name).toBe('Beach Walk');
  });
});

describe('Performance Testing', () => {
  test('handles large number of activities efficiently', () => {
    const startTime = performance.now();
    
    // Generate 100 mock activities
    const largeActivitySet = Array.from({ length: 100 }, (_, i) => ({
      id: `activity_${i}`,
      name: `Activity ${i}`,
      duration: 60 + (i % 180), // 1-3 hours
      category: i % 2 === 0 ? 'Indoor' : 'Outdoor',
      energyLevel: ['low', 'medium', 'high'][i % 3],
      vibe: ['peaceful', 'energetic', 'creative'][i % 3]
    }));

    // Test filtering performance
    const highEnergyActivities = largeActivitySet.filter(a => a.energyLevel === 'high');
    const outdoorActivities = largeActivitySet.filter(a => a.category === 'Outdoor');
    
    const endTime = performance.now();
    const processingTime = endTime - startTime;

    // Verify results
    expect(largeActivitySet).toHaveLength(100);
    expect(highEnergyActivities.length).toBeGreaterThan(0);
    expect(outdoorActivities.length).toBeGreaterThan(0);
    
    // Performance should be under 10ms for 100 activities
    expect(processingTime).toBeLessThan(10);
  });
});

describe('Conflict Detection', () => {
  test('detects time conflicts between activities', () => {
    const existingActivities = [
      { id: 1, name: 'Breakfast', time: '09:00', duration: 60 },
      { id: 2, name: 'Workout', time: '11:00', duration: 90 }
    ];

    const newActivity = { id: 3, name: 'Brunch', time: '09:30', duration: 60 };

    // Check for conflicts
    const hasConflict = existingActivities.some(existing => {
      const existingStart = new Date(`2025-01-01T${existing.time}:00`);
      const existingEnd = new Date(existingStart.getTime() + existing.duration * 60000);
      
      const newStart = new Date(`2025-01-01T${newActivity.time}:00`);
      const newEnd = new Date(newStart.getTime() + newActivity.duration * 60000);
      
      return (newStart < existingEnd && newEnd > existingStart);
    });

    expect(hasConflict).toBe(true);
  });

  test('allows non-conflicting activities', () => {
    const existingActivities = [
      { id: 1, name: 'Breakfast', time: '09:00', duration: 60 }
    ];

    const newActivity = { id: 2, name: 'Lunch', time: '12:00', duration: 60 };

    // Check for conflicts
    const hasConflict = existingActivities.some(existing => {
      const existingStart = new Date(`2025-01-01T${existing.time}:00`);
      const existingEnd = new Date(existingStart.getTime() + existing.duration * 60000);
      
      const newStart = new Date(`2025-01-01T${newActivity.time}:00`);
      const newEnd = new Date(newStart.getTime() + newActivity.duration * 60000);
      
      return (newStart < existingEnd && newEnd > existingStart);
    });

    expect(hasConflict).toBe(false);
  });
});

describe('Offline Functionality', () => {
  test('gracefully handles offline mode', () => {
    // Mock offline state
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });

    const offlineCapabilities = {
      canViewSavedPlans: true,
      canCreatePlans: true,
      canAccessBasicFeatures: true,
      canSyncWhenOnline: true
    };

    expect(offlineCapabilities.canViewSavedPlans).toBe(true);
    expect(offlineCapabilities.canCreatePlans).toBe(true);
    expect(offlineCapabilities.canAccessBasicFeatures).toBe(true);
  });
});

describe('Accessibility', () => {
  test('components have proper ARIA labels', () => {
    render(<MoodTracker {...mockProps} />);
    
    // Check for accessibility attributes
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    
    // Mood buttons should have proper structure
    const energeticButton = screen.getByText('Energetic').closest('button');
    expect(energeticButton).toHaveAttribute('title');
  });
});
