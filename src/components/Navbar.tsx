"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingBag, Sun, Moon, X, Menu as MenuIcon } from "lucide-react";
import { useApp } from "../context/AppContext";
import { products } from "../data/products";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { cart, setCartOpen, cartOpen, user } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  // Scroll threshold detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredProducts = searchQuery
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Trust", href: "/trust" },
    { label: "Services", href: "/services" },
    { label: user ? `Hi, ${user.name.split(" ")[0]}` : "My Orders", href: "/orders" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Morphing Header with Framer Motion Layout Animations */}
      <motion.header
        layout
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ left: "50%", x: "-50%" }}
        className={`fixed z-50 transition-colors duration-300 ${
          isScrolled
            ? "top-4 w-[92%] max-w-[600px] py-2 px-4 sm:px-6 rounded-full bg-white/30 dark:bg-primary/20 backdrop-blur-xl border border-black/5 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] text-primary dark:text-lightMint"
            : pathname === "/"
              ? "top-10 w-full py-6 px-4 sm:px-6 bg-transparent text-white rounded-none border-b border-transparent shadow-none"
              : "top-10 w-full py-7 px-4 sm:px-6 bg-primary dark:bg-primary/95 text-white rounded-none border-b border-white/10 shadow-md"
        }`}
      >
        <div className="w-full flex items-center justify-between">
          
          {/* Logo */}
          <motion.div layout="position" className="shrink-0 flex items-center">
            <Link href="/" className="whitespace-nowrap shrink-0 block">
              <span
                className={`text-xs xs:text-sm sm:text-base md:text-xl font-playfair font-bold tracking-wider xs:tracking-widest whitespace-nowrap select-none transition-colors duration-300 ${
                  isScrolled
                    ? "text-primary"
                    : "text-white"
                }`}
              >
                RAJ MARKETING
              </span>
            </Link>
          </motion.div>

          {/* Middle Navigation Links (Exit/Enter animation as container width shrinks) */}
          <AnimatePresence>
            {!isScrolled && (
              <motion.nav
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="hidden lg:flex items-center space-x-8 shrink-0"
              >
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="relative py-1 font-inter text-sm font-medium tracking-wide uppercase text-white/80 hover:text-white transition-colors"
                    >
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="activeUnderline"
                          className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </motion.nav>
            )}
          </AnimatePresence>

          {/* Right Action Switcher */}
          <motion.div layout="position" className="flex items-center shrink-0">
            <AnimatePresence mode="wait">
              {!isScrolled ? (
                /* Normal Desktop & Mobile triggers when at top */
                <motion.div
                  key="actions-normal"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center space-x-1 sm:space-x-3 md:space-x-5"
                >
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-1.5 sm:p-2 rounded-full cursor-pointer hover:bg-white/10 transition-colors text-white"
                    aria-label="Search"
                  >
                    <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>

                  <button
                    onClick={() => setCartOpen(!cartOpen)}
                    className="p-1.5 sm:p-2 rounded-full cursor-pointer relative hover:bg-white/10 transition-colors text-white"
                    aria-label="Cart"
                  >
                    <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-3.5 sm:w-4 font-poppins h-3.5 sm:h-4 text-[8px] sm:text-[9px] bg-accent text-primary font-bold flex items-center justify-center rounded-full">
                        {cartItemsCount}
                      </span>
                    )}
                  </button>



                  {/* Mobil menu toggle at top */}
                  <button
                    onClick={() => setMenuOpen(true)}
                    className="lg:hidden flex items-center p-1.5 sm:p-2 rounded-full text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Open menu"
                  >
                    <MenuIcon className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
                  </button>
                </motion.div>
              ) : (
                /* Only the minimal hamburger button when scrolled */
                <motion.button
                  key="action-hamburger"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setMenuOpen(true)}
                  className="p-2 text-primary dark:text-lightMint hover:text-accent dark:hover:text-accent hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  aria-label="Open menu"
                >
                  <MenuIcon className="w-5.5 h-5.5 md:w-6 md:h-6" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.header>

      {/* Expanded Fullscreen Navigation Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary/95 dark:bg-primary/98 backdrop-blur-xl flex flex-col justify-between p-8 md:p-16 text-white"
          >
            {/* Expanded Header */}
            <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
              <span className="text-base sm:text-xl font-playfair font-bold tracking-wider sm:tracking-widest text-lightMint">
                RAJ MARKETING
              </span>
              
              <div className="flex items-center space-x-2 md:space-x-4">
                {/* Search */}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="p-2 rounded-full hover:bg-white/10 text-lightMint hover:text-white transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Cart link */}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setCartOpen(true);
                  }}
                  className="p-2 rounded-full relative hover:bg-white/10 text-lightMint hover:text-white transition-colors"
                  aria-label="Cart"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 font-poppins h-4 text-[9px] bg-accent text-primary font-bold flex items-center justify-center rounded-full">
                      {cartItemsCount}
                    </span>
                  )}
                </button>



                {/* Close Button */}
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-full border border-white/20 hover:border-white hover:bg-white/10 text-white transition-all cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="max-w-4xl mx-auto w-full flex flex-col justify-center items-center space-y-6 md:space-y-8 my-auto select-none">
              {menuItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`font-playfair text-3xl md:text-5xl font-bold tracking-wide transition-colors ${
                        isActive ? "text-accent" : "text-white/80 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom contact deck */}
            <div className="w-full max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-lightMint/60 space-y-4 md:space-y-0">
              <div className="flex flex-col space-y-1 text-center md:text-left font-inter">
                <span>Owner: Pravin Bhai</span>
                <span>Email: dipakparmar2466@gmail.com</span>
              </div>
              <div className="flex space-x-6 font-poppins">
                <a href="tel:+919924750849" className="hover:text-accent transition-colors">+91 99247 50849</a>
                <a href="tel:+919510583980" className="hover:text-accent transition-colors">+91 95105 83980</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Search Overlay Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary/95 backdrop-blur-md flex flex-col justify-start pt-24 px-6 md:px-12"
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              className="absolute top-6 right-6 p-3 text-lightMint hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Search Input Container */}
            <div className="max-w-3xl mx-auto w-full">
              <label htmlFor="search-input" className="sr-only">Search our luxury collection</label>
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search our luxury collection..."
                className="w-full text-2xl md:text-4xl text-white font-playfair bg-transparent border-b border-lightMint/30 focus:border-accent outline-none pb-4 tracking-wider transition-colors placeholder:text-lightMint/30"
                autoFocus
              />
              
              {/* Results */}
              <div className="mt-8 overflow-y-auto max-h-[60vh] space-y-4 pr-2 select-none">
                {searchQuery === "" ? (
                   <p className="text-lightMint/50 font-inter text-sm">
                     Type a product name to search (e.g. Serum, Toner, Hydra-Cream...)
                   </p>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                        router.push(`/products/${product.id}`);
                      }}
                      className="flex items-center p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-all duration-300 border border-transparent hover:border-white/5"
                    >
                      <img
                        src={product.imgUrl}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                      <div>
                        <h4 className="font-playfair text-lg text-white font-semibold">
                          {product.name}
                        </h4>
                        <p className="text-xs text-lightMint/70 font-inter mt-0.5">
                          {product.tagline}
                        </p>
                        <p className="text-sm font-poppins text-accent font-semibold mt-1">
                          ₹{product.offerPrice}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-lightMint/50 font-inter text-sm">
                    No organic luxury products found matching "{searchQuery}".
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
