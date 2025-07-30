import React from 'react'
import {Routes, Route, useLocation} from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import SignUp from './pages/SignUp'
import {UserProvider} from './store/UserContext'
import {BookingProvider} from './store/BookingContext'
import Login from './pages/Login'
import AddBooking from './pages/AddBooking'
import ShowBooking from './pages/Showbooking'

function App() {
  const location = useLocation();
  // Hide layout on login and signup pages
  const hideLayout = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div>
      <UserProvider>
        <BookingProvider>
          {hideLayout ? (
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<SignUp />} />
            </Routes>
          ) : (
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/addbooking" element={<AddBooking />} />
                <Route path="/showbooking" element={<ShowBooking />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </Layout>
          )}
        </BookingProvider>
      </UserProvider>
    </div>
  )
}

export default App