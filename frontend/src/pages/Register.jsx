import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../api/api'

function Register({ setUser }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const isLongEnough = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasDigit = /\d/.test(password)
  const passwordsMatch = password === confirmPassword
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const isFormValid = isLongEnough && hasUppercase && hasDigit && passwordsMatch && isEmailValid

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid) {
      setError('Please meet all requirements.')
      return
    }

    try {
      const response = await registerUser(username, password, email)
      if (response.ok) {
        setSuccess(true)
        setError('')
        setTimeout(() => navigate('/login'), 1500)
      } else {
        const errorData = await response.json()
        setError(errorData.detail || 'Registration failed')
      }
    } catch {
      setError('Registration error. Please try again.')
    }
  }

  const CheckItem = ({ condition, label }) => (
    <li className={`text-sm ${condition ? 'text-green-600' : 'text-gray-500'} flex items-center`}>
      <span className="mr-2">{condition ? '✔️' : '❌'}</span>
      {label}
    </li>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create an Account</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">Registration successful! Redirecting...</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-sm text-blue-500 hover:underline"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <ul className="text-left mb-4 space-y-1">
            <CheckItem condition={isLongEnough} label="At least 8 characters" />
            <CheckItem condition={hasUppercase} label="Contains uppercase letter" />
            <CheckItem condition={hasDigit} label="Contains a number" />
            <CheckItem condition={passwordsMatch && password !== ''} label="Passwords match" />
            <CheckItem condition={isEmailValid} label="Valid email address" />
          </ul>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-3 rounded-lg transition ${
              isFormValid
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register