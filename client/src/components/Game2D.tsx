import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../lib/game/GameEngine';
import { GameState, GamePhase } from '../lib/game/GameState';
import MainMenu from './MainMenu';
import Leaderboard from './Leaderboard';
import SubmitScore from './SubmitScore';

const Game2D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    phase: 'menu',
    score: 0,
    health: 100,
    level: 1,
    enemiesKilled: 0,
    gameTime: 0
  });

  // Add logging when game state changes
  useEffect(() => {
    console.log('Game state changed:', gameState);
  }, [gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    // Set canvas size to fill window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      console.log('Canvas resized to:', canvas.width, 'x', canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    try {
      // Initialize game engine
      console.log('Initializing game engine...');
      gameEngineRef.current = new GameEngine(canvas, setGameState);
      console.log('Game engine initialized successfully');
    } catch (error) {
      console.error('Failed to initialize game engine:', error);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (gameEngineRef.current) {
        gameEngineRef.current.destroy();
      }
    };
  }, []);

  const startGame = () => {
    console.log('Start game button clicked, current phase:', gameState.phase);
    if (gameEngineRef.current) {
      gameEngineRef.current.start();
    } else {
      console.error('Game engine not initialized');
    }
  };

  const restartGame = () => {
    console.log('Restart game button clicked');
    if (gameEngineRef.current) {
      gameEngineRef.current.restart();
    }
  };

  const goToMenu = () => {
    console.log('Go to menu button clicked');
    if (gameEngineRef.current) {
      gameEngineRef.current.goToMenu();
    }
  };

  const showLeaderboard = () => {
    console.log('Show leaderboard button clicked, current phase:', gameState.phase);
    if (gameEngineRef.current) {
      gameEngineRef.current.showLeaderboard();
    } else {
      console.error('Game engine not initialized');
    }
  };

  const handleSubmitSuccess = () => {
    showLeaderboard();
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Canvas always rendered for GameEngine initialization */}
      <canvas 
        ref={canvasRef} 
        style={{ 
          display: gameState.phase === 'playing' || gameState.phase === 'ready' ? 'block' : 'none',
          width: '100%', 
          height: '100%' 
        }} 
      />

      {/* Render different phases as overlays */}
      {gameState.phase === 'menu' && (
        <MainMenu onStartGame={startGame} onShowLeaderboard={showLeaderboard} />
      )}

      {gameState.phase === 'leaderboard' && (
        <Leaderboard onBack={goToMenu} />
      )}

      {gameState.phase === 'submit-score' && (
        <SubmitScore 
          gameState={gameState} 
          onSubmitSuccess={handleSubmitSuccess}
          onSkip={goToMenu}
        />
      )}
      
      {/* Game UI for playing and ready states */}
      {(gameState.phase === 'playing' || gameState.phase === 'ready' || gameState.phase === 'ended') && (
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
              <button onClick={() => {
                if (gameEngineRef.current) {
                  gameEngineRef.current.gameState.phase = 'playing';
                  gameEngineRef.current.gameLoop = requestAnimationFrame(gameEngineRef.current.gameUpdate);
                }
              }}>Start Game</button>
              <button onClick={goToMenu} style={{ marginLeft: '10px' }}>Back to Menu</button>
            </div>
          )}

          {gameState.phase === 'ended' && (
            <div className="game-over">
              <h1>💀 Game Over!</h1>
              <p>Final Score: {gameState.score}</p>
              <p>Enemies Defeated: {gameState.enemiesKilled}</p>
              <p>Level Reached: {gameState.level}</p>
              <button onClick={restartGame}>Play Again</button>
              <button onClick={goToMenu} style={{ marginLeft: '10px' }}>Main Menu</button>
            </div>
          )}

          <div className="controls">
            <div>🎮 Controls:</div>
            <div>🖱️ Mouse - Aim</div>
            <div>🖱️ Click or Space - Shoot</div>
            <div>🎯 Stop enemies from escaping!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game2D;
