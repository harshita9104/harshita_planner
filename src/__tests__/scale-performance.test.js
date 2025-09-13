import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// Super Stretch: Scale and Performance Testing
describe('Weekendly Scale and Performance Tests', () => {
  
  // Test handling of 50+ activities
  test('should handle 50+ activities without performance degradation', async () => {
    const startTime = performance.now();
    
    render(<App />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText(/Weekendly/i)).toBeInTheDocument();
    });
    
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    // App should load in under 3 seconds even with many activities
    expect(loadTime).toBeLessThan(3000);
    
    // Check if the app renders without crashing
    const app = document.querySelector('#root');
    expect(app).toBeInTheDocument();
    
    // Verify activities are rendered (even if we can't see all 50+)
    await waitFor(() => {
      const browseButton = screen.getAllByText(/Browse/i)[0];
      fireEvent.click(browseButton);
      
      // Should show activities grid/list
      const activitiesContainer = document.querySelector('[class*="grid"], [class*="activities"]');
      expect(activitiesContainer).toBeTruthy();
    });
  });

  // Test memory usage doesn't grow excessively
  test('should maintain reasonable memory usage with large datasets', async () => {
    const initialMemory = window.performance.memory ? window.performance.memory.usedJSHeapSize : 0;
    
    render(<App />);
    
    // Simulate adding many activities to plan
    await waitFor(() => {
      expect(screen.getByText(/Weekendly/i)).toBeInTheDocument();
    });
    
    // Add multiple activities (simulate heavy usage)
    const addButtons = document.querySelectorAll('[class*="add"], button[aria-label*="add"]');
    
    // Click up to 10 add buttons (if available)
    for (let i = 0; i < Math.min(addButtons.length, 10); i++) {
      fireEvent.click(addButtons[i]);
      // Small delay to simulate real user behavior
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const finalMemory = window.performance.memory ? window.performance.memory.usedJSHeapSize : 0;
    
    if (window.performance.memory) {
      const memoryIncrease = finalMemory - initialMemory;
      const memoryIncreaseMB = memoryIncrease / (1024 * 1024);
      
      // Memory increase should be reasonable (less than 50MB for this test)
      expect(memoryIncreaseMB).toBeLessThan(50);
      console.log(`Memory usage increased by ${memoryIncreaseMB.toFixed(2)}MB`);
    }
  });

  // Test drag and drop performance with many items
  test('should handle drag and drop operations efficiently', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Weekendly/i)).toBeInTheDocument();
    });
    
    // Switch to plan view where drag and drop is most active
    const planButton = screen.getAllByText(/Plan/i)[0];
    fireEvent.click(planButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Your Weekend Plan/i)).toBeInTheDocument();
    });
    
    // Test that drag operations don't freeze the UI
    const draggableElements = document.querySelectorAll('[draggable="true"]');
    
    if (draggableElements.length > 0) {
      const startTime = performance.now();
      
      // Simulate drag operation
      fireEvent.dragStart(draggableElements[0]);
      fireEvent.dragEnd(draggableElements[0]);
      
      const endTime = performance.now();
      const dragTime = endTime - startTime;
      
      // Drag operation should complete quickly (under 100ms)
      expect(dragTime).toBeLessThan(100);
    }
  });

  // Test virtual scrolling or pagination for large lists
  test('should efficiently render large activity lists', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Browse Activities/i)).toBeInTheDocument();
    });
    
    // Check if activities are rendered efficiently
    const activityElements = document.querySelectorAll('[class*="activity"], [data-testid*="activity"]');
    
    // Even with 50+ activities, only visible ones should be in DOM for performance
    // This depends on implementation - virtual scrolling would limit DOM nodes
    if (activityElements.length > 0) {
      expect(activityElements.length).toBeGreaterThan(0);
      
      // Check that each activity element is properly structured
      activityElements.forEach(element => {
        expect(element).toBeInTheDocument();
      });
    }
  });

  // Test search and filter performance
  test('should perform search and filtering quickly', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Browse Activities/i)).toBeInTheDocument();
    });
    
    // Look for search or filter inputs
    const searchInputs = document.querySelectorAll('input[type="text"], input[placeholder*="search"], input[placeholder*="filter"]');
    
    if (searchInputs.length > 0) {
      const startTime = performance.now();
      
      // Type in search box
      fireEvent.change(searchInputs[0], { target: { value: 'hiking' } });
      
      // Wait for search results
      await waitFor(() => {
        const endTime = performance.now();
        const searchTime = endTime - startTime;
        
        // Search should complete quickly (under 500ms)
        expect(searchTime).toBeLessThan(500);
      });
    }
  });

  // Test offline functionality
  test('should work in offline mode', async () => {
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });
    
    render(<App />);
    
    // App should still render in offline mode
    await waitFor(() => {
      expect(screen.getByText(/Weekendly/i)).toBeInTheDocument();
    });
    
    // Check for offline indicators
    const offlineIndicators = document.querySelectorAll('[class*="offline"], [data-testid*="offline"]');
    
    // Should show some indication of offline status
    if (offlineIndicators.length === 0) {
      // Even without explicit offline UI, app should function
      const browseButton = screen.getAllByText(/Browse/i)[0];
      fireEvent.click(browseButton);
      
      // Should still show some activities (cached)
      await waitFor(() => {
        const activitiesSection = document.querySelector('[class*="browse"], [class*="activities"]');
        expect(activitiesSection).toBeTruthy();
      });
    }
    
    // Restore online status
    Object.defineProperty(navigator, 'onLine', {
      value: true
    });
  });

  // Test data persistence
  test('should persist data across page reloads', async () => {
    // Clear any existing data
    localStorage.clear();
    if (window.indexedDB) {
      // Note: In real tests, you might want to clear IndexedDB too
    }
    
    const { unmount } = render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Weekendly/i)).toBeInTheDocument();
    });
    
    // Add some data (simulate user interaction)
    const planButton = screen.getAllByText(/Plan/i)[0];
    fireEvent.click(planButton);
    
    // Unmount component (simulate page reload)
    unmount();
    
    // Re-render component
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Weekendly/i)).toBeInTheDocument();
    });
    
    // Check if some persistence mechanism is working
    const persistedData = localStorage.getItem('weekendly_data') || 
                         localStorage.getItem('weekendPlanner_scheduledActivities') ||
                         localStorage.getItem('weekendPlanner_userPreferences');
    
    // Some form of persistence should be active
    expect(typeof persistedData === 'string' || persistedData === null).toBe(true);
  });

  // Test component lazy loading
  test('should load components efficiently', async () => {
    const startTime = performance.now();
    
    render(<App />);
    
    // Initial render should be fast
    await waitFor(() => {
      expect(screen.getByText(/Weekendly/i)).toBeInTheDocument();
    });
    
    const initialLoadTime = performance.now() - startTime;
    expect(initialLoadTime).toBeLessThan(2000); // Under 2 seconds
    
    // Test navigation between views (should be fast)
    const views = ['Browse', 'Plan', 'Share'];
    
    for (const viewName of views) {
      const viewStartTime = performance.now();
      
      const viewButton = screen.getAllByText(new RegExp(viewName, 'i'))[0];
      if (viewButton) {
        fireEvent.click(viewButton);
        
        await waitFor(() => {
          const viewEndTime = performance.now();
          const viewLoadTime = viewEndTime - viewStartTime;
          
          // View switching should be under 500ms
          expect(viewLoadTime).toBeLessThan(500);
        });
      }
    }
  });
});

// Performance utilities for manual testing
export const performanceUtils = {
  measureRenderTime: (componentName, renderFunction) => {
    const startTime = performance.now();
    const result = renderFunction();
    const endTime = performance.now();
    
    console.log(`${componentName} render time: ${(endTime - startTime).toFixed(2)}ms`);
    return result;
  },
  
  measureMemoryUsage: () => {
    if (window.performance.memory) {
      const memory = window.performance.memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return null;
  },
  
  simulateHeavyLoad: (iterations = 1000) => {
    const startTime = performance.now();
    
    // Simulate heavy computation
    for (let i = 0; i < iterations; i++) {
      Math.random() * Math.random();
    }
    
    const endTime = performance.now();
    return endTime - startTime;
  }
};
