export interface HijabStyle {
  id: string;
  name: string;
  color: string;
  fabric: string;
  texture?: string;
}

export interface FaceData {
  landmarks: Array<{ x: number; y: number; z: number }>;
  headPose?: {
    rotation: { x: number; y: number; z: number };
    position: { x: number; y: number; z: number };
  };
}

export class HijabRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private hijabStyles: HijabStyle[] = [
    { id: '1', name: 'Classic Wrap', color: '#8B4513', fabric: 'chiffon' },
    { id: '2', name: 'Modern Drape', color: '#2C3E50', fabric: 'jersey' },
    { id: '3', name: 'Elegant Style', color: '#E74C3C', fabric: 'silk' },
    { id: '4', name: 'Casual Wrap', color: '#3498DB', fabric: 'cotton' },
    { id: '5', name: 'Formal Style', color: '#9B59B6', fabric: 'satin' },
  ];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context');
    }
    this.ctx = context;
  }

  renderHijab(faceData: FaceData, hijabStyle: HijabStyle, segmentationMask: ImageData) {
    if (!faceData.landmarks || faceData.landmarks.length === 0) {
      return;
    }

    const landmarks = faceData.landmarks;
    
    // Ensure we have enough landmarks (MediaPipe Face Mesh has 468 points)
    if (landmarks.length < 468) {
      console.warn('Not enough face landmarks detected:', landmarks.length);
      return;
    }
    
    // Key points for hijab placement (MediaPipe Face Mesh indices)
    const foreheadTop = landmarks[10]; // Top of forehead
    const foreheadLeft = landmarks[234]; // Left temple
    const foreheadRight = landmarks[454]; // Right temple
    const chin = landmarks[175]; // Chin
    const leftTemple = landmarks[234];
    const rightTemple = landmarks[454];
    
    // Validate landmark coordinates (should be normalized 0-1)
    if (!foreheadTop || !foreheadLeft || !foreheadRight || !chin) {
      return;
    }

    // Clear and prepare
    this.ctx.save();
    
    // Set global composite operation to ensure hijab appears on top
    this.ctx.globalCompositeOperation = 'source-over';

    // Draw hijab base (covering head and hair)
    this.ctx.fillStyle = hijabStyle.color;
    this.ctx.beginPath();

    // Create hijab shape covering head
    // MediaPipe landmarks are normalized (0-1), convert to canvas coordinates
    const headTop = {
      x: Math.max(0, Math.min(this.canvas.width, foreheadTop.x * this.canvas.width)),
      y: Math.max(0, Math.min(this.canvas.height, foreheadTop.y * this.canvas.height - 80)),
    };

    const headLeft = {
      x: Math.max(0, Math.min(this.canvas.width, leftTemple.x * this.canvas.width - 40)),
      y: Math.max(0, Math.min(this.canvas.height, leftTemple.y * this.canvas.height)),
    };

    const headRight = {
      x: Math.max(0, Math.min(this.canvas.width, rightTemple.x * this.canvas.width + 40)),
      y: Math.max(0, Math.min(this.canvas.height, rightTemple.y * this.canvas.height)),
    };

    const chinPoint = {
      x: Math.max(0, Math.min(this.canvas.width, chin.x * this.canvas.width)),
      y: Math.max(0, Math.min(this.canvas.height, chin.y * this.canvas.height)),
    };

    // Draw hijab covering head
    this.ctx.moveTo(headTop.x, headTop.y);
    this.ctx.quadraticCurveTo(
      headLeft.x - 20,
      headLeft.y - 20,
      headLeft.x,
      headLeft.y
    );
    this.ctx.lineTo(chinPoint.x - 20, chinPoint.y + 10);
    this.ctx.quadraticCurveTo(
      chinPoint.x,
      chinPoint.y + 15,
      chinPoint.x + 20,
      chinPoint.y + 10
    );
    this.ctx.lineTo(headRight.x, headRight.y);
    this.ctx.quadraticCurveTo(
      headRight.x + 20,
      headRight.y - 20,
      headTop.x,
      headTop.y
    );
    this.ctx.closePath();
    this.ctx.fill();

    // Add drape effect
    this.addDrapeEffect(headLeft, headRight, chinPoint, hijabStyle);

    // Add texture if available
    if (hijabStyle.texture) {
      this.addTexture(hijabStyle);
    }

    this.ctx.restore();
  }

  private addDrapeEffect(
    left: { x: number; y: number },
    right: { x: number; y: number },
    chin: { x: number; y: number },
    style: HijabStyle
  ) {
    // Add drape layers for realism
    this.ctx.strokeStyle = this.darkenColor(style.color, 0.2);
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    
    // Left drape
    this.ctx.moveTo(left.x, left.y);
    this.ctx.quadraticCurveTo(
      left.x - 15,
      left.y + 30,
      chin.x - 25,
      chin.y + 20
    );
    this.ctx.stroke();

    // Right drape
    this.ctx.beginPath();
    this.ctx.moveTo(right.x, right.y);
    this.ctx.quadraticCurveTo(
      right.x + 15,
      right.y + 30,
      chin.x + 25,
      chin.y + 20
    );
    this.ctx.stroke();
  }

  private addTexture(style: HijabStyle) {
    // Simple texture overlay based on fabric type
    const pattern = this.ctx.createPattern(
      this.createFabricPattern(style.fabric),
      'repeat'
    );
    if (pattern) {
      this.ctx.globalAlpha = 0.3;
      this.ctx.fillStyle = pattern;
      this.ctx.fill();
      this.ctx.globalAlpha = 1.0;
    }
  }

  private createFabricPattern(fabric: string): CanvasPattern {
    // Create a simple pattern based on fabric type
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 20;
    patternCanvas.height = 20;
    const patternCtx = patternCanvas.getContext('2d');
    
    if (patternCtx) {
      if (fabric === 'chiffon') {
        // Light, airy pattern
        patternCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        patternCtx.fillRect(0, 0, 20, 20);
      } else if (fabric === 'jersey') {
        // Knit pattern
        patternCtx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        patternCtx.lineWidth = 1;
        for (let i = 0; i < 20; i += 2) {
          patternCtx.beginPath();
          patternCtx.moveTo(i, 0);
          patternCtx.lineTo(i, 20);
          patternCtx.stroke();
        }
      }
    }
    
    return this.ctx.createPattern(patternCanvas, 'repeat') as CanvasPattern;
  }

  private darkenColor(color: string, amount: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, ((num >> 16) & 0xff) * (1 - amount));
    const g = Math.max(0, ((num >> 8) & 0xff) * (1 - amount));
    const b = Math.max(0, (num & 0xff) * (1 - amount));
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
  }

  getAvailableStyles(): HijabStyle[] {
    return this.hijabStyles;
  }
}

