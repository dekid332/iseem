import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { LeaderboardEntry } from '../lib/game/GameState';
import { getLeaderboard } from '../lib/queryClient';

interface LeaderboardProps {
  onBack: () => void;
}

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const data = await getLeaderboard();
      setLeaderboardData(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatWallet = (wallet: string) => {
    if (!wallet) return 'N/A';
    return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-black/30 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-white tracking-wider">
              🏆 LEADERBOARD
            </h1>
            <Button 
              onClick={onBack}
              className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg"
            >
              ← Back to Menu
            </Button>
          </div>
          <p className="text-purple-200 mt-2">Top players in The Prooper</p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center text-white text-xl">Loading leaderboard...</div>
          ) : leaderboardData.length === 0 ? (
            <div className="text-center text-gray-300">
              <div className="text-6xl mb-4">🎯</div>
              <div className="text-xl">No scores yet!</div>
              <div className="text-sm mt-2">Be the first to set a high score</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-2 text-purple-300">Rank</th>
                    <th className="text-left py-3 px-2 text-purple-300">Player</th>
                    <th className="text-left py-3 px-2 text-purple-300">Score</th>
                    <th className="text-left py-3 px-2 text-purple-300">Level</th>
                    <th className="text-left py-3 px-2 text-purple-300">Kills</th>
                    <th className="text-left py-3 px-2 text-purple-300">Time</th>
                    <th className="text-left py-3 px-2 text-purple-300">Wallet</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry, index) => (
                    <tr 
                      key={entry.id} 
                      className={`border-b border-white/10 ${
                        index < 3 ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10' : ''
                      }`}
                    >
                      <td className="py-4 px-2">
                        <div className="flex items-center">
                          {index === 0 && <span className="text-2xl mr-2">🥇</span>}
                          {index === 1 && <span className="text-2xl mr-2">🥈</span>}
                          {index === 2 && <span className="text-2xl mr-2">🥉</span>}
                          <span className="font-bold">{index + 1}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 font-bold">{entry.username}</td>
                      <td className="py-4 px-2 text-green-400 font-bold">{entry.score.toLocaleString()}</td>
                      <td className="py-4 px-2">{entry.level}</td>
                      <td className="py-4 px-2">{entry.enemies_killed || entry.enemiesKilled}</td>
                      <td className="py-4 px-2">{formatTime(entry.game_time || entry.gameTime)}</td>
                      <td className="py-4 px-2 text-blue-400 font-mono">
                        {formatWallet(entry.wallet_address || entry.walletAddress || '')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}