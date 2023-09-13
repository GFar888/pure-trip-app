import "./scss/App.scss";
import React from "react";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";

import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import { Route, Routes } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes";
import Settings from "./pages/settings/Settings";
import Tours_list from "./pages/tours_lists/Tours_list";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route
          element={
            <React.Fragment>
              <Header />
              <div className="body-wrapper">
                <PrivateRoutes />
              </div>
            </React.Fragment>
          }
        >
          <Route element={<Sidebar />}>
            <Route path="/home" element={<Tours_list />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
