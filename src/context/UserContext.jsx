// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { useToast } from './ToastContext';

const UserContext = createContext(null);
const STORAGE_KEY = 'nursury_user_profile';

const DEFAULT_PROFILE = {
  displayName: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  bio: 'Botanical enthusiast & indoor jungle curator in Bengaluru.',
  joinedDate: 'October 2026'
};

export function UserProvider({ children }) {
  const { addToast } = useToast();
  const [profile, setProfile] = useState(() => {
    return loadFromStorage(STORAGE_KEY, DEFAULT_PROFILE);
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEY, profile);
  }, [profile]);

  const updateProfile = (data) => {
    setProfile((prev) => ({ ...prev, ...data }));
    addToast('Profile updated successfully!', 'success');
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
