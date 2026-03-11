import React from 'react';
import { Link, useNavigate } from 'react-router';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export function Wishlist() {
  const {
    wishlist,
    removeFromWishlist,
    totalItems,
  } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (totalItems === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-serif mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Bookmark items you love to view them later</p>
          <Link to="/products">
            <Button className="bg-orange-600 hover:bg-orange-700">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleMoveToCart = (productId: number) => {
    const product = wishlist.find((p) => p.id === productId);
    if (product) {
      addToCart(product);
      removeFromWishlist(productId);
      toast.success('Moved to cart');
      navigate('/cart');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-serif mb-8">Your Wishlist</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {wishlist.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex gap-4">
              <Link to={`/products/${item.id}`} className="flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.id}`}>
                  <h3 className="mb-1 hover:text-orange-600 transition-colors truncate">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 mb-2">{item.artist}</p>
                <p className="text-sm text-gray-500 mb-3">{item.category}</p>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => handleMoveToCart(item.id)}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{item.price.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
