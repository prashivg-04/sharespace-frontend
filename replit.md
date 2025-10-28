# ShareSpace - Mental Wellness Platform

## Overview
ShareSpace is a pure frontend React application for mental wellness and peer support. Users can share thoughts anonymously, track their mood, journal, and access mental health resources.

## Recent Changes
**Date:** October 28, 2025

### Project Cleanup
- Removed all backend API dependencies (axios, dotenv)
- Removed Emergent Labs-specific plugins and configurations
- Simplified to a frontend-only React application
- All data now persists using browser localStorage

### localStorage Implementation
- **Posts:** Created posts are saved to localStorage and displayed on the Feed page
- **Comments:** Comments persist across page refreshes
- **Likes (Kindness):** Like counts are saved to localStorage
- Data structure uses simple key-value pairs for easy management

## Project Structure

### Core Directories
```
src/
├── components/
│   ├── ui/              # Shadcn UI components (buttons, cards, etc.)
│   └── Sidebar.js       # Main navigation sidebar
├── pages/
│   ├── LandingPage.js   # Public homepage
│   ├── LoginPage.js     # Mock login/signup (no backend)
│   ├── Dashboard.js     # User dashboard with quick actions
│   ├── FeedPage.js      # Community posts feed
│   ├── CreatePostPage.js # Create new posts
│   ├── JournalPage.js   # Personal journaling
│   ├── MoodTrackerPage.js # Mood tracking and statistics
│   ├── ResourcesPage.js # Mental health resources
│   └── CalmToolsPage.js # Breathing exercises and ambient sounds
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── App.js               # Main application component
└── index.js             # React entry point

public/                  # Static assets
```

## Technology Stack
- **React 19** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **CRACO** - Create React App configuration

## Development

### Running Locally
The app runs on port 5000:
```bash
PORT=5000 HOST=0.0.0.0 npm start
```

### Data Persistence
All user data is stored in browser localStorage:
- `posts` - Community feed posts
- `comments` - Post comments

To reset all data, clear localStorage:
```javascript
localStorage.clear()
```

## Features

### ✅ Working Features
1. **Anonymous Login** - Mock authentication (no backend required)
2. **Community Feed** - View and filter posts by category
3. **Create Posts** - Share thoughts with mood and category
4. **Interactions** - Like posts and add supportive comments
5. **Personal Journal** - Create and manage journal entries
6. **Mood Tracking** - Log moods with notes and view statistics
7. **Mental Health Resources** - Access helplines and educational content
8. **Calm Tools** - Breathing exercises and ambient sound player

### 🔄 Data Flow
1. User creates a post → Saved to localStorage
2. Navigate to Feed → Posts loaded from localStorage
3. Like a post → Updated in localStorage
4. Add comment → Saved to localStorage
5. Refresh page → All data persists

## Configuration

### Environment
No environment variables required. The app is fully self-contained.

### Deployment
To deploy to production:
```bash
npm run build
```
The build folder will contain the static files ready for deployment.

## User Preferences
- Keep the codebase clean and maintainable
- No backend dependencies
- Use localStorage for all data persistence
- Focus on user privacy and anonymous interactions

## Architecture Decisions
- **Frontend-only:** All logic runs in the browser
- **No database:** Uses localStorage for simplicity and privacy
- **Mock authentication:** Users can log in with any credentials
- **Anonymous posting:** Random anonymous IDs generated for each post
- **No external APIs:** Fully offline-capable after initial load

## Future Integration
This frontend is ready to connect to a Python backend when needed:
1. Replace localStorage calls with API endpoints
2. Add proper authentication
3. Implement real-time features with WebSockets
4. Add data validation and moderation
