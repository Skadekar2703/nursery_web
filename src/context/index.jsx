// src/context/index.jsx
import { ToastProvider } from './ToastContext';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { AddressProvider } from './AddressContext';
import { OrderProvider } from './OrderContext';
import { UserProvider } from './UserContext';

export function AppProviders({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
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
      </AuthProvider>
    </ToastProvider>
  );
}

export { useToast } from './ToastContext';
export { useAuth } from './AuthContext';
export { useCart } from './CartContext';
export { useWishlist } from './WishlistContext';
export { useAddress } from './AddressContext';
export { useOrders } from './OrderContext';
export { useUser } from './UserContext';
