import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { State_ } from "../state";

const BACKEND_URL = "http://localhost:3000/api/v1";

interface Element {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
}

const MapManager: React.FC = () => {
    const token=useSelector((state:State_)=>state.token);
  const [mapName, setMapName] = useState<string>("");
  const [mapThumbnail, setMapThumbnail] = useState<string>("");
  const [mapDimensions, setMapDimensions] = useState<string>("100x100");
  const [defaultElements, setDefaultElements] = useState<any[]>([]);
  const [availableElements, setAvailableElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<string>("");
  const [xCoord, setXCoord] = useState<number | "">("");
  const [yCoord, setYCoord] = useState<number | "">("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    fetchAvailableElements();
  }, []);

  const fetchAvailableElements = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/elements`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setAvailableElements(response.data.elements);
      setError("");
    } catch (err) {
      setError("Failed to fetch available elements.");
    }
  };

  const addDefaultElement = () => {
    if (!selectedElement || xCoord === "" || yCoord === "") {
      setError("Please fill in all fields before adding an element.");
      return;
    }
    const newElement = {
      element: selectedElement,
      x: Number(xCoord),
      y: Number(yCoord),
    };
    setDefaultElements([...defaultElements, newElement]);
    setXCoord("");
    setYCoord("");
    setSelectedElement("");
    setError("");
  };

  const createMap = async () => {
    if (!mapName || !mapThumbnail || !mapDimensions) {
      setError("Please provide all map details.");
      return;
    }
    try {
      const response = await axios.post(
        `${BACKEND_URL}/admin/map`,
        {
          thumbnail: mapThumbnail,
          dimensions: mapDimensions,
          name: mapName,
          defaultElements,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(`Map created successfully with ID: ${response.data.id}`);
      setDefaultElements([]);
      setMapName("");
      setMapThumbnail("");
      setMapDimensions("100x100");
    } catch (err) {
      setError("Failed to create map. Please check your inputs.");
    }
  };

  return (
    <div>
      <h1>Map Manager</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <div>
        <h2>Create Map</h2>
        <input
          type="text"
          placeholder="Map Name"
          value={mapName}
          onChange={(e) => setMapName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Map Thumbnail URL"
          value={mapThumbnail}
          onChange={(e) => setMapThumbnail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Map Dimensions (e.g., 100x200)"
          value={mapDimensions}
          onChange={(e) => setMapDimensions(e.target.value)}
        />
      </div>

      <div>
        <h3>Add Default Elements</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {availableElements.map((element) => (
            <div
              key={element.id}
              style={{
                border: selectedElement === element.id ? "2px solid blue" : "1px solid gray",
                padding: "10px",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => setSelectedElement(element.id)}
            >
              <img
                src={element.imageUrl}
                alt={`Element ${element.id}`}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <p>{element.width}x{element.height}</p>
              <p>ID: {element.id}</p>
            </div>
          ))}
        </div>
        <input
          type="number"
          placeholder="X Coordinate"
          value={xCoord}
          onChange={(e) => setXCoord(e.target.value ? Number(e.target.value) : "")}
        />
        <input
          type="number"
          placeholder="Y Coordinate"
          value={yCoord}
          onChange={(e) => setYCoord(e.target.value ? Number(e.target.value) : "")}
        />
        <button onClick={addDefaultElement}>Add Default Element</button>
        <ul>
          {defaultElements.map((el, index) => (
            <li key={index}>
              {el.element} (x: {el.x}, y: {el.y})
            </li>
          ))}
        </ul>
      </div>

      <button onClick={createMap}>Create Map</button>
    </div>
  );
};

export default MapManager;
