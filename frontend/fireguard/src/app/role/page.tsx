'use client';

import { useState } from 'react';
import Modal from '@/app/components/modal';
import Button from '@/app/components/button';

export default function RolePage() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleRoleSelect = (role: string) => {
    console.log(`Selected role: ${role}`);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Modal
        isOpen={isModalOpen}
        title="Select Your Role"
      >
        <div className="flex flex-col gap-6 w-full min-w-[300px] max-w-md p-6">
          <Button 
            variant="role-resident" 
            size="large"
            onClick={() => handleRoleSelect('resident')}
          >
            Resident
          </Button>
          <Button 
            variant="role-manager" 
            size="large"
            onClick={() => handleRoleSelect('manager')}
          >
            Property Manager
          </Button>
          <Button 
            variant="role-firefighter" 
            size="large"
            onClick={() => handleRoleSelect('firefighter')}
          >
            Firefighter
          </Button>
        </div>
      </Modal>
    </div>
  );
}