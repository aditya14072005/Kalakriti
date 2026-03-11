import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Star, Heart } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { products } from '../data/products';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'sonner';

export function Products() {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl || 'All');
  const [priceRange, setPriceRange] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (priceRange === 'Under 2000') {
      filtered = filtered.filter((p) => p.price < 2000);
    } else if (priceRange === '2000-4000') {
      filtered = filtered.filter((p) => p.price >= 2000 && p.price < 4000);
    } else if (priceRange === 'Above 4000') {
      filtered = filtered.filter((p) => p.price >= 4000);
    }

    return filtered;
  }, [selectedCategory, priceRange]);

  const { isInWishlist, toggleWishlist } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif mb-2">Our Collection</h1>
        <p className="text-gray-600">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <div className="space-y-6 sticky top-24">
            {/* Category Filter */}
            <div>
              <h3 className="mb-4">Category</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="mb-4">Price Range</h3>
              <div className="space-y-2">
                {['All', 'Under 2000', '2000-4000', 'Above 4000'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setPriceRange(range)}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      priceRange === range
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {range === 'All' ? 'All Prices' : `₹${range}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedCategory !== 'All' || priceRange !== 'All') && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedCategory('All');
                  setPriceRange('All');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="relative">
                  <Link to={`/products/${product.id}`}>                    
                    <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow h-full">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-orange-400 text-orange-400" />
                          ))}
                        </div>
                        <h3 className="mb-1 line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.artist}</p>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">₹{product.price.toLocaleString()}</p>
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                            {product.category}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const already = isInWishlist(product.id);
                      toggleWishlist(product);
                      toast.success(already ? 'Removed from wishlist' : 'Added to wishlist');
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors ${
                        isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
