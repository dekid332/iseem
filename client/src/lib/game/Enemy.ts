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
    
    // Different enemy types
    const types: Array<'runner' | 'jumper' | 'tank'> = ['runner', 'jumper', 'tank'];
    this.type = types[Math.floor(Math.random() * types.length)];
    
    switch (this.type) {
      case 'runner':
        this.color = '#ff6b6b';
        this.speed *= 1.5;
        this.health = 1;
        break;
      case 'jumper':
        this.color = '#4ecdc4';
        this.speed *= 0.8;
        this.health = 1;
        break;
      case 'tank':
        this.color = '#45b7d1';
        this.speed *= 0.6;
        this.health = 3;
        this.width = 60;
        this.height = 60;
        break;
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
    
    // Draw enemy body
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Draw health bar for tanks
    if (this.type === 'tank' && this.health < this.maxHealth) {
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
    
    // Draw eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.x + this.width * 0.3, this.y + this.height * 0.3, 4, 0, Math.PI * 2);
    ctx.arc(this.x + this.width * 0.7, this.y + this.height * 0.3, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw pupils
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(this.x + this.width * 0.3, this.y + this.height * 0.3, 2, 0, Math.PI * 2);
    ctx.arc(this.x + this.width * 0.7, this.y + this.height * 0.3, 2, 0, Math.PI * 2);
    ctx.fill();
    
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
