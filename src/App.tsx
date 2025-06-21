import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthorizationScreen } from './components/AuthorizationScreen';
import { LobbyScreen } from './components/LobbyScreen';
import { MissionScreen } from './components/MissionScreen';
import { EndGameDialog } from './components/EndGameDialog';
import { KickDialog } from './components/KickDialog';
import { MissionAbortedDialog } from './components/MissionAbortedDialog';
import { Player, GameState, COUNTRIES, GameConfig } from './types';
import { ref, set, get, onValue, off } from 'firebase/database';
import { db } from './firebase';

// -------------------------------------------------------------------------------------------------
// Initial helpers & constants
// -------------------------------------------------------------------------------------------------

const initialGameState: GameState = {
  id: '',
  isPlaying: false,
  timeRemaining: 480,
  players: [],
  waitingPlayers: [],
  votes: {},
  config: { numSpies: 1, timeLimit: 480, country: 'Canada' },
  currentTurn: null
};

// -------------------------------------------------------------------------------------------------
// Main component
// -------------------------------------------------------------------------------------------------

function App() {
  // UI & game state ------------------------------------------------------------------------------
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [playerName, setPlayerName] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [showLobby, setShowLobby] = useState(false);
  const [showEndGameDialog, setShowEndGameDialog] = useState(false);
  const [showKickDialog, setShowKickDialog] = useState(false);
  const [showMissionAbortedDialog, setShowMissionAbortedDialog] = useState(false);
  const [nameError, setNameError] = useState('');
  const [joiningCode, setJoiningCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // -------------------------------------------------------------------------------------------------
  // Side-effects ------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------

  // Parse invite code from URL on mount -----------------------------------------------------------
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('game');
    if (code && code.length === 6) handleJoinGame(code.toUpperCase());
  }, []);

  // Game timer ------------------------------------------------------------------------------------
  useEffect(() => {
    if (gameState.isPlaying && gameState.timeRemaining > 0) {
      const timer = setInterval(() =>
        setGameState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 })),
      1000);
      return () => clearInterval(timer);
    }
  }, [gameState.isPlaying, gameState.timeRemaining]);

  // Firebase listener ----------------------------------------------------------------------------
  useEffect(() => {
    if (!gameState.id) return;
    const gameRef = ref(db, `games/${gameState.id}`);
    const unsubscribe = onValue(gameRef, snapshot => {
      const data = snapshot.val();
      if (!data) return;

      // If current player was kicked --------------------------------------------------------------
      if (
        currentPlayer &&
        ![...(data.players || []), ...(data.waitingPlayers || [])].some(
          (p: Player) => p.id === currentPlayer.id
        )
      ) {
        setShowKickDialog(true);
        return;
      }

      // Update local leadership flag --------------------------------------------------------------
      if (currentPlayer) {
        const me = data.players?.find((p: Player) => p.id === currentPlayer.id);
        if (me && me.isLeader !== currentPlayer.isLeader) setCurrentPlayer(me);
      }

      setGameState({
        ...initialGameState,
        ...data,
        players: data.players || [],
        waitingPlayers: data.waitingPlayers || [],
        votes: data.votes || {},
        currentTurn: data.currentTurn || null
      });
    });
    return () => off(gameRef);
  }, [gameState.id, currentPlayer]);

  // -------------------------------------------------------------------------------------------------
  // Handlers ---------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------

  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${window.location.pathname}?game=${gameState.id}`
      );
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleCreateGame = async (config: GameConfig, creatorName: string) => {
    const gameId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const leader: Player = { id: crypto.randomUUID(), name: creatorName, isLeader: true, score: 0, isSpy: false };
    const newGameState: GameState = {
      id: gameId,
      config: { ...config, country: config.country || 'Canada' },
      timeRemaining: config.timeLimit,
      players: [leader],
      isPlaying: false,
      votes: {},
      currentTurn: null
    };
    await set(ref(db, `games/${gameId}`), newGameState);
    setGameState(newGameState);
    setCurrentPlayer(leader);
    setShowLobby(true);
  };

  const handleJoinGame = async (code: string) => {
    try {
      const snap = await get(ref(db, `games/${code}`));
      if (!snap.exists()) return setNameError('Game not found');
      const data = snap.val();
      setJoiningCode(code);
      setGameState({ ...initialGameState, ...data, players: data.players || [], waitingPlayers: data.waitingPlayers || [] });
      setShowLobby(true);
    } catch (e) {
      console.error(e);
      setNameError('Error joining game');
    }
  };

  const handleLeaveLobby = async () => {
    if (!currentPlayer || !gameState.id) {
      resetToHome();
      return;
    }
    const remaining = gameState.players.filter(p => p.id !== currentPlayer.id);
    if (remaining.length === 0) {
      await set(ref(db, `games/${gameState.id}`), null);
    } else {
      if (currentPlayer.isLeader) remaining[0] = { ...remaining[0], isLeader: true };
      await set(ref(db, `games/${gameState.id}`), { ...gameState, players: remaining });
    }
    resetToHome();
  };

  const handleKickPlayer = async (playerId: string) => {
    if (!currentPlayer?.isLeader || !gameState.id) return;
    await set(ref(db, `games/${gameState.id}`), {
      ...gameState,
      players: gameState.players.filter(p => p.id !== playerId)
    });
  };

  const handleJoinLobby = async () => {
    const trimmed = playerName.trim();
    if (!trimmed) return setNameError('Please enter your name');
    const exists = [...gameState.players, ...(gameState.waitingPlayers || [])].some(
      p => p.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) return setNameError('This name is already taken');

    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: trimmed,
      isLeader: gameState.players.length === 0,
      score: 0,
      isSpy: false
    };

    if (gameState.isPlaying) {
      await set(ref(db, `games/${gameState.id}/waitingPlayers`), [...(gameState.waitingPlayers || []), newPlayer]);
      setCurrentPlayer(newPlayer);
    } else {
      await set(ref(db, `games/${gameState.id}/players`), [...gameState.players, newPlayer]);
      setCurrentPlayer(newPlayer);
    }
    setPlayerName('');
    setNameError('');
  };

  const endGame = async () => {
    if (!gameState.id) return;
    const allPlayers = [...gameState.players, ...(gameState.waitingPlayers || [])].map(p => ({ ...p, isSpy: false }));
    const resetState = {
      ...gameState,
      isPlaying: false,
      location: null,
      timeRemaining: gameState.config.timeLimit,
      players: allPlayers,
      waitingPlayers: [],
      votes: {},
      currentTurn: null
    };
    await set(ref(db, `games/${gameState.id}`), resetState);
    if (currentPlayer) setCurrentPlayer({ ...currentPlayer, isSpy: false });
    setShowEndGameDialog(false);
    setGameState(resetState);
  };

  const startGame = async () => {
    const allPlayers = [...gameState.players, ...(gameState.waitingPlayers || [])];
    const locations = COUNTRIES[gameState.config.country as keyof typeof COUNTRIES];
    const location = locations[Math.floor(Math.random() * locations.length)];

    const spyIndices = new Set<number>();
    while (spyIndices.size < gameState.config.numSpies) {
      spyIndices.add(Math.floor(Math.random() * allPlayers.length));
    }

    const updatedPlayers = allPlayers.map((p, i) => ({ ...p, isSpy: spyIndices.has(i) }));
    const firstTurn = updatedPlayers.find(p => p.isLeader)?.id || updatedPlayers[0]?.id || null;

    const newState = {
      ...gameState,
      isPlaying: true,
      location,
      timeRemaining: gameState.config.timeLimit,
      players: updatedPlayers,
      waitingPlayers: [],
      currentTurn: firstTurn
    };
    await set(ref(db, `games/${gameState.id}`), newState);
    setGameState(newState);
    if (currentPlayer) setCurrentPlayer({ ...currentPlayer, isSpy: spyIndices.has(allPlayers.findIndex(p => p.id === currentPlayer.id)) });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && playerName.trim()) handleJoinLobby();
  };

  const resetToHome = () => {
    setGameState(initialGameState);
    setCurrentPlayer(null);
    setShowLobby(false);
    setNameError('');
    setJoiningCode('');
  };

  const handlePlayerNameChange = (val: string) => {
    setPlayerName(val);
    setNameError('');
  };

  const handleKickDialogClose = () => {
    setShowKickDialog(false);
    resetToHome();
  };

  const handleMissionAbortedClose = () => {
    setShowMissionAbortedDialog(false);
    resetToHome();
  };

  // -------------------------------------------------------------------------------------------------
  // Conditional rendering --------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------

  if (!showLobby) return <LandingPage onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} />;

  if (joiningCode && !currentPlayer) {
    return (
      <AuthorizationScreen
        joiningCode={joiningCode}
        playerName={playerName}
        nameError={nameError}
        onPlayerNameChange={handlePlayerNameChange}
        onJoin={handleJoinLobby}
        onBack={handleLeaveLobby}
        onKeyPress={handleKeyPress}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900"></div>
      <div className="relative z-10 container mx-auto px-4 py-8">
        {gameState.isPlaying && currentPlayer && gameState.players.some(p => p.id === currentPlayer.id) ? (
          <MissionScreen
            gameState={gameState}
            currentPlayer={currentPlayer}
            onKickPlayer={handleKickPlayer}
            onAbortMission={() => setShowEndGameDialog(true)}
          />
        ) : (
          <LobbyScreen
            gameState={gameState}
            currentPlayer={currentPlayer}
            copySuccess={copySuccess}
            onShareLink={handleShareLink}
            onBack={handleLeaveLobby}
            onStartGame={startGame}
            onKickPlayer={handleKickPlayer}
          />
        )}
      </div>

      <EndGameDialog isOpen={showEndGameDialog} onConfirm={endGame} onCancel={() => setShowEndGameDialog(false)} />
      <KickDialog isOpen={showKickDialog} onClose={handleKickDialogClose} />
      <MissionAbortedDialog isOpen={showMissionAbortedDialog} onReturnHome={handleMissionAbortedClose} />
    </div>
  );
}

export default App;