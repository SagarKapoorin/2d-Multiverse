import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { State_ } from "../state";
import Navbar from "../components/Navbar";
import UserHeader from "./UserHeader";
import AnimatedBackground from "../Animation/Animation";
import { showErrorToast, showSuccessToast } from "../components/Message";

const BACKEND_URL = "http://localhost:3000/api/v1";

interface Element {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
}

const MapManager: React.FC = () => {
  const token = useSelector((state: State_) => state.token);
  const [mapName, setMapName] = useState<string>("");
  const [mapThumbnail, setMapThumbnail] = useState<string>("");
  const [mapDimensions, setMapDimensions] = useState<string>("100x100");
  const [defaultElements, setDefaultElements] = useState<any[]>([]);
  const [availableElements, setAvailableElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<string>("");
  const [xCoord, setXCoord] = useState<number | "">("");
  const [yCoord, setYCoord] = useState<number | "">("");


  useEffect(() => {
    fetchAvailableElements();
  }, []);

  const fetchAvailableElements = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/elements`, {
        headers: { authorization: `Bearer ${token}` },
      });
      setAvailableElements(response.data.elements);
      // setError("");
    } catch (err) {
      showErrorToast({message:`Error:${err}`});
     
    }
  };

  const addDefaultElement = () => {
    if (!selectedElement || xCoord === "" || yCoord === "") {
    showErrorToast({message:"Please fill in all fields before adding an element."});
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
    // setError("");
  };

  const createMap = async () => {
    if (!mapName || !mapThumbnail || !mapDimensions) {
      showErrorToast({message:"Please provide all map details."});
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
          headers: { authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      showSuccessToast({message:`Map created successfully`});
      setDefaultElements([]);
      setMapName("");
      setMapThumbnail("");
      setMapDimensions("100x100");
    } catch (err) {
      // showErrorToast({message:`Error:${error}`});
      showErrorToast({message:"Failed to create map. Please check your inputs."});
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatedBackground></AnimatedBackground>
      <UserHeader/>
      <Navbar />
      <div className="container--map">
        <h1 className="title--map">Map Manager</h1>

        <div className="section--map">
          <h2 className="section-title--map">Create Map</h2>
          <div className="input-group--map">
            <input
              type="text"
              placeholder="Map Name"
              value={mapName}
              onChange={(e) => setMapName(e.target.value)}
              className="input--map"
            />
            <input
              type="text"
              placeholder="Map Thumbnail URL"
              value={mapThumbnail}
              onChange={(e) => setMapThumbnail(e.target.value)}
              className="input--map"
            />
            <input
              type="text"
              placeholder="Map Dimensions (e.g., 100x200)"
              value={mapDimensions}
              onChange={(e) => setMapDimensions(e.target.value)}
              className="input--map"
            />
          </div>
        </div>

        <div className="section--map">
          <h3 className="section-title--map">Add Default Elements</h3>
          <div className="elements-grid--map">
            {availableElements.map((element) => (
              <div
                key={element.id}
                className={`element-card--map ${
                  selectedElement === element.id ? "element-card-selected--map" : ""
                }`}
                onClick={() => setSelectedElement(element.id)}
              >
                <img
                  src={element.imageUrl}
                  alt={`Element ${element.id}`}
                  className="element-image--map"
                />
                <div className="element-info--map">
                  <p>{element.width}x{element.height}</p>
        
                </div>
              </div>
            ))}
          </div>

          <div className="coordinates-group--map">
            <input
              type="number"
              placeholder="X Coordinate"
              value={xCoord}
              onChange={(e) => setXCoord(e.target.value ? Number(e.target.value) : "")}
              className="coordinate-input--map"
            />
            <input
              type="number"
              placeholder="Y Coordinate"
              value={yCoord}
              onChange={(e) => setYCoord(e.target.value ? Number(e.target.value) : "")}
              className="coordinate-input--map"
            />
          </div>

          <button onClick={addDefaultElement} className="button-secondary--map">
            Add Default Element
          </button>

          <ul className="elements-list--map">
            {defaultElements.map((el, index) => (
              <li key={index} className="element-list-item--map">
                Element: {el.element} (x: {el.x}, y: {el.y})
              </li>
            ))}
          </ul>
        </div>

        <button onClick={createMap} className="button--map w-full">
          Create Map
        </button>
      </div>
    </div>
  );
};

export default MapManager;