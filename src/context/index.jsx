// src/context/index.jsx
import { ToastProvider } from './ToastContext';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { AddressProvider } from './AddressContext';
import { OrderProvider } from './OrderContext';
import { UserProvider } from './UserContext';

export function AppProviders({ children }) {
  return (
    <ToastProvider>
      <CartProvider>
        <WishlistProvider>
          <AddressProvider>
            <OrderProvider>
              <UserProvider>
                {children}
              </UserProvider>
            </OrderProvider>
          </AddressProvider>
        </WishlistProvider>
      </CartProvider>
    </ToastProvider>
  );
}
