import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State_, setSpaces, setSpaceId } from "../state";
import axios from "axios";
import SpaceCreator from "./SpaceCreator";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserHeader from "./UserHeader";
// import "./SpaceManager.css";

const SpaceManager: React.FC = () => {
  const navigate = useNavigate();
  const BACKEND_URL = "http://localhost:3000";
  const dispatch = useDispatch();
  const spaces = useSelector((state: State_) => state.spaces);
  const token = useSelector((state: State_) => state.token);
  const change = useSelector((state: State_) => state.change);

  // const [name, setName] = useState<string>("");
  // const [dimensions, setDimensions] = useState<string>("");

  useEffect(() => {
    if (token) {
      fetchSpaces();
    }
  }, [token, change]);

  const SpaceId = (id: string) => {
    dispatch(setSpaceId({ spaceId: id }));
    navigate("/Arena");
  };

  const fetchSpaces = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setSpaces({ spaces: response.data.spaces }));
    } catch (error) {
      console.error("Failed to fetch spaces:", error);
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
    <div className="space-manager--space1">
      <UserHeader/>
      <Navbar />
      <h1 className="title--space1">Space Manager</h1>

      <SpaceCreator />

      <div>
        <h2 className="title--space1">Your Spaces</h2>
        <div className="space-list--space1">
          {spaces.map((space) => (
            <div className="space-item--space1" key={space.id}>
              <img
                src={space.thumbnail || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"}
                alt={space.name}
                className="space-thumbnail--space1"
              />
              <div className="space-details--space1">
                <p className="space-name--space1">{space.name}</p>
                <p className="space-dimensions--space1">{space.dimensions}</p>
                <div className="button-container--space1">
                  <button 
                    className="button--space1 button-select--space1"
                    onClick={() => SpaceId(space.id)}
                  >
                    Select
                  </button>
                
                  <button 
                    className="button--space1 button-delete--space1"
                    onClick={() => deleteSpace(space.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpaceManager;