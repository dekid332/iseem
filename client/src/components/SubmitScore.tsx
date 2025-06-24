import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { GameState } from '../lib/game/GameState';

interface SubmitScoreProps {
  gameState: GameState;
  onSubmitSuccess: () => void;
  onSkip: () => void;
}

export default function SubmitScore({ gameState, onSubmitSuccess, onSkip }: SubmitScoreProps) {
  const [username, setUsername] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          walletAddress: walletAddress.trim() || null,
          score: gameState.score,
          level: gameState.level,
          enemiesKilled: gameState.enemiesKilled,
          gameTime: gameState.gameTime,
        }),
      });

      if (response.ok) {
        onSubmitSuccess();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to submit score');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black/40 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
        <div className="p-6 text-center border-b border-white/20">
          <div className="text-6xl mb-4">💀</div>
          <h1 className="text-3xl font-bold text-white mb-2">GAME OVER!</h1>
          <p className="text-gray-300">Your journey with The Prooper has ended</p>
        </div>

        <div className="p-6">
          {/* Game Stats */}
          <div className="bg-white/10 rounded-xl p-4 mb-6">
            <h3 className="text-white font-bold text-lg mb-3 text-center">Final Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">{gameState.score.toLocaleString()}</div>
                <div className="text-sm text-gray-300">Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{gameState.level}</div>
                <div className="text-sm text-gray-300">Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{gameState.enemiesKilled}</div>
                <div className="text-sm text-gray-300">Enemies</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{formatTime(gameState.gameTime)}</div>
                <div className="text-sm text-gray-300">Time</div>
              </div>
            </div>
          </div>

          {/* Submit Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-bold mb-2">
                Username *
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400"
                maxLength={20}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-white text-sm font-bold mb-2">
                Solana Wallet Address (optional)
              </label>
              <Input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Your Solana wallet address"
                className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 font-mono text-sm"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-400 mt-1">
                Optional: For future rewards and NFT drops
              </p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !username.trim()}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : '🏆 Submit Score'}
              </Button>

              <Button
                type="button"
                onClick={onSkip}
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold rounded-xl"
              >
                Skip & Continue
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}