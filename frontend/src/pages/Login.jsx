import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../store/UserContext'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useUser()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (formData.email && formData.password) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        let role = 'user'
        if (formData.email.includes('admin')) role = 'admin'
        else if (formData.email.includes('station')) role = 'station_master'
        login({
          username: formData.email.split('@')[0],
          email: formData.email,
          role: role
        })
        navigate('/dashboard')
      } else {
        setError('Please fill in all fields')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="w-full max-w-md bg-white border border-[#78B9B5] rounded shadow p-6">
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 bg-[#0F828C] rounded-full flex items-center justify-center">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-[#065084]">Sign In</h2>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full px-3 py-2 border border-[#78B9B5] rounded text-[#065084] focus:outline-none"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full px-3 py-2 border border-[#78B9B5] rounded text-[#065084] focus:outline-none"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {error && (
            <div className="rounded bg-[#fbeaea] p-2 text-[#b91c1c] text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F828C] text-white py-2 rounded hover:bg-[#065084] transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-[#065084]">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-[#320A6B] hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
        <div className="mt-6 p-3 bg-[#f8fafc] rounded text-xs text-[#065084]">
          <div className="mb-1 font-semibold">Demo Credentials:</div>
          <div>Admin: <b>admin@demo.com</b> / password</div>
          <div>Station Master: <b>station@demo.com</b> / password</div>
          <div>User: <b>user@demo.com</b> / password</div>
        </div>
      </div>
    </div>
  )
}

export default Login