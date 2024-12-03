import  { useLayoutEffect, useState, useEffect } from "react";
import { UserCircle2, PlusCircle, X } from "lucide-react";
import { setAvatarId, setLogin, setName, setRole, State_ } from "../state/index";
import { useSelector,useDispatch } from "react-redux";
import SpiderBG from "../components/SpiderBG";

interface Avatar {
  id: string | null;
  imageUrl: string;
  name: string | null;
}

const User = () => {
  const dispatch = useDispatch();
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const imageUrl = useSelector((state:State_) => state.avatarId);
  const name = useSelector((state:State_) => state.name);
  const spaces = useSelector((state:State_) => state.spaces);
  const role = useSelector((state:State_) => state.role);

  const [plus, setPlus] = useState(false);
  const [ChangeImage, setImage] = useState(false);
  const [img, setimg] = useState<string | null>(null);
  const [named, setnamed] = useState<string>(() => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array(5).fill(0).map(() => characters[Math.floor(Math.random() * characters.length)]).join('');
  });
  const [updateImage, setImage2] = useState<string | null>("");
  const [Image, setImages] = useState<string>(imageUrl || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y");

  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/space/google/user", {
          credentials: "include",
        });
        const data = await response.json();
        dispatch(setLogin({ token: data.token }));
        dispatch(setRole({ role: data.role }));
        dispatch(setName({ name: data.name }));
        dispatch(setAvatarId({ avatarId: data.avatar.imageUrl }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchAvatars = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/avatars", {
          credentials: "include",
        });
        const data = await response.json();
        setAvatars(data.avatars);
      } catch (error) {
        console.error("Error fetching avatars:", error);
      }
    };

    fetchData();
    fetchAvatars();
  }, [dispatch]);

  useEffect(() => {
    if (imageUrl) setImages(imageUrl);
  }, [imageUrl]);

  const handleAvatarClick = (id: string | null, imageUrl: string) => {
    setImages(imageUrl);
    setImage2(id);
  };

  const handleAddAvatar = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/admin/avatar", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: named, imageUrl: img }),
      });
      if (response.ok) {
        const fetchAvatars = await fetch("http://localhost:3000/api/v1/avatars", {
          credentials: "include",
        });
        const data = await fetchAvatars.json();
        setAvatars(data.avatars);
        setPlus(false);
        setimg(null);
        setnamed("");
      }
    } catch (err) {
      console.error("Error adding avatar:", err);
    }
  };

  const handleUpdateAvatar = async () => {
    try {
      await fetch("http://localhost:3000/api/v1/user/metadata", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarId: updateImage }),
      });
      setImage(false);
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  return (
    <div className="profile--user">
      <SpiderBG />
      
      <div className="profile__container--user">
        <div className="profile__header--user">
          <div className="profile__avatar--user">
            {Image ? (
              <img src={Image} alt={name || 'User'} />
            ) : (
              <UserCircle2 size={120} />
            )}
          </div>
          <div className="profile__info--user">
            <h1 className="profile__name--user">{name}</h1>
            <span className="profile__role--user">{role}</span>
            <span className="profile__spaces--user">
              {spaces.length} Space{spaces.length !== 1 ? 's' : ''} Created
            </span>
          </div>
        </div>

        <div className="profile__actions--user">
          {!ChangeImage ? (
            <button 
              className="profile__button--user"
              onClick={() => setImage(true)}
            >
              Change Avatar
            </button>
          ) : (
            <div className="profile__avatar-selector--user">
              <div className="profile__avatars-grid--user">
                {avatars.map((avatar, index) => (
                  <div 
                    key={index}
                    className={`profile__avatar-option--user ${Image === avatar.imageUrl ? 'profile__avatar-option--selected--user' : ''}`}
                    onClick={() => handleAvatarClick(avatar.id, avatar.imageUrl)}
                  >
                    <img src={avatar.imageUrl} alt={avatar.name || `Avatar ${index + 1}`} />
                  </div>
                ))}
                {!plus && (
                  <button 
                    className="profile__add-avatar--user"
                    onClick={() => setPlus(true)}
                  >
                    <PlusCircle size={24} />
                  </button>
                )}
              </div>

              {plus && (
                <div className="profile__add-form--user">
                  <div className="profile__form-header--user">
                    <h3>Add New Avatar</h3>
                    <button 
                      className="profile__close-button--user"
                      onClick={() => setPlus(false)}
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Avatar name"
                    value={named}
                    onChange={(e) => setnamed(e.target.value)}
                    className="profile__input--user"
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={img || ""}
                    onChange={(e) => setimg(e.target.value)}
                    className="profile__input--user"
                  />
                  <button 
                    className="profile__button--user"
                    onClick={handleAddAvatar}
                  >
                    Add Avatar
                  </button>
                </div>
              )}

              {!plus && (
                <button 
                  className="profile__button--user"
                  onClick={handleUpdateAvatar}
                >
                  Save Changes
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;