import  { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { State_ } from '../state';
import axios from 'axios';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import Canvas from './Canvas';
import { AnimatedBackground } from './AnimatedBackground';
import Navbar from '../components/Navbar';
import UserHeader from './UserHeader';
// import '../../styles/websockets.css';

const WebSockets = () => {
  const imageUrl = useSelector((state: State_) => state.avatarId) || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
  const socketRef = useRef<typeof Socket | null>(null);
  const [currentUser, setCurrentUser] = useState<any>({});
  const [users, setUsers] = useState(new Map());

  let token = useSelector((state: State_) => state.token);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    token = token || urlParams.get('token') || '';
    const spaceId = urlParams.get('spaceId') || '6745c62d935e9cfef019fa47';

    const socket = io('http://localhost:5000', { transports: ['websocket'] });
    socketRef.current = socket;

    socket.emit('message', { type: 'join', payload: { spaceId, token } });

    socket.on('message', (data: string) => {
      const parsedData = JSON.parse(data);
      const { type, payload } = parsedData;

      switch (type) {
        case 'space-joined':
          setCurrentUser({
            x: payload.spawn.x,
            y: payload.spawn.y,
            userId: payload.userId,
          });
          const userMap = new Map();
          payload.users.forEach((user: any) => {
            userMap.set(user.userId, user);
          });
          setUsers(userMap);
          break;

        case 'user-joined':
          setUsers((prev) => {
            const newUsers = new Map(prev);
            newUsers.set(payload.userId, {
              x: payload.x,
              y: payload.y,
              userId: payload.userId,
            });
            return newUsers;
          });
          break;

        case 'movement':
          setUsers((prev) => {
            const newUsers = new Map(prev);
            const user = newUsers.get(payload.userId);
            if (user) {
              user.x = payload.x;
              user.y = payload.y;
              newUsers.set(payload.userId, user);
            }
            return newUsers;
          });
          break;

        case 'movement-rejected':
          setCurrentUser((prev: any) => ({
            ...prev,
            x: payload.x,
            y: payload.y,
          }));
          break;

        case 'user-left':
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
  


  return (
    <div className="container--websocket">
      <UserHeader/>
      <Navbar/>
      <AnimatedBackground />
      <h1 className="title--websocket">WebSockets Space</h1>
      <div className="connected-users--websocket">
        Connected Users: {users.size}
      </div>
      <Canvas
        currentUser={currentUser}
        users={users}
        imageUrl={imageUrl}
      />
      <div className="controls--websocket">
        <button
          className="button--websocket"
          data-direction="up"
          onClick={() => handleMove(currentUser.x, currentUser.y - 1)}
        >
          ↑
        </button>
        <button
          className="button--websocket"
          data-direction="left"
          onClick={() => handleMove(currentUser.x - 1, currentUser.y)}
        >
          ←
        </button>
        <button
          className="button--websocket"
          data-direction="right"
          onClick={() => handleMove(currentUser.x + 1, currentUser.y)}
        >
          →
        </button>
        <button
          className="button--websocket"
          data-direction="down"
          onClick={() => handleMove(currentUser.x, currentUser.y + 1)}
        >
          ↓
        </button>
      </div>
      <p className="instructions--websocket">
        Use buttons to move your avatar
      </p>
    </div>
  );
};

export default WebSockets;
