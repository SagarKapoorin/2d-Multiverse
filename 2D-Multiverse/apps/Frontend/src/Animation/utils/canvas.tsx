export const setupCanvas = (
    canvas: HTMLCanvasElement,
    width: number,
    height: number
  ): CanvasRenderingContext2D | null => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
  
    canvas.width = width;
    canvas.height = height;
    return ctx;
  };
  
  export const drawBall = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number
  ): void => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    
    // Enhanced gradient effect with stronger colors
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(225, 79, 91, 1)'); // Full opacity center
    gradient.addColorStop(0.4, 'rgba(225, 79, 91, 0.8)'); // Higher mid opacity
    gradient.addColorStop(1, 'rgba(225, 79, 91, 0.4)'); // More visible edge
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Enhanced glow effect
    ctx.shadowColor = 'rgba(225, 79, 91, 0.5)';
    ctx.shadowBlur = radius * 0.8;
    ctx.fill();
    
    ctx.closePath();
    
    // Reset shadow for next draw
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  };