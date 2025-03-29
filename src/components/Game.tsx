import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MineGrid from './MineGrid';
import GameControls from './GameControls';
import BetHistory from './BetHistory';
import { GameState } from '../types/game';
import SoundEffects from '../utils/SoundEffects';

// Save game state to localStorage
const saveGameState = (gameState: GameState, 
                        revealedTiles: number[], 
                        mines: number[], 
                        gameOver: boolean, 
                        won: boolean, 
                        currentMultiplier: number,
                        username: string) => {
  const fullState = {
    gameState,
    revealedTiles,
    mines,
    gameOver,
    won,
    currentMultiplier,
    username
  };
  localStorage.setItem('miningGameState', JSON.stringify(fullState));
};

// Load game state from localStorage
const loadGameState = () => {
  const savedState = localStorage.getItem('miningGameState');
  if (savedState) {
    try {
      return JSON.parse(savedState);
    } catch (e) {
      console.error('Error parsing saved game state', e);
      return null;
    }
  }
  return null;
};

// Initial state if no saved state exists
const initialGameState: GameState = {
  balance: 1000,
  betAmount: 10,
  mineCount: 5,
  gridSize: 5, // 5x5 grid = 25 tiles
  isPlaying: false,
  cashoutMultiplier: 0,
  history: [],
};

