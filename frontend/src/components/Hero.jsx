import React from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const images = [
  assets.hero_img,
  assets.hero_img1,
  assets.hero_img2,
  assets.hero_img3,
  assets.hero_img4,
];

const Hero = () => {
  return (
    <section
      className="
relative 
bg-linear-to-br from-orange-50 via-pink-50 to-yellow-50 
py-20 md:py-32 
overflow-hidden
border-2 border-orange-200
rounded-2xl
shadow-lg
transition-all duration-500
hover:border-orange-600
hover:shadow-2xl
hover:bg-linear-to-br hover:from-orange-100 hover:via-pink-100 hover:to-yellow-100
"
    >
      {/* top gradient lines */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-orange-500 via-pink-500 to-orange-500"></div>
      <div className="absolute top-2 left-0 right-0 h-1 bg-linear-to-r from-yellow-500 via-orange-500 to-yellow-500"></div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center gap-12">
        {/* LEFT TEXT SECTION */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200">
            <span className="text-xl">🪔</span>
            <span className="text-sm text-orange-600 font-medium">
              Handcrafted with Love
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif mb-6">
            Discover Authentic
            <span className="block text-orange-600 relative">
              Handcrafted Art
              <svg
                className="absolute -bottom-2 left-0 w-64 h-3"
                viewBox="0 0 200 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,5 Q50,0 100,5 T200,5"
                  stroke="#f97316"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.5"
                />
              </svg>
            </span>
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Each piece is crafted by skilled artisans celebrating traditional
            Indian craftsmanship and timeless beauty.
          </p>

          <div className="flex gap-4">
            <Link to="/collection">
              <button className="bg-linear-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-md shadow-lg hover:from-orange-600 hover:to-pink-600 transition">
                Shop Collection →
              </button>
            </Link>

            <Link to="/about">
              <button className="border-2 border-orange-300 px-6 py-3 rounded-md hover:bg-orange-50 transition">
                Learn More
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE SCROLLER */}

        <div className="w-full lg:w-1/2 overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear",
            }}
          >
            {[...images, ...images].map((img, index) => (
              <motion.img
                key={index}
                src={img}
                alt="hero"
                className="w-60 h-85 object-cover rounded-2xl shadow-lg"
                whileHover={{ scale: 1.1 }}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* mandala decoration */}

      <div className="absolute bottom-10 right-10 w-40 h-40 opacity-10 hidden lg:block">
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-500">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
