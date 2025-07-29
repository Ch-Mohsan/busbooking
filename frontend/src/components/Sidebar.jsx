import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUser } from '../store/UserContext'

function Sidebar() {
  const location = useLocation()
  const { currentUser, isAdmin, isStationMaster } = useUser()

  const isActive = (path) => location.pathname === path

  const navigationItems = [
    { name: 'Home', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Book Ticket', path: '/addbooking', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
    { name: 'My Bookings', path: '/showbooking', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ]

  const adminItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { name: 'Manage Stations', path: '/stations', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
    { name: 'All Bookings', path: '/all-bookings', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ]

  const stationMasterItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { name: 'Station Bookings', path: '/station-bookings', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ]

  const allItems = [
    ...navigationItems,
    ...(isAdmin() ? adminItems : []),
    ...(isStationMaster() ? stationMasterItems : [])
  ]

  return (
    <div className="fixed left-0 top-14 h-full w-56 bg-[#f8fafc] border-r border-[#78B9B5] z-40">
      <div className="flex flex-col h-full">
        {/* User Info */}
        {currentUser && (
          <div className="p-4 border-b border-[#78B9B5]">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-[#320A6B] rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {currentUser.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#065084]">{currentUser.username}</p>
                <p className="text-xs text-[#0F828C]">{currentUser.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {allItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-[#78B9B5] text-[#320A6B] border-r-4 border-[#0F828C]'
                  : 'text-[#065084] hover:bg-[#e6f2f1] hover:text-[#0F828C]'
              }`}
            >
              <svg
                className={`h-5 w-5 ${
                  isActive(item.path) ? 'text-[#320A6B]' : 'text-[#0F828C]'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#78B9B5]">
          <div className="text-xs text-[#0F828C] text-center">
            Bus Booking System<br />v1.0.0
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar