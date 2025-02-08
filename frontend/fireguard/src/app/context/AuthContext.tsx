"use client"

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabaseClient/clients';

// Now you can use supabase to sign out or query your database.
interface AuthContextProps {
  userRole: string | null;
  setUserRole: (role: string | null) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  userRole: null,
  setUserRole: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // On initial load, force a sign out so the user always starts as logged out
    const clearSession = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out on initialization:', error);
      }
      // Ensure state is set to logged out
      setUserRole(null);
    };

    clearSession();
  }, []);

  return (
    <AuthContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};