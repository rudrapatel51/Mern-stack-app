import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaUserAlt, FaShoppingCart, FaHeart, FaSearch, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { useAuth } from "../Auth/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      {/* Top bar */}
      <div className="hidden lg:flex justify-between items-center px-4 py-2 text-sm text-gray-600">
        <div className="flex space-x-4">
          <Link to="/about" className="hover:text-green-500">About Us</Link>
          <Link to="/account" className="hover:text-green-500">My Account</Link>
          <Link to="/wishlist" className="hover:text-green-500">Wishlist</Link>
          <Link to="/order-tracking" className="hover:text-green-500">Order Tracking</Link>
        </div>
        <div className="flex items-center space-x-4">
          <span>Need help? Call Us: 1800 900</span>
          <select className="bg-transparent">
            <option>English</option>
          </select>
          <select className="bg-transparent">
            <option>USD</option>
          </select>
        </div>
      </div>

      {/* Main navbar */}
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-green-500">Mern Stack</span>
        </Link>

        {/* Search bar - hidden on mobile */}
        <div className="flex justify-center">
  <div className="hidden md:flex items-center mx-4">
    <select className="p-2 bg-gray-100 rounded-l-full">
      <option>All Categories</option>
      <option>Option 1</option>
      <option>Option 2</option>
      <option>Option 3</option>
      <option>Option 4</option>
    </select>
    <input
      type="text"
      placeholder="Search for items..."
      className="p-2 w-[300px] bg-gray-100"
    />
    <button className="p-2 bg-green-500 text-white rounded-r-full">
      <FaSearch size={22} />
    </button>
  </div>
</div>


        <div className="flex md:order-2 items-center space-x-6">
          <button className="hidden lg:block"><FaHeart size={20} /></button>
          <button className="hidden lg:flex items-center">
            <FaShoppingCart size={20} className="text-green-500" />
            <span className="ml-1">0</span>
          </button>
          {isLoggedIn ? (
            <Link to="/dashboard" className='flex items-center'>
              <FaUserAlt size={20} className='text-green-500' />
            </Link>
          ) : (
            <Link to="/login">
              <button type="button" className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center">
                Login
              </button>
            </Link>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-sticky"
            aria-expanded={isMenuOpen ? "true" : "false"}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom navbar - now responsive */}
      <div className={`lg:flex justify-between items-center px-4 py-2 bg-gray-100 ${isMenuOpen ? 'block' : 'hidden'}`}>
        <button className="hidden lg:flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded mb-2 lg:mb-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>Browse All Categories</span>
        </button>
        <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-2 lg:space-y-0">
          <NavLink to="/" className={({ isActive }) => isActive ? "text-green-500" : "hover:text-green-500"}>Home</NavLink>
          <NavLink to="/shop" className={({ isActive }) => isActive ? "text-green-500" : "hover:text-green-500"}>Shop</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "text-green-500" : "hover:text-green-500"}>About Us</NavLink>
          <NavLink to="/categories" className={({ isActive }) => isActive ? "text-green-500" : "hover:text-green-500"}>Categories</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "text-green-500" : "hover:text-green-500"}>Contact</NavLink>
        </div>
        <div className="flex items-center mt-2 lg:mt-0">
          <FaPhoneAlt className="text-green-500 mr-2" />
          <span>1900 - 888</span>
          <span className="ml-2 text-sm text-gray-500">24/7 Support Center</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;