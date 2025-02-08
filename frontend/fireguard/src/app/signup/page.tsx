'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    console.log('Sign up with:', { email, password })
  }

  return (
    <div className="h-[calc(100vh-4rem)] fixed w-full flex items-center justify-center bg-[#1a1a1a]">
      <div className="bg-[#2a2a2a] p-8 rounded-lg shadow-xl w-96 border border-[#3a3a3a]">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Sign Up</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#3a3a3a] border border-[#4a4a4a] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#3a3a3a] border border-[#4a4a4a] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Create a password"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#3a3a3a] border border-[#4a4a4a] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Confirm your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
