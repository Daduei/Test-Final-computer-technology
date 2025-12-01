import { useState } from 'react'
import { UserPlus, User, Mail, Lock, Shield, PenTool, Eye, EyeOff, Sparkles, Check } from 'lucide-react'
import { authAPI } from '../services/api'
import './AuthPages.css'

export default function RegisterPage({ onSwitch, onLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [role, setRole] = useState('viewer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const roles = [
    { value: 'admin', label: 'Admin', icon: Shield, desc: 'Full system access', color: 'from-red-500 to-pink-500' },
    { value: 'editor', label: 'Editor', icon: PenTool, desc: 'Create & edit content', color: 'from-indigo-500 to-purple-500' },
    { value: 'viewer', label: 'Viewer', icon: Eye, desc: 'Read-only access', color: 'from-green-500 to-teal-500' }
  ]

  const passwordStrength = () => {
    if (!password) return { strength: 0, label: '' }
    let strength = 0
    if (password.length >= 6) strength++
    if (password.length >= 10) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
    return { strength, label: labels[Math.min(strength - 1, 4)] }
  }

  const strength = passwordStrength()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) return setError('Passwords do not match')
    if (password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    try {
      const res = await authAPI.register(name.trim(), email, password, role)
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

      <div className="glass-card card-entrance relative rounded-3xl shadow-2xl w-full max-w-lg p-10 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="icon-container w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 smooth-transition">
              <UserPlus className="text-white relative z-10" size={36} />
            </div>
            <Sparkles className="sparkle absolute -top-1 -right-1 text-yellow-300" size={20} />
          </div>
          <h1 className="text-gradient text-3xl font-bold">
            Join Wiki Web
          </h1>
          <p className="text-gray-600 mt-2 text-sm">Create your account and get started</p>
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
          {/* Full Name */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" size={18} />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="input-glow w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none smooth-transition text-gray-800 placeholder-gray-400"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" size={18} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="input-glow w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none smooth-transition text-gray-800 placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Select Your Role</label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`role-card relative p-4 rounded-xl border-2 ${
                    role === r.value 
                      ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  {role === r.value && (
                    <div className="role-card-checkmark absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                  <r.icon size={24} className={`mx-auto mb-2 ${role === r.value ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <p className={`text-xs font-bold ${role === r.value ? 'text-indigo-600' : 'text-gray-600'}`}>
                    {r.label}
                  </p>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              {roles.find(r => r.value === role)?.desc}
            </p>
          </div>

          {/* Password */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="input-glow w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none smooth-transition text-gray-800 placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-icon text-gray-400 p-2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      className={`strength-bar h-1.5 flex-1 rounded-full ${
                        i <= strength.strength 
                          ? i <= 2 ? 'bg-red-500' : i <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    ></div>
                  ))}
                </div>
                {strength.label && (
                  <p className={`text-xs font-medium ${
                    strength.strength <= 2 ? 'text-red-600' : strength.strength <= 3 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {strength.label}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" size={18} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="input-glow w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none smooth-transition text-gray-800 placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="eye-icon text-gray-400 p-2"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPassword && password === confirmPassword && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <Check size={14} /> Passwords match
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gradient w-auto mx-auto px-8 py-3 text-white rounded-full flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-6"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus size={20} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Already have an account?</span>
          </div>
        </div>

        {/* Switch to Login */}
        <button
          onClick={onSwitch}
          className="w-auto mx-auto px-8 py-3 border-2 border-gray-200 text-gray-700 rounded-full hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 font-semibold smooth-transition block"
        >
          Sign In Instead
        </button>
      </div>
    </div>
  )
}