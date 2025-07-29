import React, { createContext, useContext, useState, useEffect } from 'react';
import { createBooking as apiCreateBooking, getUserBookings as apiGetUserBookings, getAllBookings as apiGetAllBookings } from '../services/BookingServices';
import { useUser } from './UserContext';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const { currentUser } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user bookings on mount or when user changes
  useEffect(() => {
    if (currentUser) {
      fetchUserBookings();
    } else {
      setBookings([]);
    }
    // eslint-disable-next-line
  }, [currentUser]);

  const fetchUserBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('busBookingToken');
      const data = await apiGetUserBookings(token);
      setBookings(data);
    } catch (err) {
      setError(err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('busBookingToken');
      const data = await apiGetAllBookings(token);
      setBookings(data);
    } catch (err) {
      setError(err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('busBookingToken');
      const newBooking = await apiCreateBooking(bookingData, token);
      setBookings(prev => [newBooking, ...prev]);
      return newBooking;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    bookings,
    loading,
    error,
    createBooking,
    fetchUserBookings,
    fetchAllBookings,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

