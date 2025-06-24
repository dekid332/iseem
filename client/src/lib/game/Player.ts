import { Vector2D } from './GameState';

export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  gunAngle: number;
  gunLength: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.width = 80;
    this.height = 100;
    // Position player at bottom center
    this.x = canvasWidth / 2 - this.width / 2;
    this.y = canvasHeight - this.height - 20;
    this.gunAngle = 0;
    this.gunLength = 40;
  }

  updateAim(mouseX: number, mouseY: number): void {
    const gunTipX = this.x + this.width / 2;
    const gunTipY = this.y + 20; // Gun position on character
    
    this.gunAngle = Math.atan2(mouseY - gunTipY, mouseX - gunTipX);
  }

  getGunTip(): Vector2D {
    const gunTipX = this.x + this.width / 2 + Math.cos(this.gunAngle) * this.gunLength;
    const gunTipY = this.y + 20 + Math.sin(this.gunAngle) * this.gunLength;
    
    return { x: gunTipX, y: gunTipY };
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // Load and draw Iseem character image
    const iseemImg = new Image();
    iseemImg.src = '/assets/characters/iseem.png';
    
    // If image is loaded, draw it
    if (iseemImg.complete) {
      // Scale Iseem to be bigger since he's the main character
      const imgSize = Math.min(this.width, this.height) * 1.2;
      const imgX = this.x + (this.width - imgSize) / 2;
      const imgY = this.y + (this.height - imgSize) / 2;
      
      ctx.drawImage(iseemImg, imgX, imgY, imgSize, imgSize);
    } else {
      // Fallback drawing while image loads
      ctx.fillStyle = '#4a90e2';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('ISEEM', this.x + this.width / 2, this.y + this.height / 2);
    }
    
    // Draw "The Prooper" gun
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y + 20);
    const gunTip = this.getGunTip();
    ctx.lineTo(gunTip.x, gunTip.y);
    ctx.stroke();
    
    // Draw gun barrel
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.arc(gunTip.x, gunTip.y, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw character name
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Iseem', this.x + this.width / 2, this.y - 5);
  }
}
