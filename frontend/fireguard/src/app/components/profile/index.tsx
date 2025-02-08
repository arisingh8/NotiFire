import { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Button, Form, Input, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {
  ProfileContainer,
  ProfileCard,
  ProfileHeader,
  ProfileInfo,
  FormSection,
  ProfileDetails
} from './styles';

const { Title } = Typography;

interface UserProfile {
  name: string;
  email: string;
  role: string;
  // Add more profile fields as needed
}

export const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // TODO: Replace with actual API call to fetch user profile
    const fetchProfile = async () => {
      try {
        // Mock data - replace with actual API call
        const userData = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'Administrator'
        };
        setProfile(userData);
        form.setFieldsValue(userData);
      } catch (error) {
        message.error('Failed to load profile');
      }
    };

    fetchProfile();
  }, [form]);

  const handleSubmit = async (values: UserProfile) => {
    try {
      // TODO: Replace with actual API call to update profile
      setProfile(values);
      setIsEditing(false);
      message.success('Profile updated successfully');
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <Avatar size={64} icon={<UserOutlined />} />
          <ProfileInfo>
            <Title level={4}>{profile.name}</Title>
            <Typography.Text type="secondary">{profile.role}</Typography.Text>
          </ProfileInfo>
        </ProfileHeader>
        
        {isEditing ? (
          <FormSection>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={profile}
            >
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <div className="flex gap-2">
                  <Button type="primary" htmlType="submit">
                    Save Changes
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              </Form.Item>
            </Form>
          </FormSection>
        ) : (
          <ProfileDetails>
            <div>
              <Typography.Text strong>Email: </Typography.Text>
              <Typography.Text>{profile.email}</Typography.Text>
            </div>
            <Button type="primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          </ProfileDetails>
        )}
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile;
