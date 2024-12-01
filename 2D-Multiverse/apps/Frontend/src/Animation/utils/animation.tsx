import { Ball } from '../types/ball';

export const createBalls = (width: number, height: number): Ball[] => {
  const balls: Ball[] = [];
  // Dramatically increased number of balls based on screen size
  const numberOfBalls = Math.min(Math.floor(width * height / 4000), 400); // Doubled max balls and density
  const minRadius = 8; // Increased minimum radius
  const maxRadius = 20; // Increased maximum radius

  for (let i = 0; i < numberOfBalls; i++) {
    balls.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * (maxRadius - minRadius) + minRadius,
      dx: (Math.random() - 0.5) * 2, // Slightly reduced speed for larger balls
      dy: (Math.random() - 0.5) * 2,
      originalRadius: Math.random() * (maxRadius - minRadius) + minRadius,
    });
  }

  return balls;
};

export const updateBall = (
  ball: Ball,
  mouseX: number,
  mouseY: number,
  isMouseDown: boolean,
  width: number,
  height: number
): void => {
  // Update position with variable speed
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Enhanced bounce effect with slight randomization
  if (ball.x + ball.radius > width || ball.x - ball.radius < 0) {
    ball.dx *= -1;
    ball.dx += (Math.random() - 0.5) * 0.3; // Reduced random bounce for smoother movement
  }
  if (ball.y + ball.radius > height || ball.y - ball.radius < 0) {
    ball.dy *= -1;
    ball.dy += (Math.random() - 0.5) * 0.3;
  }

  // Enhanced interactive effect with larger range
  const distance = Math.sqrt(
    Math.pow(mouseX - ball.x, 2) + Math.pow(mouseY - ball.y, 2)
  );
  const maxDistance = 250; // Increased interaction range for larger balls

  if (distance < maxDistance && isMouseDown) {
    const angle = Math.atan2(ball.y - mouseY, ball.x - mouseX);
    const force = (maxDistance - distance) / maxDistance * 3; // Adjusted force for larger balls
    ball.dx = Math.cos(angle) * force;
    ball.dy = Math.sin(angle) * force;
    ball.radius = ball.originalRadius * 1.5; // More subtle size change
  } else {
    // Smoother transition back to original size
    ball.radius += (ball.originalRadius - ball.radius) * 0.1;
    
    // Gradual speed adjustment
    ball.dx *= 0.997;
    ball.dy *= 0.997;
    
    // Ensure minimum speed with randomization
    const minSpeed = 0.5;
    const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    if (speed < minSpeed) {
      const randomAngle = Math.random() * Math.PI * 2;
      ball.dx = Math.cos(randomAngle) * minSpeed;
      ball.dy = Math.sin(randomAngle) * minSpeed;
    }
    
    // Cap maximum speed
    const maxSpeed = 4;
    if (speed > maxSpeed) {
      ball.dx *= maxSpeed / speed;
      ball.dy *= maxSpeed / speed;
    }
  }
};