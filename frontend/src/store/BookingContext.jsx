import React, { createContext, useContext, useState, useEffect } from 'react'
import { useUser } from './UserContext'
import { fetchStations } from '../services/StationServices'
import * as BookingServices from '../services/BookingServices'

const BookingContext = createContext()

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}

export const BookingProvider = ({ children }) => {
  const { currentUser } = useUser()
  const [stations, setStations] = useState([])
  const [userBookings, setUserBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch stations on mount
  useEffect(() => {
    loadStations()
  }, [])

  const loadStations = async () => {
    try {
      setLoading(true)
      setError(null)
      const stationsData = await fetchStations()
      setStations(stationsData)
    } catch (err) {
      console.error('Error loading stations:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Get available seats for a route
// Get available seats for a route
const getAvailableSeats = async (fromStation, toStation, date, time) => {
  try {
    if (!currentUser?.token) {
      console.warn('No user token found, returning mock data for available seats')
      // Return mock data if no user token
      const totalSeats = 40
      const seats = []
      for (let i = 1; i <= totalSeats; i++) {
        seats.push({
          number: i,
          available: Math.random() > 0.3 // 70% chance of being available
        })
      }
      return seats
    }

    const seatsData = await BookingServices.getAvailableSeats(
      fromStation, 
      toStation, 
      date, 
      time, 
      currentUser.token
    )
    
    // Handle different response formats from backend
    if (seatsData.availableSeats) {
      // Backend returns { availableSeats: [1, 2, 3, ...] }
      const totalSeats = 40
      const seats = []
      for (let i = 1; i <= totalSeats; i++) {
        seats.push({
          number: i,
          available: seatsData.availableSeats.includes(i)
        })
      }
      return seats
    }
    
    // Return as is if already in expected format
    return seatsData.seats || seatsData
  } catch (err) {
    console.error('Error getting available seats:', err)
    // Return mock data on error
    const totalSeats = 40
    const seats = []
    for (let i = 1; i <= totalSeats; i++) {
      seats.push({
        number: i,
        available: Math.random() > 0.3
      })
    }
    return seats
  }
}

  // Calculate fare for a route
  const calculateFare = async (fromStation, toStation, travelType) => {
    try {
      // Try to get fare from backend API first
      const fareData = await BookingServices.calculateFare(fromStation, toStation, travelType)
      return fareData.fare || fareData.amount || fareData
    } catch (err) {
      console.error('Error calculating fare from API:', err)
      
      // Fallback: Find stations to calculate distance-based fare
      const fromStationData = stations.find(s => s.stationId === fromStation || s.city === fromStation)
      const toStationData = stations.find(s => s.stationId === toStation || s.city === toStation)
      
      if (fromStationData && toStationData) {
        // You can implement distance-based calculation here
        // For now, using basic calculation
        const baseFare = travelType === 'business' ? 2000 : 1500
        return baseFare
      }
      
      // Final fallback
      return travelType === 'business' ? 2000 : 1500
    }
  }

  // Create a new booking
  const createBooking = async (bookingData) => {
    try {
      if (!currentUser?.token) {
        throw new Error('User must be logged in to create booking')
      }

      setLoading(true)
      setError(null)

      // Calculate total amount using the API
      const farePerSeat = await calculateFare(bookingData.fromStation, bookingData.toStation, bookingData.travelType)
      const totalAmount = bookingData.seats.length * farePerSeat

      const bookingPayload = {
        ...bookingData,
        totalAmount,
        status: 'confirmed',
        bookingDate: new Date().toISOString()
      }

      const newBooking = await BookingServices.createBooking(bookingPayload, currentUser.token)
      
      // Refresh user bookings
      await fetchUserBookings()
      
      return newBooking
    } catch (err) {
      console.error('Error creating booking:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Fetch user's bookings
  const fetchUserBookings = async () => {
    try {
      if (!currentUser?.token) {
        setUserBookings([])
        return
      }

      setLoading(true)
      const bookingsData = await BookingServices.getUserBookings(currentUser.token)
      setUserBookings(bookingsData.bookings || bookingsData)
    } catch (err) {
      console.error('Error fetching user bookings:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Cancel a booking
  const cancelBooking = async (bookingId) => {
    try {
      if (!currentUser?.token) {
        console.log(currentUser ,'user token not found, cannot cancel booking')
        throw new Error('User must be logged in to cancel booking')
      }

      setLoading(true)
      await BookingServices.cancelBooking(bookingId, currentUser.token)
      
      // Refresh bookings
      await fetchUserBookings()
    } catch (err) {
      console.error('Error canceling booking:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Get booking by ID
  const getBookingById = async (bookingId) => {
    try {
      if (!currentUser?.token) {
        throw new Error('User must be logged in to view booking')
      }

      const booking = await BookingServices.getBookingById(bookingId, currentUser.token)
      return booking
    } catch (err) {
      console.error('Error getting booking:', err)
      throw err
    }
  }

  const contextValue = {
    // Data
    stations,
    userBookings,
    loading,
    error,

    // Functions
    getAvailableSeats,
    calculateFare,
    createBooking,
    fetchUserBookings,
    cancelBooking,
    getBookingById,
    loadStations, // This allows components to refresh stations
    
    // Helper function to refresh stations after adding new ones
    refreshStations: loadStations
  }

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  )
}