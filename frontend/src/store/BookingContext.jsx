import React, { createContext, useContext, useState, useEffect } from 'react'

const BookingContext = createContext()

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}

export const BookingProvider = ({ children }) => {
  const [stations, setStations] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedStations = localStorage.getItem('busStations')
    const savedBookings = localStorage.getItem('busBookings')
    
    if (savedStations) {
      setStations(JSON.parse(savedStations))
    } else {
      // Initialize with default stations
      const defaultStations = [
        { id: 1, city: 'Lahore', stationName: 'Lahore Central Terminal', stationId: 'LHR001' },
        { id: 2, city: 'Karachi', stationName: 'Karachi Central Terminal', stationId: 'KHI001' },
        { id: 3, city: 'Islamabad', stationName: 'Islamabad Central Terminal', stationId: 'ISB001' },
        { id: 4, city: 'Multan', stationName: 'Multan Central Terminal', stationId: 'MUL001' },
        { id: 5, city: 'Faisalabad', stationName: 'Faisalabad Central Terminal', stationId: 'FSD001' },
        { id: 6, city: 'Peshawar', stationName: 'Peshawar Central Terminal', stationId: 'PES001' },
        { id: 7, city: 'Quetta', stationName: 'Quetta Central Terminal', stationId: 'QTA001' },
        { id: 8, city: 'Rawalpindi', stationName: 'Rawalpindi Central Terminal', stationId: 'RWP001' }
      ]
      setStations(defaultStations)
      localStorage.setItem('busStations', JSON.stringify(defaultStations))
    }
    
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings))
    }
  }, [])

  // Save stations to localStorage whenever they change
  useEffect(() => {
    if (stations.length > 0) {
      localStorage.setItem('busStations', JSON.stringify(stations))
    }
  }, [stations])

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('busBookings', JSON.stringify(bookings))
  }, [bookings])

  // Add new station (Admin only)
  const addStation = (stationData) => {
    const newStation = {
      id: Date.now(),
      city: stationData.city,
      stationName: stationData.stationName,
      stationId: stationData.stationId
    }
    setStations(prev => [...prev, newStation])
  }

  // Create new booking
  const createBooking = (bookingData) => {
    const { travelType, fromStation, toStation, date, time, seats, userId, username } = bookingData
    
    // Validate seat availability
    const existingBookings = bookings.filter(booking => 
      booking.date === date && 
      booking.time === time && 
      booking.fromStation === fromStation && 
      booking.toStation === toStation
    )
    
    const bookedSeats = existingBookings.flatMap(booking => booking.seats)
    const requestedSeats = seats.map(seat => seat.number)
    
    // Check for seat conflicts
    const seatConflicts = requestedSeats.filter(seat => bookedSeats.includes(seat))
    if (seatConflicts.length > 0) {
      throw new Error(`Seats ${seatConflicts.join(', ')} are already booked for this time`)
    }

    const newBooking = {
      id: Date.now(),
      travelType,
      fromStation,
      toStation,
      date,
      time,
      seats,
      userId,
      username,
      totalAmount: seats.length * (travelType === 'business' ? 5500 : 4000),
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
    
    setBookings(prev => [...prev, newBooking])
    return newBooking
  }

  // Get bookings by user
  const getUserBookings = (userId) => {
    return bookings.filter(booking => booking.userId === userId)
  }

  // Get all bookings (Admin/Station Master)
  const getAllBookings = () => {
    return bookings
  }

  // Get bookings by station
  const getBookingsByStation = (stationId) => {
    return bookings.filter(booking => 
      booking.fromStation === stationId || booking.toStation === stationId
    )
  }

  // Get available seats for a specific route and time
  const getAvailableSeats = (fromStation, toStation, date, time) => {
    const allSeats = Array.from({ length: 40 }, (_, i) => ({ number: i + 1, available: true }))
    
    const existingBookings = bookings.filter(booking => 
      booking.date === date && 
      booking.time === time && 
      booking.fromStation === fromStation && 
      booking.toStation === toStation
    )
    
    const bookedSeats = existingBookings.flatMap(booking => booking.seats.map(seat => seat.number))
    
    return allSeats.map(seat => ({
      ...seat,
      available: !bookedSeats.includes(seat.number)
    }))
  }

  // Calculate fare based on route and class
  const calculateFare = (fromStation, toStation, travelType) => {
    // Sample fare calculation based on Faisal Movers pricing
    const baseFares = {
      'Lahore-Karachi': { business: 8290, economy: 6700 },
      'Lahore-Islamabad': { business: 2450, economy: 1890 },
      'Lahore-Multan': { business: 2450, economy: 1890 },
      'Karachi-Multan': { business: 5500, economy: 4000 },
      'Lahore-Peshawar': { business: 3600, economy: 2490 }
    }
    
    const route = `${fromStation}-${toStation}`
    const reverseRoute = `${toStation}-${fromStation}`
    
    const fare = baseFares[route] || baseFares[reverseRoute] || { business: 3000, economy: 2000 }
    
    return fare[travelType] || fare.economy
  }

  const value = {
    stations,
    bookings,
    loading,
    addStation,
    createBooking,
    getUserBookings,
    getAllBookings,
    getBookingsByStation,
    getAvailableSeats,
    calculateFare
  }

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  )
}

