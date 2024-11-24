import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { useSelector, UseSelector } from "react-redux";
import './App.css';
import Login from "./pages/Login";

// interface State{
//   user:string|null,
//   token:string|null,
//   spaces:any[],
// }

function App() {
  // const isAuth = Boolean( useSelector((state:State) => state.token));

  return (
    <>
    <BrowserRouter>
    <Routes>
            <Route path="/" element={<Login />} />
            {/* <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
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
