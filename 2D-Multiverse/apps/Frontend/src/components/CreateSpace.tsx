import React, { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSpaces } from "../state";
import { State_ } from "../state";

const CreateSpace: React.FC = () => {
  const dispatch = useDispatch();
  const spaces = useSelector((state: State_ ) => state.spaces);
  const [x, setX] = useState<number>(100);
  const [y, setY] = useState<number>(200);
  const [name, setName] = useState<string>("New" + Math.random());
  const [url, setUrl] = useState<string>("");
  const [mapId, setMapId] = useState<string | null>(null);

  useLayoutEffect(() => {
    const getAllSpaces = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/space/all", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        console.log(data);
        if (data.spaces) {
          dispatch(setSpaces({ spaces: data.spaces }));
        } else {
          console.error("No spaces data found");
        }
      } catch (error) {
        console.error("Error fetching spaces:", error);
      }
    };

    getAllSpaces();
  }, [dispatch]);

  const createSpaceBlank = async () => {
    try {
      const payload: { name: string; dimensions: string; mapId?: string } = {
        name: name,
        dimensions: `${x}x${y}`,
      };
      if (mapId) payload.mapId = mapId;

      const response = await fetch("http://localhost:3000/api/v1/space", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log(data);

      // Optionally refetch spaces after creation
      if (data.success) {
        dispatch(setSpaces({ spaces: [...spaces, data.newSpace] }));
      }
    } catch (error) {
      console.error("Error creating space:", error);
    }
  };

  const selectSpace = (name:string,dimensions: string, thumbnail: string | null) => {
    setUrl(thumbnail || "https://dummyimage.com/600x400/ffffff/ffffff");
    const [xPart, yPart] = dimensions.split("x").map(Number);
    setX(xPart);
    setY(yPart);
    setName(name);
    console.log(`Selected dimensions: ${dimensions}`);
  };

  return (
    <div style={{backgroundColor:"blue"}}>
      <div>
        <h2>Create Space</h2>
        <button onClick={createSpaceBlank}>Create Blank Space</button>
      </div>

        {spaces.map((space, index) => (
         <div>
          <img
            key={space.id}
            src={
              space.thumbnail || "https://dummyimage.com/600x400/ffffff/ffffff"
            }
            alt={`Space ${index + 1}`}
            style={{width:'50px'}}
            onClick={() => selectSpace(space.name,space.dimensions, space.thumbnail)}
          />
          <p>{space.name}</p>
          </div>
        ))}
  
    </div>
  );
};

export default CreateSpace;
