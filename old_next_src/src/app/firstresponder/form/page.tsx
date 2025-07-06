'use client';

import React, { useState } from 'react';
import Input from '@/app/components/form/input';
import Select from '@/app/components/form/select';
import { useRouter } from 'next/navigation';

interface FormData {
  role: string;
  unit_name: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  unit_size: string;
}

export default function FirstResponderForm() {
  const [formData, setFormData] = useState<FormData>({
    role: '',
    unit_name: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    unit_size: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);


  const roleOptions = [
    { value: 'EMT', label: 'EMT' },
    { value: 'Firefighter', label: 'Firefighter' },
    { value: 'Police', label: 'Police' }
  ];

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | 
    { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.unit_name) newErrors.unit_name = 'Unit name is required';
    if (!formData.street) newErrors.street = 'Street address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipcode) newErrors.zipcode = 'ZIP code is required';
    if (!formData.unit_size) newErrors.unit_size = 'Unit size is required';

    // ZIP code validation
    const zipRegex = /^\d{5}$/;
    if (!zipRegex.test(formData.zipcode)) {
      newErrors.zipcode = 'Please enter a valid 5-digit ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/onboard/responder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

        setSubmitStatus('success');
        router.push('/firstresponder/dashboard');
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to submit form';
        console.error('Submission error:', errorMessage);
        setSubmitStatus('error');
        setSubmitError(errorMessage);
    } finally {
        setIsSubmitting(false);
    }
};

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#ffdbbb] mb-8 font-[family-name:var(--font-eb-garamond)]">
          First Responder Registration
        </h1>

        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-800/50 text-green-100 rounded-lg">
            Registration submitted successfully! We will review your information.
          </div>
        )}

        {submitError && (
                    <div className="mb-6 p-4 bg-red-800/50 text-red-100 rounded-lg">
                        {submitError}
                    </div>
                )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-xl">
          <Select
            label="Role"
            name="role"
            options={roleOptions}
            value={formData.role}
            onChange={handleChange}
            error={errors.role}
            required
            placeholder="Select your role"
          />

          <Input
            label="Unit Name"
            name="unit_name"
            value={formData.unit_name}
            onChange={handleChange}
            error={errors.unit_name}
            required
          />

          <Input
            label="Street Address"
            name="street"
            value={formData.street}
            onChange={handleChange}
            error={errors.street}
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
              placeholder="Start typing to search states..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ZIP Code"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              error={errors.zipcode}
              required
            />

            <Input
              label="Unit Size"
              name="unit_size"
              type="number"
              value={formData.unit_size}
              onChange={handleChange}
              error={errors.unit_size}
              required
              placeholder="Number of personnel"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
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
            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}