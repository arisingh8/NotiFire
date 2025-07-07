'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getUser, getUserRole, ResidentData, DispatcherData, FirstResponderData } from '@/utils/getUser';
import { User } from '@supabase/supabase-js';
import { ProfileStyles } from './styles';
import { redirect } from 'next/navigation';
import Button from '@/app/components/button';
import Input from '@/app/components/form/input';
import Textarea from '@/app/components/form/textarea';
import Select from '@/app/components/form/select';
import { saveChanges } from './actions';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<ResidentData | DispatcherData | FirstResponderData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<typeof userRole>(userRole);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        
        // Get user
        const userData = await getUser(supabase);
        if (!userData) {
          redirect('/login');
        }
        setUser(userData);

        // Get user role data
        const roleData = await getUserRole(userData, supabase);
        if (!roleData) {
          redirect('/onboarding');
        }
        setUserRole(roleData);
        setEditData(roleData);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const startEditing = () => {
    if (userRole) {
      setEditData(userRole);
      setIsEditing(true);
      setError(null);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditData(userRole);
    setError(null);
  };

  const saveClientChanges = async () => {
    if (!userRole || !editData || !user) return;

    setSaving(true);
    await saveChanges(editData);
    setUserRole(editData);
    setIsEditing(false);
    setEditData(userRole);
    setSaving(false);
    redirect('/profile');
  };

  const handleInputChange = (field: keyof FirstResponderData['data'] | keyof DispatcherData['data'] | keyof ResidentData['data'], value: string | number) => {
    if (!editData) return;
    if (editData.kind === 'resident') {
      setEditData({
        ...editData,
        data: {
          ...editData.data,
          [field]: value
        }
      });
    } else if (editData.kind === 'dispatcher') {
      setEditData({
        ...editData,
        data: {
          ...editData.data,
          [field]: value
        }
      });
    } else if (editData.kind === 'first_responder') {
      setEditData({
        ...editData,
        data: {
          ...editData.data,
          [field]: value
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className={ProfileStyles.container}>
          <div className={ProfileStyles.loadingSpinner}>Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className={ProfileStyles.container}>
          <div className={ProfileStyles.error}>{error}</div>
        </div>
      </div>
    );
  }

  if (!user || !userRole || !editData) {
    throw new Error('User data not found, should not happen');
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className={ProfileStyles.container}>
        <div className={ProfileStyles.header}>
          <h1 className={ProfileStyles.title}>Profile</h1>
          <div className={ProfileStyles.badge}>
            {userRole.kind === 'resident' && 'Resident'}
            {userRole.kind === 'dispatcher' && 'Dispatcher'}
            {userRole.kind === 'first_responder' && 'First Responder'}
          </div>
        </div>

        <div className={ProfileStyles.section}>
          <h2 className={ProfileStyles.sectionTitle}>Account Information</h2>
          <div className={ProfileStyles.field}>
            <span className={ProfileStyles.label}>Email:</span>
            <span className={ProfileStyles.value}>{user.email}</span>
          </div>
          <div className={ProfileStyles.field}>
            <span className={ProfileStyles.label}>User ID:</span>
            <span className={ProfileStyles.value}>{user.id}</span>
          </div>
          <div className={ProfileStyles.field}>
            <span className={ProfileStyles.label}>Created:</span>
            <span className={ProfileStyles.value}>
              {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>

        <div className={ProfileStyles.section}>
          <div className={ProfileStyles.sectionHeader}>
            <h2 className={ProfileStyles.sectionTitle}>
              {userRole.kind === 'resident' && 'Resident Information'}
              {userRole.kind === 'dispatcher' && 'Dispatcher Information'}
              {userRole.kind === 'first_responder' && 'First Responder Information'}
            </h2>
            <div className={ProfileStyles.buttonGroup}>
              {!isEditing ? (
                <Button variant="outline" size="small" onClick={startEditing}>
                  Edit
                </Button>
              ) : (
                <>
                  <Button 
                    variant="primary" 
                    size="small" 
                    onClick={saveClientChanges}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="small" 
                    onClick={cancelEditing}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {userRole.kind === 'resident' && editData.kind === 'resident' && (
            <div className={ProfileStyles.grid}>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>Name:</span>
                {isEditing ? (
                  <Input
                    label=""
                    value={editData.data.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Full name"
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.name}</span>
                )}
              </div>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>Phone:</span>
                {isEditing ? (
                  <Input
                    label=""
                    value={editData.data.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Phone number"
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.phone || 'N/A'}</span>
                )}
              </div>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>Street:</span>
                {isEditing ? (
                  <Input
                    label=""
                    value={editData.data.street || ''}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    placeholder="Street address"
                    autoComplete="address-line1"
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.street || 'N/A'}</span>
                )}
              </div>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>City:</span>
                {isEditing ? (
                  <Input
                    label=""
                    value={editData.data.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City"
                    autoComplete="address-level2"
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.city || 'N/A'}</span>
                )}
              </div>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>State:</span>
                {isEditing ? (
                  <Input
                    label=""
                    value={editData.data.state || ''}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="State"
                    autoComplete="address-level1"
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.state || 'N/A'}</span>
                )}
              </div>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>ZIP Code:</span>
                {isEditing ? (
                  <Input
                    label=""
                    value={editData.data.zipcode || ''}
                    onChange={(e) => handleInputChange('zipcode', e.target.value)}
                    placeholder="ZIP code"
                    autoComplete="postal-code"
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.zipcode || 'N/A'}</span>
                )}
              </div>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>Mobility Status:</span>
                {isEditing ? (
                  <Select
                    label=""
                    name="mobility_status"
                    value={editData.data.mobility_status || ''}
                    onChange={(e) => handleInputChange('mobility_status', e.target.value)}
                    options={[
                      { value: '', label: 'Select mobility status' },
                      { value: 'mobile', label: 'Mobile' },
                      { value: 'limited_mobility', label: 'Limited Mobility' },
                      { value: 'wheelchair', label: 'Wheelchair' },
                      { value: 'bedridden', label: 'Bedridden' }
                    ]}
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.mobility_status || 'N/A'}</span>
                )}
              </div>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>Emergency Contact:</span>
                {isEditing ? (
                  <Input
                    label=""
                    value={editData.data.emergency_contact || ''}
                    onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                    placeholder="Emergency contact name"
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.emergency_contact || 'N/A'}</span>
                )}
              </div>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>Emergency Phone:</span>
                {isEditing ? (
                  <Input
                    label=""
                    value={editData.data.emergency_phone || ''}
                    onChange={(e) => handleInputChange('emergency_phone', e.target.value)}
                    placeholder="Emergency contact phone"
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.emergency_phone || 'N/A'}</span>
                )}
              </div>
              <div className={`${ProfileStyles.field} md:col-span-2`}>
                <span className={ProfileStyles.label}>Medical Needs:</span>
                {isEditing ? (
                  <Textarea
                    label=""
                    value={editData.data.medical_needs || ''}
                    onChange={(e) => handleInputChange('medical_needs', e.target.value)}
                    placeholder="Medical needs or conditions"
                    rows={3}
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.medical_needs || 'N/A'}</span>
                )}
              </div>
              <div className={`${ProfileStyles.field} md:col-span-2`}>
                <span className={ProfileStyles.label}>Additional Info:</span>
                {isEditing ? (
                  <Textarea
                    label=""
                    value={editData.data.additional_info || ''}
                    onChange={(e) => handleInputChange('additional_info', e.target.value)}
                    placeholder="Additional information"
                    rows={3}
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.additional_info || 'N/A'}</span>
                )}
              </div>
            </div>
          )}

          {userRole.kind === 'dispatcher' && editData.kind === 'dispatcher' && (
            <div className={ProfileStyles.grid}>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>Name:</span>
                {isEditing ? (
                  <Input
                    label=""
                    value={editData.data.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Full name"
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.name}</span>
                )}
              </div>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>State:</span>
                {isEditing ? (
                  <Input
                    label=""
                    value={editData.data.state || ''}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="State"
                    autoComplete="address-level1"
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.state || 'N/A'}</span>
                )}
              </div>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>ZIP Code:</span>
                {isEditing ? (
                  <Input
                    label=""
                    value={editData.data.zipcode || ''}
                    onChange={(e) => handleInputChange('zipcode', e.target.value)}
                    placeholder="ZIP code"
                    autoComplete="postal-code"
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.zipcode || 'N/A'}</span>
                )}
              </div>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>Auth Key:</span>
                {isEditing ? (
                  <Input
                    label=""
                    value={editData.data.authkey || ''}
                    onChange={(e) => handleInputChange('authkey', e.target.value)}
                    placeholder="Authorization key"
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.authkey || 'N/A'}</span>
                )}
              </div>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>Dispatch Center:</span>
                {isEditing ? (
                  <Input
                    label=""
                    value={editData.data.dispatch_center || ''}
                    onChange={(e) => handleInputChange('dispatch_center', e.target.value)}
                    placeholder="Dispatch center name"
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.dispatch_center || 'N/A'}</span>
                )}
              </div>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>Dispatch Center Phone:</span>
                {isEditing ? (
                  <Input
                    label=""
                    value={editData.data.dispatch_center_phone || ''}
                    onChange={(e) => handleInputChange('dispatch_center_phone', e.target.value)}
                    placeholder="Dispatch center phone"
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.dispatch_center_phone || 'N/A'}</span>
                )}
              </div>
            </div>
          )}

          {userRole.kind === 'first_responder' && editData.kind === 'first_responder' && (
            <div className={ProfileStyles.grid}>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>Role:</span>
                {isEditing ? (
                  <Select
                    label=""
                    name="role"
                    value={editData.data.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    options={[
                      { value: 'Firefighter', label: 'Firefighter' },
                      { value: 'EMT', label: 'EMT' },
                      { value: 'Police', label: 'Police Officer' },
                      { value: 'Rescue', label: 'Rescue Personnel' }
                    ]}
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.role}</span>
                )}
              </div>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>Unit Name:</span>
                {isEditing ? (
                  <Input
                    label=""
                    value={editData.data.unit_name || ''}
                    onChange={(e) => handleInputChange('unit_name', e.target.value)}
                    placeholder="Unit name"
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.unit_name || 'N/A'}</span>
                )}
              </div>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>Unit Size:</span>
                {isEditing ? (
                  <Input
                    label=""
                    type="number"
                    value={editData.data.unit_size || ''}
                    onChange={(e) => handleInputChange('unit_size', parseInt(e.target.value) || 0)}
                    placeholder="Number of personnel"
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.unit_size || 'N/A'}</span>
                )}
              </div>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>Street:</span>
                {isEditing ? (
                  <Input
                    label=""
                    value={editData.data.street || ''}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    placeholder="Street address"
                    autoComplete="address-line1"
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.street || 'N/A'}</span>
                )}
              </div>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>City:</span>
                {isEditing ? (
                  <Input
                    label=""
                    value={editData.data.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City"
                    autoComplete="address-level2"
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.city || 'N/A'}</span>
                )}
              </div>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>State:</span>
                {isEditing ? (
                  <Input
                    label=""
                    value={editData.data.state || ''}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="State"
                    autoComplete="address-level1"
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.state || 'N/A'}</span>
                )}
              </div>
              <div className={ProfileStyles.field}>
                <span className={ProfileStyles.label}>ZIP Code:</span>
                {isEditing ? (
                  <Input
                    label=""
                    value={editData.data.zipcode || ''}
                    onChange={(e) => handleInputChange('zipcode', e.target.value)}
                    placeholder="ZIP code"
                    autoComplete="postal-code"
                  />
                ) : (
                  <span className={ProfileStyles.value}>{userRole.data.zipcode || 'N/A'}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}