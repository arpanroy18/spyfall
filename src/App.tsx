import React, { useState, useEffect } from 'react';
import { GameTimer } from './components/GameTimer';
import { PlayerCard } from './components/PlayerCard';
import { LandingPage } from './components/LandingPage';
import { RoleInfo } from './components/RoleInfo';
import { EndGameDialog } from './components/EndGameDialog';
import { Player, GameState, COUNTRIES, GameConfig } from './types';
import { MapPin, Users, Crown, AlertCircle, XCircle } from 'lucide-react';
import { ref, set, get, onValue, off } from 'firebase/database';
import { db } from './firebase';

// Add helper function before App component
const createTestPlayer = (name: string, isLeader: boolean = false): Player => ({
  id: crypto.randomUUID(),
  name,
  isLeader,
  score: 0
});

function App() {
  const [gameState, setGameState] = useState<GameState>({
    id: '',
    isPlaying: false,
    timeRemaining: 480,
    players: [],
    votes: {},
    config: {
      numSpies: 1,
      timeLimit: 480,
      country: 'Canada' // Default to Canada
    }
  });

  const [playerName, setPlayerName] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [showLobby, setShowLobby] = useState(false);
  const [showEndGameDialog, setShowEndGameDialog] = useState(false);
  const [nameError, setNameError] = useState<string>('');

  useEffect(() => {
    if (gameState.isPlaying && gameState.timeRemaining > 0) {
      const timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState.isPlaying, gameState.timeRemaining]);

  const handleCreateGame = async (config: GameConfig) => {
    const gameId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const testPlayers = [
      createTestPlayer("TestHost", true),
      createTestPlayer("TestPlayer2"),
      createTestPlayer("TestPlayer3")
    ];
    
    const newGameState = {
      id: gameId,
      config: config,
      timeRemaining: config.timeLimit,
      players: testPlayers,
      isPlaying: false,
      votes: {},
    };

    // Save to Firebase
    await set(ref(db, `games/${gameId}`), newGameState);
    
    setGameState(newGameState);
    setCurrentPlayer(testPlayers[0]);
    setShowLobby(true);
  };

  const handleJoinGame = async (code: string) => {
    try {
      // Check if game exists
      const gameRef = ref(db, `games/${code}`);
      const snapshot = await get(gameRef);
      
      if (!snapshot.exists()) {
        setNameError('Game not found');
        return;
      }

      // Subscribe to game updates
      onValue(gameRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setGameState(data);
        }
      });

      setGameState(prev => ({
        ...prev,
        id: code
      }));
      setShowLobby(true);
    } catch (error) {
      setNameError('Error joining game');
      console.error('Error joining game:', error);
    }
  };

  useEffect(() => {
    // Cleanup Firebase listeners when component unmounts
    return () => {
      if (gameState.id) {
        const gameRef = ref(db, `games/${gameState.id}`);
        off(gameRef);
      }
    };
  }, [gameState.id]);

  // Update Firebase whenever game state changes
  useEffect(() => {
    if (gameState.id && showLobby) {
      set(ref(db, `games/${gameState.id}`), gameState);
    }
  }, [gameState, showLobby]);

  const handleJoinLobby = () => {
    // First check if already joined
    if (currentPlayer) {
      setNameError('You are already in this game');
      return;
    }

    const trimmedName = playerName.trim();
    if (trimmedName) {
      // Check for duplicate name
      const isDuplicateName = gameState.players.some(
        player => player.name.toLowerCase() === trimmedName.toLowerCase()
      );

      if (isDuplicateName) {
        setNameError('This name is already taken');
        return;
      }

      const newPlayer: Player = {
        id: crypto.randomUUID(),
        name: trimmedName,
        isLeader: gameState.players.length === 0,
        score: 0
      };

      setCurrentPlayer(newPlayer);
      setGameState(prev => ({
        ...prev,
        players: [...prev.players, newPlayer]
      }));
      setPlayerName('');
      setNameError(''); // Clear any existing error
    }
  };

  const endGame = () => {
    setShowEndGameDialog(false);
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      timeRemaining: prev.config.timeLimit,
      location: undefined,
      currentTurn: undefined,
      votingFor: undefined,
      votes: {},
      players: prev.players.map(player => ({
        ...player,
        isSpy: undefined
      }))
    }));
  };

  const startGame = () => {
    const countryLocations = COUNTRIES[gameState.config.country as keyof typeof COUNTRIES];
    const randomLocation = countryLocations[Math.floor(Math.random() * countryLocations.length)];
    
    // Randomly select spies
    const playerIndices = Array.from({ length: gameState.players.length }, (_, i) => i);
    const spyIndices = new Set<number>();
    
    for (let i = 0; i < gameState.config.numSpies; i++) {
      const randomIndex = Math.floor(Math.random() * playerIndices.length);
      spyIndices.add(playerIndices[randomIndex]);
      playerIndices.splice(randomIndex, 1);
    }
    
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      location: randomLocation,
      timeRemaining: prev.config.timeLimit,
      players: prev.players.map((player, index) => ({
        ...player,
        isSpy: spyIndices.has(index)
      })),
      currentTurn: prev.players.find(p => p.isLeader)?.id
    }));

    // Update current player's role
    if (currentPlayer) {
      const playerIndex = gameState.players.findIndex(p => p.id === currentPlayer.id);
      setCurrentPlayer(prev => prev ? {
        ...prev,
        isSpy: spyIndices.has(playerIndex)
      } : null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && playerName.trim()) {
      handleJoinLobby();
    }
  };

  if (!showLobby) {
    return <LandingPage onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} />;
  }

  const canStartGame = gameState.players.length >= 4;
  const hasLeader = gameState.players.some(p => p.isLeader);
  const isLeader = currentPlayer?.isLeader;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {gameState.isPlaying ? (
          <>
            <div className="max-w-6xl mx-auto">
              {currentPlayer && gameState.location && (
                <RoleInfo
                  isSpy={currentPlayer.isSpy || false}
                  location={gameState.location}
                  country={gameState.config.country}
                />
              )}

              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <GameTimer timeRemaining={gameState.timeRemaining} />
                  <div className="h-8 w-px bg-gray-700/50" />
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="w-5 h-5" />
                    <span className="text-lg">{gameState.players.length} Players</span>
                  </div>
                </div>
                {isLeader && (
                  <button
                    onClick={() => setShowEndGameDialog(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white font-medium shadow-lg hover:shadow-xl"
                    aria-label="End Game"
                  >
                    <XCircle className="w-5 h-5" />
                    End Game
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gameState.players.map(player => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    isCurrentTurn={player.id === gameState.currentTurn}
                    onVotePlayer={() => {
                      // Handle voting logic
                    }}
                    showVoteButton={gameState.votingFor !== undefined}
                    hasVoted={gameState.votes[player.id]}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto">
            <header className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 text-purple-400">Spyfall</h1>
              <div className="text-gray-400">
                Game Code: <span className="font-mono text-xl text-purple-400">{gameState.id}</span>
              </div>
            </header>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">Join Game</h2>
              <div className="flex gap-2 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => {
                      setPlayerName(e.target.value);
                      setNameError('');
                    }}
                    onKeyPress={handleKeyPress}
                    disabled={false} // Remove the !!currentPlayer condition here
                    placeholder="Enter your name"
                    className={`w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border 
                      ${nameError ? 'border-red-500' : 'border-gray-600/50'}
                      ${currentPlayer ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  />
                  {nameError && (
                    <div className="text-red-400 text-sm mt-1">{nameError}</div>
                  )}
                </div>
                <button
                  onClick={handleJoinLobby}
                  disabled={!playerName.trim()}  // Only disable if name is empty
                  className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Join
                </button>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-400 mb-3">Players ({gameState.players.length}/12)</div>
                {gameState.players.map(player => (
                  <div key={player.id} className="flex items-center gap-2 bg-gray-700/50 p-3 rounded-lg">
                    <span className="text-gray-200">{player.name}</span>
                    {player.isLeader && (
                      <span className="flex items-center gap-1 text-yellow-500 text-sm">
                        <Crown className="w-3.5 h-3.5" />
                        Leader
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {!canStartGame && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-500">
                    <AlertCircle className="w-5 h-5" />
                    <span>Need at least 4 players to start</span>
                  </div>
                </div>
              )}

              {canStartGame && hasLeader && (
                <button
                  onClick={startGame}
                  className="w-full mt-4 px-4 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
                >
                  Start Game
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <EndGameDialog
        isOpen={showEndGameDialog}
        onConfirm={endGame}
        onCancel={() => setShowEndGameDialog(false)}
      />
    </div>
  );
}

export default App;