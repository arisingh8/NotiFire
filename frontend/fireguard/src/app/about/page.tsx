import React from 'react'

export default function About() {
  return (
    <div className="h-[calc(100vh-4rem)] fixed w-full flex items-center justify-center bg-[#1a1a1a]">
      <div className="bg-[#2a2a2a] p-8 rounded-lg shadow-xl w-96 border border-[#3a3a3a] text-center">
        <h2 className="text-2xl font-bold mb-6 text-white">About FireGuard (In Progress)</h2>
        <div className="space-y-4 text-gray-300">
          <p>
            FireGuard is a comprehensive fire safety management system designed to
            protect communities and save lives.
          </p>
          <p>
            Our mission is to provide cutting-edge technology solutions for fire
            departments and emergency responders.
          </p>
          <p>
            With real-time monitoring and advanced analytics, we help make
            informed decisions when every second counts.
          </p>
        </div>
      </div>
    </div>
  )
}