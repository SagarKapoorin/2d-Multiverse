import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { State_ } from '../state';
import { Element } from './canvasTypes';

interface User {
  x: number;
  y: number;
  userId: string;
}

interface CanvasProps {
  currentUser: User;
  users: Map<string, User>;
  imageUrl: string;
}

const Canvas: React.FC<CanvasProps> = ({ currentUser, users, imageUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements,SetElements]=useState([]);
  let token = useSelector((state: State_) => state.token);
  const [Background, setBackground] = useState(
    'https://thumbs.dreamstime.com/b/transparent-pattern-background-simulation-alpha-channel-png-seamless-gray-white-squares-vector-design-grid-162521286.jpg'
  );

  const BACKEND_URL = 'http://localhost:3000';
  const spaceId = useSelector((state:State_)=>state.selectSpaceId);;
console.log(spaceId);
  const fetchSpace = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.elements);
      SetElements(response.data.elements);
      setBackground(response.data.imageUrl);
    } catch (error) {
      console.error('Failed to get space:', error);
    }
  };

  useEffect(() => {
    fetchSpace();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentUserImg = new Image();
    const otherUserImg = new Image();
    const backgroundImg = new Image();

    currentUserImg.src = imageUrl;
    otherUserImg.src =
      'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
    backgroundImg.src = Background;
    
    const drawCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground(ctx, canvas, backgroundImg);
    //   drawGrid(ctx, canvas);
      drawCurrentUser(ctx, currentUser, currentUserImg);
      drawOtherUsers(ctx, users, currentUser, otherUserImg);
      drawElements(ctx,elements);
    };

    currentUserImg.onload = otherUserImg.onload = backgroundImg.onload = drawCanvas;
  }, [currentUser, users, imageUrl, Background]);

  const drawBackground = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    backgroundImg: HTMLImageElement
  ) => {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
  };



  const drawCurrentUser = (
    ctx: CanvasRenderingContext2D,
    user: User,
    img: HTMLImageElement
  ) => {
    if (!user || user.x === undefined) return;
    const size = 80;
    const borderSize = 4;
    const x = user.x * 50;
    const y = user.y * 50;
    ctx.fillStyle = '#4299e1';
    ctx.strokeStyle = '#2b6cb0';
    ctx.lineWidth = borderSize;
    ctx.beginPath();
    ctx.arc(x, y, size / 2 + borderSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
    ctx.restore();
    ctx.fillStyle = '#2d3748';
    ctx.font = 'bold 16px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('You', x, y + size / 2 + 20);
  };

  const drawOtherUsers = (
    ctx: CanvasRenderingContext2D,
    users: Map<string, User>,
    currentUser: User,
    img: HTMLImageElement
  ) => {
    users.forEach((user) => {
      if (user.x === undefined || user.userId === currentUser.userId) return;
      const size = 80;
      const borderSize = 4;
      const x = user.x * 50;
      const y = user.y * 50;
      ctx.fillStyle = '#f56565';
      ctx.strokeStyle = '#c53030';
      ctx.lineWidth = borderSize;
      ctx.beginPath();
      ctx.arc(x, y, size / 2 + borderSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
      ctx.restore();
      ctx.fillStyle = '#2d3748';
      ctx.font = 'bold 16px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`User ${user.userId}`, x, y + size / 2 + 20);
    });
  };
  const drawElements = (
    ctx: CanvasRenderingContext2D,
    elements:Element[],
  ) => {
    elements.forEach((ele) => {
        if (ele.x === undefined) return;
      
        const size = 80;
        const x = ele.x>39?35:ele.x*50;
        const y = ele.y>39?35:ele.y*50;
      console.log(x+" "+y+" "+ele.x+" "+ele.y);
        // Load the image
        const image = new Image();
        image.src = ele.element.imageUrl;
      
        image.onload = () => {
            ctx.strokeStyle = 'white'; 
            ctx.lineWidth = 4;         
            ctx.beginPath();
            ctx.arc(x, y, size / 2 + 4, 0, Math.PI * 2); 
            ctx.stroke();              
        
            ctx.save(); 
            ctx.beginPath();
            ctx.arc(x, y, size / 2, 0, Math.PI * 2); 
            ctx.clip(); 
        
            ctx.drawImage(image, x - size / 2, y - size / 2, size, size);
        
            ctx.restore(); 
        };
      });
      
  };

  return (
    <div className="canvas-container--websocket">
      <canvas
        ref={canvasRef}
        width={2000}
        height={2000}
        className="canvas--websocket"
      />
    </div>
  );
};

export default Canvas;
