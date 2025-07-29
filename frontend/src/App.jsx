
import React from 'react'
import {Routes, Route, useLocation} from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import SignUp from './pages/SignUp'
import {UserProvider} from './store/UserContext'
import Login from './pages/Login'
import AddBooking from './pages/Addbooking'
import ShowBooking from './pages/Showbooking'

function App() {
  const location = useLocation();
  // Hide layout on login and signup pages
  const hideLayout = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div>
      <UserProvider>
        {hideLayout ? (
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
          </Routes>
        ) : (
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/addbookng" element={<AddBooking />} />
              <Route path="/showbookng" element={<ShowBooking />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Layout>
        )}
      </UserProvider>
    </div>
  )
}

export default App