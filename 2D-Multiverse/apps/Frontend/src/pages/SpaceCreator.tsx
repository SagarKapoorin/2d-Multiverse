import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setChange } from "../state";
import { State_ } from "../state";
// import "./SpaceCreator.css";

import { showErrorToast, showSuccessToast } from "../components/Message";
const SpaceCreator: React.FC = () => {
  const dispatch = useDispatch();
  const BACKEND_URL = "http://localhost:3000";
  const userToken = useSelector((state: State_) => state.token);
  const [name, setName] = useState<string>("");
  const [dimensions, setDimensions] = useState<string>("100x200");
  const [maps, setMaps] = useState<{ _id: string; name: string; width: number; height: number; thumbnail: string }[]>([
    {
      _id: '673b3bdc34db4302d2ed6541',
      width: 100,
      height: 200,
      name: 'Default space',
      thumbnail: 'https://thumbnail.com/a.png'
    },
    {
      _id: '673b3be134db4302d2ed656a',
      width: 100,
      height: 200,
      name: 'Space',
      thumbnail: 'https://thumbnail.com/a.png'
    },
    {
      _id: '673c64c26cd5a1323fbafb1a',
      width: 100,
      height: 200,
      name: 'Default space',
      thumbnail: 'https://thumbnail.com/a.png'
    },
    {
      _id: '673c64c76cd5a1323fbafb47',
      width: 100,
      height: 200,
      name: 'Space',
      thumbnail: 'https://thumbnail.com/a.png'
    }
  ]);
  const [selectedMap, setSelectedMap] = useState<string>("");

  useEffect(() => {
    fetchMaps();
  }, []);

  const fetchMaps = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/maps`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log(response.data);
      setMaps(response.data.elements);
      // showSuccessToast({message:"Success"});
    } catch (error) {
      showErrorToast({message:`Error:${error}`});
      console.error("Failed to fetch maps:", error);
    }
  };

  const createSpace = async () => {
    if (!name || !dimensions) {
      showErrorToast({message:"Please enter a name for the space."});
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/space`,
        {
          name,
          dimensions,
          mapId: selectedMap || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      showSuccessToast({message:`Space created`});
      setName("");
      setDimensions("");
      setSelectedMap("");
      dispatch(setChange());
    } catch (error) {
      showErrorToast({message:`Failed to Create Space:${error}`});
      console.error("Failed to create space:", error);
    }
  };

  return (
    <div className="creator-container--space2">
      <h2 className="creator-title--space2">Create a Space</h2>
      <div className="input-container--space2">
        <input
          type="text"
          placeholder="Enter space name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field--space2"
        />
      </div>

      <div className="map-section--space2">
        <h3 className="map-title--space2">Select a Map</h3>
        <div className="map-grid--space2">
          <div
            onClick={() => setSelectedMap("")}
            className="map-option--space2"
          >
            <div className={`map-blank--space2 ${selectedMap === "" ? "selected--space2" : ""}`}>
              No Map
            </div>
          </div>

          {maps.length > 0 && maps.map((map) => (
            <div
              key={map._id}
              onClick={() => setSelectedMap(map._id)}
              className="map-option--space2"
            >
              <img
                src={map.thumbnail || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"}
                alt={map.name}
                className={`map-image--space2 ${selectedMap === map._id ? "selected--space2" : ""}`}
              />
            </div>
          ))}
        </div>
      </div>

      <button onClick={createSpace} className="create-button--space2">
        Create Space
      </button>

    </div>
  );
};

export default SpaceCreator;