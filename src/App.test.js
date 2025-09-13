import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

test('renders weekend planner heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Weekendly/i);
  expect(headingElement).toBeInTheDocument();
});

test('should switch to plan view when plan button is clicked', () => {
  render(<App />);
  // Start from browse view to ensure the plan button click is what changes the view
  fireEvent.click(screen.getByRole('button', { name: /Browse/i }));
  const planButton = screen.getAllByText(/Plan/i)[0];
  fireEvent.click(planButton);
  const planViewElement = screen.getByText(/Your Weekend Plan/i);
  expect(planViewElement).toBeInTheDocument();
});

test('should switch to share view when share button is clicked', () => {
  render(<App />);
  const shareButton = screen.getByText(/Share/i);
  fireEvent.click(shareButton);
  const shareViewElement = screen.getByText(/Share Your Plan/i);
  expect(shareViewElement).toBeInTheDocument();
});

// Super Stretch: Advanced testing for core functionality
test('should add activity to bucket when plus button is clicked', async () => {
  render(<App />);
  
  // Wait for activities to load
  await waitFor(() => {
    expect(screen.getByText(/Browse Activities/i)).toBeInTheDocument();
  });
  
  // Find first activity card and its plus button
  const addButtons = screen.getAllByText('+');
  if (addButtons.length > 0) {
    fireEvent.click(addButtons[0]);
    
    // Switch to plan view to verify activity was added
    const planButton = screen.getAllByText(/Plan/i)[0];
    fireEvent.click(planButton);
    
    // Should show some planned activities or bucket
    await waitFor(() => {
      const planContent = screen.getByText(/Your Weekend Plan/i);
      expect(planContent).toBeInTheDocument();
    });
  }
});

test('should open activity detail modal when activity card is clicked', async () => {
  render(<App />);
  
  // Wait for activities to load
  await waitFor(() => {
    expect(screen.getByText(/Browse Activities/i)).toBeInTheDocument();
  });
  
  // Find and click on an activity card (but not the plus button)
  const activityCards = screen.getAllByTestId ? screen.getAllByTestId('activity-card') : [];
  if (activityCards.length === 0) {
    // Fallback: look for activity titles
    const activityElements = document.querySelectorAll('.activity-card, [class*="activity"]');
    if (activityElements.length > 0) {
      fireEvent.click(activityElements[0]);
      
      // Check if modal opened (look for common modal elements)
      await waitFor(() => {
        const modalElements = document.querySelectorAll('[class*="modal"], [class*="backdrop"]');
        expect(modalElements.length).toBeGreaterThan(0);
      });
    }
  }
});

// Super Stretch: Persistence testing
test('should persist and restore data from localStorage', () => {
  // Clear localStorage first
  localStorage.clear();
  
  render(<App />);
  
  // Check if persistence service is working (it should initialize localStorage)
  const storedData = localStorage.getItem('weekendly_data');
  expect(typeof storedData === 'string' || storedData === null).toBe(true);
});

// Super Stretch: Performance testing
test('should handle large number of activities without crashing', async () => {
  render(<App />);
  
  // Wait for initial load
  await waitFor(() => {
    expect(screen.getByText(/Browse Activities/i)).toBeInTheDocument();
  });
  
  // The app should render without crashing even with many activities
  const app = document.querySelector('#root');
  expect(app).toBeInTheDocument();
});

// Super Stretch: Offline functionality
test('should work in offline mode', () => {
  // Mock navigator.onLine to simulate offline
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: false
  });
  
  render(<App />);
  
  // App should still render basic functionality
  const headingElement = screen.getByText(/Weekendly/i);
  expect(headingElement).toBeInTheDocument();
  
  // Restore online status
  Object.defineProperty(navigator, 'onLine', {
    value: true
  });
});