const Game: React.FC = () => {
  // Load state from localStorage or use initial state
  const savedState = loadGameState();
  
  const [gameState, setGameState] = useState<GameState>(
    savedState ? savedState.gameState : initialGameState
  );
  const [revealedTiles, setRevealedTiles] = useState<number[]>(
    savedState ? savedState.revealedTiles : []
  );
  const [mines, setMines] = useState<number[]>(
    savedState ? savedState.mines : []
  );
  const [gameOver, setGameOver] = useState<boolean>(
    savedState ? savedState.gameOver : false
  );
  const [won, setWon] = useState<boolean>(
    savedState ? savedState.won : false
  );
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(
    savedState ? savedState.currentMultiplier : 1
  );
  const [username, setUsername] = useState<string>(
    savedState?.username || 'Player'
  );
  const [displayBalance, setDisplayBalance] = useState<number>(
    savedState?.gameState?.balance || initialGameState.balance
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Save game state to localStorage whenever it changes
  useEffect(() => {
    saveGameState(gameState, revealedTiles, mines, gameOver, won, currentMultiplier, username);
  }, [gameState, revealedTiles, mines, gameOver, won, currentMultiplier, username]);
  
  // Update display balance when game state changes
  useEffect(() => {
    setDisplayBalance(gameState.balance);
  }, [gameState.balance]);
  
  // Initialize sound effects on component mount
  useEffect(() => {
    console.log("Game component mounted, initializing sound effects");
    SoundEffects.init();
  }, []);
  
  // Update sound effects state
  useEffect(() => {
    SoundEffects.toggleSound(soundEnabled);
  }, [soundEnabled]);
  
  const startGame = () => {
    if (gameState.balance < gameState.betAmount) {
      alert("Not enough balance!");
      return;
    }
    
    // No need to generate mines - mines will only appear on right-click
    setMines([]);
    setRevealedTiles([]);
    setGameOver(false);
    setWon(false);
    setCurrentMultiplier(1);
    
    setGameState({
      ...gameState,
      isPlaying: true,
      balance: gameState.balance - gameState.betAmount,
    });
  };
  
  const calculateMultiplier = (revealed: number[]) => {
    const totalTiles = gameState.gridSize * gameState.gridSize;
    const remainingTiles = totalTiles - revealed.length;
    
    // Exponential multiplier that grows dramatically as fewer tiles remain
    // When only 1 tile remains (the mine), multiplier will be 25x
    if (remainingTiles === 1) {
      return 25.0; // 25x multiplier for revealing all safe tiles
    } else {
      // Progressive scaling - higher multiplier as more tiles are revealed
      const progress = revealed.length / (totalTiles - 1); // How close to revealing all safe tiles
      const multiplier = 1 + Math.pow(progress, 3) * 24; // Exponential curve from 1x to 25x
      return parseFloat(multiplier.toFixed(2));
    }
  };

  const revealTile = (tileIndex: number) => {
    if (!gameState.isPlaying || revealedTiles.includes(tileIndex) || gameOver) {
      return;
    }
    
    // Left-click always reveals a safe tile (diamond)
    const newRevealedTiles = [...revealedTiles, tileIndex];
    setRevealedTiles(newRevealedTiles);
    
    // Play diamond sound
    console.log("Safe tile revealed, playing diamond sound");
    SoundEffects.playDiamondSound();
    
    const newMultiplier = calculateMultiplier(newRevealedTiles);
    setCurrentMultiplier(newMultiplier);
    
    // Check if all safe tiles are revealed (win condition)
    const totalTiles = gameState.gridSize * gameState.gridSize;
    const remainingTiles = totalTiles - newRevealedTiles.length;
    
    if (remainingTiles <= 1) {
      // If there's only one tile left, it must be the "mine" tile
      // Pick any unrevealed tile to be the mine
      const unrevealedTiles = [];
      for (let i = 0; i < totalTiles; i++) {
        if (!newRevealedTiles.includes(i)) {
          unrevealedTiles.push(i);
        }
      }
      
      if (unrevealedTiles.length > 0) {
        // Set the remaining tile as a mine
        setMines([unrevealedTiles[0]]);
      }
      
      cashout(newMultiplier);
      setWon(true);
      setGameOver(true);
      
      // Play win sound when completing the game
      console.log("Game completed, playing win sound");
      SoundEffects.playWinSound();
    }
  };
  
  const cashout = (multiplier = currentMultiplier) => {
    if (!gameState.isPlaying || gameOver) {
      return;
    }
    
    const winAmount = gameState.betAmount * multiplier;
    
    const newHistory = [
      {
        id: gameState.history.length + 1,
        betAmount: gameState.betAmount,
        mineCount: gameState.mineCount,
        result: "win" as "win",
        profit: winAmount - gameState.betAmount,
        multiplier: multiplier,
        tiles: revealedTiles.length,
      },
      ...gameState.history,
    ];
    
    setGameState({
      ...gameState,
      isPlaying: false,
      balance: gameState.balance + winAmount,
      history: newHistory,
    });
    
    setWon(true);
    setGameOver(true);
    
    // Play win sound when cashing out
    console.log("Cashing out, playing win sound");
    SoundEffects.playWinSound();
  };
  
  const updateBetAmount = (amount: number) => {
    if (!gameState.isPlaying) {
      setGameState({
        ...gameState,
        betAmount: amount,
      });
    }
  };
  
  const updateMineCount = (count: number) => {
    if (!gameState.isPlaying) {
      setGameState({
        ...gameState,
        mineCount: count,
      });
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!gameState.isPlaying) {
      const newBalance = parseFloat(e.target.value);
      if (!isNaN(newBalance) && newBalance >= 0) {
        setDisplayBalance(newBalance);
        setGameState({
          ...gameState,
          balance: newBalance,
        });
      }
    }
  };

  const toggleMarkTile = (tileIndex: number) => {
    if (!gameState.isPlaying || revealedTiles.includes(tileIndex) || gameOver) {
      return;
    }
    
    // Right-click always ends the game with a bomb at the clicked position
    setGameOver(true);
    setWon(false);
    
    // Play bomb sound (not diamond) when hitting a mine
    console.log("Hit a mine, playing bomb sound");
    SoundEffects.playBombSound();
    
    const newHistory = [
      {
        id: gameState.history.length + 1,
        betAmount: gameState.betAmount,
        mineCount: gameState.mineCount,
        result: "loss" as "loss",
        profit: -gameState.betAmount,
        multiplier: 0,
        tiles: revealedTiles.length,
      },
      ...gameState.history,
    ];
    
    setGameState({
      ...gameState,
      isPlaying: false,
      history: newHistory,
    });
    
    // Replace the mines array with only the clicked tile to show a single bomb
    setMines([tileIndex]);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Profile and balance bar - centered layout */}
      <div className="mb-2 px-2 bg-gray-800 rounded-lg py-2">
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <div className="bg-gray-700 rounded-full p-1 mr-2">
              <svg viewBox="0 0 448 512" width="16" height="16" className="fill-current text-blue-400">
                <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" />
              </svg>
            </div>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Username"
              className="bg-gray-700 text-white px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-32 text-center font-semibold"
            />
          </div>
          
          <div className="flex items-center ml-3">
            <div className="bg-gray-700 rounded-full p-1 mr-2">
              <svg viewBox="0 0 320 512" width="14" height="14" className="fill-current text-yellow-400">
                <path d="M308 96c6.627 0 12-5.373 12-12V44c0-6.627-5.373-12-12-12H12C5.373 32 0 37.373 0 44v44.748c0 6.627 5.373 12 12 12h85.28c27.308 0 48.261 9.958 60.97 27.252H12c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h158.757c-6.217 36.086-32.961 58.632-74.757 58.632H12c-6.627 0-12 5.373-12 12v44c0 6.627 5.373 12 12 12h74.666c70.431 0 109.857-34.78 127.965-85.632H308c6.627 0 12-5.373 12-12V172c0-6.627-5.373-12-12-12h-89.34C203.798 139.308 187.698 120 161.666 120H12c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h81.869c3.519 0 7.874-.38 12.131-1.399V172c0-6.627 5.373-12 12-12h180c6.627 0 12-5.373 12-12v-52z" />
              </svg>
            </div>
            <input
              type="number"
              value={displayBalance}
              onChange={handleBalanceChange}
              disabled={gameState.isPlaying}
              title={gameState.isPlaying ? "Cannot change balance during game" : "Edit your balance"}
              className={`bg-gray-700 text-white px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 w-32 text-center font-semibold ${gameState.isPlaying ? 'opacity-80 cursor-not-allowed' : ''}`}
            />
          </div>
          
          {gameState.isPlaying && (
            <motion.div 
              className="ml-3 bg-green-700 rounded-lg px-3 py-1 text-sm"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <span className="text-gray-200 text-xs mr-1">Multiplier:</span>
              <span className="text-white font-bold">{currentMultiplier}x</span>
            </motion.div>
          )}
          
          {/* Sound Toggle Button */}
          <button 
            onClick={toggleSound}
            className="ml-3 bg-gray-700 rounded-full p-2 focus:outline-none hover:bg-gray-600"
            title={soundEnabled ? "Mute Sound" : "Unmute Sound"}
          >
            {soundEnabled ? (
              <svg viewBox="0 0 576 512" width="14" height="14" className="fill-current text-green-400">
                <path d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zm233.32-51.08c-11.17-7.33-26.18-4.24-33.51 6.95-7.34 11.17-4.22 26.18 6.95 33.51 66.27 43.49 105.82 116.6 105.82 195.58 0 78.98-39.55 152.09-105.82 195.58-11.17 7.32-14.29 22.34-6.95 33.5 7.04 10.71 21.93 14.56 33.51 6.95C528.27 439.58 576 351.33 576 256S528.27 72.43 448.35 19.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.53 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z" />
              </svg>
            ) : (
              <svg viewBox="0 0 512 512" width="14" height="14" className="fill-current text-gray-400">
                <path d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zM461.64 256l45.64-45.64c6.3-6.3 6.3-16.52 0-22.82l-22.82-22.82c-6.3-6.3-16.52-6.3-22.82 0L416 210.36l-45.64-45.64c-6.3-6.3-16.52-6.3-22.82 0l-22.82 22.82c-6.3 6.3-6.3 16.52 0 22.82L370.36 256l-45.63 45.63c-6.3 6.3-6.3 16.52 0 22.82l22.82 22.82c6.3 6.3 16.52 6.3 22.82 0L416 301.64l45.64 45.64c6.3 6.3 16.52 6.3 22.82 0l22.82-22.82c6.3-6.3 6.3-16.52 0-22.82L461.64 256z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 grid grid-cols-4 gap-2 h-full">
        {/* Game grid + controls */}
        <div className="col-span-3 flex flex-col">
          <div className="flex-1 bg-gray-800 rounded-lg p-3 overflow-hidden flex flex-col">
            <MineGrid 
              gridSize={gameState.gridSize}
              mines={gameOver ? mines : []}
              revealedTiles={revealedTiles}
              markedTiles={[]}
              onTileClick={revealTile}
              onTileRightClick={toggleMarkTile}
              gameOver={gameOver}
              isPlaying={gameState.isPlaying}
            />
            
            {gameOver && (
              <div className={`my-2 p-2 rounded-lg text-center text-sm ${won ? 'bg-green-800' : 'bg-red-800'}`}>
                <h2 className="text-lg font-bold">
                  {won ? 'You Won!' : 'You Lost!'}
                </h2>
                {won ? (
                  <p className="text-sm">
                    You won ₹{(gameState.betAmount * currentMultiplier - gameState.betAmount).toFixed(2)}!
                  </p>
                ) : (
                  <p className="text-sm">
                    You lost ₹{gameState.betAmount.toFixed(2)}!
                  </p>
                )}
              </div>
            )}
            
            <GameControls 
              betAmount={gameState.betAmount}
              mineCount={gameState.mineCount}
              isPlaying={gameState.isPlaying}
              onBetChange={updateBetAmount}
              onMineCountChange={updateMineCount}
              onStart={startGame}
              onCashout={() => cashout()}
            />
          </div>
        </div>
        
        {/* History sidebar */}
        <div className="col-span-1">
          <BetHistory history={gameState.history} />
        </div>
      </div>
    </div>
  );
};

export default Game; 