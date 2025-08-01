import React, { useState, useEffect } from 'react';
import { useUser } from '../store/UserContext';
import { useBooking } from '../store/BookingContext';

function StationsBookings() {
  const { currentUser, loading: userLoading } = useUser();
  const {
    fetchAllBookings,
    loading: bookingsLoading,
    error,
    userBookings: bookings,
  } = useBooking();

  const [allBookings, setAllBookings] = useState([]);

  const MatchStationsBooking = async () => {
    try {
      if (!userLoading && currentUser && (currentUser.role === 'admin' || currentUser.role === 'station_master')) {
        console.log('Fetching all bookings...');
        await fetchAllBookings(); // ⬅ Await this!

        const stationId = currentUser?.assignedStation?.stationId;

        // ⬅ Filter bookings after fetch
        const matchedBookings = bookings.filter(
          (booking) => booking.fromStation === stationId
        );

        console.log('Matched bookings:', matchedBookings);
        setAllBookings(matchedBookings);
      } else {
        console.warn('User is not an admin or station master or still loading');
      }
    } catch (error) {
      console.error('Error matching station bookings:', error);
    }
  };

  useEffect(() => {
    MatchStationsBooking();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'station_master')) {
      // Re-filter when bookings change
      const stationId = currentUser?.assignedStation?.stationId;
      const matchedBookings = bookings.filter(
        (booking) => booking.fromStation === stationId
      );
      setAllBookings(matchedBookings);
    }
  }, [bookings]);

  if (userLoading || bookingsLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Stations Bookings</h1>
      {allBookings.length > 0 ? (
        allBookings.map((booking) => (
          <div key={booking._id || booking.id}>
            <p>Booking ID: {booking._id || booking.id}</p>
            <p>From: {booking.fromStation}</p>
            <p>To: {booking.toStation}</p>
            <p>Status: {booking.status}</p>
          </div>
        ))
      ) : (
        <p>No bookings found for this station.</p>
      )}
    </div>
  );
}

export default StationsBookings;
