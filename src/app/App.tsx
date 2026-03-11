import { RouterProvider } from 'react-router';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Toaster } from './components/ui/sonner';
import { AnimatedBackground } from './components/AnimatedBackground';
import { router } from './routes';

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <AnimatedBackground />
        <RouterProvider router={router} />
        <Toaster />
      </WishlistProvider>
    </CartProvider>
  );
}