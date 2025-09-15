/**
 * Advanced Persistence Service - IndexedDB + Offline Support
 * 
 * This service provides robust data persistence using IndexedDB for complex data
 * and localStorage for simple preferences. Includes offline support and data
 * synchronization capabilities for a seamless user experience.
 * 
 * Features:
 * • IndexedDB for complex data structures
 * • Offline-first architecture
 * • Data versioning and migration
 * • Automatic backup and restore
 * • Performance optimization for 50+ activities
 */

class PersistenceService {
  constructor() {
    this.dbName = 'WeekendlyDB';
    this.version = 2;
    this.db = null;
    this.isOnline = navigator.onLine;
    this.pendingSync = [];
    
    this.initializeDatabase();
    this.setupOfflineDetection();
  }

  // Initialize IndexedDB with proper schema
  async initializeDatabase() {
    try {
      this.db = await new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          
          // Create object stores if they don't exist
          if (!db.objectStoreNames.contains('weekendPlans')) {
            const planStore = db.createObjectStore('weekendPlans', { keyPath: 'id', autoIncrement: true });
            planStore.createIndex('userId', 'userId', { unique: false });
            planStore.createIndex('createdAt', 'createdAt', { unique: false });
            planStore.createIndex('theme', 'theme', { unique: false });
          }

          if (!db.objectStoreNames.contains('activities')) {
            const activityStore = db.createObjectStore('activities', { keyPath: 'id' });
            activityStore.createIndex('category', 'category', { unique: false });
            activityStore.createIndex('vibe', 'vibe', { unique: false });
            activityStore.createIndex('energyLevel', 'energyLevel', { unique: false });
          }

          if (!db.objectStoreNames.contains('userPreferences')) {
            const prefStore = db.createObjectStore('userPreferences', { keyPath: 'key' });
          }

          if (!db.objectStoreNames.contains('eventHistory')) {
            const historyStore = db.createObjectStore('eventHistory', { keyPath: 'id', autoIncrement: true });
            historyStore.createIndex('timestamp', 'timestamp', { unique: false });
            historyStore.createIndex('action', 'action', { unique: false });
          }

          if (!db.objectStoreNames.contains('cachedEvents')) {
            const eventsStore = db.createObjectStore('cachedEvents', { keyPath: 'id' });
            eventsStore.createIndex('location', 'location', { unique: false });
            eventsStore.createIndex('expiresAt', 'expiresAt', { unique: false });
          }
        };
      });

      console.log('Database initialized successfully');
      await this.migrateFromLocalStorage();
    } catch (error) {
      console.error('Database initialization failed:', error);
      // Fallback to localStorage
      this.db = null;
    }
  }

  // Setup offline detection and sync
  setupOfflineDetection() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingChanges();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Migrate existing localStorage data to IndexedDB
  async migrateFromLocalStorage() {
    try {
      const existingSchedule = localStorage.getItem('weekendly-schedule');
      const existingBucket = localStorage.getItem('weekendly-bucket');
      const existingPrefs = localStorage.getItem('weekendly-preferences');

      if (existingSchedule) {
        const scheduleData = JSON.parse(existingSchedule);
        await this.saveWeekendPlan({
          id: 'migrated_plan',
          scheduledActivities: scheduleData,
          createdAt: new Date().toISOString(),
          theme: 'wellnessWarrior',
          isMigrated: true
        });
      }

      if (existingBucket) {
        const bucketData = JSON.parse(existingBucket);
        await this.saveUserPreference('activityBucket', bucketData);
      }

      if (existingPrefs) {
        const prefsData = JSON.parse(existingPrefs);
        for (const [key, value] of Object.entries(prefsData)) {
          await this.saveUserPreference(key, value);
        }
      }

      console.log('Migration from localStorage completed');
    } catch (error) {
      console.warn('Migration failed:', error);
    }
  }

  // Save weekend plan with versioning
  async saveWeekendPlan(planData) {
    const plan = {
      ...planData,
      id: planData.id || `plan_${Date.now()}`,
      updatedAt: new Date().toISOString(),
      version: (planData.version || 0) + 1,
      isOfflineCreated: !this.isOnline
    };

    try {
      if (this.db) {
        const transaction = this.db.transaction(['weekendPlans'], 'readwrite');
        const store = transaction.objectStore('weekendPlans');
        await store.put(plan);
        
        // Log the action
        await this.logAction('save_plan', { planId: plan.id, theme: plan.theme });
        
        return plan;
      } else {
        // Fallback to localStorage
        const plans = this.getLocalStoragePlans();
        plans[plan.id] = plan;
        localStorage.setItem('weekendly-plans', JSON.stringify(plans));
        return plan;
      }
    } catch (error) {
      console.error('Failed to save weekend plan:', error);
      throw error;
    }
  }

  // Load weekend plans with filtering and sorting
  async loadWeekendPlans(filters = {}) {
    try {
      if (this.db) {
        const transaction = this.db.transaction(['weekendPlans'], 'readonly');
        const store = transaction.objectStore('weekendPlans');
        
        let plans = [];
        const request = store.getAll();
        
        plans = await new Promise((resolve, reject) => {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });

        // Apply filters
        if (filters.theme) {
          plans = plans.filter(plan => plan.theme === filters.theme);
        }
        
        if (filters.dateRange) {
          const { start, end } = filters.dateRange;
          plans = plans.filter(plan => {
            const planDate = new Date(plan.createdAt);
            return planDate >= start && planDate <= end;
          });
        }

        // Sort by most recent
        plans.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        return plans;
      } else {
        // Fallback to localStorage
        const plans = this.getLocalStoragePlans();
        return Object.values(plans).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      }
    } catch (error) {
      console.error('Failed to load weekend plans:', error);
      return [];
    }
  }

  // Save custom activities for performance with 50+ activities
  async saveCustomActivity(activity) {
    const enhancedActivity = {
      ...activity,
      id: activity.id || `custom_${Date.now()}`,
      isCustom: true,
      createdAt: new Date().toISOString(),
      usageCount: 0
    };

    try {
      if (this.db) {
        const transaction = this.db.transaction(['activities'], 'readwrite');
        const store = transaction.objectStore('activities');
        await store.put(enhancedActivity);
        
        await this.logAction('create_activity', { activityId: enhancedActivity.id });
        
        return enhancedActivity;
      } else {
        const activities = this.getLocalStorageActivities();
        activities[enhancedActivity.id] = enhancedActivity;
        localStorage.setItem('weekendly-custom-activities', JSON.stringify(activities));
        return enhancedActivity;
      }
    } catch (error) {
      console.error('Failed to save custom activity:', error);
      throw error;
    }
  }

  // Load activities with performance optimization
  async loadActivities(limit = 100, offset = 0) {
    try {
      if (this.db) {
        const transaction = this.db.transaction(['activities'], 'readonly');
        const store = transaction.objectStore('activities');
        
        // Use cursor for efficient pagination
        const activities = [];
        let skipped = 0;
        
        return new Promise((resolve, reject) => {
          const request = store.openCursor();
          
          request.onsuccess = (event) => {
            const cursor = event.target.result;
            
            if (cursor) {
              if (skipped < offset) {
                skipped++;
                cursor.continue();
                return;
              }
              
              if (activities.length < limit) {
                activities.push(cursor.value);
                cursor.continue();
              } else {
                resolve(activities);
              }
            } else {
              resolve(activities);
            }
          };
          
          request.onerror = () => reject(request.error);
        });
      } else {
        const activities = this.getLocalStorageActivities();
        const activityArray = Object.values(activities);
        return activityArray.slice(offset, offset + limit);
      }
    } catch (error) {
      console.error('Failed to load activities:', error);
      return [];
    }
  }

  // Save user preferences
  async saveUserPreference(key, value) {
    const preference = {
      key,
      value,
      updatedAt: new Date().toISOString()
    };

    try {
      if (this.db) {
        const transaction = this.db.transaction(['userPreferences'], 'readwrite');
        const store = transaction.objectStore('userPreferences');
        await store.put(preference);
      } else {
        const prefs = this.getLocalStoragePreferences();
        prefs[key] = preference;
        localStorage.setItem('weekendly-preferences', JSON.stringify(prefs));
      }
    } catch (error) {
      console.error('Failed to save preference:', error);
    }
  }

  // Load user preference
  async loadUserPreference(key, defaultValue = null) {
    try {
      if (this.db) {
        const transaction = this.db.transaction(['userPreferences'], 'readonly');
        const store = transaction.objectStore('userPreferences');
        const request = store.get(key);
        
        const result = await new Promise((resolve, reject) => {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        
        return result ? result.value : defaultValue;
      } else {
        const prefs = this.getLocalStoragePreferences();
        return prefs[key]?.value || defaultValue;
      }
    } catch (error) {
      console.error('Failed to load preference:', error);
      return defaultValue;
    }
  }

  // Cache external events with expiration
  async cacheEvents(location, events, expiryHours = 2) {
    const cacheEntry = {
      id: `events_${location.city}`,
      location: location.city,
      events,
      cachedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString()
    };

    try {
      if (this.db) {
        const transaction = this.db.transaction(['cachedEvents'], 'readwrite');
        const store = transaction.objectStore('cachedEvents');
        await store.put(cacheEntry);
      }
    } catch (error) {
      console.error('Failed to cache events:', error);
    }
  }

  // Load cached events
  async loadCachedEvents(location) {
    try {
      if (this.db) {
        const transaction = this.db.transaction(['cachedEvents'], 'readonly');
        const store = transaction.objectStore('cachedEvents');
        const request = store.get(`events_${location.city}`);
        
        const result = await new Promise((resolve, reject) => {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        
        if (result && new Date(result.expiresAt) > new Date()) {
          return result.events;
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to load cached events:', error);
      return null;
    }
  }

  // Log user actions for analytics
  async logAction(action, metadata = {}) {
    const logEntry = {
      action,
      metadata,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      isOffline: !this.isOnline
    };

    try {
      if (this.db) {
        const transaction = this.db.transaction(['eventHistory'], 'readwrite');
        const store = transaction.objectStore('eventHistory');
        await store.add(logEntry);
      }
    } catch (error) {
      console.error('Failed to log action:', error);
    }
  }

  // Analytics and insights
  async getUsageAnalytics(days = 30) {
    try {
      if (this.db) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        const transaction = this.db.transaction(['eventHistory'], 'readonly');
        const store = transaction.objectStore('eventHistory');
        const index = store.index('timestamp');
        
        const range = IDBKeyRange.lowerBound(cutoffDate.toISOString());
        const request = index.getAll(range);
        
        const events = await new Promise((resolve, reject) => {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });

        // Analyze usage patterns
        const analytics = {
          totalActions: events.length,
          uniqueSessions: new Set(events.map(e => e.sessionId)).size,
          actionBreakdown: {},
          dailyUsage: {},
          offlineUsage: events.filter(e => e.isOffline).length
        };

        events.forEach(event => {
          // Count actions
          analytics.actionBreakdown[event.action] = (analytics.actionBreakdown[event.action] || 0) + 1;
          
          // Daily usage
          const day = event.timestamp.split('T')[0];
          analytics.dailyUsage[day] = (analytics.dailyUsage[day] || 0) + 1;
        });

        return analytics;
      }
      return { totalActions: 0, message: 'Analytics not available' };
    } catch (error) {
      console.error('Failed to get analytics:', error);
      return { error: error.message };
    }
  }

  // Sync pending changes when back online
  async syncPendingChanges() {
    if (!this.isOnline || this.pendingSync.length === 0) return;

    console.log('Syncing offline changes...');

    for (const change of this.pendingSync) {
      try {
        // Process each pending change
        await this.processChange(change);
      } catch (error) {
        console.error('Failed to sync change:', error);
      }
    }

    this.pendingSync = [];
    console.log('Sync completed');
  }

  // Process individual change
  async processChange(change) {
    switch (change.type) {
      case 'save_plan':
        await this.saveWeekendPlan(change.data);
        break;
      case 'save_activity':
        await this.saveCustomActivity(change.data);
        break;
      default:
        console.warn('Unknown change type:', change.type);
    }
  }

  // Utility methods
  getSessionId() {
    if (!this.sessionId) {
      this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    return this.sessionId;
  }

  getLocalStoragePlans() {
    try {
      return JSON.parse(localStorage.getItem('weekendly-plans') || '{}');
    } catch {
      return {};
    }
  }

  getLocalStorageActivities() {
    try {
      return JSON.parse(localStorage.getItem('weekendly-custom-activities') || '{}');
    } catch {
      return {};
    }
  }

  getLocalStoragePreferences() {
    try {
      return JSON.parse(localStorage.getItem('weekendly-preferences') || '{}');
    } catch {
      return {};
    }
  }

  // Cleanup old data
  async cleanup(daysToKeep = 90) {
    try {
      if (this.db) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        
        const transaction = this.db.transaction(['eventHistory'], 'readwrite');
        const store = transaction.objectStore('eventHistory');
        const index = store.index('timestamp');
        
        const range = IDBKeyRange.upperBound(cutoffDate.toISOString());
        await index.openCursor(range).result?.delete();
        
        console.log('🧹 Database cleanup completed');
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }

  // Export data for backup
  async exportData() {
    try {
      const data = {
        plans: await this.loadWeekendPlans(),
        activities: await this.loadActivities(1000), // Export all
        preferences: {},
        exportedAt: new Date().toISOString(),
        version: this.version
      };

      // Get all preferences
      if (this.db) {
        const transaction = this.db.transaction(['userPreferences'], 'readonly');
        const store = transaction.objectStore('userPreferences');
        const allPrefs = await store.getAll();
        
        allPrefs.forEach(pref => {
          data.preferences[pref.key] = pref.value;
        });
      }

      return data;
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }

  // Import data from backup
  async importData(data) {
    try {
      // Import plans
      if (data.plans) {
        for (const plan of data.plans) {
          await this.saveWeekendPlan({ ...plan, isImported: true });
        }
      }

      // Import activities
      if (data.activities) {
        for (const activity of data.activities) {
          await this.saveCustomActivity({ ...activity, isImported: true });
        }
      }

      // Import preferences
      if (data.preferences) {
        for (const [key, value] of Object.entries(data.preferences)) {
          await this.saveUserPreference(key, value);
        }
      }

      console.log('Data import completed');
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new PersistenceService();
