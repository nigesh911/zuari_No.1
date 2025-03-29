import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 py-6">
      <div className="container mx-auto px-4 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Jua Mining Game. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 