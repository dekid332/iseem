import React from 'react';
import { Button } from './ui/button';

interface MainMenuProps {
  onStartGame: () => void;
  onShowLeaderboard: () => void;
}

export default function MainMenu({ onStartGame, onShowLeaderboard }: MainMenuProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center p-8 bg-black/30 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-wider">
            🎯 THE PROOPER
          </h1>
          <p className="text-xl text-purple-200 mb-2">
            Help Iseem defend against the escaping enemies!
          </p>
          <p className="text-lg text-blue-200">
            Shoot 💩 projectiles to stop them from escaping
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <Button 
            onClick={onStartGame}
            className="w-full py-4 text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg transform transition hover:scale-105"
          >
            🎮 START GAME
          </Button>
          
          <Button 
            onClick={onShowLeaderboard}
            className="w-full py-4 text-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-xl shadow-lg transform transition hover:scale-105"
          >
            🏆 LEADERBOARD
          </Button>
        </div>

        <div className="text-sm text-gray-300 space-y-2">
          <div className="flex items-center justify-center space-x-4">
            <span>🖱️ Mouse to aim</span>
            <span>🖱️ Click or Space to shoot</span>
          </div>
          <div>
            <span>Stop enemies from escaping to maintain your health!</span>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-8 text-sm text-purple-300">
          <div className="text-center">
            <div className="text-2xl">🏃</div>
            <div>Fast Runners</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">🦘</div>
            <div>Jumpers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">🛡️</div>
            <div>Tanks</div>
          </div>
        </div>
      </div>
    </div>
  );
}