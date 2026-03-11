import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { CreditCard, ShoppingBag, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const shippingCost = totalPrice > 999 ? 0 : 99;
  const finalTotal = totalPrice + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      setOrderPlaced(true);
      clearCart();
      toast.success('Order placed successfully!');
    }, 2000);
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-serif mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items before checking out</p>
          <Button
            className="bg-orange-600 hover:bg-orange-700"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-serif mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-2">
            Thank you for your purchase. Your order has been confirmed and will be shipped soon.
          </p>
          <p className="text-gray-600 mb-8">
            Order number: <span className="font-semibold">#KK{Date.now().toString().slice(-8)}</span>
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-serif mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" required />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" required />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" required />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" defaultValue="India" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" required />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input id="cardName" required />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span>Total</span>
                    <span className="font-semibold text-xl">₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
