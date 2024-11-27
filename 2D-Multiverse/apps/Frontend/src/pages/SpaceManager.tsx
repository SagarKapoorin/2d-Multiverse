import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State_, setSpaces, setUpdateSpaces,setSpaceId } from "../state";
import axios from "axios";
import SpaceCreator from "./SpaceCreator";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
// import "./SpaceManager.css"; // Add a CSS file for styling

const SpaceManager: React.FC = () => {
  const navigate=useNavigate();
  const BACKEND_URL = "http://localhost:3000";
  const dispatch = useDispatch();
  const spaces = useSelector((state: State_) => state.spaces);
  const token = useSelector((state: State_) => state.token);

  const [name, setName] = useState<string>("");
  const [dimensions, setDimensions] = useState<string>("");
const change=useSelector((state:State_)=>state.change);
  useEffect(() => {
    if (token) {
      fetchSpaces();
    }
  }, [token,change]);
  const SpaceId=(id:string)=>{
    dispatch(setSpaceId({spaceId:id}));
    navigate("/Arena");
  }
  const fetchSpaces = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setSpaces({ spaces: response.data.spaces }));
      console.log(response.data.spaces)
    } catch (error) {
      console.error("Failed to fetch spaces:", error);
    }
  };

 

    

  const updateSpace = async (spaceId: string) => {
    if (!name || !dimensions) {
      alert("Please enter a name and dimensions for the space.");
      return;
    }
    const updatedSpace = { id: spaceId, name, dimensions };
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/space/${spaceId}`,
        updatedSpace,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setUpdateSpaces({ space: response.data }));
      setName("");
      setDimensions("");
    } catch (error) {
      console.error("Failed to update space:", error);
    }
  };

  const deleteSpace = async (spaceId: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setSpaces({ spaces: spaces.filter((space) => space.id !== spaceId) }));
    } catch (error) {
      console.error("Failed to delete space:", error);
    }
  };

  return (
    <div>
        <Navbar/>
      <h1>Space Manager</h1>

    <SpaceCreator/>

      <div>
        <h2>Your Spaces</h2>
        <div className="space-list">
          {spaces.map((space) => (
            <div className="space-item" key={space.id}>
              <img
                src={space.thumbnail || "https://dummyimage.com/600x400/ffffff/ffffff"}
                alt={space.name}
                className="space-thumbnail"
              />
              <div className="space-details">
                <p className="space-name">{space.name}</p>
                <p className="space-dimensions">{space.dimensions}</p>
                <button onClick={() => SpaceId(space.id)}>Select</button>
                <button onClick={() => updateSpace(space.id)}>Update</button>
                <button onClick={() => deleteSpace(space.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpaceManager;
