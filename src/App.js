

import Home from "./components/HomePage/main"
import Login from "./components/LoginPage"
import NotFound from "./components/NotFoundPage"
import User from "./components/UserPage"

import {BrowserRouter, Route, Routes} from "react-router-dom"
import ProtectedRoute from "./protectedApp"

function App() {
  return (
    <BrowserRouter>
     <Routes>
    <Route exact path="/login" element={<Login/> } />

     <Route  element={<ProtectedRoute   extraProps={{name:"Admin"}}/>}>
     <Route exact path="/" element={<Home/>} />
     </Route>
{/* User Routes*/}
     <Route  element={<ProtectedRoute   extraProps={{name:"User"}}/>}>
     <Route exact path="/User" element={<User/>} />
     </Route>
{/* User Routes*/}
      <Route path="*" element={<NotFound/>}/>
    </Routes>
     
    </BrowserRouter>
  );
}

export default App;
