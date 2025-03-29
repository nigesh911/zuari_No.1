import React from 'react';

const Dashboard: React.FC = () => {
  // Example stats - these would be connected to actual game state in a full implementation
  const stats = {
    totalPlayed: 100,
    wins: 42,
    losses: 58,
    highestWin: 5.2,
    currentBalance: 1250.75,
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-blue-300">Total Games</h2>
          <p className="text-4xl font-bold text-white mt-2">{stats.totalPlayed}</p>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-green-300">Wins</h2>
          <p className="text-4xl font-bold text-white mt-2">{stats.wins}</p>
          <p className="text-gray-400 text-sm">{(stats.wins / stats.totalPlayed * 100).toFixed(1)}% win rate</p>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-red-300">Losses</h2>
          <p className="text-4xl font-bold text-white mt-2">{stats.losses}</p>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-yellow-300">Highest Win</h2>
          <p className="text-4xl font-bold text-white mt-2">{stats.highestWin}x</p>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4 md:col-span-2">
          <h2 className="text-xl font-semibold text-purple-300">Balance</h2>
          <p className="text-4xl font-bold text-white mt-2">${stats.currentBalance.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="mt-8 bg-gray-700 rounded-lg p-4">
        <h2 className="text-xl font-semibold text-blue-300 mb-4">Recent Activity</h2>
        <div className="divide-y divide-gray-600">
          <div className="py-3 flex justify-between">
            <span>Game #100</span>
            <span className="text-red-400">Lost $25.00</span>
          </div>
          <div className="py-3 flex justify-between">
            <span>Game #99</span>
            <span className="text-green-400">Won $125.50</span>
          </div>
          <div className="py-3 flex justify-between">
            <span>Game #98</span>
            <span className="text-green-400">Won $50.25</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 