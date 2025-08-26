# Spyfall

A real-time multiplayer web implementation of the social deduction game Spyfall, built with React, TypeScript, and Firebase.

![Demo](https://github.com/arpanroy18/spyfall/blob/88360740f2fcd2e6b71c3e3214fa289970c289e7/public/Spyfall-Demo.gif)

## Overview

This project implements the Spyfall game mechanics in a web application with real-time multiplayer capabilities. Players are assigned roles at specific locations, with one player designated as the spy who must identify the location while other players try to identify the spy through strategic questioning.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase Realtime Database
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Linting**: ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── AuthorizationScreen.tsx
│   ├── EndGameDialog.tsx
│   ├── FAQ.tsx
│   ├── GameConfig.tsx
│   ├── GameConfigPanel.tsx
│   ├── GameTimer.tsx
│   ├── KickDialog.tsx
│   ├── LandingPage.tsx
│   ├── LobbyScreen.tsx
│   ├── LocationCard.tsx
│   ├── LocationGrid.tsx
│   ├── MissionAbortedDialog.tsx
│   ├── MissionScreen.tsx
│   ├── PlayerCard.tsx
│   ├── QuestionCard.tsx
│   └── RoleInfo.tsx
├── data/               # Game data and configurations
├── firebase.ts         # Firebase configuration
├── hooks/              # Custom React hooks
├── types.ts            # TypeScript type definitions
├── utils/              # Utility functions
│   └── locationImages.ts
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## Core Features

### Game State Management
- Real-time synchronization using Firebase Realtime Database
- Centralized game state with TypeScript interfaces
- Player role assignment and spy detection logic
- Timer management with automatic game progression

### Multiplayer Architecture
- Room-based game sessions with unique 6-character codes
- Real-time player synchronization
- Leader-based game control
- Player kick functionality

### Game Logic
- Dynamic location and role assignment
- Turn-based questioning system
- Voting mechanism for spy identification
- Automatic game termination conditions

## Data Models

### Player Interface
```typescript
interface Player {
  id: string;
  name: string;
  isSpy?: boolean;
  isLeader?: boolean;
  role?: string;
  score: number;
}
```

### Game State Interface
```typescript
interface GameState {
  id: string;
  isPlaying: boolean;
  timeRemaining: number;
  location?: string | null;
  players: Player[];
  waitingPlayers?: Player[];
  currentTurn?: string | null;
  votingFor?: string;
  votes: Record<string, boolean>;
  config: GameConfig;
}
```

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
git clone <repository-url>
cd spyfall
npm install
```

### Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Firebase Configuration

The application uses Firebase Realtime Database for:
- Game state persistence
- Real-time player synchronization
- Room management
- Player authentication (anonymous)

Database rules are configured in `database.rules.json` to ensure secure access patterns.

## Deployment

The project includes configuration for:
- **Railway**: `railway.json` for Railway deployment
- **Firebase Hosting**: `firebase.json` for Firebase hosting
- **Docker**: `Dockerfile` for containerized deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
