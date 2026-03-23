import React, { useState, useEffect, useContext, useRef } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const NavBar = () => {

  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchHovered, setSearchHovered] = useState(false);
  const [profileHovered, setProfileHovered] = useState(false);
  const [cartHovered, setCartHovered] = useState(false);
  const [menuHovered, setMenuHovered] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [hoveredZone, setHoveredZone] = useState(null); // 'logo' | 'search' | 'profile' | 'cart' | 'menu'
  const [isListening, setIsListening] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  const { getCartCount, getWishlistCount, token, logout, navigate, search, setSearch, showSearch, setShowSearch, role } = useContext(ShopContext);

  // Voice recognition
  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearch(transcript);
      navigate('/collection');
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access and try again.');
      } else if (event.error === 'no-speech') {
        alert('No speech detected. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
      // Close search when scrolling
      if (isScrolled && showSearch) {
        setShowSearch(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showSearch]);

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    navigate('/collection');
    if (!showSearch) setTimeout(() => searchRef.current?.querySelector('input')?.focus(), 100);
  };

  const reelStyle = (zone) => ({
    transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
    transform: hoveredZone === zone
      ? 'scale(1.25) translateY(-3px)'
      : hoveredZone !== null
      ? 'scale(0.82) translateY(2px)'
      : 'scale(1) translateY(0px)',
    opacity: hoveredZone !== null && hoveredZone !== zone ? 0.4 : 1,
    filter: hoveredZone !== null && hoveredZone !== zone ? 'blur(0.3px)' : 'none',
  });

  return (
    <>
      <div className={`sticky top-0 z-50 relative transition-all duration-500
        ${scrolled ? "bg-white/90 backdrop-blur-md shadow-md border-b border-yellow-400" : "bg-transparent"}`}>

        <div className={`flex items-center justify-between font-medium transition-all duration-500 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]
          ${scrolled ? "py-2" : "py-4"}`}>

          {/* Logo */}
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onMouseEnter={() => setHoveredZone('logo')}
            onMouseLeave={() => setHoveredZone(null)}
            style={{
              transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: hoveredZone === 'logo' ? 'scale(1.08) translateY(-2px)' : 'scale(1)',
              opacity: 1,
              filter: 'none',
            }}>
            <img
              src={assets.logo}
              className={`cursor-pointer transition-all duration-500 hover:drop-shadow-md ${scrolled ? "w-20" : "w-28"}`}
              alt="logo"
            />
          </Link>

          {/* Desktop Menu */}
          <ul
            className={`hidden sm:flex gap-6 text-gray-700 transition-all duration-500 ${scrolled ? "text-xs" : "text-sm"}`}
            onMouseLeave={() => setHoveredNav(null)}
          >
            {["/", "/collection", "/vendor", "/contact", "/about"].map((path, i) => {
              const label = ["HOME", "COLLECTION", "VENDOR", "CONTACT", "ABOUT"][i];
              const isHovered = hoveredNav === i;
              const isOther = hoveredNav !== null && hoveredNav !== i;
              return (
                <NavLink key={i} to={path}
                  onMouseEnter={() => setHoveredNav(i)}
                  className={({ isActive }) =>
                    `relative group transition-all duration-300 ${isActive ? "text-black font-bold" : ""}`}
                  style={{
                    transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: isHovered
                      ? 'scale(1.35) translateY(-3px)'
                      : isOther
                      ? 'scale(0.78) translateY(2px)'
                      : 'scale(1) translateY(0px)',
                    opacity: isOther ? 0.4 : 1,
                    color: isHovered ? '#ea580c' : undefined,
                    fontWeight: isHovered ? '700' : undefined,
                    textShadow: isHovered ? '0 2px 8px rgba(249,115,22,0.4)' : 'none',
                    filter: isOther ? 'blur(0.4px)' : 'none',
                  }}>
                  {label}
                  <span className="nav-underline"></span>
                </NavLink>
              );
            })}
          </ul>

          {/* Icons */}
          <div className={`flex items-center transition-all duration-500 ${scrolled ? "gap-2" : "gap-3"}`}>

            {/* Search */}
            <div ref={searchRef} className="flex items-center"
              onMouseEnter={() => { setSearchHovered(true); setHoveredZone('search'); }}
              onMouseLeave={() => { setSearchHovered(false); setHoveredZone(null); }}
              style={reelStyle('search')}>
              <div className={`flex items-center overflow-hidden transition-all duration-500 ease-in-out
                ${showSearch ? "w-56 bg-white border border-orange-300 shadow-lg shadow-orange-100" : "bg-transparent border border-transparent"}
                ${scrolled ? "rounded-full px-1 py-1" : "rounded-full px-1.5 py-1.5"}`}>
                <button
                  onClick={handleSearchToggle}
                  style={{ transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                  className={`flex-shrink-0 relative flex items-center justify-center rounded-full overflow-visible
                    ${scrolled ? "w-7 h-7" : "w-10 h-10"}`}>

                  {/* Ripple ring on hover */}
                  <span style={{
                    position: 'absolute', inset: '-5px', borderRadius: '50%',
                    border: '2px solid rgba(249,115,22,0.5)',
                    transform: searchHovered && !showSearch ? 'scale(1.6)' : 'scale(0.8)',
                    opacity: searchHovered && !showSearch ? 0 : 0,
                    transition: 'all 0.5s ease-out',
                    pointerEvents: 'none',
                  }} />

                  {/* Search Icon or Cross Icon */}
                  {showSearch ? (
                    <img
                      src={assets.cross_icon}
                      alt="close search"
                      style={{
                        width: scrolled ? '16px' : '20px',
                        height: scrolled ? '16px' : '20px',
                        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        transform: searchHovered ? 'scale(1.1) rotate(90deg)' : 'scale(1) rotate(0deg)',
                        filter: 'brightness(0) invert(0.4)',
                      }}
                    />
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{
                        width: scrolled ? '18px' : '26px',
                        height: scrolled ? '18px' : '26px',
                        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        transform: searchHovered
                          ? 'rotate(-20deg) scale(1.2) translateY(-1px)'
                          : 'rotate(0deg) scale(1)',
                        filter: searchHovered ? 'drop-shadow(0 0 4px rgba(249,115,22,0.8))' : 'none',
                      }}
                    >
                      {/* Lens circle */}
                      <circle
                        cx="10" cy="10" r="6"
                        stroke={searchHovered ? '#f97316' : '#6b7280'}
                        strokeWidth="2"
                        style={{ transition: 'stroke 0.3s ease' }}
                      />
                      {/* Handle */}
                      <line
                        x1="14.5" y1="14.5" x2="19" y2="19"
                        stroke={searchHovered ? '#f97316' : '#6b7280'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        style={{
                          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          transformOrigin: '14.5px 14.5px',
                          transform: searchHovered ? 'rotate(15deg) scaleX(1.2)' : 'rotate(0deg) scaleX(1)',
                        }}
                      />
                      {/* Scanning line inside lens — slides top to bottom on hover */}
                      <line
                        x1="6" y1="10" x2="14" y2="10"
                        stroke="#fb923c"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        style={{
                          transition: 'all 0.4s ease-in-out',
                          opacity: searchHovered ? 1 : 0,
                          transform: searchHovered ? 'translateY(3px)' : 'translateY(-3px)',
                        }}
                      />
                      {/* Shine dot inside lens */}
                      <circle
                        cx="8" cy="8" r="1.2"
                        fill="#fed7aa"
                        style={{
                          transition: 'all 0.35s ease',
                          opacity: searchHovered ? 1 : 0,
                          transform: searchHovered ? 'scale(1)' : 'scale(0)',
                          transformOrigin: '8px 8px',
                        }}
                      />
                    </svg>
                  )}

                  {/* Outer glow bg */}
                  <span style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: showSearch
                      ? 'rgba(249,115,22,0.1)'
                      : searchHovered
                      ? 'radial-gradient(circle, rgba(253,186,116,0.5) 0%, rgba(249,115,22,0.15) 70%, transparent 100%)'
                      : 'transparent',
                    transition: 'all 0.4s ease',
                    pointerEvents: 'none',
                    zIndex: -1,
                  }} />
                </button>
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); navigate('/collection') }}
                  onKeyDown={e => e.key === 'Escape' && setShowSearch(false)}
                  placeholder="Search products..."
                  className={`outline-none bg-transparent text-gray-700 placeholder-gray-400 transition-all duration-500
                    ${scrolled ? "text-xs" : "text-sm"}
                    ${showSearch ? "w-full ml-2 opacity-100" : "w-0 opacity-0"}`}
                />
                {showSearch && (
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={startVoiceSearch}
                      disabled={isListening}
                      className={`flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-200
                        ${scrolled ? "w-4 h-4" : "w-5 h-5"}
                        ${isListening
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-orange-100 hover:bg-orange-200'
                        }`}
                      title="Voice search"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`${scrolled ? "w-3 h-3" : "w-4 h-4"}`}
                      >
                        <path
                          d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z"
                          stroke={isListening ? '#ffffff' : '#f97316'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M19 10V12C19 16.4183 15.4183 20 11 20C6.58172 20 3 16.4183 3 12V10"
                          stroke={isListening ? '#ffffff' : '#f97316'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 20V23"
                          stroke={isListening ? '#ffffff' : '#f97316'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {isListening && (
                          <circle cx="19" cy="5" r="1.5" fill="#ef4444" />
                        )}
                      </svg>
                    </button>
                    {search && (
                      <button onClick={() => setSearch('')}
                        className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded-full bg-gray-200 hover:bg-orange-200 transition">
                        <img src={assets.cross_icon} className="w-2" alt="clear" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Profile */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                onMouseEnter={() => { setProfileHovered(true); setHoveredZone('profile'); }}
                onMouseLeave={() => { setProfileHovered(false); setHoveredZone(null); }}
                style={{
                  ...reelStyle('profile'),
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: profileOpen ? 'scale(1.1)' : profileHovered ? 'scale(1.2) translateY(-3px)' : 'scale(1)',
                  background: profileOpen ? '#f97316' : profileHovered ? 'linear-gradient(135deg, #fde68a, #fb923c)' : 'transparent',
                  boxShadow: profileHovered && !profileOpen ? '0 4px 15px rgba(249,115,22,0.4), 0 0 0 4px rgba(249,115,22,0.1)' : profileOpen ? '0 4px 15px rgba(249,115,22,0.5)' : 'none',
                  border: profileHovered || profileOpen ? '1px solid #fb923c' : '1px solid transparent',
                }}
                className={`flex items-center justify-center rounded-full ${scrolled ? "w-7 h-7" : "w-8 h-8"}`}>
                <img
                  src={assets.profile_icon}
                  style={{
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: profileHovered ? 'rotateY(180deg) scale(1.1)' : 'rotateY(0deg)',
                    filter: profileHovered ? 'brightness(0) invert(0.3) sepia(1) saturate(3) hue-rotate(340deg)' : 'none',
                  }}
                  className={scrolled ? "w-3.5" : "w-4"} alt="profile" />
              </button>
              <div className={`absolute right-0 top-10 transition-all duration-300 origin-top-right
                ${profileOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}>
                <div className="w-44 bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
                  <div className="px-3 py-2 bg-orange-50 border-b border-orange-100">
                    <p className="text-xs text-orange-600 font-semibold uppercase tracking-wide">
                      {token ? (role === 'vendor' ? '🏪 Vendor' : role === 'admin' ? '⚙️ Admin' : '👤 Customer') : "Welcome"}
                    </p>
                  </div>
                  <div className="py-1">
                    {token ? (
                      <>
                        {role === 'customer' && (
                          <button onClick={() => { navigate('/orders'); setProfileOpen(false) }}
                            className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition flex items-center gap-2">
                            📦 My Orders
                          </button>
                        )}
                        {role === 'vendor' && (
                          <button onClick={() => { navigate('/vendor-dashboard'); setProfileOpen(false) }}
                            className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition flex items-center gap-2">
                            🏪 Vendor Dashboard
                          </button>
                        )}
                        {role === 'admin' && (
                          <button onClick={() => { navigate('/admin'); setProfileOpen(false) }}
                            className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition flex items-center gap-2">
                            ⚙️ Admin Panel
                          </button>
                        )}
                        <hr className="my-1 border-orange-100" />
                        <button onClick={() => { logout(); setProfileOpen(false) }}
                          className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-50 hover:text-red-600 transition flex items-center gap-2">
                          🚪 Logout
                        </button>
                      </>
                    ) : (
                      <button onClick={() => { navigate('/login'); setProfileOpen(false) }}
                        className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition flex items-center gap-2">
                        🔑 Login
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Wishlist */}
            <button
              onClick={() => navigate('/wishlist')}
              onMouseEnter={() => setHoveredZone('wishlist')}
              onMouseLeave={() => setHoveredZone(null)}
              style={{
                ...reelStyle('wishlist'),
                transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: hoveredZone === 'wishlist' ? 'scale(1.3)' : 'scale(1)',
                background: hoveredZone === 'wishlist' ? 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(236,72,153,0.3))' : 'transparent',
                boxShadow: hoveredZone === 'wishlist' ? '0 6px 25px rgba(236,72,153,0.4), 0 0 0 3px rgba(236,72,153,0.2)' : 'none',
                border: hoveredZone === 'wishlist' ? '2px solid rgba(236,72,153,0.6)' : '2px solid transparent',
              }}
              className={`relative flex items-center justify-center rounded-full ${scrolled ? "w-9 h-9" : "w-11 h-11"} ${hoveredZone === 'wishlist' ? 'animate-heartbeat' : ''}`}>
              <span className={scrolled ? "text-2xl" : "text-3xl"} style={{ color: '#ec4899', lineHeight: '1', fontWeight: 'bold' }}>♥</span>
              {getWishlistCount() > 0 && (
                <span
                  style={{ transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)', transform: hoveredZone === 'wishlist' ? 'scale(1.4)' : 'scale(1)' }}
                  className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-pink-500 text-white rounded-full text-[9px] font-bold shadow-lg shadow-pink-300 border-2 border-white">
                  {getWishlistCount()}
                </span>
              )}
            </button>

            {/* Cart */}
            <Link to="/cart"
              onMouseEnter={() => { setCartHovered(true); setHoveredZone('cart'); }}
              onMouseLeave={() => { setCartHovered(false); setHoveredZone(null); }}
              style={{
                ...reelStyle('cart'),
                transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: cartHovered ? 'scale(1.2) rotate(12deg)' : 'scale(1) rotate(0deg)',
                background: cartHovered ? 'linear-gradient(135deg, #fed7aa, #fb923c)' : 'transparent',
                boxShadow: cartHovered ? '0 4px 18px rgba(249,115,22,0.45), 0 0 0 4px rgba(249,115,22,0.12)' : 'none',
                border: cartHovered ? '1px solid #fb923c' : '1px solid transparent',
              }}
              className={`relative flex items-center justify-center rounded-full ${scrolled ? "w-7 h-7" : "w-8 h-8"}`}>
              <img
                src={assets.cart_icon}
                style={{
                  transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: cartHovered ? 'rotate(-12deg) scale(1.15)' : 'rotate(0deg) scale(1)',
                }}
                className={scrolled ? "w-3.5" : "w-4"} alt="cart" />
              {getCartCount() > 0 && (
                <span
                  style={{ transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)', transform: cartHovered ? 'scale(1.3)' : 'scale(1)' }}
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 flex items-center justify-center bg-orange-500 text-white rounded-full text-[8px] font-bold shadow-md shadow-orange-300">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Mobile Menu */}
            <button
              onClick={() => setVisible(true)}
              onMouseEnter={() => { setMenuHovered(true); setHoveredZone('menu'); }}
              onMouseLeave={() => { setMenuHovered(false); setHoveredZone(null); }}
              style={{
                ...reelStyle('menu'),
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: menuHovered ? 'scale(1.2) rotate(90deg)' : 'scale(1) rotate(0deg)',
                background: menuHovered ? 'linear-gradient(135deg, #fde68a, #fb923c)' : 'transparent',
                boxShadow: menuHovered ? '0 4px 15px rgba(249,115,22,0.4), 0 0 0 4px rgba(249,115,22,0.1)' : 'none',
                border: menuHovered ? '1px solid #fb923c' : '1px solid transparent',
              }}
              className={`flex items-center justify-center rounded-full sm:hidden ${scrolled ? "w-7 h-7" : "w-8 h-8"}`}>
              <img
                src={assets.menu_icon}
                style={{
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: menuHovered ? 'rotate(-90deg) scale(1.1)' : 'rotate(0deg) scale(1)',
                }}
                className={scrolled ? "w-3.5" : "w-4"} alt="menu" />
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {visible && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setVisible(false)} />
          <div className="fixed top-0 right-0 h-full w-56 bg-white shadow-2xl z-50">
            <div className="flex items-center justify-between p-4 border-b border-orange-100">
              <p className="font-semibold text-orange-700 text-sm">MENU</p>
              <button onClick={() => setVisible(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-orange-100 transition">
                <img src={assets.cross_icon} className="w-3" alt="close" />
              </button>
            </div>
            <div className="flex flex-col py-3">
              {["/", "/collection", "/vendor", "/contact", "/about"].map((path, i) => (
                <NavLink key={i} to={path} onClick={() => setVisible(false)}
                  className="px-5 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition">
                  {["Home", "Collection", "Vendor", "Contact", "About"][i]}
                </NavLink>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NavBar;
