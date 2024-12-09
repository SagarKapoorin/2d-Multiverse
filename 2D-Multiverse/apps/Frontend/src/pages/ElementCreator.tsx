import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { State_ } from '../state';
import AnimatedBackground from '../Animation/Animation';
import Navbar from '../components/Navbar';
import UserHeader from './UserHeader';

const BACKEND_URL = "http://localhost:3000/";

const ElementCreator = () => {
  const [formData, setFormData] = useState({
    imageUrl: '',
    width: 1,
    height: 1,
    static: true,
  });

  const adminToken = useSelector((state:State_)=>state.token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const element1Response = await axios.post(
        `${BACKEND_URL}/api/v1/admin/element`,
        {
          imageUrl: formData.imageUrl,
          width: formData.width,
          height: formData.height,
          static: formData.static,
        },
        {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );

      console.log('Element created successfully:', element1Response.data);
      alert('Element created successfully!');
    } catch (error) {
      console.error('Error creating element:', error);
      alert('Failed to create element. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="element-creator--element3">
      <Navbar/>
      <UserHeader/>
        <AnimatedBackground/>
      <div className="element-creator__container--element3">
        <h1 className="element-creator__title--element3">Create New Element</h1>
        
        <form className="element-creator__form--element3" onSubmit={handleSubmit}>
          <div className="element-creator__preview--element3">
            {formData.imageUrl && (
              <img 
                src={formData.imageUrl} 
                alt="Element preview" 
                className="element-creator__image--element3"
              />
            )}
          </div>

          <div className="element-creator__field--element3">
            <label className="element-creator__label--element3">
              Image URL:
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="element-creator__input--element3"
                placeholder="Enter image URL"
              />
            </label>
          </div>

          <div className="element-creator__dimensions--element3">
            <div className="element-creator__field--element3">
              <label className="element-creator__label--element3">
                Width:
                <input
                  type="number"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  min="1"
                  className="element-creator__input--element3"
                />
              </label>
            </div>

            <div className="element-creator__field--element3">
              <label className="element-creator__label--element3">
                Height:
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min="1"
                  className="element-creator__input--element3"
                />
              </label>
            </div>
          </div>

          <div className="element-creator__field--element3">
            <label className="element-creator__checkbox-label--element3">
              <input
                type="checkbox"
                name="static"
                checked={formData.static}
                onChange={handleChange}
                className="element-creator__checkbox--element3"
              />
              Static Element
            </label>
          </div>

          <button type="submit" className="element-creator__button--element3">
            Create Element
          </button>
        </form>
      </div>
    </div>
  );
};

export default ElementCreator;
