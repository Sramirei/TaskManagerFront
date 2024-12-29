import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserContext from "./Context/userContext";
import { ProtectedRoute } from "./Components/ProtectedRoute";

import Login from "./Views/Login/Login";
import Home from "./Views/Home/Home";
const App = () => {
  const { session } = useContext(UserContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login session={session} />} />
        <Route path="/" element={<Login session={session} />} />
        <Route element={<ProtectedRoute isAllowed={!!session} />}>
          <Route path="/home" element={<Home session={session} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
