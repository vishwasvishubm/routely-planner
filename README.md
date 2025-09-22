# RouteX - Travel Management PWA

<div align="center">
  <img src="public/icon-192x192.png" alt="RouteX Logo" width="120" height="120" />
  
  **Your ultimate travel companion for managing trips, tracking expenses, and capturing memories**
  
  [![PWA](https://img.shields.io/badge/PWA-enabled-blue)](https://web.dev/progressive-web-apps/)
  [![Offline First](https://img.shields.io/badge/Offline-First-green)](https://developers.google.com/web/fundamentals/instant-and-offline/offline-first)
  [![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue)](https://www.typescriptlang.org/)
</div>

## ✨ Features

### 🗺️ Trip Management
- **Create, edit, and organize trips** with detailed information
- **Visual trip cards** with status indicators (upcoming, active, completed)
- **Smart trip statistics** and progress tracking
- **Beautiful, responsive interface** for all devices

### 📅 Itinerary Planning
- **Daily itinerary management** with time-based organization
- **Location and notes** for each activity
- **Reminder system** with browser notifications
- **Seamless integration** with trip details

### 💰 Expense Tracking
- **Category-based expense tracking** (food, hotel, transport, etc.)
- **Receipt photo uploads** and storage
- **Visual expense charts** and summaries
- **Multi-currency support** for international travel

### 📸 Memory Capture
- **Photo gallery** for trip memories
- **Notes and captions** for each memory
- **Organized by trip** for easy browsing
- **Offline storage** and viewing

### 🤖 AI Suggestions
- **Personalized recommendations** for attractions and restaurants
- **Hidden gems discovery** powered by AI
- **Location-based suggestions** (coming soon)
- **User preference learning** (coming soon)

### 📱 Progressive Web App
- **Offline-first architecture** using IndexedDB
- **Service Worker caching** for instant loading
- **Install on any device** like a native app
- **Background sync** when connection returns
- **Push notifications** for reminders

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript for robust development
- **Vite** for lightning-fast build and development
- **TailwindCSS** with custom design system
- **Shadcn/UI** components for consistent interface
- **React Router** for seamless navigation
- **Zustand** for lightweight state management

### Data & Storage
- **IndexedDB** via LocalForage for offline data storage
- **Service Worker** with Workbox for caching
- **UUID** for unique record identification
- **React Query** for data fetching and caching

### Charts & Visualization
- **Recharts** for expense visualization
- **Custom charts** for trip statistics
- **Responsive design** for all screen sizes

### PWA Features
- **Web App Manifest** for installability
- **Service Worker** for offline functionality
- **Background sync** for data synchronization
- **Push notifications** for reminders

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with PWA support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd routex
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:8080
   ```

### Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 📱 PWA Installation

### On Desktop
1. Open RouteX in Chrome, Edge, or Firefox
2. Look for the "Install" button in the address bar
3. Click "Install" to add RouteX to your applications

### On Mobile
1. Open RouteX in your mobile browser
2. Tap the browser menu (⋮ or share button)
3. Select "Add to Home Screen" or "Install App"
4. Tap "Add" to install RouteX

## 💾 Data Storage

RouteX uses a robust offline-first data storage approach:

### Local Storage (IndexedDB)
- **Trips**: Complete trip information and metadata
- **Itinerary**: Daily activities and schedules  
- **Expenses**: Financial tracking with categories
- **Memories**: Photos, notes, and experiences
- **Reminders**: Notification settings and schedules

### Database Schema
```typescript
// Core entities with UUID identification
trips: { id, title, destination, startDate, endDate, notes, synced }
itinerary_items: { id, tripId, title, location, startTime, endTime, notes, synced }
expenses: { id, tripId, amount, currency, category, date, note, receiptPath, synced }
memories: { id, tripId, type, content, title, date, synced }
reminders: { id, itemId, notifyTime, repeatRule, isActive, synced }
```

### Sync Strategy
- All records include a `synced` flag for future backend integration
- Changes are stored locally first for instant responsiveness
- Background sync will handle server synchronization when implemented

## 🎨 Design System

RouteX features a beautiful, travel-inspired design system:

### Color Palette
- **Ocean Blue** (#0ea5e9) - Primary brand color
- **Sunset Orange** (#f97316) - Accent and warmth  
- **Travel Sky** (#dbeafe) - Light backgrounds
- **Success Green** (#059669) - Positive actions

### Typography
- **System fonts** for optimal performance
- **Responsive sizing** for all devices
- **Semantic hierarchy** for accessibility

### Components
- **Card-based layouts** with subtle shadows
- **Gradient backgrounds** for visual appeal
- **Smooth animations** and transitions
- **Status indicators** for trip states

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Navigation and layout
│   ├── trips/          # Trip-related components
│   └── ui/             # Shadcn/UI components
├── pages/              # Route components
├── services/           # Data services and API
├── stores/             # Zustand state management
├── types/              # TypeScript definitions
└── lib/                # Utilities and helpers
```

### Key Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Code linting
npm run type-check   # TypeScript checking
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## 🚀 Roadmap

### Phase 1: Core Features ✅
- [x] Trip management CRUD operations
- [x] Basic itinerary planning
- [x] Expense tracking with categories
- [x] Memory capture and storage
- [x] Offline-first PWA functionality
- [x] Responsive design

### Phase 2: Enhanced Features 🚧
- [ ] Trip detail pages with tabs
- [ ] Advanced expense charts and analytics
- [ ] Photo editing and organization
- [ ] Calendar integration
- [ ] Export functionality

### Phase 3: Smart Features 🔮
- [ ] Backend integration and sync
- [ ] Real AI-powered suggestions
- [ ] Location-based recommendations  
- [ ] Social sharing features
- [ ] Collaborative trip planning

### Phase 4: Advanced PWA 🌟
- [ ] Background sync implementation
- [ ] Push notification system
- [ ] Offline maps integration
- [ ] Voice input and commands
- [ ] Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/UI** for beautiful component library
- **TailwindCSS** for utility-first styling
- **Lucide Icons** for consistent iconography
- **React Community** for excellent ecosystem

---

<div align="center">
  <strong>Built with ❤️ for travelers worldwide</strong>
  
  <br />
  
  <a href="#getting-started">Get Started</a> • 
  <a href="#features">Features</a> • 
  <a href="#roadmap">Roadmap</a>
</div>