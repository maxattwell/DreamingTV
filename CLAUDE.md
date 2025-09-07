# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DreamingTV is a React Native TV app built with Expo that supports both Apple TV and Android TV platforms. The app provides video streaming functionality with user authentication, progress tracking, and video management.

## Development Commands

### Package Management
- **Use `pnpm`** for all package management operations (install, add, remove)
- `pnpm install` - Install dependencies
- `pnpm add <package>` - Add new dependencies

### Building and Running
- `pnpm start` or `EXPO_TV=1 expo start` - Start the development server
- `pnpm run android` or `EXPO_TV=1 expo run:android` - Build and run on Android TV
- `pnpm run ios` or `EXPO_TV=1 expo run:ios` - Build and run on Apple TV
- `pnpm run prebuild` or `EXPO_TV=1 expo prebuild --clean` - Prebuild native code for TV

**Important**: Always set `EXPO_TV=1` environment variable to enable TV-specific configurations via the `@react-native-tvos/config-tv` plugin.

## Architecture

### Core Technologies
- **React Native TV Fork**: Uses `react-native-tvos@0.79.5-0` for TV platform support
- **Expo SDK 53**: For cross-platform development with TV-specific plugins
- **TypeScript**: Full type safety throughout the codebase
- **React Context**: For state management (Auth, Video, Progress contexts)

### Directory Structure
```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── common/          # Shared components (Button, ProgressBar, etc.)
│   ├── dashboard/       # Dashboard screen components
│   └── video/           # Video-related components
├── context/             # React Context providers
│   ├── AuthContext/     # Authentication state management
│   ├── ProgressContext/ # Video progress tracking
│   └── VideoContext/    # Video data management
├── hooks/               # Custom React hooks
├── services/            # API and storage services
│   ├── api/            # API client and endpoints
│   └── storage/        # AsyncStorage services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── constants/          # App constants and configuration
└── styles/             # Shared styling (colors, typography, spacing)
```

### State Management Pattern
The app uses React Context for state management with three main contexts:
- **AuthContext**: Manages authentication state, login/logout, token persistence
- **VideoContext**: Handles video data fetching, caching, and video details
- **ProgressContext**: Tracks video watch progress and user analytics

### Navigation Pattern
Uses a custom navigation hook (`useNavigation`) with view-based routing:
- `VIEWS.LOGIN` - Authentication screen
- `VIEWS.DASHBOARD` - Main dashboard
- `VIEWS.VIDEOS` - Video listing
- `VIEWS.PLAYER` - Video player

### API Integration
- Centralized API client in `src/services/api/client.ts`
- Token-based authentication with automatic storage
- Modular API services for auth, videos, and progress tracking

## TV-Specific Features

### Platform Support
- Apple TV and Android TV optimized UI
- TV-specific image assets (banners, icons, top shelf images)
- Remote control navigation support

### Metro Configuration
The project includes optional Metro config for TV-specific file extensions (`*.tv.tsx`, `*.ios.tv.tsx`, `*.android.tv.tsx`) but this is commented out by default for performance reasons.

## Key Components

### Main App Flow
1. App starts with authentication check via `AuthContext`
2. Unauthenticated users see `LoginForm`
3. Authenticated users navigate between Dashboard → VideoList → VideoPlayer
4. Progress tracking occurs throughout video playback

### Component Architecture
- All components follow a consistent pattern with separate `.tsx` and `index.ts` files
- Shared styling system using centralized color, typography, and spacing constants
- Components are fully typed with TypeScript interfaces

## Important Notes

- The project uses React Native TV fork, not standard React Native
- TV environment variable (`EXPO_TV=1`) is required for proper builds
- Authentication tokens are persisted using AsyncStorage
- Video progress is tracked and synced with backend API
- Error boundaries and loading states are handled at the component level