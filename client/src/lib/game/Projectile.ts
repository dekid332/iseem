import { GameObject, Vector2D } from './GameState';

export class Projectile implements GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
  velocity: Vector2D;
  speed: number;
  rotation: number;

  constructor(startX: number, startY: number, targetX: number, targetY: number) {
    this.x = startX;
    this.y = startY;
    this.width = 16;
    this.height = 16;
    this.active = true;
    this.speed = 8;
    this.rotation = 0;
    
    // Calculate direction vector
    const dx = targetX - startX;
    const dy = targetY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize direction and apply speed
    this.velocity = {
      x: (dx / distance) * this.speed,
      y: (dy / distance) * this.speed
    };
  }

  update(canvasWidth: number, canvasHeight: number): void {
    if (!this.active) return;
    
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.rotation += 0.2; // Spin the projectile
    
    // Deactivate if out of bounds
    if (this.x < -50 || this.x > canvasWidth + 50 || 
        this.y < -50 || this.y > canvasHeight + 50) {
      this.active = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;
    
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);
    
    // Draw poop emoji as text
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💩', 0, 0);
    
    ctx.restore();
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}
