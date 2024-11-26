import { useSelector, useDispatch } from "react-redux";
import { useLayoutEffect, useState, useEffect } from "react";
import SpiderBG from "../components/SpiderBG";

import { setAvatarId, State_,setLogin,setName,setRole } from "../state";

interface Avatar {
  id: string | null;
  imageUrl: string;
  name: string | null;
}

const User = () => {
  const dispatch = useDispatch();
  const [avatars, setAvatars] = useState<Avatar[]>([]);

  const imageUrl = useSelector((state: State_) => state.avatarId);
  const name = useSelector((state: State_) => state.name);
  const spaces = useSelector((state: State_) => state.spaces);
  const role = useSelector((state: State_) => state.role);

  const generateRandomString = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  };

  const [plus,setPlus]=useState(false);
  const [ChangeImage, setImage] = useState(false);
  const [img, setimg] = useState<string | null>(null);
  const [named, setnamed] = useState<string>(generateRandomString());
  const [updateImage, setImage2] = useState<string | null>("");

  const [Image, setImages] = useState<string>(
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
  );
  const fetchData2 = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/avatars", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setAvatars(data.avatars);
    } catch (error) {
      console.error("Error fetching avatars:", error);
    }
  };

  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/space/google/user", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        dispatch(
          setLogin({
          //   user: data.user,
            token: data.token,
          })
        );
        dispatch(
         setRole({
          role:data.role,
         })
        )
        dispatch(
          setName({
            name:data.name,
          })
        )
        dispatch(setAvatarId({ avatarId: data.avatar.imageUrl }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };


    fetchData();
    fetchData2();
  }, [dispatch]);

  useEffect(() => {
    if (imageUrl) {
      setImages(imageUrl);
    }
  }, [imageUrl]);

  const imageclicked = (x: string | null, y: string) => {
    setImages(y);
    setImage2(x);
  };

  const AddAvatar = async () => {
    console.log(JSON.stringify({ name: named ,imageUrl: img}))
    try {
      const response = await fetch("http://localhost:3000/api/v1/admin/avatar", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: named ,imageUrl: img}),
      });
      const data = await response.json();
      console.log(data);
      fetchData2();
    } catch (err) {
      console.log("Error :" + err);
    }
  };

  const AddAvatarCheck = (x: string, y: string) => {
    setimg(x);
    setnamed(y);
    AddAvatar();
  };

  const ChangeCallback = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/user/metadata", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatarId: updateImage }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  return (
    <div className="UserPage">
      <SpiderBG />
      <div className="User-SubPart">
        <div className="Profile-detail">
          <img src={Image} alt="My image" className="UserImage" />
          <h3 className="Username">{name}</h3>
          <h5 className="Role">{role}</h5>
          <h3 className="Role2">Made {spaces.length} Spaces Currently</h3>
        </div>
        <div className="update-button">
          {!ChangeImage && (
            <button className="Update-avatar" onClick={() => setImage(true)}>
              Change Image
            </button>
          )}
          {ChangeImage && (
            <div className="UpdateChoices">
              <div className="avatar">
                {avatars.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar.imageUrl}
                    alt={`Avatar ${index + 1}`}
                    className="UserImage2"
                    style={Image === avatar.imageUrl ? { border: "5px solid whitesmoke" } : {}}
                    onClick={() => imageclicked(avatar.id, avatar.imageUrl)}
                  />
                ))}
               {!plus && <button className="Plus" onClick={()=>setPlus(true)}>+</button>}
              </div>
            </div>
          )}
        </div>

        {ChangeImage && plus && (
          <div className="changeit">
            <input
              type="text"
              placeholder="Enter name"
              value={named}
              onChange={(e) => setnamed(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter Image URL"
              value={img || ""}
              onChange={(e) => setimg(e.target.value)}
            />
            <div className="L-Button">
            <button
              className="Update-avatar six"
              onClick={() => AddAvatarCheck(img || "", named)}
            >
              Submit
            </button>
            <button
              className="Update-avatar six"
              onClick={() => setPlus(false)}
            >
              Cancel
            </button>
          </div>
          </div>
        )}

        {ChangeImage && (
          <div className="changeit">
            <button className="Update-avatar" onClick={() => ChangeCallback()}>
              Change Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
