import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { useSelector} from "react-redux";
import './App.css';
import Login from "./pages/Login";
// import { State_ } from "./state";
// import User from "./pages/User";
// import CreateSpace from "./components/CreateSpace";
import SpaceManager from "./pages/SpaceManager";
function App() {
  // const isAuth = Boolean( useSelector((state:State_) => state.token));
  return (
    <>
    <BrowserRouter>
    <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/user"
              element={<SpaceManager/>  }
            />
            {/* <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
            <Route
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
