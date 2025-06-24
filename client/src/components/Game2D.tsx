import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../lib/game/GameEngine';
import { GameState, GamePhase } from '../lib/game/GameState';

const Game2D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    phase: 'ready',
    score: 0,
    health: 100,
    level: 1,
    enemiesKilled: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size to fill window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize game engine
    gameEngineRef.current = new GameEngine(canvas, setGameState);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (gameEngineRef.current) {
        gameEngineRef.current.destroy();
      }
    };
  }, []);

  const startGame = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.start();
    }
  };

  const restartGame = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.restart();
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <canvas ref={canvasRef} />
      
      <div className="game-ui">
        <div className="hud">
          <div>
            <div>Score: {gameState.score}</div>
            <div>Level: {gameState.level}</div>
          </div>
          <div>
            <div>Health: {gameState.health}</div>
            <div>Kills: {gameState.enemiesKilled}</div>
          </div>
        </div>

        {gameState.phase === 'ready' && (
          <div className="game-over">
            <h1>🎯 The Prooper Shooter</h1>
            <p>Iseem needs your help to stop the escaping enemies!</p>
            <p>Use your mouse to aim and click or press spacebar to shoot 💩</p>
            <button onClick={startGame}>Start Game</button>
          </div>
        )}

        {gameState.phase === 'ended' && (
          <div className="game-over">
            <h1>💀 Game Over!</h1>
            <p>Final Score: {gameState.score}</p>
            <p>Enemies Defeated: {gameState.enemiesKilled}</p>
            <p>Level Reached: {gameState.level}</p>
            <button onClick={restartGame}>Play Again</button>
          </div>
        )}

        <div className="controls">
          <div>🎮 Controls:</div>
          <div>🖱️ Mouse - Aim</div>
          <div>🖱️ Click or Space - Shoot</div>
          <div>🎯 Stop enemies from escaping!</div>
        </div>
      </div>
    </div>
  );
};

export default Game2D;
