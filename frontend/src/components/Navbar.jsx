import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../store/UserContext'

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { currentUser, logout, isAdmin, isStationMaster } = useUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getRoleBadge = () => {
    if (isAdmin()) return <span className="bg-[#320A6B] text-white text-xs font-medium px-2.5 py-0.5 rounded-full">Admin</span>
    if (isStationMaster()) return <span className="bg-[#78B9B5] text-[#065084] text-xs font-medium px-2.5 py-0.5 rounded-full">Station Master</span>
    return <span className="bg-[#0F828C] text-white text-xs font-medium px-2.5 py-0.5 rounded-full">User</span>
  }

  return (
    <nav className="bg-white border-b border-[#78B9B5] fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-[#0F828C] rounded flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="ml-2 text-lg font-bold text-[#065084]">Bus Booking</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-[#065084] hover:text-[#0F828C] px-2 py-1 rounded text-sm font-medium transition-colors">Home</Link>
            <Link to="/addbooking" className="text-[#065084] hover:text-[#0F828C] px-2 py-1 rounded text-sm font-medium transition-colors">Book Ticket</Link>
            <Link to="/showbooking" className="text-[#065084] hover:text-[#0F828C] px-2 py-1 rounded text-sm font-medium transition-colors">My Bookings</Link>
            {(isAdmin() || isStationMaster()) && (
              <Link to="/dashboard" className="text-[#065084] hover:text-[#0F828C] px-2 py-1 rounded text-sm font-medium transition-colors">Dashboard</Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-[#065084] hover:text-[#0F828C] focus:outline-none transition-colors"
                >
                  <div className="h-8 w-8 bg-[#320A6B] rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {currentUser.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-[#065084]">{currentUser.username}</p>
                    <div className="flex items-center space-x-2">
                      {getRoleBadge()}
                    </div>
                  </div>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow py-1 z-50 border border-[#78B9B5]">
                    <div className="px-4 py-2 border-b border-[#78B9B5]">
                      <p className="text-sm font-medium text-[#065084]">{currentUser.username}</p>
                      <p className="text-xs text-[#0F828C]">{currentUser.email}</p>
                      <div className="mt-1">{getRoleBadge()}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-[#065084] hover:bg-[#78B9B5] hover:text-[#320A6B] transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-[#065084] hover:text-[#0F828C] px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#0F828C] text-white px-4 py-1 rounded text-sm font-medium hover:bg-[#320A6B] transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar