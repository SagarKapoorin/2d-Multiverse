import { BrowserRouter, Routes, Route } from "react-router-dom";
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
function App() {
  const isAuth = Boolean( useSelector((state:State_) => state.token));
  return (
    <>
    <BrowserRouter>
    <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/user"
              element={<ElementUpdater/>  }
            />
            <Route
              path="/Arena"
              element={isAuth ?<Arena/>:<Login/>}
            />
            {/* <Route
              path="/Faq"
              element={isAuth ? <FAQ /> : <Navigate to="/" />}
            />
             <Route
              path="/Contact"
              element={isAuth ? <Contact /> : <Navigate to="/" />}
            /> */}
          </Routes>

    </BrowserRouter>
     
    </>
  )
}

export default App
