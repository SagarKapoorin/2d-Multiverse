import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { State_ } from '../state';
import { io, Socket } from 'socket.io-client';

const WebSockets = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const [currentUser, setCurrentUser] = useState<any>({});
  const [users, setUsers] = useState(new Map());
  const [params, setParams] = useState({ token: '', spaceId: '' });

  let token = useSelector((state: State_) => state.token);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    token = token || urlParams.get('token') || '';
    const spaceId = urlParams.get('spaceId') || '6745c62d935e9cfef019fa47';
    setParams({ token, spaceId });

    const socket = io('http://localhost:5000', { transports: ['websocket'] });
    socketRef.current = socket;

    // console.log('Connecting to WebSocket...');
    socket.emit('message', { type: 'join', payload: { spaceId, token } });

    socket.on('message', (data: string) => {
      const parsedData = JSON.parse(data);
      const { type, payload } = parsedData;
      console.log(data);
      switch (type) {
        case 'space-joined':
          // console.log('Space joined');
          setCurrentUser({
            x: payload.spawn.x,
            y: payload.spawn.y,
            userId: payload.userId,
          });

          const userMap = new Map();
          payload.users.forEach((user: any) => {
            userMap.set(user.userId, user);
          });
          // console.log("---");
          // console.log(userMap);
          setUsers(userMap);
          break;

        case 'user-joined':
          // console.log('User joined');
          setUsers((prev) => {
            const newUsers = new Map(prev);
            newUsers.set(payload.userId, {
              x: payload.x,
              y: payload.y,
              userId: payload.userId,
            });
            // console.log("---2");
            // console.log(newUsers);
            return newUsers;
          });
          break;

        case 'movement':
          // console.log('Movement detected');
          setUsers((prev) => {
            const newUsers = new Map(prev);
            const user = newUsers.get(payload.userId);
            if (user) {
              user.x = payload.x;
              user.y = payload.y;
              newUsers.set(payload.userId, user);
            }
            // console.log("---3");
            // console.log(newUsers);
            return newUsers;
          });
          break;

        case 'movement-rejected':
          // console.log('Movement rejected');
          setCurrentUser((prev: any) => ({
            ...prev,
            x: payload.x,
            y: payload.y,
          }));
          break;

        case 'user-left':
          // console.log('User left');
          setUsers((prev) => {
            const newUsers = new Map(prev);
            newUsers.delete(payload.userId);
            return newUsers;
          });
          break;

        default:
          console.warn(`Unhandled message type: ${type}`);
      }
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const handleMove = (newX: number, newY: number) => {
    if (!currentUser || !socketRef.current) return;

    socketRef.current.emit('message', {
      type: 'move',
      payload: {
        x: newX,
        y: newY,
        userId: currentUser.userId,
      },
    });
  };

  useEffect(() => {
    console.log(users);
    console.log(currentUser);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#eee';
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw current user
    if (currentUser && currentUser.x !== undefined) {
      ctx.beginPath();
      ctx.fillStyle = '#FF6B6B';
      ctx.arc(currentUser.x * 50, currentUser.y * 50, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('You', currentUser.x * 50, currentUser.y * 50 + 40);
    }
    // // console.log(users);
    // Draw other users
    users.forEach((user) => {
      if (user.x === undefined|| user.userId===currentUser.userId) return;
      
      ctx.beginPath();
      ctx.fillStyle = '#4ECDC4';
      ctx.arc(user.x * 50, user.y * 50, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`User ${user.userId}`, user.x * 50, user.y * 50 + 40);
    });
  }, [currentUser, users]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!currentUser) return;

    const { x, y } = currentUser;
    switch (e.key) {
      case 'ArrowUp':
        handleMove(x, y - 1);
        break;
      case 'ArrowDown':
        handleMove(x, y + 1);
        break;
      case 'ArrowLeft':
        handleMove(x - 1, y);
        break;
      case 'ArrowRight':
        handleMove(x + 1, y);
        break;
    }
  };

  return (
    <div className="p-4" onKeyDown={handleKeyDown} tabIndex={0}>
      <h1 className="text-2xl font-bold mb-4">WebSockets</h1>
      <div className="mb-4">
        <p className="text-sm text-gray-600">Token: {params.token}</p>
        <p className="text-sm text-gray-600">Space ID: {params.spaceId}</p>
        <p className="text-sm text-gray-600">
          Connected Users: {users.size}
        </p>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={2000}
          height={2000}
          className="bg-white"
        />
      </div>
      <p className="mt-2 text-sm text-gray-500">Use arrow keys to move your avatar</p>
    </div>
  );
};

export default WebSockets;
