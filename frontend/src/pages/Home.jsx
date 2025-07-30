import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBooking } from '../store/BookingContext'

function Home() {
  const { stations } = useBooking()
  const [searchData, setSearchData] = useState({
    fromStation: '',
    toStation: '',
    date: '',
    returnDate: ''
  })

  const popularRoutes = [
    { from: 'Lahore', to: 'Karachi', business: 8290, economy: 6700 },
    { from: 'Lahore', to: 'Islamabad', business: 2450, economy: 1890 },
    { from: 'Multan', to: 'Karachi', business: 5500, economy: 4000 },
    { from: 'Lahore', to: 'Peshawar', business: 3600, economy: 2490 },
    { from: 'Karachi', to: 'Islamabad', business: 8290, economy: 6700 },
    { from: 'Faisalabad', to: 'Lahore', business: 1370, economy: 1050 }
  ]

  // Get the stations array safely
  const getStationsArray = () => {
    if (!stations) return []
    
    // If stations is directly an array
    if (Array.isArray(stations)) {
      return stations
    }
    
    // If stations has a nested stations property
    if (stations.stations && Array.isArray(stations.stations)) {
      return stations.stations
    }
    
    // If stations has other possible property names, add them here
    if (stations.data && Array.isArray(stations.data)) {
      return stations.data
    }
    
    return []
  }

  const stationsArray = getStationsArray()

  const handleSearchChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchData)
    window.location.href = `/addbooking?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Section */}
      <div className="w-full bg-[#78B9B5] border-b-4 border-[#0F828C] py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#320A6B] mb-2">
            Book Your Bus Journey
          </h1>
          <p className="text-[#065084] mb-6">
            Simple, secure, and reliable bus ticket booking for all major cities.
          </p>
          <form onSubmit={handleSearch} className="bg-white rounded shadow p-4 flex flex-col md:flex-row gap-2 items-center justify-center">
            <select
              name="fromStation"
              value={searchData.fromStation}
              onChange={handleSearchChange}
              className="px-3 py-2 border border-[#78B9B5] rounded text-[#065084] w-full md:w-auto"
              required
            >
              <option value="">From</option>
              {stationsArray.map(station => (
                <option key={station.id || station.stationId} value={station.stationId || station.id}>
                  {station.city || station.name}
                </option>
              ))}
            </select>
            <select
              name="toStation"
              value={searchData.toStation}
              onChange={handleSearchChange}
              className="px-3 py-2 border border-[#78B9B5] rounded text-[#065084] w-full md:w-auto"
              required
            >
              <option value="">To</option>
              {stationsArray.map(station => (
                <option key={station.id || station.stationId} value={station.stationId || station.id}>
                  {station.city || station.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              name="date"
              value={searchData.date}
              onChange={handleSearchChange}
              className="px-3 py-2 border border-[#78B9B5] rounded text-[#065084] w-full md:w-auto"
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <button
              type="submit"
              className="bg-[#0F828C] text-white px-4 py-2 rounded hover:bg-[#065084] transition-colors w-full md:w-auto"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Popular Routes Section */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-[#065084] mb-6 text-center">Popular Routes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularRoutes.map((route, index) => (
            <div key={index} className="bg-white border border-[#78B9B5] rounded shadow-sm p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-[#320A6B]">{route.from} → {route.to}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#065084]">Business</span>
                <span className="font-bold text-[#0F828C]">PKR {route.business.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#065084]">Economy</span>
                <span className="font-bold text-[#320A6B]">PKR {route.economy.toLocaleString()}</span>
              </div>
              <Link
                to={`/addbooking?fromStation=${route.from}&toStation=${route.to}`}
                className="mt-2 bg-[#065084] text-white text-center py-1 rounded hover:bg-[#320A6B] transition-colors"
              >
                Book Now
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Debug Info - Remove this in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="max-w-5xl mx-auto px-4 py-4">
          <details className="bg-gray-100 p-4 rounded">
            <summary className="cursor-pointer font-medium">Debug: Stations Data</summary>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(stations, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}

export default Home