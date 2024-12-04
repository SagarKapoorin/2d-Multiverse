
import { Plus, Edit } from 'lucide-react';
import Animated2 from '../components/Animated2';
import Navbar from '../components/Navbar';
import UserHeader from './UserHeader';
import { useNavigate } from 'react-router-dom';

const ElementsPage = () => {
    const navigate=useNavigate();
  return (
    <div className="elements-page--element3">
        <UserHeader/>
        <Navbar/>

      <Animated2 />
      
      <div className="elements-page__content--element3">
        <h1 className="elements-page__title--element3">Elements Dashboard</h1>
        
        <div className="elements-page__cards--element3">
          <div className="elements-page__card--element3">
            <div className="elements-page__card-icon--element3" onClick={()=>navigate("/element/create")}>
              <Plus size={32} />
            </div>
            <h2 className="elements-page__card-title--element3">Create Element</h2>
            <p className="elements-page__card-description--element3">
              Add a new element with custom dimensions and properties
            </p>
            <button className="elements-page__card-button--element3"  onClick={()=>navigate("/element/create")}>
              Create New
            </button>
          </div>

          <div className="elements-page__card--element3">
            <div className="elements-page__card-icon--element3"  onClick={()=>navigate("/element/update")}>
              <Edit size={32} />
            </div>
            <h2 className="elements-page__card-title--element3">Update Element</h2>
            <p className="elements-page__card-description--element3">
              Modify existing elements and their properties
            </p>
            <button className="elements-page__card-button--element3"  onClick={()=>navigate("/element/update")}>
              Update Existing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementsPage;