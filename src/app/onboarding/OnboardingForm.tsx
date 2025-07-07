'use client';

import { useState } from 'react';
import { submitOnboardingForm } from './actions';
import { Database } from '@/utils/supabase/database.types';

export default function OnboardingForm() {
    const [selectedType, setSelectedType] = useState<string>('');

    // State options for forms
    const stateOptions = [
        { value: 'AL', label: 'Alabama' },
        { value: 'AK', label: 'Alaska' },
        { value: 'AZ', label: 'Arizona' },
        { value: 'AR', label: 'Arkansas' },
        { value: 'CA', label: 'California' },
        { value: 'CO', label: 'Colorado' },
        { value: 'CT', label: 'Connecticut' },
        { value: 'DE', label: 'Delaware' },
        { value: 'FL', label: 'Florida' },
        { value: 'GA', label: 'Georgia' },
        { value: 'HI', label: 'Hawaii' },
        { value: 'ID', label: 'Idaho' },
        { value: 'IL', label: 'Illinois' },
        { value: 'IN', label: 'Indiana' },
        { value: 'IA', label: 'Iowa' },
        { value: 'KS', label: 'Kansas' },
        { value: 'KY', label: 'Kentucky' },
        { value: 'LA', label: 'Louisiana' },
        { value: 'ME', label: 'Maine' },
        { value: 'MD', label: 'Maryland' },
        { value: 'MA', label: 'Massachusetts' },
        { value: 'MI', label: 'Michigan' },
        { value: 'MN', label: 'Minnesota' },
        { value: 'MS', label: 'Mississippi' },
        { value: 'MO', label: 'Missouri' },
        { value: 'MT', label: 'Montana' },
        { value: 'NE', label: 'Nebraska' },
        { value: 'NV', label: 'Nevada' },
        { value: 'NH', label: 'New Hampshire' },
        { value: 'NJ', label: 'New Jersey' },
        { value: 'NM', label: 'New Mexico' },
        { value: 'NY', label: 'New York' },
        { value: 'NC', label: 'North Carolina' },
        { value: 'ND', label: 'North Dakota' },
        { value: 'OH', label: 'Ohio' },
        { value: 'OK', label: 'Oklahoma' },
        { value: 'OR', label: 'Oregon' },
        { value: 'PA', label: 'Pennsylvania' },
        { value: 'RI', label: 'Rhode Island' },
        { value: 'SC', label: 'South Carolina' },
        { value: 'SD', label: 'South Dakota' },
        { value: 'TN', label: 'Tennessee' },
        { value: 'TX', label: 'Texas' },
        { value: 'UT', label: 'Utah' },
        { value: 'VT', label: 'Vermont' },
        { value: 'VA', label: 'Virginia' },
        { value: 'WA', label: 'Washington' },
        { value: 'WV', label: 'West Virginia' },
        { value: 'WI', label: 'Wisconsin' },
        { value: 'WY', label: 'Wyoming' }
    ];

    const mobilityOptions = [
        { value: 'independent', label: 'Fully Independent' },
        { value: 'assisted', label: 'Needs Assistance' },
        { value: 'wheelchair', label: 'Wheelchair User' },
        { value: 'bedridden', label: 'Bedridden' }
    ];

    const firstResponderRoles: Database['public']['Enums']['first_responder_role'][] = [
        'EMT',
        'Firefighter',
        'Police',
        'Rescue'
    ];

    // Input component styles
    const inputClasses = `
        w-full
        px-4
        py-2
        bg-gray-700
        border
        border-gray-600
        rounded-lg
        text-[#ffdbbb]
        placeholder-gray-400
        focus:outline-none
        focus:ring-2
        focus:ring-[#ffdbbb]
        focus:border-transparent
        transition-colors
        duration-200
        font-(family-name:--font-eb-garamond)
    `;

    const labelClasses = "text-[#ffdbbb] font-medium text-sm font-(family-name:--font-eb-garamond)";

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-[#ffdbbb] mb-2 font-(family-name:--font-eb-garamond)">
                    Complete Your Profile
                </h1>

                <p className="text-gray-400 mb-8 font-(family-name:--font-eb-garamond)">
                    Select your user type and fill out the information below to complete your profile.
                </p>

                <form action={submitOnboardingForm} className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-xl">
                    {/* User Type Selection */}
                    <div>
                        <label className={labelClasses}>
                            I am a... <span className="text-red-500">*</span>
                        </label>
                        <select 
                            name="userType" 
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            required 
                            className={inputClasses}
                        >
                            <option value="">Select your user type</option>
                            <option value="resident">At-Risk Resident</option>
                            <option value="dispatcher">Dispatcher</option>
                            <option value="first_responder">First Responder</option>
                        </select>
                        {selectedType && (
                            <p className="text-gray-400 text-sm mt-1 font-(family-name:--font-eb-garamond)">
                                {selectedType === 'resident' && 'You are a resident who may need assistance during emergencies'}
                                {selectedType === 'dispatcher' && 'You work at a dispatch center and coordinate emergency responses'}
                                {selectedType === 'first_responder' && 'You are an EMT, firefighter, police officer, or other emergency responder'}
                            </p>
                        )}
                    </div>

                    {/* Dynamic form fields based on selected type */}
                    {selectedType && (
                        <>
                            <div className="border-t border-gray-600 pt-6">
                                <h2 className="text-xl font-semibold text-[#ffdbbb] mb-4 font-(family-name:--font-eb-garamond)">
                                    {selectedType === 'resident' && 'At-Risk Resident Information'}
                                    {selectedType === 'dispatcher' && 'Dispatcher Information'}
                                    {selectedType === 'first_responder' && 'First Responder Information'}
                                </h2>
                            </div>

                            {selectedType === 'resident' && (
                                <>
                                    <div>
                                        <label className={labelClasses}>
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            className={inputClasses}
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClasses}>
                                            Street Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="street"
                                            required
                                            className={inputClasses}
                                            placeholder="Enter your street address"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClasses}>
                                                City <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                required
                                                className={inputClasses}
                                                placeholder="Enter your city"
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClasses}>
                                                State <span className="text-red-500">*</span>
                                            </label>
                                            <select name="state" required className={inputClasses}>
                                                <option value="">Select state</option>
                                                {stateOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClasses}>
                                                ZIP Code <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="zipcode"
                                                required
                                                pattern="[0-9]{5}"
                                                className={inputClasses}
                                                placeholder="12345"
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClasses}>
                                                Phone Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                className={inputClasses}
                                                placeholder="(555) 123-4567"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClasses}>
                                            Mobility Status <span className="text-red-500">*</span>
                                        </label>
                                        <select name="mobility_status" required className={inputClasses}>
                                            <option value="">Select mobility status</option>
                                            {mobilityOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClasses}>
                                            Medical Needs
                                        </label>
                                        <textarea
                                            name="medical_needs"
                                            rows={3}
                                            className={inputClasses}
                                            placeholder="Please list any medical conditions, equipment, or special needs"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClasses}>
                                                Emergency Contact Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="emergency_contact"
                                                required
                                                className={inputClasses}
                                                placeholder="Contact name"
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClasses}>
                                                Emergency Contact Phone <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="emergency_phone"
                                                required
                                                className={inputClasses}
                                                placeholder="(555) 123-4567"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClasses}>
                                            Additional Information
                                        </label>
                                        <textarea
                                            name="additional_info"
                                            rows={3}
                                            className={inputClasses}
                                            placeholder="Any additional information that emergency responders should know"
                                        />
                                    </div>
                                </>
                            )}

                            {selectedType === 'dispatcher' && (
                                <>
                                    <div>
                                        <label className={labelClasses}>
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            className={inputClasses}
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClasses}>
                                                State <span className="text-red-500">*</span>
                                            </label>
                                            <select name="state" required className={inputClasses}>
                                                <option value="">Select state</option>
                                                {stateOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className={labelClasses}>
                                                ZIP Code <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="zipcode"
                                                required
                                                pattern="[0-9]{5}"
                                                className={inputClasses}
                                                placeholder="12345"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClasses}>
                                            Authorization Key <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            name="authkey"
                                            required
                                            className={inputClasses}
                                            placeholder="Enter your authorization key"
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClasses}>
                                            Dispatch Center <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="dispatch_center"
                                            required
                                            className={inputClasses}
                                            placeholder="Enter dispatch center name"
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClasses}>
                                            Dispatch Center Phone <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="dispatch_center_phone"
                                            required
                                            className={inputClasses}
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>
                                </>
                            )}

                            {selectedType === 'first_responder' && (
                                <>
                                    <div>
                                        <label className={labelClasses}>
                                            Role <span className="text-red-500">*</span>
                                        </label>
                                        <select name="role" required className={inputClasses}>
                                            <option value="">Select your role</option>
                                            {firstResponderRoles.map((role) => (
                                                <option key={role} value={role}>
                                                    {role}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClasses}>
                                            Unit Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="unit_name"
                                            required
                                            className={inputClasses}
                                            placeholder="Enter your unit name"
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClasses}>
                                            Street Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="street"
                                            required
                                            className={inputClasses}
                                            placeholder="Enter your street address"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClasses}>
                                                City <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                required
                                                className={inputClasses}
                                                placeholder="Enter your city"
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClasses}>
                                                State <span className="text-red-500">*</span>
                                            </label>
                                            <select name="state" required className={inputClasses}>
                                                <option value="">Select state</option>
                                                {stateOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClasses}>
                                                ZIP Code <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="zipcode"
                                                required
                                                pattern="[0-9]{5}"
                                                className={inputClasses}
                                                placeholder="12345"
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClasses}>
                                                Unit Size <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="unit_size"
                                                required
                                                min="1"
                                                className={inputClasses}
                                                placeholder="Number of personnel"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-[#ffdbbb] text-gray-900 rounded-lg font-bold hover:opacity-90 transition-opacity"
                            >
                                Complete Registration
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
} 