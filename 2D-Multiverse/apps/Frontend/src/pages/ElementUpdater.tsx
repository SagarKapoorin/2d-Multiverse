import React, { useEffect, useState } from "react";
import axios from "axios";
import { State_ } from "../state";
import { useSelector } from "react-redux";

const BACKEND_URL = "http://localhost:3000/api/v1";

interface Element {
  id: string;
  imageUrl: string;
}

const ElementUpdater: React.FC = () => {
const token = useSelector((state: State_) => state.token);
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string>("");
  const [newImageUrl, setNewImageUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    fetchElements();
  }, []);

  const fetchElements = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/elements`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setElements(response.data.elements);
      setError("");
    } catch (err) {
      setError("Failed to fetch elements.");
    }
  };

  const updateElementImage = async () => {
    if (!selectedElementId || !newImageUrl) {
      setError("Please select an element and provide a new image URL.");
      return;
    }

    try {
      const response = await axios.put(
        `${BACKEND_URL}/admin/element/${selectedElementId}`,
        { imageUrl: newImageUrl },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(response.data.message);
      setError("");
      fetchElements(); 
      setNewImageUrl("");
    } catch (err) {
      setError("Failed to update the element image URL.");
    }
  };

  return (
    <div>
      <h1>Update Element Image</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <div>
        <h2>Available Elements</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {elements.map((element) => (
            <div
              key={element.id}
              style={{
                border: selectedElementId === element.id ? "2px solid blue" : "1px solid gray",
                padding: "10px",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => setSelectedElementId(element.id)}
            >
              <img
                src={element.imageUrl}
                alt={`Element ${element.id}`}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <p>ID: {element.id}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3>Update Selected Element</h3>
        {selectedElementId ? (
          <>
            <p>Selected Element ID: {selectedElementId}</p>
            <input
              type="text"
              placeholder="Enter new image URL"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
            <button onClick={updateElementImage}>Update Image URL</button>
          </>
        ) : (
          <p>Please select an element to update.</p>
        )}
      </div>
    </div>
  );
};

export default ElementUpdater;
