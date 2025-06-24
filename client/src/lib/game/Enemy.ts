import { GameObject, Vector2D } from './GameState';

export class Enemy implements GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
  speed: number;
  direction: Vector2D;
  color: string;
  type: 'runner' | 'jumper' | 'tank';
  health: number;
  maxHealth: number;

  character: string;

  constructor(canvasWidth: number, canvasHeight: number, level: number) {
    this.width = 40;
    this.height = 40;
    this.active = true;
    this.speed = 2 + level * 0.5; // Increase speed with level
    
    // Randomly spawn from left or right side
    const fromLeft = Math.random() < 0.5;
    this.x = fromLeft ? -this.width : canvasWidth;
    this.y = Math.random() * (canvasHeight - 200) + 50; // Avoid spawning too close to player
    
    // Move towards opposite side
    this.direction = { x: fromLeft ? 1 : -1, y: 0 };
    
    // Add some randomness to movement
    if (Math.random() < 0.3) {
      this.direction.y = (Math.random() - 0.5) * 0.5;
    }
    
    // Different enemy types with character assignments
    const enemyTypes = [
      { type: 'runner', character: 'colt', color: '#ff6b6b', speedMult: 1.5, health: 1 },
      { type: 'jumper', character: 'soljakey', color: '#4ecdc4', speedMult: 0.8, health: 1 },
      { type: 'tank', character: 'whish', color: '#45b7d1', speedMult: 0.6, health: 3 },
      { type: 'runner', character: 'pete', color: '#ff9f43', speedMult: 1.2, health: 2 }
    ];
    
    const enemyConfig = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    this.type = enemyConfig.type as 'runner' | 'jumper' | 'tank';
    this.character = enemyConfig.character;
    this.color = enemyConfig.color;
    this.speed *= enemyConfig.speedMult;
    this.health = enemyConfig.health;
    
    if (this.type === 'tank') {
      this.width = 60;
      this.height = 60;
    }
    
    this.maxHealth = this.health;
  }

  update(canvasWidth: number, canvasHeight: number): void {
    if (!this.active) return;
    
    // Move enemy
    this.x += this.direction.x * this.speed;
    this.y += this.direction.y * this.speed;
    
    // Jumper special movement
    if (this.type === 'jumper') {
      this.y += Math.sin(Date.now() * 0.01) * 2;
    }
    
    // Keep within canvas bounds vertically
    if (this.y < 0) this.y = 0;
    if (this.y > canvasHeight - this.height - 100) this.y = canvasHeight - this.height - 100;
    
    // Deactivate if escaped
    if (this.x > canvasWidth + 50 || this.x < -this.width - 50) {
      this.active = false;
    }
  }

  takeDamage(): boolean {
    this.health--;
    return this.health <= 0;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;
    
    // Load and draw character image
    const characterImg = new Image();
    characterImg.src = `/assets/characters/${this.character}.png`;
    
    if (characterImg.complete) {
      const imgSize = Math.min(this.width, this.height);
      const imgX = this.x + (this.width - imgSize) / 2;
      const imgY = this.y + (this.height - imgSize) / 2;
      
      ctx.drawImage(characterImg, imgX, imgY, imgSize, imgSize);
    } else {
      // Fallback drawing while image loads
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 8px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(this.character.toUpperCase(), this.x + this.width / 2, this.y + this.height / 2);
    }
    
    // Draw health bar for damaged enemies
    if (this.health < this.maxHealth) {
      const barWidth = this.width;
      const barHeight = 4;
      
      // Background
      ctx.fillStyle = '#333';
      ctx.fillRect(this.x, this.y - 8, barWidth, barHeight);
      
      // Health
      ctx.fillStyle = '#4ade80';
      const healthPercent = this.health / this.maxHealth;
      ctx.fillRect(this.x, this.y - 8, barWidth * healthPercent, barHeight);
    }
    
    // Draw type indicator
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px Inter';
    ctx.textAlign = 'center';
    let label = '';
    switch (this.type) {
      case 'runner': label = '💨'; break;
      case 'jumper': label = '🦘'; break;
      case 'tank': label = '🛡️'; break;
    }
    ctx.fillText(label, this.x + this.width / 2, this.y + this.height + 15);
  }
}
