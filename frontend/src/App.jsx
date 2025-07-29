
import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
// import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import SignUp from './pages/SignUp'
import {UserProvider} from './store/UserContext'
import Login from './pages/Login'
import AddBooking from './pages/Addbooking'
import ShowBooking from './pages/Showbooking'




function App() {
  return (
    <div >
    <UserProvider>
    <Navbar/>
      <Sidebar/>
      
      <Routes>
        <Route/>
        <Route path="/" element={<Home/>} />
        <Route path="/addbookng" element={<AddBooking/>} />
        <Route path="/showbookng" element={<ShowBooking/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path='/login' element={<Login/>} />
        <Route path ='/signup' element={<SignUp/>}/>
      
      </Routes>

    </UserProvider>
    

    </div>
  )
}

export default App