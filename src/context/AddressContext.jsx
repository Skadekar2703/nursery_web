// src/context/AddressContext.jsx
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { useToast } from './ToastContext';

const AddressContext = createContext(null);
const STORAGE_KEY = 'nursury_addresses';
const SELECTED_KEY = 'nursury_selected_address';

const INITIAL_ADDRESSES = [
  {
    id: 'addr-default-1',
    fullName: 'Aarav Sharma',
    phone: '9876543210',
    house: 'Flat 402, Green Meadows',
    street: 'Indiranagar 100ft Road',
    landmark: 'Near Botanical Park',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    isDefault: true
  }
];

export function AddressProvider({ children }) {
  const { addToast } = useToast();

  const [addresses, setAddresses] = useState(() => {
    return loadFromStorage(STORAGE_KEY, INITIAL_ADDRESSES);
  });

  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const saved = loadFromStorage(SELECTED_KEY, null);
    if (saved) return saved;
    const def = INITIAL_ADDRESSES.find((a) => a.isDefault);
    return def ? def.id : null;
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEY, addresses);
  }, [addresses]);

  useEffect(() => {
    saveToStorage(SELECTED_KEY, selectedAddressId);
  }, [selectedAddressId]);

  // Derived active address - no need for cascading setState in useEffect
  const selectedAddress = useMemo(() => {
    if (!addresses || addresses.length === 0) return null;
    const found = addresses.find((a) => a.id === selectedAddressId);
    if (found) return found;
    return addresses.find((a) => a.isDefault) || addresses[0];
  }, [addresses, selectedAddressId]);

  const addAddress = (data) => {
    const newId = 'addr-' + Date.now();
    const isFirst = addresses.length === 0;
    const newAddress = {
      ...data,
      id: newId,
      isDefault: isFirst || Boolean(data.isDefault)
    };

    setAddresses((prev) => {
      let updated = prev;
      if (newAddress.isDefault) {
        updated = updated.map((a) => ({ ...a, isDefault: false }));
      }
      return [...updated, newAddress];
    });

    setSelectedAddressId(newId);
    addToast('Delivery address saved!', 'success');
    return newAddress;
  };

  const updateAddress = (id, data) => {
    setAddresses((prev) => {
      let updated = prev;
      if (data.isDefault) {
        updated = updated.map((a) => ({ ...a, isDefault: false }));
      }
      return updated.map((a) => (a.id === id ? { ...a, ...data, id } : a));
    });
    addToast('Address updated successfully', 'success');
  };

  const deleteAddress = (id) => {
    const target = addresses.find((a) => a.id === id);
    if (!target) return;

    const remaining = addresses.filter((a) => a.id !== id);
    setAddresses(remaining);

    if (selectedAddressId === id) {
      const nextActive = remaining.find((a) => a.isDefault) || remaining[0] || null;
      setSelectedAddressId(nextActive ? nextActive.id : null);
    }

    addToast('Address removed', 'info');
  };

  const setDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id
      }))
    );
    setSelectedAddressId(id);
    addToast('Default address updated', 'success');
  };

  const selectAddress = (id) => {
    setSelectedAddressId(id);
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        selectedAddressId,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        selectAddress
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const ctx = useContext(AddressContext);
  if (!ctx) {
    throw new Error('useAddress must be used within AddressProvider');
  }
  return ctx;
}
