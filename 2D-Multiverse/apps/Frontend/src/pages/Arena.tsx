import React, { useLayoutEffect, useState } from "react";
import { State_ } from "../state";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../components/Navbar";
import Animated2 from "../components/Animated2";
import UserHeader from "./UserHeader";
// import "./styles/arena.css";

const BACKEND_URL = "http://localhost:3000/api/v1";

interface Element {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
  static: boolean;
}

const Arena: React.FC = () => {
  const spaceId = useSelector((state: State_) => state.selectSpaceId);
  const token = useSelector((state: State_) => state.token);
  const [elements, setElements] = useState<any[]>([]);
  const [availableElements, setAvailableElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<string>("");
  const [xCoord, setXCoord] = useState<number | "">("");
  const [yCoord, setYCoord] = useState<number | "">("");
  const [dimensions, setDimensions] = useState<string>("");
  const [error, setError] = useState<string>("");

  useLayoutEffect(() => {
    fetchAvailableElements();
    fetchSpaceDetails(spaceId);
  }, []);

  const fetchSpaceDetails = async (id: string) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/space/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setElements(response.data.elements);
      setDimensions(response.data.dimensions);
      setError("");
    } catch (err) {
      setError("Failed to fetch space details. Please check the Space ID.");
    }
  };

  const fetchAvailableElements = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/elements`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setAvailableElements(response.data.elements);
    } catch (err) {
      setError("Failed to fetch available elements.");
    }
  };

  const deleteElement = async (elementId: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/space/element`, {
        data: { id: elementId },
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      fetchSpaceDetails(spaceId);
    } catch (err) {
      setError("Failed to delete element.");
    }
  };

  const addElement = async () => {
    if (!selectedElement || xCoord === "" || yCoord === "") {
      setError("Please fill in all fields before adding an element.");
      return;
    }
    try {
      await axios.post(
        `${BACKEND_URL}/space/element`,
        {
          elementId: selectedElement,
          spaceId,
          x: Number(xCoord),
          y: Number(yCoord),
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      fetchSpaceDetails(spaceId);
      setXCoord("");
      setYCoord("");
      setSelectedElement("");
    } catch (err) {
      setError("Failed to add element. Ensure the coordinates are within dimensions.");
    }
  };

  return (
    <>
      <Navbar />
      <UserHeader/>
      <Animated2/>
      <div className="container--arena2">
        <h1 className="title--arena2">Arena Manager</h1>
        {error && <p className="error--arena2">{error}</p>}

        {dimensions && (
          <div className="space-details--arena2">
            <h2 className="section-title--arena2">Space Details</h2>
            <p className="dimensions--arena2">Dimensions: {dimensions}</p>
            <h3 className="section-title--arena2">Elements</h3>
            <ul className="elements-list--arena2">
              {elements.map((el) => (
                <li key={el.id} className="element-item--arena2">
                  <img
                    src={el.element.imageUrl}
                    alt={`Element ${el.id}`}
                    className="element-image--arena2"
                  />
                  <span className="coordinates--arena2">
                    (x: {el.x}, y: {el.y})
                  </span>
                  <button
                    className="delete-button--arena2"
                    onClick={() => deleteElement(el.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="add-element-section--arena2">
          <h3 className="section-title--arena2">Add Element</h3>
          <div className="elements-grid--arena2">
            {availableElements.map((element) => (
              <div
                key={element.id}
                className={`element-card--arena2 ${
                  selectedElement === element.id ? "selected" : ""
                }`}
                onClick={() => setSelectedElement(element.id)}
              >
                <img
                  src={element.imageUrl}
                  alt={`Element ${element.id}`}
                  className="element-preview--arena2"
                />
                <p className="dimensions-text--arena2">
                  {element.width}x{element.height}
                </p>
              </div>
            ))}
          </div>
          <div className="coordinates-input--arena2">
            <input
              type="number"
              placeholder="X Coordinate"
              value={xCoord}
              onChange={(e) => setXCoord(e.target.value ? Number(e.target.value) : "")}
              className="input-field--arena2"
            />
            <input
              type="number"
              placeholder="Y Coordinate"
              value={yCoord}
              onChange={(e) => setYCoord(e.target.value ? Number(e.target.value) : "")}
              className="input-field--arena2"
            />
          </div>
          <button className="add-button--arena2" onClick={addElement}>
            Add Element
          </button>
        </div>
      </div>
    </>
  );
};

export default Arena;