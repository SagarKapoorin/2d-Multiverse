import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import { useSelector} from "react-redux";
import './App.css';
import Login from "./pages/Login";
import { State_ } from "./state";
// import User from "./pages/User";
// import CreateSpace from "./components/CreateSpace";
import SpaceManager from "./pages/SpaceManager";
import Arena from "./pages/Arena";
import MapManager from "./pages/MapManager";
import ElementUpdater from "./pages/ElementUpdater";
import DashBoard from "./pages/DashBoard";
import User from "./pages/User";
function App() {
  const isAuth = Boolean( useSelector((state:State_) => state.token));
  return (
    <>
    <BrowserRouter>
    <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/home"
              element={<DashBoard/>}
            />
             <Route
              path="/user"
              element={isAuth?<User/>:<Navigate to="/"/>  }
            />
            <Route
              path="/arena"
              element={isAuth ?<Arena/>:<Navigate to="/"/>}
            />
            <Route
              path="/space"
              element={isAuth ? <SpaceManager /> : <Navigate to="/" />}
            />
             <Route
              path="/map"
              element={isAuth ? <MapManager /> : <Navigate to="/" />}
            />
            <Route
            path="/elements"
            element={isAuth?<ElementUpdater/>:<Navigate to="/"/>}
            />
          </Routes>

    </BrowserRouter>
     
    </>
  )
}

export default App
