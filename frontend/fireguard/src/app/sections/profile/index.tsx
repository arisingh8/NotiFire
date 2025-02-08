'use client';

import { useState, useEffect } from 'react';
import Input from '@/app/components/form/input';
import Select from '@/app/components/form/select';
import { ProfileStyles } from './styles';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  hasDisability: boolean;
  disability: string;
  role: string;
}

const INITIAL_PROFILE: UserProfile = {
  name: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  hasDisability: false,
  disability: '',
  role: 'User'
};

const DISABILITY_OPTIONS = [
  { value: 'mobility', label: 'Mobility Impairment' },
  { value: 'visual', label: 'Visual Impairment' },
  { value: 'hearing', label: 'Hearing Impairment' },
  { value: 'cognitive', label: 'Cognitive Disability' },
  { value: 'other', label: 'Other' }
];

const STATE_OPTIONS = [
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

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Simulated API call
      const userData = {
        name: 'Aayush Shahjee',
        email: 'aayush.shahjee@yahoo.com',
        phone: '440-655-5012',
        street: '3642 Percy St',
        city: 'Los Angles',
        state: 'CA',
        zipCode: '90023',
        hasDisability: true,
        disability: 'Mobility Impairment',
        role: 'User',

      };
      setProfile(userData);
      setError(null);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load profile';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Replace with actual API call
      // await updateProfile(profile);
      setIsEditing(false);
      setError(null);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setError(errorMessage);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | 
    { target: { name: string; value: string | boolean } }
  ) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-[#ffdbbb]">Loading...</div>
      </div>
    );
  }

  return (
    <div className={ProfileStyles.pageContainer(isEditing)}>
      <div className={ProfileStyles.container}>
        <div className={ProfileStyles.card}>
          {error && (
            <div className="mb-6 p-4 bg-red-800/50 text-red-100 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#ffdbbb]">{profile.name}</h2>
              <p className="text-gray-400">{profile.role}</p>
            </div>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                required
              />

              <Input
                label="Phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                required
              />

              <Input
                label="Street Address"
                name="street"
                value={profile.street}
                onChange={handleChange}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                  required
                />

                <Select
                  label="State"
                  name="state"
                  options={STATE_OPTIONS}
                  value={profile.state}
                  onChange={handleChange}
                  required
                  placeholder="Start typing to search states..."
                />
              </div>

              <Input
                label="ZIP Code"
                name="zipCode"
                value={profile.zipCode}
                onChange={handleChange}
                required
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasDisability"
                  name="hasDisability"
                  checked={profile.hasDisability}
                  onChange={e => handleChange({
                    target: {
                      name: 'hasDisability',
                      value: e.target.checked
                    }
                  })}
                  className="w-4 h-4 text-[#ffdbbb] bg-gray-700 border-gray-600 rounded focus:ring-[#ffdbbb]"
                />
                <label htmlFor="hasDisability" className="text-[#ffdbbb]">
                  Do you have a disability?
                </label>
              </div>

              {profile.hasDisability && (
                <Select
                  label="Type of Disability"
                  name="disability"
                  options={DISABILITY_OPTIONS}
                  value={profile.disability}
                  onChange={handleChange}
                  required
                />
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#ffdbbb] text-gray-900 rounded-lg font-bold hover:opacity-90"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-700 text-[#ffdbbb] rounded-lg font-bold hover:opacity-90"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="text-[#ffdbbb]">Email: {profile.email}</div>
              <div className="text-[#ffdbbb]">Phone: {profile.phone}</div>
              <div className="text-[#ffdbbb]">
                Address: {profile.street}, {profile.city}, {profile.state} {profile.zipCode}
              </div>
              {profile.hasDisability && (
                <div className="text-[#ffdbbb]">
                  Disability: {DISABILITY_OPTIONS.find(opt => opt.value === profile.disability)?.label}
                </div>
              )}
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-[#ffdbbb] text-gray-900 rounded-lg font-bold hover:opacity-90"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
