import React, { useEffect, useState, useMemo } from 'react'
import { useBooking } from '../store/BookingContext'
import { useUser } from '../store/UserContext'

const StationsBookings = () => {
  const { userBookings, fetchAllBookings, loading, error, updateBookingStatus } = useBooking()
  const { currentUser, loading: userLoading } = useUser()
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingBooking, setUpdatingBooking] = useState(null)

  // Check authorization and get station data
  const isAuthorized = currentUser?.role === 'admin' || currentUser?.role === 'station_master'
  const stationId = currentUser?.assignedStation?.stationId
  const isAdmin = currentUser?.role === 'admin'

  // Filter bookings for station
  const stationBookings = useMemo(() => {
    if (!userBookings?.length) return []
    
    return userBookings.filter(booking => 
      isAdmin || booking.fromStation === stationId
    )
  }, [userBookings, stationId, isAdmin])

  // Apply filters and search
  const filteredBookings = useMemo(() => {
    return stationBookings.filter(booking => {
      const matchesFilter = filter === 'all' || booking.status === filter
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = !searchTerm || [
        booking.username,
        booking.fromStation,
        booking.toStation,
        booking._id
      ].some(field => field?.toLowerCase().includes(searchLower))
      
      return matchesFilter && matchesSearch
    })
  }, [stationBookings, filter, searchTerm])

  // Fetch data on mount
  useEffect(() => {
    if (isAuthorized && !userLoading) {
      fetchAllBookings()
    }
  }, [isAuthorized, userLoading])

  // Handle status updates
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      setUpdatingBooking(bookingId)
      await updateBookingStatus(bookingId, newStatus)
    } catch (err) {
      console.error('Error updating status:', err)
    } finally {
      setUpdatingBooking(null)
    }
  }

  // Utility functions
  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100',
      pending: 'text-yellow-600 bg-yellow-100'
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })

  const formatTime = (time) => new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true
  })

  // Loading states
  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Authorization check
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchAllBookings}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Calculate stats
  const stats = {
    total: filteredBookings.length,
    confirmed: filteredBookings.filter(b => b.status === 'confirmed').length,
    pending: filteredBookings.filter(b => b.status === 'pending').length,
    cancelled: filteredBookings.filter(b => b.status === 'cancelled').length
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
          {isAdmin ? 'All Station Bookings' : 'Station Bookings'}
        </h1>
        <p className="text-gray-600">
          {isAdmin ? 'Manage all station bookings' : `Station: ${currentUser?.assignedStation?.stationName || stationId}`}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'blue' },
          { label: 'Confirmed', value: stats.confirmed, color: 'green' },
          { label: 'Pending', value: stats.pending, color: 'yellow' },
          { label: 'Cancelled', value: stats.cancelled, color: 'red' }
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-${color}-50 p-4 rounded-lg`}>
            <h3 className={`text-sm font-medium text-${color}-600`}>{label}</h3>
            <p className={`text-2xl font-bold text-${color}-900`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No bookings found</p>
            {(searchTerm || filter !== 'all') && (
              <button
                onClick={() => { setSearchTerm(''); setFilter('all') }}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['ID', 'User', 'Route', 'Date/Time', 'Seats', 'Amount', 'Status', 'Actions'].map(header => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {booking._id?.slice(-8)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {booking.username}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>{booking.fromStation}</div>
                      <div className="text-gray-400">to {booking.toStation}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>{formatDate(booking.date)}</div>
                      <div className="text-gray-400">{formatTime(booking.time)}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {booking.seats?.map((seat, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {seat.number || seat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      Rs {booking.totalAmount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                              disabled={updatingBooking === booking._id}
                              className="text-green-600 hover:text-green-900"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                              disabled={updatingBooking === booking._id}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                            disabled={updatingBooking === booking._id}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        )}
                        {booking.status === 'cancelled' && (
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                            disabled={updatingBooking === booking._id}
                            className="text-green-600 hover:text-green-900"
                          >
                            Reconfirm
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default StationsBookings