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
  role: string;
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
          role: 'User',
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
    <div className="max-w-2xl mx-auto p-6 bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-gray-600">{profile.role}</p>
          </div>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData?.name || ''}
                  placeholder={formData?.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData?.email || ''}
                  placeholder={formData?.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData?.phone || ''}
                  placeholder={formData?.phone}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>
              <div className="form-group">
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData?.street || ''}
                  placeholder={formData?.street}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>
              <div className="form-group">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData?.city || ''}
                  placeholder={formData?.city}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>
              <div className="form-group">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData?.state || ''}
                  placeholder={formData?.state}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>
              <div className="form-group">
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Zip Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData?.zipCode || ''}
                  placeholder={formData?.zipCode}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>
              <div className="form-group">
                <label htmlFor="hasDisability" className="block text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    id="hasDisability"
                    name="hasDisability"
                    checked={formData?.hasDisability || false}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span>Do you have a disability?</span>
                </label>
              </div>
              {formData?.hasDisability && (
                <div className="form-group">
                  <label htmlFor="disability" className="block text-sm font-medium text-gray-700">Type of Disability</label>
                  <select
                    id="disability"
                    name="disability"
                    value={formData?.disability || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300"
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
            </div>
            <div className="mt-4">
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                Save Changes
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md ml-2">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="text-gray-700">Email: {profile.email}</div>
            <div className="text-gray-700">Phone: {profile.phone}</div>
            <div className="text-gray-700">Address: {profile.street}, {profile.city}, {profile.state} {profile.zipCode}</div>
            {profile.hasDisability && (
              <div className="text-gray-700">Disability: {profile.disability}</div>
            )}
            <div className="mt-4">
              <button type="button" onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
