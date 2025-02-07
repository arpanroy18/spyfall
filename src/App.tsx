import React, { useState, useEffect } from 'react';
import { GameTimer } from './components/GameTimer';
import { PlayerCard } from './components/PlayerCard';
import { LandingPage } from './components/LandingPage';
import { RoleInfo } from './components/RoleInfo';
import { EndGameDialog } from './components/EndGameDialog';
import { KickDialog } from './components/KickDialog';
import { Player, GameState, COUNTRIES, GameConfig } from './types';
import { MapPin, Users, Crown, AlertCircle, XCircle, ArrowLeft, UserX } from 'lucide-react';
import { ref, set, get, onValue, off } from 'firebase/database';
import { db } from './firebase';

const createTestPlayer = (name: string, isLeader: boolean = false): Player => ({
  id: crypto.randomUUID(),
  name,
  isLeader,
  score: 0,
  isSpy: false
});

const initialGameState: GameState = {
  id: '',
  isPlaying: false,
  timeRemaining: 480,
  players: [],
  votes: {},
  config: {
    numSpies: 1,
    timeLimit: 480,
    country: 'Canada'
  },
  currentTurn: null
};

function App() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [playerName, setPlayerName] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [showLobby, setShowLobby] = useState(false);
  const [showEndGameDialog, setShowEndGameDialog] = useState(false);
  const [showKickDialog, setShowKickDialog] = useState(false);
  const [nameError, setNameError] = useState<string>('');
  const [joiningCode, setJoiningCode] = useState<string>('');

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

  const handleCreateGame = async (config: GameConfig, creatorName: string) => {
    const gameId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const leaderPlayer: Player = {
      id: crypto.randomUUID(),
      name: creatorName,
      isLeader: true,
      score: 0,
      isSpy: false
    };

    const newGameState: GameState = {
      id: gameId,
      config: {
        ...config,
        country: config.country || 'Canada'
      },
      timeRemaining: config.timeLimit,
      players: [leaderPlayer],
      isPlaying: false,
      votes: {},
      currentTurn: null
    };

    await set(ref(db, `games/${gameId}`), newGameState);
    
    setGameState(newGameState);
    setCurrentPlayer(leaderPlayer);
    setShowLobby(true);
  };

  const handleJoinGame = async (code: string) => {
    try {
      const gameRef = ref(db, `games/${code}`);
      const snapshot = await get(gameRef);
      
      if (!snapshot.exists()) {
        setNameError('Game not found');
        return;
      }

      const gameData = snapshot.val();
      const validatedGameState: GameState = {
        ...initialGameState,
        ...gameData,
        players: gameData.players || [],
        votes: gameData.votes || {},
        currentTurn: gameData.currentTurn || null
      };

      setJoiningCode(code);
      setGameState(validatedGameState);
      setShowLobby(true);
    } catch (error) {
      setNameError('Error joining game');
      console.error('Error joining game:', error);
    }
  };

  const handleLeaveLobby = async () => {
    if (currentPlayer && gameState.id) {
      const updatedPlayers = gameState.players.filter(p => p.id !== currentPlayer.id);
      
      // If the leaving player was the leader, assign leadership to the next player
      if (currentPlayer.isLeader && updatedPlayers.length > 0) {
        const newLeader = { ...updatedPlayers[0], isLeader: true };
        updatedPlayers[0] = newLeader;
      }

      // Update the entire game state to ensure leadership changes are properly propagated
      const updatedGameState = {
        ...gameState,
        players: updatedPlayers
      };

      // Update the entire game state in Firebase
      await set(ref(db, `games/${gameState.id}`), updatedGameState);

      setGameState(initialGameState);
      setCurrentPlayer(null);
      setShowLobby(false);
      setNameError('');
      setJoiningCode('');
    } else {
      setShowLobby(false);
      setGameState(initialGameState);
      setJoiningCode('');
    }
  };

  const handleKickPlayer = async (playerId: string) => {
    if (!currentPlayer?.isLeader || !gameState.id) return;

    const updatedPlayers = gameState.players.filter(p => p.id !== playerId);
    const updatedGameState = {
      ...gameState,
      players: updatedPlayers
    };

    await set(ref(db, `games/${gameState.id}`), updatedGameState);
  };

  useEffect(() => {
    if (gameState.id) {
      const gameRef = ref(db, `games/${gameState.id}`);
      const unsubscribe = onValue(gameRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Check if current player was kicked
          if (currentPlayer && !data.players?.some((p: Player) => p.id === currentPlayer.id)) {
            // Player was kicked, show kick dialog
            setShowKickDialog(true);
            return;
          }

          setGameState(prev => ({
            ...prev,
            ...data,
            players: data.players || [],
            votes: data.votes || {},
            currentTurn: data.currentTurn || null
          }));
        }
      });

      return () => {
        off(gameRef);
      };
    }
  }, [gameState.id, currentPlayer]);

  const handleKickDialogClose = () => {
    setShowKickDialog(false);
    setShowLobby(false);
    setGameState(initialGameState);
    setCurrentPlayer(null);
    setJoiningCode('');
  };

  const handleJoinLobby = async () => {
    const trimmedName = playerName.trim();
    if (!trimmedName) {
      setNameError('Please enter your name');
      return;
    }

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
      score: 0,
      isSpy: false
    };

    const updatedPlayers = [...gameState.players, newPlayer];
    await set(ref(db, `games/${gameState.id}/players`), updatedPlayers);

    setCurrentPlayer(newPlayer);
    setPlayerName('');
    setNameError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && playerName.trim()) {
      handleJoinLobby();
    }
  };

  const endGame = async () => {
    if (gameState.id) {
      const updatedState = {
        ...gameState,
        isPlaying: false,
        timeRemaining: gameState.config.timeLimit,
        location: null,
        currentTurn: null,
        votingFor: null,
        votes: {},
        players: gameState.players.map(player => ({
          ...player,
          isSpy: false
        }))
      };

      await set(ref(db, `games/${gameState.id}`), updatedState);
      setShowEndGameDialog(false);
    }
  };

  const startGame = async () => {
    const countryLocations = COUNTRIES[gameState.config.country as keyof typeof COUNTRIES];
    const randomLocation = countryLocations[Math.floor(Math.random() * countryLocations.length)];
    
    const playerIndices = Array.from({ length: gameState.players.length }, (_, i) => i);
    const spyIndices = new Set<number>();
    
    for (let i = 0; i < gameState.config.numSpies; i++) {
      const randomIndex = Math.floor(Math.random() * playerIndices.length);
      spyIndices.add(playerIndices[randomIndex]);
      playerIndices.splice(randomIndex, 1);
    }
    
    const firstTurnPlayerId = gameState.players.find(p => p.isLeader)?.id || gameState.players[0]?.id || null;
    
    const updatedState = {
      ...gameState,
      isPlaying: true,
      location: randomLocation,
      timeRemaining: gameState.config.timeLimit,
      players: gameState.players.map((player, index) => ({
        ...player,
        isSpy: spyIndices.has(index)
      })),
      currentTurn: firstTurnPlayerId
    };

    await set(ref(db, `games/${gameState.id}`), updatedState);

    if (currentPlayer) {
      const playerIndex = gameState.players.findIndex(p => p.id === currentPlayer.id);
      setCurrentPlayer(prev => prev ? {
        ...prev,
        isSpy: spyIndices.has(playerIndex)
      } : null);
    }
  };

  if (!showLobby) {
    return <LandingPage onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} />;
  }

  if (joiningCode && !currentPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <header className="text-center mb-8 relative">
              <button
                onClick={handleLeaveLobby}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Back to main menu"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-4xl font-bold mb-2 text-purple-400">Join Game</h1>
              <div className="text-gray-400">
                Game Code: <span className="font-mono text-xl text-purple-400">{joiningCode}</span>
              </div>
            </header>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">Enter Your Name</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => {
                    setPlayerName(e.target.value);
                    setNameError('');
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Your name"
                  className={`w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border 
                    ${nameError ? 'border-red-500' : 'border-gray-600/50'}`}
                />
                {nameError && (
                  <div className="text-red-400 text-sm">{nameError}</div>
                )}
                <button
                  onClick={handleJoinLobby}
                  disabled={!playerName.trim()}
                  className="w-full px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Join Game
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const canStartGame = gameState.players.length > 0;
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
                    onKickPlayer={currentPlayer?.isLeader && !player.isLeader ? 
                      () => handleKickPlayer(player.id) : 
                      undefined}
                    showVoteButton={gameState.votingFor !== undefined}
                    hasVoted={gameState.votes[player.id]}
                    isCurrentPlayer={currentPlayer?.id === player.id}
                    canKick={currentPlayer?.isLeader && !player.isLeader}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto">
            <header className="text-center mb-8 relative">
              <button
                onClick={handleLeaveLobby}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Back to main menu"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-4xl font-bold mb-2 text-purple-400">Spyfall</h1>
              <div className="text-gray-400">
                Game Code: <span className="font-mono text-xl text-purple-400">{gameState.id}</span>
              </div>
            </header>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">Game Lobby</h2>
              <div className="space-y-2">
                <div className="text-sm text-gray-400 mb-3">Players ({gameState.players.length}/12)</div>
                {gameState.players.map(player => (
                  <div key={player.id} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-200">{player.name}</span>
                      {player.isLeader && (
                        <span className="flex items-center gap-1 text-yellow-500 text-sm">
                          <Crown className="w-3.5 h-3.5" />
                          Leader
                        </span>
                      )}
                    </div>
                    {currentPlayer?.isLeader && !player.isLeader && (
                      <button
                        onClick={() => handleKickPlayer(player.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        aria-label="Kick player"
                      >
                        <UserX className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {canStartGame && hasLeader && isLeader && (
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

      <KickDialog
        isOpen={showKickDialog}
        onClose={handleKickDialogClose}
      />
    </div>
  );
}

export default App;