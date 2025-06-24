import { Vector2D } from './GameState';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'explosion' | 'hit' | 'escape';
}

export class ParticleSystem {
  particles: Particle[] = [];

  createExplosion(x: number, y: number, color: string = '#ff6b6b'): void {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const speed = 3 + Math.random() * 2;
      
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 30,
        maxLife: 30,
        color,
        size: 4 + Math.random() * 4,
        type: 'explosion'
      });
    }
  }

  createHitEffect(x: number, y: number): void {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 20,
        maxLife: 20,
        color: '#ffd700',
        size: 2 + Math.random() * 3,
        type: 'hit'
      });
    }
  }

  createEscapeEffect(x: number, y: number): void {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 3 - 1,
        life: 40,
        maxLife: 40,
        color: '#ff4444',
        size: 3 + Math.random() * 2,
        type: 'escape'
      });
    }
  }

  update(): void {
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
      
      // Add gravity to explosion particles
      if (particle.type === 'explosion') {
        particle.vy += 0.1;
      }
      
      return particle.life > 0;
    });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      
      if (particle.type === 'hit') {
        // Draw star shape for hit effects
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5;
          const x = particle.x + Math.cos(angle) * particle.size;
          const y = particle.y + Math.sin(angle) * particle.size;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        // Draw circle for other effects
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    });
  }
}
