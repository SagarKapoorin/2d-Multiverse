import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import { useSelector} from "react-redux";
import './App.css';
// import Login from "./pages/Login";
import { State_ } from "./state";
// import User from "./pages/User";
// import CreateSpace from "./components/CreateSpace";
import SpaceManager from "./pages/SpaceManager";
import Arena from "./pages/Arena";
import MapManager from "./pages/MapManager";
import ElementUpdater from "./pages/ElementUpdater";
import DashBoard from "./pages/DashBoard";
import User from "./pages/User";
import Form from "./pages/Form";
import ElementCreator from "./pages/ElementCreator";
import ElementsPage from "./pages/ElementPage";
import WebSockets from "./pages/WebSocket";
import { ToastContainer } from "./components/MessageContainer";
function App() {
  const isAuth = Boolean( useSelector((state:State_) => state.token));
  return (
    <>
    <BrowserRouter>
    <Routes>
            <Route path="/" element={<Form />} />
            <Route
              path="/home"
              element={<DashBoard/>}
            />
            <Route
            path="/stadium"
            element={isAuth ?<WebSockets/>:<Navigate to="/"/>}
            />
             <Route
              path="/user"
              element={isAuth ?<User/>:<Navigate to="/"/>  }
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
            path="/element/update"
            element={isAuth?<ElementUpdater/>:<Navigate to="/"/>}
            />
            <Route
            path="/element/create"
            element={isAuth?<ElementCreator/>:<Navigate to="/"/>}
            />
             <Route
            path="/elements"
            element={isAuth?<ElementsPage/>:<Navigate to="/"/>}
            />
          </Routes>

    </BrowserRouter>
     <ToastContainer/>
    </>
  )
}

export default App
