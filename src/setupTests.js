// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';

// Mock matchMedia (required for react-hot-toast and other components that use media queries)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock localStorage with proper Jest spies
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => {
      return store[key] || null;
    }),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index) => Object.keys(store)[index] || null)
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock IndexedDB with proper async behavior
const mockIDBRequest = {
  result: null,
  error: null,
  onsuccess: null,
  onerror: null,
  readyState: 'done'
};

const mockObjectStore = {
  add: jest.fn(() => mockIDBRequest),
  get: jest.fn(() => ({ ...mockIDBRequest, result: null })),
  put: jest.fn(() => mockIDBRequest),
  delete: jest.fn(() => mockIDBRequest),
  getAll: jest.fn(() => ({ ...mockIDBRequest, result: [] })),
  clear: jest.fn(() => mockIDBRequest),
  createIndex: jest.fn(),
  index: jest.fn(() => mockObjectStore)
};

const mockTransaction = {
  objectStore: jest.fn((name) => mockObjectStore),
  oncomplete: null,
  onerror: null,
  onabort: null,
  mode: 'readwrite',
  abort: jest.fn()
};

const mockDatabase = {
  createObjectStore: jest.fn(() => mockObjectStore),
  transaction: jest.fn((stores, mode) => ({
    ...mockTransaction,
    objectStore: jest.fn((name) => mockObjectStore),
    mode: mode || 'readonly'
  })),
  close: jest.fn(),
  version: 1,
  objectStoreNames: { contains: jest.fn(() => true) }
};

global.indexedDB = {
  open: jest.fn(() => {
    const request = { ...mockIDBRequest, result: mockDatabase };
    // Simulate async success
    setTimeout(() => {
      if (request.onsuccess) {
        request.onsuccess({ target: request });
      }
    }, 0);
    return request;
  }),
  deleteDatabase: jest.fn(() => mockIDBRequest),
  databases: jest.fn(() => Promise.resolve([])),
  cmp: jest.fn()
};

// Mock navigator.geolocation
global.navigator.geolocation = {
  getCurrentPosition: jest.fn((success) => {
    success({
      coords: {
        latitude: 37.7749,
        longitude: -122.4194
      }
    });
  }),
  watchPosition: jest.fn()
};

// Mock performance.now
global.performance.now = jest.fn(() => Date.now());

// Suppress console errors and warnings during tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    // Only suppress known test warnings and errors
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: An update to') ||
       args[0].includes('Database initialization failed') ||
       args[0].includes('Weekendly Error') ||
       args[0].includes('act(...)') ||
       args[0].includes('Failed to load preference'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
  
  console.warn = (...args) => {
    // Suppress React warnings during testing
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning:')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
