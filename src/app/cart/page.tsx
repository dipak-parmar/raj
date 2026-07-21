"use client";

import { useApp } from "../../context/AppContext";
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    couponApplied,
    couponCode,
    applyCoupon,
    removeCoupon,
    orderTotal,
  } = useApp();

  const router = useRouter();
  const [promoText, setPromoText] = useState("");
  const [promoError, setPromoError] = useState("");

  const subtotal = cart.reduce(
    (total, item) => total + item.product.offerPrice * item.quantity,
    0
  );
  
  const discountAmount = couponApplied ? subtotal * 0.15 : 0;
  const tax = 0;
  const shipping = 0;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const success = applyCoupon(promoText);
    if (!success) {
      setPromoError("Invalid coupon code.");
    } else {
      setPromoText("");
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl md:text-5xl font-playfair font-bold text-primary dark:text-white mb-10">
          Your Beauty Bag
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl space-y-6">
            <span className="text-5xl block animate-pulse">🍃</span>
            <div className="space-y-2">
              <h2 className="font-playfair text-xl font-bold text-textCustom dark:text-white">
                Bag is currently empty
              </h2>
              <p className="text-xs text-textCustom/60 dark:text-lightMint/60 font-inter max-w-sm mx-auto leading-relaxed">
                Add our premium organic skincare and cosmetics formulations containing active forest botanicals.
              </p>
            </div>
            <button
              onClick={() => router.push("/products")}
              className="px-8 py-3 bg-primary dark:bg-accent text-white dark:text-primary font-poppins text-xs font-semibold uppercase tracking-widest rounded-full cursor-pointer hover:opacity-90 transition-opacity"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-6">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl gap-6 shadow-sm hover:shadow transition-shadow"
                >
                  {/* Photo & Titles */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product.imgUrl}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-xl bg-white border border-black/5 shrink-0"
                    />
                    <div>
                      <h4 className="font-playfair text-lg font-bold text-textCustom dark:text-white">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-textCustom/50 dark:text-lightMint/50 font-inter mt-0.5">
                        {item.product.tagline}
                      </p>
                      <p className="text-xs text-primary dark:text-accent font-poppins font-semibold mt-1">
                        ₹{item.product.offerPrice} / unit
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls & Delete */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
                    <div className="flex items-center border border-black/10 dark:border-white/10 rounded-full bg-white dark:bg-black/20 h-10 select-none">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-3 text-textCustom/60 dark:text-lightMint/70 hover:text-primary dark:hover:text-white transition-colors h-full flex items-center cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-poppins text-xs font-semibold text-textCustom dark:text-white w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="px-3 text-textCustom/60 dark:text-lightMint/70 hover:text-primary dark:hover:text-white transition-colors h-full flex items-center cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <p className="font-poppins text-sm font-bold text-primary dark:text-accent">
                        ₹{item.product.offerPrice * item.quantity}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-textCustom/40 dark:text-lightMint/40 hover:text-red-500 hover:dark:text-red-400 transition-colors p-2 cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 p-4 sm:p-8 rounded-2xl sm:rounded-3xl space-y-6 shadow-sm">
                <h3 className="font-playfair text-xl font-bold text-primary dark:text-white border-b border-black/5 dark:border-white/5 pb-4">
                  Summary Breakdown
                </h3>

                {/* Promo Code Form */}
                {couponApplied ? (
                  <div className="bg-lightMint/50 dark:bg-accent/10 border border-accent/20 rounded-xl p-3 flex items-center justify-between">
                    <span className="text-xs font-poppins font-semibold text-primary dark:text-accent">
                      ✓ Promo: {couponCode} (15% OFF)
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-poppins text-red-500 font-semibold cursor-pointer hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter Promo Code"
                      value={promoText}
                      onChange={(e) => setPromoText(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 text-xs font-poppins rounded-xl focus:outline-none focus:border-primary dark:focus:border-accent"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary dark:bg-accent text-white dark:text-primary text-[10px] font-poppins font-bold uppercase tracking-wider rounded-xl hover:opacity-90 cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="text-[11px] font-poppins text-red-500 pl-1">
                    {promoError}
                  </p>
                )}

                {/* Billing Summary */}
                <div className="space-y-3.5 text-xs font-inter text-textCustom/70 dark:text-lightMint/70">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-poppins text-textCustom dark:text-white text-sm">₹{subtotal}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-green-600 dark:text-accent font-semibold">
                      <span>15% Coupon Discount</span>
                      <span className="font-poppins">-₹{Math.round(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-poppins text-green-600 dark:text-accent font-semibold text-sm">
                      FREE
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-black/5 dark:border-white/5 pt-4 text-sm font-bold text-primary dark:text-white">
                    <span>Grand Billing Total</span>
                    <span className="font-poppins text-primary dark:text-accent text-lg">
                      ₹{orderTotal}
                    </span>
                  </div>
                </div>

                {/* Checkout Link */}
                <Link
                  href="/checkout"
                  className="w-full py-4 bg-primary dark:bg-accent text-white dark:text-primary font-poppins font-bold text-center uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 hover:opacity-90 hover:space-x-3 cursor-pointer shadow-lg shadow-primary/20 dark:shadow-accent/10"
                >
                  <span>Checkout Order</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-[9px] text-center text-textCustom/40 dark:text-lightMint/30 font-inter">
                  Delivery dates, receipt documentation, and tracking details will be provided at Checkout.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
