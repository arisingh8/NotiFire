'use client';

import React from 'react'

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 overflow-hidden fixed inset-0">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#ffdbbb] mb-2 font-[family-name:var(--font-eb-garamond)]">
            Contact Us
          </h1>
          <p className="text-gray-400 font-[family-name:var(--font-eb-garamond)]">
            We&apos;re here to help
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-[#ffdbbb] mb-2 font-[family-name:var(--font-eb-garamond)]">
                  Get in Touch
                </h2>
                <p className="text-[#ffdbbb] font-[family-name:var(--font-eb-garamond)]">
                  Email: contact@notifire.com
                </p>
                <p className="text-[#ffdbbb] font-[family-name:var(--font-eb-garamond)]">
                  Phone: (555) 123-4567
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#ffdbbb] mb-2 font-[family-name:var(--font-eb-garamond)]">
                  Office Hours
                </h2>
                <p className="text-[#ffdbbb] font-[family-name:var(--font-eb-garamond)]">
                  Monday - Friday
                </p>
                <p className="text-[#ffdbbb] font-[family-name:var(--font-eb-garamond)]">
                  9:00 AM - 5:00 PM
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-[#ffdbbb] mb-2 font-[family-name:var(--font-eb-garamond)]">
                  Location
                </h2>
                <p className="text-[#ffdbbb] font-[family-name:var(--font-eb-garamond)]">
                  123 Fire Station Road
                </p>
                <p className="text-[#ffdbbb] font-[family-name:var(--font-eb-garamond)]">
                  Safety City, ST 12345
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#ffdbbb] mb-2 font-[family-name:var(--font-eb-garamond)]">
                  Emergency
                </h2>
                <p className="text-[#ffdbbb] font-[family-name:var(--font-eb-garamond)]">
                  For emergencies, please dial 911
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-center font-[family-name:var(--font-eb-garamond)]">
              For technical support, please email: support@notifire.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}