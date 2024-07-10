import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './Authentication/Register'
import Login from "./Authentication/Login"
import Home from "./components/Home"
const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>} />
        {/* <Route path="*" element={<NoPage />} /> */}
    </Routes>
  </BrowserRouter>
  </>
  )
}

export default App
