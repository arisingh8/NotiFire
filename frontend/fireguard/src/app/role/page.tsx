'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/modal';
import Button from '@/app/components/button';
import Header from '@/app/sections/header';

export default function RolePage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleRoleSelect = (role: string) => {
    console.log(`Selected role: ${role}`);
    if (role === 'atrisk') {
      router.push('/resident');
    } else if (role === 'dispatcher') {
      router.push('/dispatcher');
    } else if (role === 'firstresponder') {
      router.push('/firstresponder');
    }
    setIsModalOpen(false);
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />   
      
      {/* Modal */}
      <div className="flex-1 flex items-center justify-center">
        <Modal
          isOpen={isModalOpen}
          title="Select Your Role"
        >
          <div className="flex flex-col gap-6 w-full min-w-[300px] max-w-md p-6">
            <Button 
              variant="role-atrisk" 
              size="large"
              onClick={() => handleRoleSelect('atrisk')}
            >
              Resident
            </Button>

            <Button 
              variant="role-dispatcher" 
              size="large"
              onClick={() => handleRoleSelect('dispatcher')}
            >
              Dispatcher
            </Button>
            <Button 
              variant="role-firstresponder" 
              size="large"
              onClick={() => handleRoleSelect('firstresponder')}
            >
              First Responder
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}