import { render, screen, fireEvent } from '@testing-library/react';
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


