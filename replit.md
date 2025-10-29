# ShareSpace - Mental Wellness Platform

## Overview
ShareSpace is a pure frontend React application for mental wellness and peer support. Users can share thoughts anonymously, track their mood, journal, and access mental health resources.

## Recent Changes
**Date:** October 29, 2025

### Edit Profile Feature
- Added functional Edit Profile modal dialog
- Users can now edit their name, bio, and profile picture
- Profile pictures are stored as base64 in localStorage
- Form validation ensures name is not empty
- File size validation (max 5MB for images)
- Character limit validation for bio (500 characters)
- Changes persist across page refreshes
- Immediate UI updates after saving

### Profile Page Implementation
- Complete Profile Page showing user details, bio, join date
- Statistics dashboard (posts shared, kindness received, comments)
- User's posts display with full interaction support
- Empty state handling with call-to-action
- Profile picture support with default gradient avatar fallback

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
- **User Profiles:** Profile data including name, bio, and profile pictures
- Data structure uses simple key-value pairs for easy management

## Project Structure

### Core Directories
```
src/
├── components/
│   ├── ui/              # Shadcn UI components (buttons, cards, dialogs, etc.)
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
│   ├── CalmToolsPage.js # Breathing exercises and ambient sounds
│   └── ProfilePage.js   # User profile with edit capabilities
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
- **Radix UI** - Accessible component primitives (Dialog, Label, etc.)
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
- `userProfiles` - User profile data (name, bio, profile picture, join date)

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
9. **User Profile** - View personal stats, posts, and profile information
10. **Edit Profile** - Update name, bio, and profile picture with validation

### 🔄 Data Flow
1. User creates a post → Saved to localStorage
2. Navigate to Feed → Posts loaded from localStorage
3. Like a post → Updated in localStorage
4. Add comment → Saved to localStorage
5. Edit profile → Updated in localStorage with validation
6. Refresh page → All data persists

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
- Clean and consistent design with Tailwind CSS
- Form validation for user inputs

## Architecture Decisions
- **Frontend-only:** All logic runs in the browser
- **No database:** Uses localStorage for simplicity and privacy
- **Mock authentication:** Users can log in with any credentials
- **Anonymous posting:** Random anonymous IDs generated for each post
- **No external APIs:** Fully offline-capable after initial load
- **Base64 image storage:** Profile pictures stored as base64 strings in localStorage

## Future Integration
This frontend is ready to connect to a Python backend when needed:
1. Replace localStorage calls with API endpoints
2. Add proper authentication
3. Implement real-time features with WebSockets
4. Add data validation and moderation
5. Move image storage to cloud storage service
