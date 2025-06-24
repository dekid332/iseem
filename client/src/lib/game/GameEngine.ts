import { Player } from './Player';
import { Enemy } from './Enemy';
import { Projectile } from './Projectile';
import { CollisionDetection } from './CollisionDetection';
import { ParticleSystem } from './ParticleSystem';
import { SoundManager } from './SoundManager';
import { InputManager } from './InputManager';
import { GameState, GamePhase } from './GameState';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private player: Player;
  private enemies: Enemy[] = [];
  private projectiles: Projectile[] = [];
  private particleSystem: ParticleSystem;
  private soundManager: SoundManager;
  private inputManager: InputManager;
  
  private gameState: GameState = {
    phase: 'menu',
    score: 0,
    health: 100,
    level: 1,
    enemiesKilled: 0,
    gameTime: 0
  };
  
  private gameStartTime: number = 0;
  
  private updateGameState: (state: GameState) => void;
  private gameLoop: number | null = null;
  private lastEnemySpawn: number = 0;
  private enemySpawnRate: number = 2000; // milliseconds
  private lastTime: number = 0;

  constructor(canvas: HTMLCanvasElement, updateStateCallback: (state: GameState) => void) {
    this.canvas = canvas;
    this.updateGameState = updateStateCallback;
    
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Unable to get 2D context from canvas');
    }
    this.ctx = context;
    
    this.player = new Player(canvas.width, canvas.height);
    this.particleSystem = new ParticleSystem();
    this.soundManager = new SoundManager();
    this.inputManager = new InputManager(canvas);
    
    this.setupInputHandlers();
    this.updateGameState(this.gameState);
  }

  private setupInputHandlers(): void {
    this.inputManager.onMouseMove = (x: number, y: number) => {
      if (this.gameState.phase === 'playing') {
        this.player.updateAim(x, y);
      }
    };
    
    this.inputManager.onShoot = () => {
      if (this.gameState.phase === 'playing') {
        this.shoot();
      }
    };
  }

  private shoot(): void {
    const gunTip = this.player.getGunTip();
    const mousePos = this.inputManager.getMousePosition();
    
    const projectile = new Projectile(gunTip.x, gunTip.y, mousePos.x, mousePos.y);
    this.projectiles.push(projectile);
    
    console.log(`Shot fired! Projectiles: ${this.projectiles.length}`);
  }

  private spawnEnemy(): void {
    const now = Date.now();
    if (now - this.lastEnemySpawn > this.enemySpawnRate) {
      const enemy = new Enemy(this.canvas.width, this.canvas.height, this.gameState.level);
      this.enemies.push(enemy);
      this.lastEnemySpawn = now;
      
      console.log(`Enemy spawned! Total enemies: ${this.enemies.length}`);
    }
  }

  private updateEnemies(): void {
    this.enemies.forEach(enemy => {
      const wasActive = enemy.active;
      enemy.update(this.canvas.width, this.canvas.height);
      
      // Check if enemy escaped
      if (wasActive && !enemy.active) {
        this.gameState.health -= 10;
        this.particleSystem.createEscapeEffect(
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height / 2
        );
        
        console.log(`Enemy escaped! Health: ${this.gameState.health}`);
        
        if (this.gameState.health <= 0) {
          this.endGame();
        }
      }
    });
    
    // Remove inactive enemies
    this.enemies = this.enemies.filter(enemy => enemy.active);
  }

  private updateProjectiles(): void {
    this.projectiles.forEach(projectile => {
      projectile.update(this.canvas.width, this.canvas.height);
    });
    
    // Remove inactive projectiles
    this.projectiles = this.projectiles.filter(projectile => projectile.active);
  }

  private checkCollisions(): void {
    this.projectiles.forEach(projectile => {
      if (!projectile.active) return;
      
      this.enemies.forEach(enemy => {
        if (!enemy.active) return;
        
        if (CollisionDetection.checkAABB(projectile, enemy)) {
          // Hit!
          projectile.active = false;
          
          const enemyKilled = enemy.takeDamage();
          
          if (enemyKilled) {
            enemy.active = false;
            this.gameState.score += this.getScoreForEnemyType(enemy.type);
            this.gameState.enemiesKilled++;
            
            this.particleSystem.createExplosion(
              enemy.x + enemy.width / 2,
              enemy.y + enemy.height / 2,
              enemy.color
            );
            
            this.soundManager.playSuccess();
            console.log(`Enemy killed! Score: ${this.gameState.score}`);
          } else {
            this.particleSystem.createHitEffect(
              enemy.x + enemy.width / 2,
              enemy.y + enemy.height / 2
            );
            
            this.soundManager.playHit();
            console.log(`Enemy hit! Health remaining: ${enemy.health}`);
          }
        }
      });
    });
  }

  private getScoreForEnemyType(type: string): number {
    switch (type) {
      case 'runner': return 10;
      case 'jumper': return 15;
      case 'tank': return 25;
      default: return 10;
    }
  }

  private updateLevel(): void {
    const newLevel = Math.floor(this.gameState.score / 200) + 1;
    if (newLevel > this.gameState.level) {
      this.gameState.level = newLevel;
      this.enemySpawnRate = Math.max(800, 2000 - (newLevel * 100)); // Faster spawning
      console.log(`Level up! New level: ${this.gameState.level}`);
    }
  }

  private render(): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(1, '#98FB98'); // Light green
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw ground
    this.ctx.fillStyle = '#8B4513';
    this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);
    
    // Draw game objects
    this.player.draw(this.ctx);
    
    this.enemies.forEach(enemy => enemy.draw(this.ctx));
    this.projectiles.forEach(projectile => projectile.draw(this.ctx));
    
    this.particleSystem.draw(this.ctx);
    
    // Draw crosshair
    const mousePos = this.inputManager.getMousePosition();
    this.drawCrosshair(mousePos.x, mousePos.y);
  }

  private drawCrosshair(x: number, y: number): void {
    this.ctx.strokeStyle = '#ff0000';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 5]);
    
    this.ctx.beginPath();
    this.ctx.moveTo(x - 10, y);
    this.ctx.lineTo(x + 10, y);
    this.ctx.moveTo(x, y - 10);
    this.ctx.lineTo(x, y + 10);
    this.ctx.stroke();
    
    this.ctx.setLineDash([]);
  }

  private gameUpdate = (currentTime: number): void => {
    if (this.gameState.phase !== 'playing') return;
    
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    // Update game time
    this.gameState.gameTime = Math.floor((currentTime - this.gameStartTime) / 1000);
    
    // Spawn enemies
    this.spawnEnemy();
    
    // Update game objects
    this.updateEnemies();
    this.updateProjectiles();
    this.checkCollisions();
    this.updateLevel();
    
    // Update particles
    this.particleSystem.update();
    
    // Update game state
    this.updateGameState({ ...this.gameState });
    
    // Render
    this.render();
    
    // Continue game loop
    this.gameLoop = requestAnimationFrame(this.gameUpdate);
  };

  start(): void {
    console.log('Starting game...');
    this.gameState.phase = 'playing';
    this.lastTime = performance.now();
    this.gameStartTime = performance.now();
    this.lastEnemySpawn = Date.now();
    
    // Enable sound (user interaction required)
    this.soundManager.setMuted(false);
    
    this.updateGameState(this.gameState);
    this.gameLoop = requestAnimationFrame(this.gameUpdate);
  }

  restart(): void {
    console.log('Restarting game...');
    this.stop();
    
    // Reset game state
    this.gameState = {
      phase: 'ready',
      score: 0,
      health: 100,
      level: 1,
      enemiesKilled: 0,
      gameTime: 0
    };
    
    // Clear game objects
    this.enemies = [];
    this.projectiles = [];
    this.particleSystem = new ParticleSystem();
    
    // Reset spawn rate
    this.enemySpawnRate = 2000;
    
    // Update player position for new canvas size
    this.player = new Player(this.canvas.width, this.canvas.height);
    
    this.updateGameState(this.gameState);
  }

  goToMenu(): void {
    this.stop();
    this.gameState.phase = 'menu';
    this.updateGameState(this.gameState);
  }

  showLeaderboard(): void {
    this.stop();
    this.gameState.phase = 'leaderboard';
    this.updateGameState(this.gameState);
  }

  showSubmitScore(): void {
    this.stop();
    this.gameState.phase = 'submit-score';
    this.updateGameState(this.gameState);
  }

  private endGame(): void {
    console.log('Game over!');
    this.gameState.phase = 'submit-score';
    this.stop();
    this.updateGameState(this.gameState);
  }

  private stop(): void {
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
    }
    
    this.soundManager.stopBackgroundMusic();
  }

  destroy(): void {
    this.stop();
    this.inputManager.destroy();
  }
}
