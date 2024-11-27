import React, { useLayoutEffect, useState } from "react";
import { State_ } from "../state";
import { useSelector } from "react-redux";
import axios from "axios";

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
      console.log(response.data.elements)
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
    //   console.log(response.data.elements);
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
    <div>
      <h1>Arena Manager</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {dimensions && (
        <div>
          <h2>Space Details</h2>
          <p>Dimensions: {dimensions}</p>
          <h3>Elements</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {elements.map((el) => (
              <li
                key={el.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                  gap: "10px",
                }}
              >
                <img
                  src={el.element.imageUrl}
                  alt={`Element ${el.id}`}
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
                <span>
                  (x: {el.x}, y: {el.y})
                </span>
                <button onClick={() => deleteElement(el.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3>Add Element</h3>
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
        <button onClick={addElement}>Add Element</button>
      </div>
    </div>
  );
};

export default Arena;
