import React from 'react'

export default function Contact() {
  return (
    <div className="h-[calc(100vh-4rem)] fixed w-full flex items-center justify-center bg-[#1a1a1a]">
      <div className="bg-[#2a2a2a] p-8 rounded-lg shadow-xl w-96 border border-[#3a3a3a] text-center">
        <h2 className="text-2xl font-bold mb-6 text-white">Contact Us</h2>
        <div className="space-y-4 text-gray-300">
          <p>Email: contact@fireguard.com</p>
          <p>Phone: (555) 123-4567</p>
          <p>Address: 123 Fire Station Road<br />Safety City, ST 12345</p>
          <p>Hours: Monday - Friday<br />9:00 AM - 5:00 PM</p>
        </div>
      </div>
    </div>
  )
}