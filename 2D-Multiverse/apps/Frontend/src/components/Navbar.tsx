import styled from 'styled-components';
// import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HouseIcon from '@mui/icons-material/House';
import StadiumIcon from '@mui/icons-material/Stadium';
import MapIcon from '@mui/icons-material/Map';
import FlagIcon from '@mui/icons-material/Flag';
import { useSelector } from 'react-redux';
import { State_ } from '../state';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const role=useSelector((state:State_)=>state.role);
  const admin:boolean=role==='Admin'?true:false;
  const navigate=useNavigate();
  return (
    <StyledWrapper>
      <div className="button-container" style={admin?{width:'250px'}:{width:'140px'}}>
        <button className="button" onClick={()=>navigate("/home")}>
        <HouseIcon/>
        </button>
        <button className="button" onClick={()=>navigate("/space")}>
        <StadiumIcon/>
        </button>
       {admin && <><button className="button" onClick={()=>navigate("/map")}>
          <MapIcon/>
        </button>
       
        <button className="button" onClick={()=>navigate("/elements")}>
          <FlagIcon/>
        </button>
        </>
}
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button-container {
  transform: rotate(90deg);
  transform-origin: center;
  z-index:3;
    display: flex;
    background-color: rgba(245, 73, 144);
    height: 40px;
    position:fixed;
    top:200px;
    <left:-90>
    </left:-90>px;
    align-items: center;
    justify-content: space-around;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px,
          rgba(245, 73, 144, 0.5) 5px 10px 15px;
  }

  .button {
    transform: rotate(-90deg);
  transform-origin: center;
    outline: 0 !important;
    border: 0 !important;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    transition: all ease-in-out 0.3s;
    cursor: pointer;
  }

  .button:hover {
  transform-origin: center;
    transform: translateX(-3px) rotate(-90deg);
  }

  .icon {
    font-size: 20px;
  }`;

export default Navbar;
