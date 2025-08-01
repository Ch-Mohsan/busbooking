import React, { useState, useEffect } from 'react'
import { useUser } from '../store/UserContext'
import { useBooking } from '../store/BookingContext'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const ManageStations = () => {
  const { getAllUsers } = useUser()
   const [statioUsers, setStationUsers] = useState([])
  const { currentUser } = useUser()
  const { stations, loadStations } = useBooking()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingStation, setEditingStation] = useState(null)
  const [formData, setFormData] = useState({
    city: '',
    stationName: '',
    stationId: ''
  })
   const fetchALLUseres= async()=>{
  try {
    const users = await getAllUsers()
    console.log(users, 'Fetched users from context')
    return users
    
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
    
  }
 }
 const fillterStationsUsers= async ()=>{
  try {
    const users = await fetchALLUseres()
    const filteredStations = users.filter(user => user.role === 'station_master')
    const pendingStationUsers= filteredStations.filter(user => user.status === 'pending')
    // console.log(pendingStationUsers, 'Filtered stations by users')
    setStationUsers(pendingStationUsers)
    
  } catch (error) {
    console.error('Error filtering stations by users:', error)
  }
 }

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      loadStations()
      fillterStationsUsers() 
    }
  }, [currentUser])

  // Helper function to get auth headers
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${currentUser.token}`
  })

  // Create new station
  const createStation = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/stations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create station')
      }

      await loadStations() // Refresh stations list
      setShowModal(false)
      resetForm()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Update station
  const updateStation = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/stations/${editingStation._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update station')
      }

      await loadStations() // Refresh stations list
      setShowModal(false)
      resetForm()
      setEditingStation(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Delete station
  const deleteStation = async (stationId) => {
    if (!window.confirm('Are you sure you want to delete this station?')) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/stations/${stationId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete station')
      }

      await loadStations() // Refresh stations list
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingStation) {
      updateStation()
    } else {
      createStation()
    }
  }

  const handleEdit = (station) => {
    setEditingStation(station)
    setFormData({
      city: station.city,
      stationName: station.stationName,
      stationId: station.stationId
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      city: '',
      stationName: '',
      stationId: ''
    })
    setEditingStation(null)
  }

  const handleModalClose = () => {
    setShowModal(false)
    resetForm()
    setError(null)
  }

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Stations</h1>
          <p className="text-gray-600">Add, edit, and manage bus stations</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Station
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Stations List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {stations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No stations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Station ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Station Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stations.map((station) => (
                  <tr key={station._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {station.stationId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {station.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {station.stationName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(station)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteStation(station._id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
          
      </div>
      <div>
        {
          statioUsers.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Station Users ({statioUsers.length})</h3>
              <ul className="space-y-4">
                {statioUsers.map(user => (
                  <li key={user.id || user._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
        }
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingStation ? 'Edit Station' : 'Add New Station'}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Station ID
                  </label>
                  <input
                    type="text"
                    value={formData.stationId}
                    onChange={(e) => setFormData({...formData, stationId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={editingStation} // Don't allow editing station ID
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Station Name
                  </label>
                  <input
                    type="text"
                    value={formData.stationName}
                    onChange={(e) => setFormData({...formData, stationName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingStation ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
           
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageStations