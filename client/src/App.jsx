import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './Authentication/Register'
import Login from "./Authentication/Login"
import Home from "./components/Home"
import UserDashboard from './User/UserDashboard';
import Layout from './outlet/Layout';
import AdminRegister from './admin/AdminRegister';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import Shop from './components/Shop';
import SingleProductPage from './components/single_product/SingleProductPage';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/product/:id" element={<SingleProductPage />} />
            {/* <Route path="*" element={<NoPage />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
