# 🎯 Weekendly – Atlan Frontend Assignment

Weekendly is an interactive weekend planner built for the Atlan Frontend Engineering Challenge.  
It helps users design their perfect weekend by browsing activities, assigning moods, and arranging them into a personalized Saturday–Sunday schedule.  

---

##  Features

- **Visual Design**
  - Glassmorphism UI with gradients and smooth animations  
  - Responsive layouts optimized for desktop, tablet, and mobile  
  - Micro-interactions and hover effects for delightful feedback  

- **Activity System**
  - Rich metadata: activity descriptions, energy levels, vibes, indoor/outdoor tags  
  - Categorized activities: Culinary, Outdoor, Cultural, Mindful Living, Social  
  - Full-screen detail modals with tips, weather context, and recommendations  

- **Themes & Personalization**
  - Six curated lifestyle themes (Urban Explorer, Creative Soul, Wellness Warrior, etc.)  
  - Emoji-based mood tracking with adaptive suggestions  
  - Contextual planning based on mood, time, and weather  

- **Smart Integrations**
  - Real-time weather API (Open-Meteo) with automatic replacements for outdoor activities  
  - Holiday awareness with curated long-weekend activity suggestions  
  - Event and dining discovery with caching and fallback data  

- **Planning Experience**
  - Drag-and-drop scheduling with conflict detection  
  - Expandable day cards showing progress stats and weather context  
  - Activity bucket for temporary storage and quick adjustments  

- **Sharing & Export**
  - High-quality share cards (PNG) optimized for social media  
  - One-click export to WhatsApp, Telegram, and native device sharing  

- **Performance & Quality**
  - Centralized state management with hooks (`useWeekendPlanner`)  
  - Offline-first design with IndexedDB + localStorage fallback  
  - Accessibility: semantic HTML, ARIA support, keyboard navigation  
---


##  Technical Implementation

### Component Architecture
- Designed using **modular React components** (`ActivityCard`, `PlanView`, `Header`, `MoodTracker`) with minimal prop surfaces.  
- **System thinking** applied: layout, UI, and feature components separated for reusability.  
- Built a **design system** with centralized tokens for colors, typography, spacing, and shadows.

### State Management
- Implemented a **custom hook** (`useWeekendPlanner`) as a single source of truth for activities, moods, and schedules.  
- State updates follow **immutable patterns** to keep changes predictable and enable undo/redo in the future.  
- **Optimistic UI updates** give instant feedback, while a **background sync queue** reconciles with persistence asynchronously.

### Persistence & Offline-first
- **IndexedDB** (via browser APIs) used for storing structured data like activities and user preferences.  
- **localStorage fallback** ensures compatibility in older environments.  
- Plans can be created, updated, and viewed entirely offline; queued updates are synced once connectivity is restored.

### User Interface & Experience
- Applied **glassmorphism design** with translucent surfaces and blur effects for visual depth.  
- Used **gradient systems and micro-interactions** to enhance engagement.  
- Layouts adapt responsively using **CSS Grid and Flexbox** for mobile-first design.  
- Added **drag-and-drop interactions** with visual feedback and conflict detection in the planner.

### Performance Optimization
- Implemented **cursor-based pagination and indexing** for browsing activities.  
- **Memoization and selective re-renders** ensure smooth performance even with large datasets.  
- Used **lazy-loading** for non-critical assets to optimize load time.

### Accessibility & Inclusivity
- Semantic HTML5 elements with **ARIA attributes** for screen reader compatibility.  
- Full **keyboard navigation support**, including drag-and-drop actions.  
- Color palette tuned for **WCAG AA contrast compliance**.

### Smart Integrations
- **Weather API (Open-Meteo)** integration provides real-time forecasts with smart recommendations (e.g., swap outdoor activities in bad weather).  
- **Holiday awareness system** suggests upcoming long weekends.  
- External event & dining APIs enrich the weekend planning experience, with **caching and fallbacks** for reliability.

