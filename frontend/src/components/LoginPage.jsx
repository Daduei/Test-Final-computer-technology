import { useState } from 'react'
import { FileText, Mail, Lock, LogIn, Eye, EyeOff, Sparkles } from 'lucide-react'
import { authAPI } from '../services/api'
import './AuthPages.css'

export default function LoginPage({ onSwitch, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authAPI.login(email, password)
      if (res.success) onLogin(res.user)
    } catch (err) { setError(err.message) }
    setLoading(false)
  }

  return (
    <div className="auth-gradient-bg min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-blob floating-blob-1"></div>
        <div className="floating-blob floating-blob-2"></div>
        <div className="floating-blob floating-blob-3"></div>
      </div>

      <div className="glass-card card-entrance relative rounded-3xl shadow-2xl w-full max-w-md p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-gradient text-3xl font-bold">
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-2 text-sm">Sign in to continue to Wiki Web</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-shake bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            <p className="font-medium">Error</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="input-glow w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none smooth-transition text-gray-800 placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="input-glow w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none smooth-transition text-gray-800 placeholder-gray-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-icon absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gradient w-auto mx-auto px-8 py-3 text-white rounded-full flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <>
                <div className="spinner w-5 h-5"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="gradient-divider w-full"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">New to Wiki Web?</span>
          </div>
        </div>

        {/* Switch to Register */}
        <button
          onClick={onSwitch}
          className="w-auto mx-auto px-8 py-3 border-2 border-gray-200 text-gray-700 rounded-full hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 font-semibold smooth-transition block"
        >
          Create Account
        </button>
      </div>
    </div>
  )
}