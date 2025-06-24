import { Vector2D } from './GameState';

export class InputManager {
  private canvas: HTMLCanvasElement;
  private mousePosition: Vector2D = { x: 0, y: 0 };
  private isMouseDown: boolean = false;
  private keys: Set<string> = new Set();
  
  // Callbacks
  onShoot?: () => void;
  onMouseMove?: (x: number, y: number) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Mouse events
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault()); // Disable right-click menu
    
    // Keyboard events
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
    
    // Touch events for mobile
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
  }

  private handleMouseMove(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.mousePosition.x = event.clientX - rect.left;
    this.mousePosition.y = event.clientY - rect.top;
    
    if (this.onMouseMove) {
      this.onMouseMove(this.mousePosition.x, this.mousePosition.y);
    }
  }

  private handleMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.isMouseDown = true;
    
    if (this.onShoot) {
      this.onShoot();
    }
  }

  private handleMouseUp(event: MouseEvent): void {
    event.preventDefault();
    this.isMouseDown = false;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    this.keys.add(event.code);
    
    // Spacebar shoots
    if (event.code === 'Space') {
      event.preventDefault();
      if (this.onShoot) {
        this.onShoot();
      }
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.keys.delete(event.code);
  }

  private handleTouchStart(event: TouchEvent): void {
    event.preventDefault();
    const touch = event.touches[0];
    if (touch) {
      const rect = this.canvas.getBoundingClientRect();
      this.mousePosition.x = touch.clientX - rect.left;
      this.mousePosition.y = touch.clientY - rect.top;
      
      if (this.onMouseMove) {
        this.onMouseMove(this.mousePosition.x, this.mousePosition.y);
      }
      
      if (this.onShoot) {
        this.onShoot();
      }
    }
  }

  private handleTouchMove(event: TouchEvent): void {
    event.preventDefault();
    const touch = event.touches[0];
    if (touch) {
      const rect = this.canvas.getBoundingClientRect();
      this.mousePosition.x = touch.clientX - rect.left;
      this.mousePosition.y = touch.clientY - rect.top;
      
      if (this.onMouseMove) {
        this.onMouseMove(this.mousePosition.x, this.mousePosition.y);
      }
    }
  }

  private handleTouchEnd(event: TouchEvent): void {
    event.preventDefault();
  }

  getMousePosition(): Vector2D {
    return { ...this.mousePosition };
  }

  isKeyPressed(key: string): boolean {
    return this.keys.has(key);
  }

  destroy(): void {
    // Remove all event listeners
    this.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.removeEventListener('mouseup', this.handleMouseUp.bind(this));
    
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
    
    this.canvas.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvas.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.canvas.removeEventListener('touchend', this.handleTouchEnd.bind(this));
  }
}