---

## 🚀 Getting Started

### Installation
```bash
# Clone the repository
git clone https://github.com/harshita9104/harshita_planner.git
cd weekendly

# Install dependencies
npm install

```

### Available Commands
```bash
# Start development server
npm start

# Run tests
npm test

# Run tests without watch mode
npm test -- --watchAll=false

# Run tests with coverage
npm test -- --coverage --watchAll=false

# Build for production
npm run build

# Serve production build locally
npm run serve
```

---

##  Testing

The project includes a comprehensive test suite covering all core functionality and user interactions.

<img width="1854" height="1048" alt="image" src="https://github.com/user-attachments/assets/f8d1cd8b-7f1f-4f69-be5a-75f9bcfab813" />


### Test Coverage

#### Core Functionality Tests (`App.test.js`)
The test suite includes **20+ test cases** covering:

** Basic Functionality:**
- ✅ App rendering and initialization
- ✅ Navigation between Browse and Plan views
- ✅ Weekend duration selection (2-day, 3-day, 4-day weekends)
- ✅ Theme customization and application

** Activity Management:**
- ✅ Activity category filtering and display
- ✅ Adding activities to bucket
- ✅ Managing weekend schedule (add/remove/edit activities)
- ✅ Drag and drop interface functionality

** Advanced Features:**
- ✅ Mood tracking functionality
- ✅ Holiday recommendations display
- ✅ Smart integrations panel accessibility
- ✅ Long weekend planning (3-4 days)

** Data & Performance:**
- ✅ localStorage persistence functionality
- ✅ Performance metrics and load time validation
- ✅ Error handling with error boundaries

** Accessibility & UX:**
- ✅ Responsive navigation elements
- ✅ Basic accessibility features (ARIA, semantic HTML)
- ✅ Visual richness with icons and categories
- ✅ Weekend plan visual format display



### Test Results Example
```
✅ Weekendly - Core Weekend Planner Tests
  ✅ renders the Weekendly app successfully
  ✅ allows navigation between browse and plan views
  ✅ allows users to select different weekend durations
  ✅ theme customization works properly
  ✅ displays activity categories and allows filtering
  ✅ can add activities to bucket
  ✅ localStorage is available for data persistence
  ✅ renders responsive navigation elements
  ✅ supports basic accessibility features
  ✅ loads within reasonable time and shows performance metrics
  ✅ can manage weekend schedule
  ✅ app handles errors gracefully with error boundary
  ✅ can remove activities from weekend schedule
  ✅ can edit activities in weekend schedule
  ✅ displays weekend plan in proper visual format
  ✅ mood tracking functionality works
  ✅ holiday recommendations are displayed
  ✅ smart integrations panel is accessible
  ✅ visual richness with icons and categories
  ✅ drag and drop interface functionality
  ✅ app supports long weekend planning (3-4 days)

Test Suites: 1 passed, 1 total
Tests: 21 passed, 21 total
```

### Testing Strategy

The test suite follows **behavior-driven testing** principles:
- **User Journey Testing**: Tests follow actual user workflows
- **Integration Testing**: Tests component interactions and data flow
- **Accessibility Testing**: Ensures ARIA compliance and keyboard navigation
- **Performance Testing**: Validates load times and responsiveness
- **Error Handling**: Tests graceful degradation and error boundaries



---
Weekendly was built to not only fulfill the core requirements of the challenge -activity browsing, scheduling, editing, and visualization, but also to push further into the bonus and super-stretch layers, the project delivers both functional depth and an enjoyable user experience.

Video Link: https://www.loom.com/share/8949bf878016428eb00861c8ac034ef4?sid=4e1c71f2-8497-47e8-8446-f9ad5546f510

Live Link: https://weekendly-omega.vercel.app/

**Built with ❤️ by [Harshita Roonwal](https://www.linkedin.com/in/harshita-roonwal-a20085243/) for the Atlan Frontend Engineering Assignment.**
