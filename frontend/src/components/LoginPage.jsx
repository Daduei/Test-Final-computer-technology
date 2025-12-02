import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import './LoginPage.css'

export default function LoginPage({ onSwitch, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      if (email && password) {
        alert('Login successful!')
      } else {
        setError('Please enter valid credentials')
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="login-container">
      {/* Login Box */}
      <div className="login-box">
        {/* Title */}
        <div className="login-header">
          <h1>Log in</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="login-form">
          {/* User name Field */}
          <div className="form-group">
            <label>User name</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your user name"
              className="form-input"
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="button-group">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-login"
            >
              {loading ? 'Loading...' : 'Log in'}
            </button>
            <button
              type="button"
              className="btn btn-register"
              onClick={() => onSwitch && onSwitch('register')}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}