import React, { useRef, useCallback, useState } from 'react';
import { useWindowSize } from './hooks/useWindowSize';
import { useAnimationFrame } from './hooks/useAnimationFrame';
import { createBalls, updateBall } from './utils/animation';
import { setupCanvas, drawBall } from './utils/canvas';
import { Ball } from './types/ball';
import './Animation.css'

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useWindowSize();
  const [balls, setBalls] = useState<Ball[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      setMousePos({
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      });
    } else {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(0, 0, width, height);

    balls.forEach((ball) => {
      updateBall(ball, mousePos.x, mousePos.y, isMouseDown, width, height);
      drawBall(ctx, ball.x, ball.y, ball.radius);
    });
  }, [balls, mousePos, isMouseDown, width, height]);

  useAnimationFrame(animate);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = setupCanvas(canvas, width, height);
    if (!ctx) return;

    setBalls(createBalls(width, height));

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling on touch devices
      handleMouseMove(e);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('mousedown', () => setIsMouseDown(true));
    canvas.addEventListener('touchstart', () => setIsMouseDown(true));
    canvas.addEventListener('mouseup', () => setIsMouseDown(false));
    canvas.addEventListener('touchend', () => setIsMouseDown(false));
    canvas.addEventListener('mouseleave', () => setIsMouseDown(false));

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('mouseleave', () => setIsMouseDown(false));
    };
  }, [width, height, handleMouseMove]);

  return (
    <div className="my-container22">
    <canvas
      ref={canvasRef}
      className="your-class"
      style={{ touchAction: 'none' }}
    />
    </div>
  );
};

export default AnimatedBackground;