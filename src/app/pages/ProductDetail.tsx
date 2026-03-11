import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Star, ShoppingCart, ArrowLeft, Truck, Shield, RotateCcw, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { products } from '../data/products';
import { toast } from 'sonner';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl mb-4">Product not found</h1>
        <Link to="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-orange-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-orange-600">Products</Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                  selectedImage === i ? 'border-orange-600' : 'border-gray-200'
                }`}
              >
                <img
                  src={product.image}
                  alt={`${product.name} ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="mb-4">
            <span className="inline-block bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full mb-4">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-serif mb-2">{product.name}</h1>
            <p className="text-gray-600">by {product.artist}</p>
          </div>

          <div className="flex items-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-orange-400 text-orange-400" />
            ))}
            <span className="text-gray-600 ml-2">(48 reviews)</span>
          </div>

          <div className="text-3xl mb-6">₹{product.price.toLocaleString()}</div>

          <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

          <div className="space-y-4 mb-8">
            <Button size="lg" className="w-full bg-orange-600 hover:bg-orange-700" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={() => {
                handleAddToCart();
                navigate('/cart');
              }}
            >
              Buy Now
            </Button>
            {/* wishlist toggle */}
            <Button
              size="lg"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => {
                const already = isInWishlist(product.id);
                toggleWishlist(product);
                toast.success(already ? 'Removed from wishlist' : 'Added to wishlist');
              }}
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isInWishlist(product.id) ? 'text-red-500' : 'text-gray-500'
                }`}
              />
              {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>

          {/* Features */}
          <div className="border-t pt-8 space-y-4">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-orange-600 mt-1" />
              <div>
                <h4 className="font-medium mb-1">Free Shipping</h4>
                <p className="text-sm text-gray-600">On orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RotateCcw className="h-5 w-5 text-orange-600 mt-1" />
              <div>
                <h4 className="font-medium mb-1">Easy Returns</h4>
                <p className="text-sm text-gray-600">7-day return policy</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-orange-600 mt-1" />
              <div>
                <h4 className="font-medium mb-1">Authentic Handcrafted</h4>
                <p className="text-sm text-gray-600">100% genuine artisan products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t pt-16">
          <h2 className="text-2xl md:text-3xl font-serif mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link key={relatedProduct.id} to={`/products/${relatedProduct.id}`}>
                <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-orange-400 text-orange-400" />
                      ))}
                    </div>
                    <h3 className="mb-1 line-clamp-1">{relatedProduct.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{relatedProduct.artist}</p>
                    <p className="font-semibold">₹{relatedProduct.price.toLocaleString()}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
