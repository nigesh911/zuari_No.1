import React from 'react';
import { motion } from 'framer-motion';

interface GameControlsProps {
  betAmount: number;
  mineCount: number;
  isPlaying: boolean;
  onBetChange: (amount: number) => void;
  onMineCountChange: (count: number) => void;
  onStart: () => void;
  onCashout: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  betAmount,
  mineCount,
  isPlaying,
  onBetChange,
  onMineCountChange,
  onStart,
  onCashout,
}) => {
  const betOptions = [5, 10, 25, 50, 100];
  const mineOptions = [1, 3, 5, 10, 15, 20];
  
  return (
    <div className="mt-auto bg-gray-700 rounded-lg p-2">
      <div className="grid grid-cols-2 gap-2">
        {/* Left Side - Bet Controls */}
        <div>
          <h3 className="text-xs font-semibold text-blue-300 mb-1">Bet Amount</h3>
          <div className="flex flex-wrap gap-1 mb-2">
            {betOptions.map((amount) => (
              <button
                key={amount}
                className={`px-2 py-1 rounded-md text-xs ${
                  betAmount === amount
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !isPlaying && onBetChange(amount)}
                disabled={isPlaying}
              >
                ₹{amount}
              </button>
            ))}
          </div>
          
          <h3 className="text-xs font-semibold text-blue-300 mb-1">Mine Count</h3>
          <div className="flex flex-wrap gap-1">
            {mineOptions.map((count) => (
              <button
                key={count}
                className={`px-2 py-1 rounded-md text-xs ${
                  mineCount === count
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !isPlaying && onMineCountChange(count)}
                disabled={isPlaying}
              >
                {count}
              </button>
            ))}
          </div>
        </div>
        
        {/* Right Side - Action Buttons */}
        <div className="flex flex-col justify-between">
          {!isPlaying ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md text-sm flex items-center justify-center"
              onClick={onStart}
            >
              <svg viewBox="0 0 448 512" width="12" height="12" className="fill-current text-white mr-1">
                <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
              </svg> Start Game
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md text-sm flex items-center justify-center"
              onClick={onCashout}
              animate={{ 
                boxShadow: ['0px 0px 0px rgba(255,255,255,0)', '0px 0px 15px rgba(255,255,255,0.5)', '0px 0px 0px rgba(255,255,255,0)'] 
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <svg viewBox="0 0 512 512" width="12" height="12" className="fill-current text-white mr-1">
                <path d="M0 405.3V448c0 35.3 86 64 192 64s192-28.7 192-64v-42.7C342.7 434.4 267.2 448 192 448S41.3 434.4 0 405.3zM320 128c106 0 192-28.7 192-64S426 0 320 0 128 28.7 128 64s86 64 192 64zM0 300.4V352c0 35.3 86 64 192 64s192-28.7 192-64v-51.6c-41.3 34-116.9 51.6-192 51.6S41.3 334.4 0 300.4zm416 11.7c0-35.3-86-64-192-64S32 276.8 32 312.1v39.7c0 35.3 86 64 192 64s192-28.7 192-64v-39.7z"/>
              </svg> Cash Out
            </motion.button>
          )}
          
          <div className="bg-gray-800 rounded-md p-2 text-center mt-2">
            <div className="text-gray-400 text-xs">Bet: <span className="text-white font-bold text-sm">₹{betAmount.toFixed(2)}</span></div>
            <div className="text-gray-400 text-xs">Mines: <span className="text-red-400 font-bold text-sm">{mineCount}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameControls; 