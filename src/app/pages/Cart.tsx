import React from 'react';
import { Link, useNavigate } from 'react-router';
import { Trash2, Plus, Minus, ShoppingBag, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'sonner';

export function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-serif mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some beautiful handcrafted items to get started</p>
          <Link to="/products">
            <Button className="bg-orange-600 hover:bg-orange-700">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost = totalPrice > 999 ? 0 : 99;
  const finalTotal = totalPrice + shippingCost;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-serif mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
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
                    <div className="flex items-center gap-2 border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                      onClick={() => {
                        if (!isInWishlist(item.id)) {
                          addToWishlist(item);
                          removeFromCart(item.id);
                          toast.success('Saved for later');
                        } else {
                          toast('Already in wishlist');
                        }
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                  {item.quantity > 1 && (
                    <p className="text-sm text-gray-500">₹{item.price} each</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-xl mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
              </div>
              {totalPrice < 999 && (
                <p className="text-sm text-orange-600">
                  Add ₹{(999 - totalPrice).toLocaleString()} more for free shipping!
                </p>
              )}
              <div className="border-t pt-3 flex justify-between">
                <span>Total</span>
                <span className="font-semibold text-xl">₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>
            <Button
              size="lg"
              className="w-full bg-orange-600 hover:bg-orange-700 mb-3"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
            <Link to="/products">
              <Button variant="outline" size="lg" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
