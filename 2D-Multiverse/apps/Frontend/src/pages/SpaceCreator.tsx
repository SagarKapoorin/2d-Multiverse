import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector,useDispatch } from "react-redux";
import { setChange } from "../state";
import { State_ } from "../state";

const SpaceCreator: React.FC = () => {
    const dispatch=useDispatch();
  const BACKEND_URL = "http://localhost:3000";
  const userToken = useSelector((state: State_) => state.token);
  const [name, setName] = useState<string>("");
  const [dimensions, setDimensions] = useState<string>("100x200");
  const [maps, setMaps] = useState<{ _id: string; name: string;width:number,height:number,thumbnail:string }[]>([
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
  ]
  );  
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
    } catch (error) {
      console.error("Failed to fetch maps:", error);
    }
  };

  const createSpace = async () => {
    if (!name || !dimensions) {
      alert("Please enter a name and dimensions for the space.");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/space`,
        {
          name,
          dimensions,
          mapId: selectedMap || undefined, // Pass undefined if no map is selected
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      alert(`Space created with ID: ${response.data.spaceId}`);
      setName("");
      setDimensions("");
      setSelectedMap("");
      dispatch(setChange());
    } catch (error) {
      console.error("Failed to create space:", error);
    }
  };

  return (
    <div>
      <h2>Create a Space</h2>
      <div>
        <input
          type="text"
          placeholder="Enter space name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div>
          <h3>Select a Map</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {/* Option for blank (no map) */}
            <div
              onClick={() => setSelectedMap("")}
              style={{
                cursor: "pointer",
                border: selectedMap === "" ? "2px solid blue" : "1px solid gray",
                padding: "1rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                No Map
              </div>
              <span>Blank</span>
            </div>
            {/* Render map options */}
            {maps.length>0 && maps.map((map) => (
              <div
                key={map._id}
                onClick={() => setSelectedMap(map._id)}
                style={{
                    width: "80px",
                    height: "80px",
                  cursor: "pointer",
                  border: selectedMap === map._id ? "2px solid blue" : "1px solid gray",
                  textAlign: "center",
                }}
              >
                <img
                  src={map.thumbnail || "https://dummyimage.com/100x100/cccccc/ffffff"}
                  alt={map.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <button onClick={createSpace}>Create Space</button>
      </div>
    </div>
  );
};

export default SpaceCreator;
