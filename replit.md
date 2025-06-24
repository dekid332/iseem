# The Prooper Shooter

## Overview

The Prooper Shooter is a 2D top-down shooter game built with React and TypeScript. The game features a player character that can aim and shoot at enemies while avoiding taking damage. It includes a scoring system, multiple levels, and audio feedback for an engaging gaming experience.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the user interface
- **Canvas-based 2D rendering** for game graphics and animations
- **Zustand** for state management (game state and audio controls)
- **Custom game engine** built from scratch for game logic and rendering
- **Tailwind CSS** with shadcn/ui components for UI styling
- **Vite** as the build tool and development server

### Backend Architecture
- **Express.js** server with TypeScript
- **In-memory storage** for user data (MemStorage implementation)
- **RESTful API structure** (routes defined but not yet implemented)
- **Session-based architecture** with potential for database integration

### Game Engine Components
- **GameEngine**: Core game loop and state management
- **Player**: Character control and aiming mechanics
- **Enemy**: AI-controlled enemies with different types (runner, jumper, tank)
- **Projectile**: Bullet physics and collision detection
- **ParticleSystem**: Visual effects for explosions and hits
- **CollisionDetection**: AABB and circle collision algorithms
- **InputManager**: Mouse, keyboard, and touch input handling
- **SoundManager**: Audio playback and management

## Key Components

### Game State Management
- Uses Zustand stores for reactive state management
- Game phases: 'ready', 'playing', 'ended'
- Audio state with mute/unmute functionality
- Real-time score, health, and level tracking

### Canvas Rendering
- Full-screen canvas that adapts to window size
- 60 FPS game loop with requestAnimationFrame
- Custom drawing functions for all game objects
- Particle effects for visual feedback

### Input System
- Mouse aiming and shooting
- Keyboard controls for game actions
- Touch support for mobile devices
- Cross-platform input normalization

### Audio System
- Background music and sound effects
- Mute/unmute toggle functionality
- Sound cloning for overlapping audio playback
- Audio preloading for smooth gameplay

## Data Flow

1. **Game Initialization**: Canvas setup, game engine creation, input binding
2. **Game Loop**: Update game state → Handle collisions → Render frame → Repeat
3. **User Input**: Mouse/touch events → Input manager → Player actions → Game state updates
4. **State Updates**: Game engine updates → Zustand stores → React re-renders → UI updates
5. **Audio Feedback**: Game events → Sound manager → Audio playback (if not muted)

## External Dependencies

### Core Framework
- React 18 with TypeScript for component architecture
- Vite for fast development and optimized builds
- Express.js for server-side API handling

### UI and Styling
- Tailwind CSS for utility-first styling
- Radix UI components for accessible UI primitives
- Lucide React for consistent iconography

### State Management
- Zustand for lightweight, reactive state management
- React Query for potential server state management

### Database (Configured but not active)
- Drizzle ORM for type-safe database operations
- PostgreSQL support via Neon Database
- Database migrations system set up

### Development Tools
- ESBuild for server-side bundling
- PostCSS for CSS processing
- TypeScript for type safety

## Deployment Strategy

### Development
- Local development with hot module replacement
- Vite dev server on port 5000
- Express server integrated with Vite middleware

### Production
- Static build output to `dist/public`
- Server bundle with ESBuild
- Autoscale deployment target on Replit
- Environment variable configuration for database

### Build Process
1. Client build: `vite build` → static assets
2. Server build: `esbuild` → Node.js bundle
3. Asset optimization and bundling
4. Production server startup

## Recent Changes
- ✓ Successfully implemented complete game functionality with character integration
- ✓ Resized Iseem character to be the main shooter (larger size: 80x100)
- ✓ Updated enemy system to use provided character images (Colt, SOLjakey, Whish, Pete)
- ✓ Added main menu with gradient background and character showcase
- ✓ Implemented leaderboard system with PostgreSQL database
- ✓ Created score submission form with username and Solana wallet address inputs
- ✓ Added game time tracking and enhanced UI with creative styling
- ✓ Set up database schema for leaderboard functionality
- ✓ Created API endpoints for leaderboard data management
- ✓ Fixed React state management for proper UI navigation between game phases
- ✓ Game fully functional: menu → ready → playing → game over → score submission → leaderboard

## Changelog
- June 24, 2025. Initial setup
- June 24, 2025. Major UI overhaul with character integration and leaderboard system

## User Preferences

Preferred communication style: Simple, everyday language.