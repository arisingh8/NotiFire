'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/app/components/form/input';
import Select from '@/app/components/form/select';

interface FormData {
    fullName: string;
    personalPhone: string;
    workLocation: string;
    state: string;
    zipCode: string;
    authkey: string;
    dispatchCenter: string;
    dispatchCenterPhone: string;
}

export default function DispatcherForm() {
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        personalPhone: '',
        workLocation: '',
        state: '',
        zipCode: '',
        authkey: '',
        dispatchCenter: '',
        dispatchCenterPhone: ''
    });

    const router = useRouter();
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [submitError, setSubmitError] = useState<string | null>(null);

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

        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.personalPhone) newErrors.personalPhone = 'Personal phone is required';
        if (!formData.workLocation) newErrors.workLocation = 'Work location is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.zipCode) newErrors.zipCode = 'Zip code is required';
        if (!formData.authkey) newErrors.authkey = 'Auth key is required';
        if (!formData.dispatchCenter) newErrors.dispatchCenter = 'Dispatch center is required';
        if (!formData.dispatchCenterPhone) newErrors.dispatchCenterPhone = 'Dispatch center phone is required';

        // Phone number validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.personalPhone.replace(/\D/g, ''))) {
            newErrors.personalPhone = 'Please enter a valid 10-digit phone number';
        }
        if (!phoneRegex.test(formData.dispatchCenterPhone.replace(/\D/g, ''))) {
            newErrors.dispatchCenterPhone = 'Please enter a valid 10-digit phone number';
        }

        // ZIP code validation
        const zipRegex = /^\d{5}$/;
        if (!zipRegex.test(formData.zipCode)) {
            newErrors.zipCode = 'Please enter a valid 5-digit ZIP code';
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
            const response = await fetch('http://127.0.0.1:8000/onboard/dispatcher', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Submission failed');

            setSubmitStatus('success');
            router.push('/dispatcher/dashboard');
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
                    Dispatcher Registration
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
                    <Input
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={errors.fullName}
                        required
                    />

                    <Input
                        label="Personal Phone"
                        name="personalPhone"
                        value={formData.personalPhone}
                        onChange={handleChange}
                        error={errors.personalPhone}
                        required
                    />

                    <Input
                        label="Work Location"
                        name="workLocation"
                        value={formData.workLocation}
                        onChange={handleChange}
                        error={errors.workLocation}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
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

                        <Input
                            label="ZIP Code"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            error={errors.zipCode}
                            required
                        />
                    </div>

                    <Input
                        label="Authorization Key"
                        name="authkey"
                        type="password"
                        value={formData.authkey}
                        onChange={handleChange}
                        error={errors.authkey}
                        required
                    />

                    <Input
                        label="Dispatch Center"
                        name="dispatchCenter"
                        value={formData.dispatchCenter}
                        onChange={handleChange}
                        error={errors.dispatchCenter}
                        required
                    />

                    <Input
                        label="Dispatch Center Phone"
                        name="dispatchCenterPhone"
                        value={formData.dispatchCenterPhone}
                        onChange={handleChange}
                        error={errors.dispatchCenterPhone}
                        required
                    />

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


