import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setSpaces, setSpaceId } from '../state';
import { State_ } from '../state';
import Navbar from '../components/Navbar';
import UserHeader from './UserHeader';

import Animated2 from '../components/Animated2';
import { showErrorToast } from '../components/Message';
// import { ToastContainer } from '../components/MessageContainer';
// import './Dashboard.css';

const DashBoard = () => {
  const navigate = useNavigate();
  const BACKEND_URL = "http://localhost:3000";
  const spaces = useSelector((state: State_) => state.spaces);
  const token = useSelector((state: State_) => state.token);
  const dispatch = useDispatch();

  const fetchSpaces = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/space/every`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setSpaces({ spaces: response.data.spaces }));
    } catch (error) {
      console.error("Failed to fetch spaces:", error);
      showErrorToast({message:"Error:Failed to fetch spaces"});
    }
  };

  React.useLayoutEffect(() => {
    fetchSpaces();
  }, []);

  const Select = (id: string) => {
    dispatch(setSpaceId({ spaceId: id }));
    navigate("/stadium");
  };

  return (
    <div className="container--dashboard">
      <UserHeader />
      <Animated2/>
      
      <div className="accent-pattern--dashboard"></div>
      <div className="decoration-circle--dashboard circle-1--dashboard"></div>
      <div className="decoration-circle--dashboard circle-2--dashboard"></div>

      <h2 className="spaces-title--dashboard">Explore Spaces</h2>
      <div className="spaces-grid--dashboard">
        {spaces.map((space) => (
          <div className="space-card--dashboard" key={space.id}>
            <img
              src={space.thumbnail || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"}
              alt={space.name}
              className="space-image--dashboard"
            />
            <div className="space-content--dashboard">
              <p className="space-name--dashboard">{space.name}</p>
              <p className="space-dimensions--dashboard">{space.dimensions}</p>
              <div className="space-button-container--dashboard">
                <button 
                  className="enter-button--dashboard"
                  onClick={() => Select(space.id)}
                >
                  Enter
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Navbar />

    </div>
  );
};

export default DashBoard;