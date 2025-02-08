import { Button } from 'antd';
import { useState, useEffect } from 'react';

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
}

export const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '555-555-5555',
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          hasDisability: false,
          disability: '',
        };
        setProfile(userData);
        setFormData(userData);
      } catch (error) {
        alert('Failed to load profile');
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Replace with actual API call to update profile
      if (formData) {
        setProfile(formData);
        setIsEditing(false);
        alert('Profile updated successfully');
      }
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Clear the field when user starts typing
    if (e.target.value === formData?.[name as keyof UserProfile]) {
      setFormData(prev => prev ? { ...prev, [name]: '' } : null);
      return;
    }
    
    setFormData(prev => 
      prev ? {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      } : null
    );
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-grey-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{profile.name}</h2>
            
          </div>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData?.name || ''}
                placeholder={formData?.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-black-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData?.email || ''}
                placeholder={formData?.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-black-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData?.phone || ''}
                placeholder={formData?.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-black-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white-700 mb-1">Street</label>
              <input
                type="text"
                name="street"
                value={formData?.street || ''}
                placeholder={formData?.street}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-black-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData?.city || ''}
                  placeholder={formData?.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-black-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData?.state || ''}
                  placeholder={formData?.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-black-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white-700 mb-1">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData?.zipCode || ''}
                placeholder={formData?.zipCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-black"
                required
              />
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="hasDisability"
                  checked={formData?.hasDisability || false}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-white-700">Do you have a disability?</span>
              </label>
            </div>
            {formData?.hasDisability && (
              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">Type of Disability</label>
                <select
                  name="disability"
                  value={formData?.disability || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select a disability</option>
                  <option value="mobility">Mobility Impairment</option>
                  <option value="visual">Visual Impairment</option>
                  <option value="hearing">Hearing Impairment</option>
                  <option value="cognitive">Cognitive Disability</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div><span className="font-medium text-white-900">Email:   </span><span className="text-white-800">{profile.email}</span></div>
            <div><span className="font-medium text-white-900">Phone:   </span><span className="text-white-800">{profile.phone}</span></div>
            <div><span className="font-medium text-white-900">Address:   </span>
              <div className="ml-4 text-white-800"> {profile.street} &nbsp; {profile.city}, &nbsp; {profile.state} &nbsp; {profile.zipCode}
              </div>
            </div>
            {profile.hasDisability && (
              <div><span className="font-medium text-gray-900">Disability: </span><span className="text-gray-800">{profile.disability}</span></div>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
