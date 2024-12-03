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
    gradient.addColorStop(0, 'rgba(245, 73, 144,0.5)'); // Full opacity center
    gradient.addColorStop(0.4, 'rgba(245, 73, 144,0.5)'); // Higher mid opacity
    gradient.addColorStop(1, 'rgba(245, 73, 144,0.5)'); // More visible edge
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Enhanced glow effect
    ctx.shadowColor = 'rgba(245, 73, 144,0.5)';
    ctx.shadowBlur = radius * 0.001;
    ctx.fill();
    
    ctx.closePath();
    
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  };