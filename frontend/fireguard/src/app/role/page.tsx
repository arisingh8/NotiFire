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
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Select Your Role"
    >
      <div className="flex flex-col gap-4 w-full min-w-[300px] p-4">
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
  );
}