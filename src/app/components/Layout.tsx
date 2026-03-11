import React from 'react';
import { Outlet, Link } from 'react-router';
import { ShoppingCart, Search, Menu, Home, Package, Heart, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { products } from '../data/products';
// Figma asset imports are not handled by Vite; reference the physical file in src/assets instead
import logo from '../../assets/6b77b4186aa26cc5fbecf536aed46c36a931c949.png';

export function Layout() {
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const filteredProducts = React.useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return products.filter((product) =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.artist.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 bg-white/95 backdrop-blur-sm z-50 shadow-sm">
        {/* Decorative top border */}
        <div className="h-1 bg-gradient-to-r from-orange-500 via-pink-500 via-yellow-500 to-orange-500" />
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between border-2 border-orange-200 rounded-xl px-10 py-2 bg-gradient-to-r from-orange-50/50 via-pink-50/50 to-yellow-50/50 shadow-md hover:shadow-xl transition-all duration-300">
            {/* Logo */}
            <Link to="/" className="flex items-center group flex-shrink-0">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="Kalakriti" 
                  className="h-16 w-auto border-4 border-orange-400 rounded-full p-2 bg-white shadow-xl group-hover:border-pink-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 via-pink-400 to-yellow-400 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-300 -z-10"></div>
              </div>
              {/* logo text follows global body font (Poppins) and uses theme primary color */}
              <span className="ml-3 text-2xl font-bold text-primary">
                KALAKRITI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className={`hidden md:flex items-center space-x-8 transition-all duration-500 ${searchOpen ? 'opacity-0 -translate-x-full absolute' : 'opacity-100 translate-x-0'}`}>
              <Link to="/products" className="flex items-center gap-2 hover:text-pink-600 transition-all duration-300 hover:scale-110 relative group">
                <Package className="h-4 w-4" />
                <span>Products</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/products?category=Pottery" className="hover:text-orange-600 transition-all duration-300 hover:scale-110 relative group">
                Pottery
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/products?category=Clothes" className="hover:text-pink-600 transition-all duration-300 hover:scale-110 relative group">
                Clothes
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/products?category=Jewellery" className="hover:text-yellow-600 transition-all duration-300 hover:scale-110 relative group">
                Jewellery
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>

            {/* Expanding Search Bar - appears in place of navigation */}
            {searchOpen && (
              <div className="hidden md:flex flex-1 mx-8 animate-in slide-in-from-right duration-500">
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-12 pr-12 py-3 border-2 border-orange-300 rounded-full bg-white focus:outline-none focus:border-orange-500 transition-all duration-300 shadow-lg text-base"
                  />
                  <button
                    onClick={handleSearchToggle}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Search Results Dropdown */}
                {searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 mx-6 bg-white rounded-xl shadow-2xl border-2 border-orange-200 z-50 animate-in slide-in-from-top duration-300 max-h-96 overflow-y-auto">
                    {filteredProducts.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        <Search className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">No products found</p>
                      </div>
                    ) : (
                      <div className="p-3">
                        <p className="text-xs text-gray-500 px-3 py-2">
                          {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
                        </p>
                        {filteredProducts.map((product) => (
                          <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:via-pink-50 hover:to-yellow-50 transition-all duration-300 group"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-14 h-14 object-cover rounded-lg border border-gray-200 group-hover:border-orange-300 transition-colors"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {product.category} • ₹{product.price.toLocaleString()}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-4 relative flex-shrink-0">
              {/* Search Button */}
              {!searchOpen && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hidden md:flex hover:bg-orange-100 hover:text-orange-600 transition-all hover:scale-110 hover:rotate-12 relative group" 
                  onClick={handleSearchToggle}
                >
                  <Search className="h-5 w-5" />
                  <span className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></span>
                </Button>
              )}

              <Link to="/wishlist">
                <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-pink-100 hover:text-pink-600 transition-all hover:scale-110 relative group">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Wishlist</span>
                </Button>
              </Link>
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative hover:bg-orange-100 hover:text-orange-600 transition-all hover:scale-110">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <nav className="flex flex-col space-y-4 mt-8">
                    <Link to="/" className="text-lg hover:text-orange-600 transition-colors flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      Home
                    </Link>
                    <Link to="/products" className="text-lg hover:text-orange-600 transition-colors flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Products
                    </Link>
                    <Link to="/wishlist" className="text-lg hover:text-pink-600 transition-colors flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Wishlist
                    </Link>
                    <Link to="/products?category=Pottery" className="text-lg hover:text-orange-600 transition-colors">
                      Pottery
                    </Link>
                    <Link to="/products?category=Clothes" className="text-lg hover:text-orange-600 transition-colors">
                      Clothes
                    </Link>
                    <Link to="/products?category=Jewellery" className="text-lg hover:text-orange-600 transition-colors">
                      Jewellery
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-serif text-xl mb-4">Kalakriti</h3>
              <p className="text-gray-600 text-sm">
                Celebrating the art of handcrafted excellence. Each piece tells a unique story.
              </p>
            </div>
            <div>
              <h4 className="mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/products" className="hover:text-orange-600">All Products</Link></li>
                <li><Link to="/products?category=Pottery" className="hover:text-orange-600">Pottery</Link></li>
                <li><Link to="/products?category=Clothes" className="hover:text-orange-600">Clothes</Link></li>
                <li><Link to="/products?category=Jewellery" className="hover:text-orange-600">Jewellery</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">About</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-orange-600">Our Story</a></li>
                <li><a href="#" className="hover:text-orange-600">Artists</a></li>
                <li><a href="#" className="hover:text-orange-600">Sustainability</a></li>
                <li><a href="#" className="hover:text-orange-600">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-orange-600">Shipping Info</a></li>
                <li><a href="#" className="hover:text-orange-600">Returns</a></li>
                <li><a href="#" className="hover:text-orange-600">FAQs</a></li>
                <li><a href="#" className="hover:text-orange-600">Care Guide</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2026 Kalakriti. All rights reserved. Handcrafted with love.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}