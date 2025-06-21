import React, { useState, useEffect } from 'react';
import { GameTimer } from './components/GameTimer';
import { PlayerCard } from './components/PlayerCard';
import { LandingPage } from './components/LandingPage';
import { RoleInfo } from './components/RoleInfo';
import { EndGameDialog } from './components/EndGameDialog';
import { KickDialog } from './components/KickDialog';
import { MissionAbortedDialog } from './components/MissionAbortedDialog';
import { Player, GameState, COUNTRIES, GameConfig } from './types';
import { MapPin, Users, Crown, AlertCircle, XCircle, ArrowLeft, UserX, Share2, Copy } from 'lucide-react';
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
  waitingPlayers: [],
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
  const [showMissionAbortedDialog, setShowMissionAbortedDialog] = useState(false);
  const [nameError, setNameError] = useState<string>('');
  const [joiningCode, setJoiningCode] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameCodeFromUrl = urlParams.get('game');
    if (gameCodeFromUrl && gameCodeFromUrl.length === 6) {
      handleJoinGame(gameCodeFromUrl.toUpperCase());
    }
  }, []);

  const handleShareLink = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?game=${gameState.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

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
        waitingPlayers: gameData.waitingPlayers || [],
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
      
      // If this was the last player, remove the game entirely
      if (updatedPlayers.length === 0) {
        await set(ref(db, `games/${gameState.id}`), null);
      } else {
        // If the leaving player was the leader, assign leadership to the next player
        if (currentPlayer.isLeader && updatedPlayers.length > 0) {
          const newLeader = { ...updatedPlayers[0], isLeader: true };
          updatedPlayers[0] = newLeader;

          if (currentPlayer.id === newLeader.id) {
            setCurrentPlayer(newLeader);
          }
        }

        // Update the game state
        const updatedGameState = {
          ...gameState,
          players: updatedPlayers
        };
        await set(ref(db, `games/${gameState.id}`), updatedGameState);
      }
      
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
          // Check if mission was aborted by leader
          if (data.missionAborted && currentPlayer && !currentPlayer.isLeader) {
            setShowMissionAbortedDialog(true);
            return;
          }

          // Check if current player was kicked (check both players and waitingPlayers)
          if (currentPlayer && 
              !data.players?.some((p: Player) => p.id === currentPlayer.id) &&
              !(data.waitingPlayers || []).some((p: Player) => p.id === currentPlayer.id)) {
            setShowKickDialog(true);
            return;
          }

          // Update current player if leadership changed
          if (currentPlayer) {
            const updatedCurrentPlayer = data.players?.find((p: Player) => p.id === currentPlayer.id);
            if (updatedCurrentPlayer && updatedCurrentPlayer.isLeader !== currentPlayer.isLeader) {
              setCurrentPlayer(updatedCurrentPlayer);
            }
          }

          setGameState(prev => ({
            ...prev,
            ...data,
            players: data.players || [],
            waitingPlayers: data.waitingPlayers || [],
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

  const handleMissionAbortedClose = () => {
    setShowMissionAbortedDialog(false);
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
    ) || (gameState.waitingPlayers || []).some(
      player => player.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicateName) {
      setNameError('This name is already taken');
      return;
    }

    // If game is currently playing, add player to waiting list
    if (gameState.isPlaying) {
      const newPlayer: Player = {
        id: crypto.randomUUID(),
        name: trimmedName,
        isLeader: false,
        score: 0,
        isSpy: false
      };

      const updatedWaitingPlayers = [...(gameState.waitingPlayers || []), newPlayer];
      await set(ref(db, `games/${gameState.id}/waitingPlayers`), updatedWaitingPlayers);

      setCurrentPlayer(newPlayer);
      setPlayerName('');
      setNameError('');
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
      // Reset game to lobby state, merging waiting players into main players list
      const allPlayers = [...gameState.players, ...(gameState.waitingPlayers || [])];
      
      const resetGameState = {
        ...gameState,
        isPlaying: false,
        location: undefined,
        timeRemaining: gameState.config.timeLimit,
        players: allPlayers,
        waitingPlayers: [],
        votes: {},
        currentTurn: null,
        missionAborted: undefined
      };

      await set(ref(db, `games/${gameState.id}`), resetGameState);
      
      setShowEndGameDialog(false);
    }
  };

  const startGame = async () => {
    // Merge waiting players into main players list before starting
    const allPlayers = [...gameState.players, ...(gameState.waitingPlayers || [])];
    
    const countryLocations = COUNTRIES[gameState.config.country as keyof typeof COUNTRIES];
    const randomLocation = countryLocations[Math.floor(Math.random() * countryLocations.length)];
    
    const playerIndices = Array.from({ length: allPlayers.length }, (_, i) => i);
    const spyIndices = new Set<number>();
    
    for (let i = 0; i < gameState.config.numSpies; i++) {
      const randomIndex = Math.floor(Math.random() * playerIndices.length);
      spyIndices.add(playerIndices[randomIndex]);
      playerIndices.splice(randomIndex, 1);
    }
    
    const firstTurnPlayerId = allPlayers.find(p => p.isLeader)?.id || allPlayers[0]?.id || null;
    
    const updatedState = {
      ...gameState,
      isPlaying: true,
      location: randomLocation,
      timeRemaining: gameState.config.timeLimit,
      players: allPlayers.map((player, index) => ({
        ...player,
        isSpy: spyIndices.has(index)
      })),
      waitingPlayers: [],
      currentTurn: firstTurnPlayerId
    };

    await set(ref(db, `games/${gameState.id}`), updatedState);

    if (currentPlayer) {
      const playerIndex = allPlayers.findIndex(p => p.id === currentPlayer.id);
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
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900"></div>
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <header className="text-center mb-8 relative">
              <button
                onClick={handleLeaveLobby}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-400 transition-colors"
                aria-label="Back to main menu"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-4xl font-bold mb-2 text-red-400 font-mono tracking-wider">INFILTRATE</h1>
              <div className="text-gray-400 font-mono">
                ACCESS CODE: <span className="font-mono text-xl text-amber-400 tracking-widest">{joiningCode}</span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-red-500 to-transparent mt-4"></div>
            </header>

            <div className="bg-gray-900/90 backdrop-blur-sm border-2 border-red-900/50 p-6 shadow-2xl shadow-red-900/20 relative">
              <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800 border-b border-red-900/50 flex items-center px-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="ml-4 text-xs text-gray-400 font-mono">AGENT_AUTH.exe</div>
              </div>
              <div className="pt-4">
                <h2 className="text-lg font-semibold mb-4 text-red-400 font-mono tracking-wide">ENTER CODENAME</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => {
                      setPlayerName(e.target.value);
                      setNameError('');
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Agent codename"
                    className={`w-full px-4 py-3 bg-black/50 border text-white placeholder-gray-500 font-mono focus:outline-none focus:ring-1 transition-all duration-300 
                      ${nameError ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-amber-500 hover:border-gray-600'}`}
                  />
                  {nameError && (
                    <div className="text-red-400 text-sm font-mono">{nameError}</div>
                  )}
                  <button
                    onClick={handleJoinLobby}
                    disabled={!playerName.trim()}
                    className="w-full px-4 py-3 bg-red-800 hover:bg-red-700 border border-red-600 text-white font-mono tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/20"
                  >
                    AUTHORIZE ACCESS
                  </button>
                </div>
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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900"></div>
      <div className="relative z-10 container mx-auto px-4 py-8">
        {gameState.isPlaying && currentPlayer && gameState.players.some(p => p.id === currentPlayer.id) ? (
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
                <div className="flex items-center gap-6">
                  <GameTimer timeRemaining={gameState.timeRemaining} />
                  <div className="h-8 w-px bg-red-800/50" />
                  <div className="flex items-center gap-2 text-gray-400 font-mono border border-gray-700 px-3 py-1 bg-black/20">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span className="text-sm">{gameState.players.length} AGENTS</span>
                  </div>
                </div>
                {isLeader && (
                  <button
                    onClick={() => setShowEndGameDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-800 hover:bg-red-700 border border-red-600 text-white font-mono tracking-wide transition-all duration-300 shadow-lg shadow-red-900/20"
                    aria-label="Abort Mission"
                  >
                    <XCircle className="w-4 h-4" />
                    ABORT MISSION
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
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-400 transition-colors"
                aria-label="Back to main menu"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-4xl font-bold mb-2 text-red-400 font-mono tracking-wider">SPYFALL</h1>
              <div className="text-gray-400 font-mono flex items-center justify-center gap-4">
                MISSION CODE: <span className="font-mono text-xl text-amber-400 tracking-widest">{gameState.id}</span>
                <button
                  onClick={handleShareLink}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 hover:text-amber-400 transition-colors font-mono text-sm"
                  title="Share game link"
                >
                  {copySuccess ? (
                    <>
                      <Copy className="w-4 h-4 text-green-400" />
                      COPIED
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      SHARE
                    </>
                  )}
                </button>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-red-500 to-transparent mt-4"></div>
            </header>

            <div className="bg-gray-900/90 backdrop-blur-sm border-2 border-red-900/50 p-6 shadow-2xl shadow-red-900/20 relative">
              <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800 border-b border-red-900/50 flex items-center px-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="ml-4 text-xs text-gray-400 font-mono">MISSION_LOBBY.exe</div>
              </div>
              <div className="pt-4">
                {gameState.isPlaying ? (
                  <>
                    <h2 className="text-lg font-semibold mb-4 text-red-400 font-mono tracking-wide">MISSION STATUS</h2>
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-800">
                      <div className="text-red-400 font-mono text-sm mb-2">OPERATION IN PROGRESS</div>
                      <div className="text-gray-300 text-sm font-mono">
                        {gameState.players.length} agents are currently on mission. You will join the next operation.
                      </div>
                    </div>
                    
                    <h3 className="text-md font-semibold mb-3 text-amber-400 font-mono tracking-wide">ACTIVE OPERATIVES</h3>
                    <div className="space-y-2 mb-6">
                      {gameState.players.map(player => (
                        <div key={player.id} className="flex items-center gap-3 bg-black/20 border border-gray-700 p-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-gray-200 font-mono">{player.name}</span>
                          {player.isLeader && (
                            <span className="flex items-center gap-1 text-amber-500 text-sm font-mono border border-amber-700 px-2 py-1 bg-amber-900/20">
                              <Crown className="w-3.5 h-3.5" />
                              COMMANDER
                            </span>
                          )}
                          <span className="text-red-400 text-xs font-mono">ON MISSION</span>
                        </div>
                      ))}
                    </div>

                    {(gameState.waitingPlayers || []).length > 0 && (
                      <>
                        <h3 className="text-md font-semibold mb-3 text-green-400 font-mono tracking-wide">STANDBY AGENTS</h3>
                        <div className="space-y-2">
                          {(gameState.waitingPlayers || []).map(player => (
                            <div key={player.id} className="flex items-center gap-3 bg-black/20 border border-gray-700 p-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-gray-200 font-mono">{player.name}</span>
                              <span className="text-green-400 text-xs font-mono">READY</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold mb-4 text-red-400 font-mono tracking-wide">AGENT ROSTER</h2>
                    <div className="space-y-2">
                      <div className="text-sm text-amber-400 mb-3 font-mono">OPERATIVES ({gameState.players.length}/12)</div>
                      {gameState.players.map(player => (
                        <div key={player.id} className="flex items-center justify-between bg-black/20 border border-gray-700 p-3 hover:border-red-800 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-gray-200 font-mono">{player.name}</span>
                            {player.isLeader && (
                              <span className="flex items-center gap-1 text-amber-500 text-sm font-mono border border-amber-700 px-2 py-1 bg-amber-900/20">
                                <Crown className="w-3.5 h-3.5" />
                                COMMANDER
                              </span>
                            )}
                          </div>
                          {currentPlayer?.isLeader && !player.isLeader && (
                            <button
                              onClick={() => handleKickPlayer(player.id)}
                              className="p-2 text-red-400 hover:text-red-300 transition-colors border border-red-800 hover:border-red-600 bg-red-900/20"
                              aria-label="Remove agent"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {canStartGame && hasLeader && isLeader && !gameState.isPlaying && (
                  <button
                    onClick={startGame}
                    className="w-full mt-6 px-4 py-3 bg-red-800 hover:bg-red-700 border border-red-600 text-white font-mono tracking-wide transition-all duration-300 text-lg shadow-lg shadow-red-900/20"
                  >
                    INITIATE MISSION
                  </button>
                )}
              </div>
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

      <MissionAbortedDialog
        isOpen={showMissionAbortedDialog}
        onReturnHome={handleMissionAbortedClose}
      />
    </div>
  );
}

export default App;