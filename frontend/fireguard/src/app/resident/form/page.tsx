'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/app/components/form/input';
import Select from '@/app/components/form/select';
import Textarea from '@/app/components/form/textarea';

interface FormData {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  mobilityStatus: string;
  medicalNeeds: string;
  emergencyContact: string;
  emergencyPhone: string;
  additionalInfo: string;
}

export default function AtRiskForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    mobilityStatus: '',
    medicalNeeds: '',
    emergencyContact: '',
    emergencyPhone: '',
    additionalInfo: ''
  });

  const router = useRouter();
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | 
    { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Required fields validation
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.mobilityStatus) newErrors.mobilityStatus = 'Mobility status is required';
    if (!formData.emergencyContact) newErrors.emergencyContact = 'Emergency contact is required';
    if (!formData.emergencyPhone) newErrors.emergencyPhone = 'Emergency contact phone is required';

    // Phone number validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!phoneRegex.test(formData.emergencyPhone.replace(/\D/g, ''))) {
      newErrors.emergencyPhone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setError(null);

    try {
      // Mock successful API response
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // Simulate successful response
      const mockResponse = {
        ok: true,
        data: { message: 'Form submitted successfully' }
      };

      if (!mockResponse.ok) {
        throw new Error('Submission failed');
      }

      setSubmitStatus('success');
      router.push('/resident/dashboard');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit form';
      console.error('Submission error:', errorMessage);
      setSubmitStatus('error');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#ffdbbb] mb-8 font-[family-name:var(--font-eb-garamond)]">
          At-Risk Resident Registration
        </h1>

        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-800/50 text-green-100 rounded-lg">
            Registration submitted successfully! We will review your information.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-800/50 text-red-100 rounded-lg">
            There was an error submitting your registration. Please try again.
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-800/50 text-red-100 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-xl">
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
          />

          <Input
            label="Street Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
              required
            />

            <Select
              label="State"
              name="state"
              options={stateOptions}
              value={formData.state}
              onChange={handleChange}
              error={errors.state}
              required
            />
          </div>

          <Input
            label="ZIP Code"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            error={errors.zipCode}
            required
          />

          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
          />

          <Select
            label="Mobility Status"
            name="mobilityStatus"
            options={mobilityOptions}
            value={formData.mobilityStatus}
            onChange={handleChange}
            error={errors.mobilityStatus}
            required
          />

          <Textarea
            label="Medical Needs"
            name="medicalNeeds"
            value={formData.medicalNeeds}
            onChange={handleChange}
            error={errors.medicalNeeds}
            placeholder="Please list any medical conditions, equipment, or special needs"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Emergency Contact Name"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              error={errors.emergencyContact}
              required
            />

            <Input
              label="Emergency Contact Phone"
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={handleChange}
              error={errors.emergencyPhone}
              required
            />
          </div>

          <Textarea
            label="Additional Information"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            error={errors.additionalInfo}
            placeholder="Any additional information that emergency responders should know"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className={`
              w-full
              px-6
              py-3
              bg-[#ffdbbb]
              text-gray-900
              rounded-lg
              font-bold
              transition-opacity
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
            `}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}