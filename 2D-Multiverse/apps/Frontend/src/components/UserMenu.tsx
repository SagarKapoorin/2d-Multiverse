import  { useState, useRef, useEffect } from 'react';
import {  User, LogOut } from 'lucide-react';
import { AvatarS } from './AvaterS';
import { MenuItem } from './MenuItem';
import { useSelector } from 'react-redux';
import { State_ } from '../state';
import { useNavigate } from 'react-router-dom';

export function UserMenu() {
    const url=useSelector((state:State_)=>state.avatarId);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log('Logging out...');
  };
  const navigate=useNavigate();
  const handleUser=()=>{
    navigate("/user");
  }

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="menu-button"
      >
        <AvatarS
imageUrl={url}
/>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <MenuItem icon={<User size={16} />} onClick={handleUser}>Account</MenuItem>
          <div className="divider" />
          <MenuItem icon={<LogOut size={16} />} onClick={handleLogout}>
            Log Out
          </MenuItem>
        </div>
      )}
    </div>
  );
}