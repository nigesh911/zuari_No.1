import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-400">Jua Mining Game</div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-gray-300 hover:text-white">Game</Link>
            </li>
            <li>
              <Link to="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 