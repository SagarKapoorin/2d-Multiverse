
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setSpaces, setSpaceId,setAvatarId,setName,setRole,setLogin } from '../state';
import { State_ } from '../state';
import Navbar from '../components/Navbar';
import UserHeader from './UserHeader';

import Animated2 from '../components/Animated2';
import { showErrorToast } from '../components/Message';
// import { ToastContainer } from '../components/MessageContainer';
// import './Dashboard.css';
import { useEffect } from 'react';

const DashBoard = () => {
  const navigate = useNavigate();
  const BACKEND_URL = "http://localhost:3000";
  const spaces = useSelector((state: State_) => state.spaces);
  const token = useSelector((state: State_) => state.token);
  let token2="";
  const dispatch = useDispatch();

  const fetchSpaces = async () => {
    console.log("Fetch-spaces");
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/space/every`, {
        headers: {
          Authorization: `Bearer ${token2}`,
        },
      });
      dispatch(setSpaces({ spaces: response.data.spaces }));
    } catch (error) {
      console.error("Failed to fetch spaces:", error);
      showErrorToast({message:"Error:Failed to fetch spaces"});
    }
  };
  useEffect(()=>{
    const getUser = async() => {
    const response=await  axios.get(`${BACKEND_URL}/login/passed`, {
      withCredentials:true,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
      }
      })
      console.log(response);
      const loggedIn=response.data;
      token2=loggedIn.token;
      dispatch(setLogin({ token: loggedIn.token }));
      dispatch(setAvatarId({ avatarId: loggedIn.avatarId || undefined }));
      dispatch(setRole({ role: loggedIn.role }));
      dispatch(setName({ name: loggedIn.name }));
      console.log(token2);
      fetchSpaces();
    }
    getUser();
  
  },[])


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