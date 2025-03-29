import React from 'react';
import { GameHistoryItem } from '../types/game';

interface BetHistoryProps {
  history: GameHistoryItem[];
}

const BetHistory: React.FC<BetHistoryProps> = ({ history }) => {
  // Get the username from localStorage
  const getUsername = () => {
    const savedState = localStorage.getItem('miningGameState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        return parsed.username || 'Player';
      } catch (e) {
        return 'Player';
      }
    }
    return 'Player';
  };

  const username = getUsername();

  return (
    <div className="bg-gray-800 rounded-lg h-full p-2 overflow-hidden flex flex-col">
      <div className="flex items-center mb-1">
        <svg viewBox="0 0 512 512" width="10" height="10" className="text-blue-400 fill-current mr-1">
          <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm57.1 350.1L224.9 294c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v137.7l63.5 46.2c5.4 3.9 6.5 11.4 2.6 16.8l-28.2 38.8c-3.9 5.3-11.4 6.5-16.8 2.6z" />
        </svg>
        <h2 className="text-sm font-bold text-blue-400">{username}'s History</h2>
      </div>
      
      {history.length === 0 ? (
        <div className="text-center text-gray-400 text-xs py-4">
          No bets yet. Start playing!
        </div>
      ) : (
        <div className="space-y-1 flex-1 overflow-auto">
          {history.slice(0, 8).map((item) => (
            <div 
              key={item.id}
              className={`
                p-2 rounded-lg border-l-2 text-xs
                ${item.result === 'win' ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'}
              `}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {item.result === 'win' ? (
                    <svg viewBox="0 0 448 512" width="10" height="10" className="text-green-500 fill-current mr-1">
                      <path d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 448 512" width="10" height="10" className="text-red-500 fill-current mr-1">
                      <path d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z" />
                    </svg>
                  )}
                  <span className="font-semibold text-xs">Game #{item.id}</span>
                </div>
                <span 
                  className={`font-bold text-xs ${item.result === 'win' ? 'text-green-400' : 'text-red-400'}`}
                >
                  {item.result === 'win' ? '+' : ''}{item.profit.toFixed(2)}
                </span>
              </div>
              
              <div className="mt-1 grid grid-cols-3 text-xs text-gray-400">
                <div>
                  <div className="text-xs">Bet</div>
                  <div className="text-white text-xs">₹{item.betAmount.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs">Mines</div>
                  <div className="text-white text-xs">{item.mineCount}</div>
                </div>
                <div>
                  <div className="text-xs">Multi</div>
                  <div className="text-white text-xs">{item.multiplier}x</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BetHistory; 