// src/context/UserContext.jsx
import { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const { profile: authProfile, updateProfile: authUpdateProfile } = useAuth();

  // Derive profile directly from AuthContext
  const profile = {
    displayName: authProfile?.full_name || authProfile?.displayName || authProfile?.email?.split('@')[0] || 'Aarav Sharma',
    email: authProfile?.email || 'aarav.sharma@example.com',
    bio: authProfile?.bio || 'Botanical enthusiast & indoor jungle curator.',
    joinedDate: authProfile?.created_at
      ? new Date(authProfile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'October 2026'
  };

  const updateProfile = async (data) => {
    if (authUpdateProfile) {
      await authUpdateProfile({
        full_name: data.displayName,
        bio: data.bio
      });
    }
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within UserProvider');
  }
  return ctx;
}
