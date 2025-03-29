import React from 'react';
import { motion } from 'framer-motion';

interface MineGridProps {
  gridSize: number;
  mines: number[];
  revealedTiles: number[];
  markedTiles: number[];
  onTileClick: (index: number) => void;
  onTileRightClick: (index: number) => void;
  gameOver: boolean;
  isPlaying: boolean;
}

const MineGrid: React.FC<MineGridProps> = ({
  gridSize,
  mines,
  revealedTiles,
  markedTiles,
  onTileClick,
  onTileRightClick,
  gameOver,
  isPlaying,
}) => {
  const renderTile = (index: number) => {
    const isRevealed = revealedTiles.includes(index);
    const isMarked = markedTiles.includes(index);
    const isMine = mines.includes(index);
    
    const handleRightClick = (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent context menu
      onTileRightClick(index);
    };
    
    return (
      <motion.div
        key={index}
        className={`
          aspect-square rounded-md shadow-sm cursor-pointer flex items-center justify-center
          ${!isPlaying && !isRevealed && !isMine ? 'bg-gray-700 cursor-not-allowed' : ''}
          ${isRevealed && !isMine ? 'bg-green-600' : ''}
          ${!isRevealed && !isMarked && isPlaying ? 'bg-blue-800 hover:bg-blue-700' : ''}
          ${gameOver && isMine ? 'bg-red-600' : ''}
        `}
        whileHover={isPlaying && !isRevealed && !gameOver ? { scale: 1.05 } : {}}
        whileTap={isPlaying && !isRevealed && !gameOver ? { scale: 0.95 } : {}}
        onClick={() => onTileClick(index)}
        onContextMenu={handleRightClick}
        animate={gameOver && isMine ? { rotate: [0, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.3 }}
      >
        {isRevealed && !isMine && (
          <svg viewBox="0 0 512 512" width="16" height="16" className="text-white fill-current">
            <path d="M378.7 32H133.3L32 256l101.3 224h245.4L480 256 378.7 32zm-75.3 325.8l-28.6-15c-10.4 6.8-21.9 11.8-33.9 14.9V384c0 8.8-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16v-26.3c-12-3.1-23.6-8.1-34-14.9l-28.6 15c-7.7 4-17.5 1-21.5-6.7l-16-27.7c-4-7.7-1-17.5 6.7-21.5l29.1-15.2c-1.6-7.5-2.4-15.3-2.4-23.3s.8-15.8 2.4-23.3l-29.1-15.2c-7.7-4-10.7-13.8-6.7-21.5l16-27.7c4-7.7 13.8-10.7 21.5-6.7l28.6 15c10.4-6.8 21.9-11.8 33.9-14.9V144c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v26.3c12 3.1 23.5 8.1 33.9 14.9l28.6-15c7.7-4 17.5-1 21.5 6.7l16 27.7c4 7.7 1 17.5-6.7 21.5l-29.1 15.2c1.6 7.5 2.4 15.3 2.4 23.3s-.8 15.8-2.4 23.3l29.1 15.2c7.7 4 10.7 13.8 6.7 21.5l-16 27.7c-4 7.7-13.8 10.6-21.5 6.7z" />
          </svg>
        )}
        {gameOver && isMine && (
          <svg viewBox="0 0 512 512" width="16" height="16" className="text-white fill-current">
            <path d="M440.5 88.5l-52 52L415 167c9.4 9.4 9.4 24.6 0 33.9l-17.4 17.4c11.8 26.1 18.4 55.1 18.4 85.6 0 114.9-93.1 208-208 208S0 418.9 0 304 93.1 96 208 96c30.5 0 59.5 6.6 85.6 18.4L311 97c9.4-9.4 24.6-9.4 33.9 0l26.5 26.5 52-52 17.1 17zM500 60h-24c-6.6 0-12 5.4-12 12s5.4 12 12 12h24c6.6 0 12-5.4 12-12s-5.4-12-12-12zM440 0c-6.6 0-12 5.4-12 12v24c0 6.6 5.4 12 12 12s12-5.4 12-12V12c0-6.6-5.4-12-12-12zm33.9 55l17-17c4.7-4.7 4.7-12.3 0-17-4.7-4.7-12.3-4.7-17 0l-17 17c-4.7 4.7-4.7 12.3 0 17 4.8 4.7 12.4 4.7 17 0zm-67.8 0c4.7 4.7 12.3 4.7 17 0 4.7-4.7 4.7-12.3 0-17l-17-17c-4.7-4.7-12.3-4.7-17 0-4.7 4.7-4.7 12.3 0 17l17 17zm67.8 34c-4.7-4.7-12.3-4.7-17 0-4.7 4.7-4.7 12.3 0 17l17 17c4.7 4.7 12.3 4.7 17 0 4.7-4.7 4.7-12.3 0-17l-17-17zM112 272c0-35.3 28.7-64 64-64 8.8 0 16-7.2 16-16s-7.2-16-16-16c-52.9 0-96 43.1-96 96 0 8.8 7.2 16 16 16s16-7.2 16-16z" />
          </svg>
        )}
      </motion.div>
    );
  };

  const grid = [];
  const totalTiles = gridSize * gridSize;
  
  for (let i = 0; i < totalTiles; i++) {
    grid.push(renderTile(i));
  }

  return (
    <div 
      className="grid gap-1 mx-auto flex-1"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
      }}
    >
      {grid}
    </div>
  );
};

export default MineGrid; 