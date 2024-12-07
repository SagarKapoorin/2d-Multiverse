import React from 'react';

interface UserInfoProps {
  token: string;
  spaceId: string;
  userCount: number;
}

const UserInfo: React.FC<UserInfoProps> = ({ token, spaceId, userCount }) => {
  return (
    <div className="info-panel--websocket">
      <p className="info-text--websocket">Token: {token}</p>
      <p className="info-text--websocket">Space ID: {spaceId}</p>
      <p className="info-text--websocket">Connected Users: {userCount}</p>
    </div>
  );
};

export default UserInfo;