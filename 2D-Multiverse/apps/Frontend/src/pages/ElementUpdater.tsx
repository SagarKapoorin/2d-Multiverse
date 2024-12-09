import React, { useEffect, useState } from "react";
import axios from "axios";
import { State_ } from "../state";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import UserHeader from "./UserHeader";
import { showErrorToast, showSuccessToast } from "../components/Message";
// import { ToastContainer } from "../components/MessageContainer";
// import "../styles/ElementUpdater.css";

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
    } catch (err) {
      showErrorToast({message:"Failed to fetch elements."});
    }
  };

  const updateElementImage = async () => {
    if (!selectedElementId || !newImageUrl) {
      showErrorToast({message:"Please select an element and provide a new image URL."});
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
      showSuccessToast({message:"Success"});
      console.log(response);
      fetchElements();
      setNewImageUrl("");
    } catch (err) {
      showErrorToast({message:"Failed to update the element image URL."});
    }
  };

  return (
    <div className="container--element1">
      <UserHeader/>
      <Navbar />
      <h1 className="title--element1">Update Element Image</h1>

      <div className="elements-section--element1">
        <h2 className="section-title--element1">Available Elements</h2>
        <div className="elements-grid--element1">
          {elements.map((element) => (
            <div
              key={element.id}
              className={`element-card--element1 ${
                selectedElementId === element.id ? "selected" : ""
              }`}
              onClick={() => setSelectedElementId(element.id)}
            >
              <img
                src={element.imageUrl}
                alt={`Element ${element.id}`}
                className="element-image--element1"
              />
              {/* <p className="element-id--element1">ID: {element.id}</p> */}
            </div>
          ))}
        </div>
      </div>

      <div className="update-section--element1">
        <h3 className="update-title--element1">Update Selected Element</h3>
        {selectedElementId ? (
          <>
            <p className="selected-id--element1">
              Selected Element ID: {selectedElementId}
            </p>
            <input
              type="text"
              className="input--element1"
              placeholder="Enter new image URL"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
            <button className="button--element1" onClick={updateElementImage}>
              Update Image URL
            </button>
          </>
        ) : (
          <p>Please select an element to update.</p>
        )}
      </div>
      
    </div>
  );
};

export default ElementUpdater;