import React from 'react';
import { Link } from 'react-router';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { products } from '../data/products';

export function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 py-20 md:py-32 overflow-hidden hover:from-orange-100 hover:via-pink-100 hover:to-yellow-100 transition-all duration-500">
        {/* Decorative Indian border pattern */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-pink-500 via-yellow-500 to-orange-500" />
        <div className="absolute top-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-orange-500 via-pink-500 to-yellow-500" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            {/* Indian decorative element */}
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border-2 border-orange-200 hover:bg-white hover:border-orange-400 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <span className="text-2xl">🪔</span>
              <span className="text-sm text-orange-600 font-medium">Handcrafted with Love</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif mb-6">
              Discover Authentic
              <span className="block text-orange-600 relative">
                Handcrafted Art
                <svg className="absolute -bottom-2 left-0 w-64 h-3" viewBox="0 0 200 10" preserveAspectRatio="none">
                  <path d="M0,5 Q50,0 100,5 T200,5" stroke="#f97316" strokeWidth="2" fill="none" opacity="0.5" />
                </svg>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Each piece is a masterpiece created by skilled artisans, celebrating traditional craftsmanship and timeless beauty.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg">
                  Shop Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2 border-orange-300 hover:bg-orange-50">
                Learn More
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative mandala in corner */}
        <div className="absolute bottom-10 right-10 w-40 h-40 opacity-10 hidden lg:block">
          <svg viewBox="0 0 100 100" className="w-full h-full text-orange-500">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x = 50 + 40 * Math.cos(angle);
              const y = 50 + 40 * Math.sin(angle);
              return <circle key={i} cx={x} cy={y} r="3" fill="currentColor" />;
            })}
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 text-orange-600">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-400" />
              <span className="text-2xl">✦</span>
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-400" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Shop by Category</h2>
          <p className="text-gray-600">Explore our curated collections</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/products?category=Pottery">
            <Card className="overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-orange-400 hover:-translate-y-2">
              <div className="aspect-square overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-orange-600/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src="https://images.unsplash.com/photo-1629380321590-3b3f75d66dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMHBvdHRlcnklMjBjZXJhbWljJTIwYXJ0fGVufDF8fHx8MTc3MjAzMjg4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Pottery"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6 bg-gradient-to-br from-orange-50 to-white group-hover:from-orange-100 group-hover:to-orange-50 transition-all duration-300">
                <h3 className="text-xl mb-2 flex items-center gap-2">
                  <span className="text-2xl">🏺</span>
                  Pottery
                </h3>
                <p className="text-gray-600 text-sm">Handcrafted ceramic art</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/products?category=Clothes">
            <Card className="overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-pink-400 hover:-translate-y-2">
              <div className="aspect-square overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-pink-600/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src="https://images.unsplash.com/photo-1762764214015-d5c22646465b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kd292ZW4lMjB0ZXh0aWxlJTIwZmFicmljJTIwYXJ0fGVufDF8fHx8MTc3MjAzMjg4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Clothes"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6 bg-gradient-to-br from-pink-50 to-white group-hover:from-pink-100 group-hover:to-pink-50 transition-all duration-300">
                <h3 className="text-xl mb-2 flex items-center gap-2">
                  <span className="text-2xl">👘</span>
                  Clothes
                </h3>
                <p className="text-gray-600 text-sm">Handwoven fabrics & patterns</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/products?category=Jewellery">
            <Card className="overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-yellow-400 hover:-translate-y-2">
              <div className="aspect-square overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-600/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src="https://images.unsplash.com/photo-1763494893425-5faf136b3b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMHBhaW50aW5nJTIwYXJ0d29yayUyMGNhbnZhc3xlbnwxfHx8fDE3NzIwMzI4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Jewellery"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6 bg-gradient-to-br from-yellow-50 to-white group-hover:from-yellow-100 group-hover:to-yellow-50 transition-all duration-300">
                <h3 className="text-xl mb-2 flex items-center gap-2">
                  <span className="text-2xl">💍</span>
                  Jewellery
                </h3>
                <p className="text-gray-600 text-sm">Traditional & modern art</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-br from-white to-orange-50/30 relative">
        {/* Decorative border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="flex items-center gap-2 text-pink-600">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-pink-400" />
                <span className="text-2xl">✦</span>
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-pink-400" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Featured Products</h2>
            <p className="text-gray-600">Handpicked pieces from our artisan community</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`}>
                <Card className="overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300 h-full border-2 hover:border-purple-300 hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-600/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-4 group-hover:bg-gradient-to-br group-hover:from-purple-50 group-hover:to-white transition-all duration-300">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-orange-400 text-orange-400 group-hover:fill-purple-400 group-hover:text-purple-400 transition-colors" />
                      ))}
                    </div>
                    <h3 className="mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.artist}</p>
                    <p className="font-semibold text-orange-600 group-hover:text-purple-600 transition-colors">₹{product.price.toLocaleString()}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/products">
              <Button variant="outline" size="lg">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Kalakriti celebrates the rich heritage of Indian craftsmanship. We partner directly with skilled artisans across the country, bringing you authentic handcrafted pieces that tell stories of tradition, culture, and passion.
            </p>
            <p className="text-gray-600 mb-6">
              Each product is carefully curated to ensure the highest quality and to support the livelihoods of talented craftspeople who keep these traditional art forms alive.
            </p>
            <Button variant="outline">
              Learn More About Us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1768321481665-b40705ab11ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwY3JhZnRzJTIwY29sb3JmdWwlMjBtYXJrZXR8ZW58MXx8fHwxNzcyMDMyODkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Artisan crafts"
              className="rounded-lg w-full h-64 object-cover hover:scale-105 hover:shadow-xl hover:ring-4 hover:ring-cyan-300 transition-all duration-300"
            />
            <img
              src="https://images.unsplash.com/photo-1756792339487-d044709b27f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGpld2VscnklMjBhcnRpc2FuJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzcyMDMyODkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Handmade jewelry"
              className="rounded-lg w-full h-64 object-cover mt-8 hover:scale-105 hover:shadow-xl hover:ring-4 hover:ring-pink-300 transition-all duration-300"
            />
          </div>
        </div>
      </section>
    </div>
  );
}