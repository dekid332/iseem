import { GameObject } from './GameState';

export class CollisionDetection {
  static checkAABB(a: GameObject, b: GameObject): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  static checkCircleAABB(
    circleX: number,
    circleY: number,
    radius: number,
    rect: GameObject
  ): boolean {
    const distX = Math.abs(circleX - (rect.x + rect.width / 2));
    const distY = Math.abs(circleY - (rect.y + rect.height / 2));

    if (distX > (rect.width / 2 + radius)) return false;
    if (distY > (rect.height / 2 + radius)) return false;

    if (distX <= (rect.width / 2)) return true;
    if (distY <= (rect.height / 2)) return true;

    const dx = distX - rect.width / 2;
    const dy = distY - rect.height / 2;
    return (dx * dx + dy * dy <= (radius * radius));
  }

  static getDistance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
