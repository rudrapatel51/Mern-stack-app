import React from 'react'
import Navbar from '../navbar/Navbar'
import Home from '../components/Home'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div>
      <Navbar/>
      <Outlet/>
    </div>
  )
}

export default Layout
