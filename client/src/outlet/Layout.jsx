import React from 'react'
import Navbar from '../navbar/Navbar'
import Home from '../components/Home'
import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'
import Cart from '../cart/Cart'

const Layout = () => {
  return (
    <div>
      <Navbar/>
      <Outlet/>
      <Cart/>
      <Footer/>
    </div>
  )
}

export default Layout
