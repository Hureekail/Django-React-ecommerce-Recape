import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';


import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ResetPassword from "./pages/ResetPassword"
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm"
import Activate from "./pages/Activate"

import GoogleAuth from "./components/GoogleAuth";

import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";

import { Provider } from 'react-redux';
import store from "./store";

function App() {
  return (
    <GoogleOAuthProvider 
      clientId="340850506135-go43tci2hl4pp7tsv806s43gj06jp004.apps.googleusercontent.com"
    >
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirm />} />
            <Route path="/activate/:uid/:token" element={<Activate />} />

            <Route path="/google" element={<GoogleAuth />} />

            <Route path="/profile" element={<Profile/>} />
            <Route path="/contact" element={<Contact/>} />
            <Route path="/about" element={<About/>} />
          </Routes>
        </Router>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;