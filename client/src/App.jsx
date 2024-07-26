import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './Authentication/Register'
import Login from "./Authentication/Login"
import Home from "./components/Home"
import UserDashboard from './User/UserDashboard';
import Layout from './outlet/Layout';
const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<UserDashboard/>} />
        {/* <Route path="*" element={<NoPage />} /> */}
        </Route>
    </Routes>
  </BrowserRouter>
  </>
  )
}

export default App
