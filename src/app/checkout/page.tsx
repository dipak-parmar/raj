"use client";

import { useApp } from "../../context/AppContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertTriangle, QrCode } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function CheckoutPage() {
  const { cart, orderTotal, clearCart, user } = useApp();
  const router = useRouter();

  // Form States
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.phone || "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
  });

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
        mobile: prev.mobile || user.phone || "",
      }));
    }
  }, [user]);
  const [distance, setDistance] = useState<number | "">("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Payment States
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi">("cod");
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed">("pending");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Redirect if cart is empty, but ignore if order has succeeded or is processing
  useEffect(() => {
    if (cart.length === 0 && paymentStatus !== "success" && !paymentProcessing) {
      router.push("/cart");
    }
  }, [cart, router, paymentStatus, paymentProcessing]);

  // Generate unique order ID
  const [orderId] = useState(() => `RAJ-${Math.floor(100000 + Math.random() * 900000)}`);

  // Auto-calculate distance and state based on PIN Code and City
  useEffect(() => {
    const pin = formData.pinCode.trim();
    const city = formData.city.trim().toLowerCase();

    // Auto-fill state if PIN starts with 38 (Gujarat)
    if (pin.startsWith("38") && formData.state.trim() === "") {
      setFormData(prev => ({ ...prev, state: "Gujarat" }));
    }

    if (!pin && !city) {
      setDistance("");
      return;
    }

    // Heuristics for distance calculation
    if (/^\d{6}$/.test(pin)) {
      if (
        pin.startsWith("380") || // Ahmedabad
        pin.startsWith("382424") || // Chandkheda
        pin.startsWith("3820") || // Gandhinagar
        pin === "382421" || // Motera
        pin === "382422" || // Sabarmati
        pin === "382480" // Kalol
      ) {
        setDistance(12); // Under 20 km -> Free Shipping
      } else if (
        pin.startsWith("382") || // Outer Ahmedabad / Gandhinagar
        pin.startsWith("384") || // Mehsana
        pin.startsWith("387") || // Kheda
        pin.startsWith("383")    // Sabarkantha
      ) {
        setDistance(32); // 20 - 40 km -> ₹100
      } else {
        setDistance(150); // Nationwide -> ₹200
      }
    } else if (city) {
      const cleanCity = city.replace(/\s+/g, "");
      if (
        cleanCity === "ahmedabad" ||
        cleanCity === "chandkheda" ||
        cleanCity === "gandhinagar" ||
        cleanCity === "kalol" ||
        cleanCity === "motera" ||
        cleanCity === "sabarmati"
      ) {
        setDistance(12);
      } else if (
        cleanCity === "mehsana" ||
        cleanCity === "nadiad" ||
        cleanCity === "kadi" ||
        cleanCity === "sanand" ||
        cleanCity === "dahegam"
      ) {
        setDistance(32);
      } else {
        if (city.length > 5) {
          setDistance(150);
        } else {
          setDistance("");
        }
      }
    } else {
      setDistance("");
    }
  }, [formData.pinCode, formData.city, formData.state]);

  // Dynamic Shipping Calculation:
  // Within 20 km of Chandkheda: Free delivery.
  // Up to 40 km: ₹100.
  // Above 40 km: ₹200.
  const getDeliveryCharge = () => {
    return 0;
  };
  const deliveryCharge = getDeliveryCharge();
  const grandTotalWithShipping = orderTotal + deliveryCharge;

  // Auto-switch payment destination if distance > 20 km (COD only available under 20 km)
  useEffect(() => {
    if (distance !== "" && Number(distance) > 20) {
      setPaymentMethod("upi");
    }
  }, [distance]);

  // UPI Link generation
  const upiId = "9510583980@slc";
  const payeeName = "RAJ MARKETING";
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${grandTotalWithShipping}&cu=INR&tn=${encodeURIComponent(`Order ${orderId}`)}`;
  
  // Public QR generating API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=10&data=${encodeURIComponent(upiDeepLink)}`;

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email.trim())) {
      errors.email = "Provide a valid email address";
    }
    if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile.trim())) {
      errors.mobile = "Provide a valid 10-digit mobile number";
    }
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.pinCode.trim() || !/^\d{6}$/.test(formData.pinCode.trim())) {
      errors.pinCode = "Provide a valid 6-digit PIN number";
    }
    if (distance === "") {
      errors.distance = "Please enter a valid City or 6-digit PIN Code to calculate shipping distance";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const executeSuccessSimulation = () => {
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentStatus("success");
      
      // Fire confetti celebrate
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Clear bag and redirect to success page after brief delay
      setTimeout(() => {
        // Save order details to localStorage for success page
        const receipt = {
          orderId,
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pinCode} (Distance: ${distance} km)`,
          amount: grandTotalWithShipping,
          deliveryCharge,
          subtotal: orderTotal,
          paymentMethod: paymentMethod === "cod" ? "Cash On Delivery" : "UPI QR Payment",
          status: "pending",
          date: new Date().toLocaleString(),
          items: cart.map(item => ({
            id: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.offerPrice,
            subtotal: item.product.offerPrice * item.quantity
          }))
        };
        localStorage.setItem("raj_latest_order", JSON.stringify(receipt));

        // Save order to the master orders list in localStorage
        const existingOrdersStr = localStorage.getItem("raj_all_orders");
        let allOrders = [];
        if (existingOrdersStr) {
          try {
            allOrders = JSON.parse(existingOrdersStr);
          } catch (e) {
            console.error(e);
          }
        }
        allOrders.unshift(receipt);
        localStorage.setItem("raj_all_orders", JSON.stringify(allOrders));
        
        clearCart();
        router.push("/order-success");
      }, 1500);
    }, 1500);
  };

  const executeFailureSimulation = () => {
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentStatus("failed");
    }, 1500);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (paymentMethod === "cod") {
      executeSuccessSimulation();
    } else {
      // For UPI QR, the merchant displays QR for customer to scan.
      // We wait for simulation check.
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Back navigation */}
        <Link
          href="/cart"
          className="inline-flex items-center space-x-2 text-xs font-poppins font-bold uppercase tracking-wider text-textCustom/60 dark:text-lightMint/60 hover:text-primary dark:hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to bag</span>
        </Link>

        <h1 className="text-3xl md:text-5xl font-playfair font-bold text-primary dark:text-white mb-6 sm:mb-10">
          Secure Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Customer Details Form */}
          <div className="lg:col-span-7 bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 p-4 sm:p-8 rounded-2xl sm:rounded-3xl space-y-6">
            {!user ? (
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl text-[11px] font-inter text-textCustom/75 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <span>Already have an account? Login to save purchase history and track items.</span>
                <Link href="/orders" className="text-primary font-bold hover:underline shrink-0 text-xs text-left sm:text-right">
                  Log In &rarr;
                </Link>
              </div>
            ) : (
              <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-2xl text-[11px] font-inter text-green-700/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <span>Logged in as <strong>{user.name}</strong>. Shipping contact pre-filled!</span>
                <button 
                  type="button" 
                  onClick={() => router.push("/orders")} 
                  className="text-green-700 font-bold hover:underline text-xs shrink-0 cursor-pointer text-left sm:text-right"
                >
                  My Orders &rarr;
                </button>
              </div>
            )}

            <h3 className="font-playfair text-xl font-bold text-primary dark:text-white mb-2">
              Shipping & Delivery Details
            </h3>

            <form onSubmit={handleSubmitOrder} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="name-input" className="text-[10px] font-poppins font-bold uppercase tracking-wider text-textCustom/60 dark:text-lightMint/60">
                    Recipient Name *
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. William Reed"
                    className="w-full px-4 py-2.5 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 text-sm rounded-xl focus:outline-none focus:border-primary dark:focus:border-accent"
                  />
                  {formErrors.name && (
                    <p className="text-[10px] font-poppins text-red-500 pl-1">{formErrors.name}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="mobile-input" className="text-[10px] font-poppins font-bold uppercase tracking-wider text-textCustom/60 dark:text-lightMint/60">
                    Mobile Number (10 digits) *
                  </label>
                  <input
                    id="mobile-input"
                    type="tel"
                    name="mobile"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-2.5 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 text-sm rounded-xl focus:outline-none focus:border-primary dark:focus:border-accent"
                  />
                  {formErrors.mobile && (
                    <p className="text-[10px] font-poppins text-red-500 pl-1">{formErrors.mobile}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email-input" className="text-[10px] font-poppins font-bold uppercase tracking-wider text-textCustom/60 dark:text-lightMint/60">
                  Email Address *
                </label>
                <input
                  id="email-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. customer@gmail.com"
                  className="w-full px-4 py-2.5 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 text-sm rounded-xl focus:outline-none focus:border-primary dark:focus:border-accent"
                />
                {formErrors.email && (
                  <p className="text-[10px] font-poppins text-red-500 pl-1">{formErrors.email}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="address-input" className="text-[10px] font-poppins font-bold uppercase tracking-wider text-textCustom/60 dark:text-lightMint/60">
                  Street Address *
                </label>
                <input
                  id="address-input"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g. Apt 4B, Raj Tower, MG Marg"
                  className="w-full px-4 py-2.5 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 text-sm rounded-xl focus:outline-none focus:border-primary dark:focus:border-accent"
                />
                {formErrors.address && (
                  <p className="text-[10px] font-poppins text-red-500 pl-1">{formErrors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="city-input" className="text-[10px] font-poppins font-bold uppercase tracking-wider text-textCustom/60 dark:text-lightMint/60">
                    City *
                  </label>
                  <input
                    id="city-input"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. New Delhi"
                    className="w-full px-4 py-2.5 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 text-sm rounded-xl focus:outline-none focus:border-primary dark:focus:border-accent"
                  />
                  {formErrors.city && (
                    <p className="text-[10px] font-poppins text-red-500 pl-1">{formErrors.city}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="state-input" className="text-[10px] font-poppins font-bold uppercase tracking-wider text-textCustom/60 dark:text-lightMint/60">
                    State *
                  </label>
                  <input
                    id="state-input"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g. Delhi"
                    className="w-full px-4 py-2.5 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 text-sm rounded-xl focus:outline-none focus:border-primary dark:focus:border-accent"
                  />
                  {formErrors.state && (
                    <p className="text-[10px] font-poppins text-red-500 pl-1">{formErrors.state}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="pincode-input" className="text-[10px] font-poppins font-bold uppercase tracking-wider text-textCustom/60 dark:text-lightMint/60">
                    PIN Code (6 digits) *
                  </label>
                  <input
                    id="pincode-input"
                    type="text"
                    name="pinCode"
                    maxLength={6}
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    placeholder="e.g. 110001"
                    className="w-full px-4 py-2.5 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 text-sm rounded-xl focus:outline-none focus:border-primary dark:focus:border-accent"
                  />
                  {formErrors.pinCode && (
                    <p className="text-[10px] font-poppins text-red-500 pl-1">{formErrors.pinCode}</p>
                  )}
                </div>
              </div>

              {/* Calculated Distance (Simulated via PIN/City) */}
              <div className="space-y-1.5 pt-2">
                <div className="text-[10px] font-poppins font-bold uppercase tracking-wider text-textCustom/60 dark:text-lightMint/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span>Shipping Distance</span>
                  <span className="text-secondary dark:text-accent lowercase font-medium">Automatic Calculation</span>
                </div>
                
                <div className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 text-sm rounded-xl flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                  <span className="text-textCustom/50 dark:text-lightMint/50 font-inter text-xs leading-normal">
                    {distance === "" ? "Awaiting City or PIN Code..." : `Distance from Chandkheda Depot:`}
                  </span>
                  <span className="font-poppins font-bold text-primary dark:text-accent shrink-0 text-sm">
                    {distance === "" ? "—" : `${distance} km`}
                  </span>
                </div>
                {formErrors.distance && (
                  <p className="text-[10px] font-poppins text-red-500 pl-1">{formErrors.distance}</p>
                )}

                {/* Interactive Shipping Rules Badge */}
                <div className="p-3.5 bg-secondary/10 dark:bg-accent/5 border border-black/5 dark:border-white/5 rounded-2xl text-[11px] font-inter text-textCustom/80 dark:text-lightMint/80 space-y-1.5 mt-2.5">
                  <p className="font-semibold text-primary dark:text-accent flex items-center">
                    🌿 Shipping Policy:
                  </p>
                  <p className="opacity-90">
                    Standard delivery is <span className="font-bold text-accent">FREE</span> for all orders.
                  </p>
                  <p className="text-[10px] text-textCustom/50 dark:text-lightMint/50 mt-1 italic">
                    *Above 40 km, shipping charges may apply.
                  </p>
                </div>
              </div>

              {/* Payment Methods Selection */}
              <div className="pt-6 border-t border-black/5 dark:border-white/5 space-y-4">
                <h3 className="font-playfair text-xl font-bold text-primary dark:text-white">
                  Payment Destination
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    disabled={distance !== "" && Number(distance) > 20}
                    onClick={() => {
                      setPaymentMethod("cod");
                      setPaymentStatus("pending");
                    }}
                    className={`p-4 rounded-2xl border text-left flex flex-col space-y-2 transition-all duration-300 ${
                      distance !== "" && Number(distance) > 20
                        ? "opacity-35 cursor-not-allowed border-black/5 bg-black/[0.02] dark:bg-white/[0.01]"
                        : paymentMethod === "cod"
                          ? "border-primary dark:border-accent bg-primary/5 dark:bg-accent/15 cursor-pointer"
                          : "border-black/5 dark:border-white/10 bg-transparent hover:border-black/10 hover:dark:border-white/20 cursor-pointer"
                    }`}
                  >
                    <span className="font-poppins text-xs font-bold uppercase text-primary dark:text-accent">
                      Cash On Delivery
                    </span>
                    <span className="text-[10px] text-textCustom/50 dark:text-lightMint/50 font-inter">
                      {distance !== "" && Number(distance) > 20
                        ? "Restricted to local 20 km zone."
                        : "Pay at your doorstep after parcel delivery."}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("upi");
                      setPaymentStatus("pending");
                    }}
                    className={`p-4 rounded-2xl border text-left flex flex-col space-y-2 cursor-pointer transition-all duration-300 ${
                      paymentMethod === "upi"
                        ? "border-primary dark:border-accent bg-primary/5 dark:bg-accent/15"
                        : "border-black/5 dark:border-white/10 bg-transparent hover:border-black/10 hover:dark:border-white/20"
                    }`}
                  >
                    <span className="font-poppins text-xs font-bold uppercase text-primary dark:text-accent flex items-center space-x-1.5">
                      <QrCode className="w-4 h-4 shrink-0" />
                      <span>Instant UPI QR</span>
                    </span>
                    <span className="text-[10px] text-textCustom/50 dark:text-lightMint/50 font-inter">
                      Scan dynamic amount QR code on screen.
                    </span>
                  </button>
                </div>
              </div>

              {/* Order Submission for COD */}
              {paymentMethod === "cod" && (
                <button
                  type="submit"
                  disabled={paymentProcessing}
                  className="w-full mt-6 py-4 bg-primary dark:bg-accent text-white dark:text-primary font-poppins text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {paymentProcessing ? "Processing Order..." : `Submit Order (COD - ₹${grandTotalWithShipping})`}
                </button>
              )}
            </form>
          </div>

          {/* Checkout Right Side: QR generation visual or checkout summary */}
          <div className="lg:col-span-5 space-y-6">
            {/* Dynamic UPI QR Panel */}
            {paymentMethod === "upi" && (
              <div className="bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 p-4 sm:p-8 rounded-2xl sm:rounded-3xl space-y-6 text-center shadow-sm select-none">
                <div className="space-y-2">
                  <h3 className="font-playfair text-xl font-bold text-primary dark:text-white">
                    Dynamic UPI QR Code
                  </h3>
                  <p className="text-xs text-textCustom/60 dark:text-lightMint/60 font-inter leading-relaxed max-w-xs mx-auto">
                    Scan with any UPI app (GPay, PhonePe, Paytm, BHIM). The exact amount has been packed inside.
                  </p>
                </div>

                {/* Live QR Image */}
                <div className="relative w-52 h-52 mx-auto bg-white p-3 rounded-2xl border border-black/5 shadow-inner flex items-center justify-center">
                  <img
                    src={qrCodeUrl}
                    alt="UPI request payment QR code"
                    className="w-full h-full object-contain"
                  />
                  {paymentProcessing && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xs flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-primary dark:border-accent border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="font-inter text-xs text-textCustom/50 dark:text-lightMint/50">Requested Amount:</p>
                  <p className="font-poppins text-2xl font-bold text-primary dark:text-accent">
                    ₹{grandTotalWithShipping}
                  </p>
                </div>

                {/* Simulated Payment actions */}
                <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5 max-w-xs mx-auto">
                  <button
                    onClick={() => {
                      if (!validateForm()) return;
                      executeSuccessSimulation();
                    }}
                    disabled={paymentProcessing}
                    className="w-full py-3 bg-secondary/15 dark:bg-accent/20 border border-secondary/20 dark:border-accent/20 text-secondary dark:text-accent font-poppins text-[10px] font-bold uppercase tracking-wider rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simulate Payment Success</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      if (!validateForm()) return;
                      executeFailureSimulation();
                    }}
                    disabled={paymentProcessing}
                    className="w-full py-3 bg-red-500/10 border border-red-500/20 text-red-500 font-poppins text-[10px] font-bold uppercase tracking-wider rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Simulate Payment failure</span>
                  </button>
                </div>

                {/* Show status replies */}
                {paymentStatus === "success" && (
                  <div className="bg-green-600/15 border border-green-600/20 p-3.5 rounded-xl text-green-600 font-poppins text-xs font-semibold">
                    ✓ Payment Verified. Loading Order Success Page...
                  </div>
                )}
                {paymentStatus === "failed" && (
                  <div className="bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl text-red-500 font-poppins text-xs font-semibold space-y-1">
                    <p className="font-bold">❌ UPI Transmission Rejected.</p>
                    <p className="text-[10px] font-inter opacity-80">Check your internet or bank server parameters and try scanning again.</p>
                  </div>
                )}
              </div>
            )}

            {/* Billing totals snapshot card */}
            <div className="bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-4 shadow-sm select-none">
              <h4 className="font-playfair text-lg font-bold text-textCustom dark:text-white">
                Purchase Order
              </h4>
              <div className="divide-y divide-black/5 dark:divide-white/5 max-h-36 overflow-y-auto space-y-2.5 pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-xs font-inter text-textCustom/75 dark:text-lightMint/75 pt-2">
                    <span className="truncate flex-1 min-w-0 mr-4 text-left">{item.product.name} (x{item.quantity})</span>
                    <span className="font-poppins font-semibold shrink-0">₹{item.product.offerPrice * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-black/5 dark:border-white/5 pt-3.5 space-y-2 text-xs font-semibold text-textCustom/80 dark:text-lightMint/80">
                <div className="flex justify-between">
                  <span>Bag Subtotal:</span>
                  <span className="font-poppins">₹{orderTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Cost:</span>
                  <span className="font-poppins">{deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-primary dark:text-accent pt-1 border-t border-black/5 dark:border-white/5">
                  <span>Grand Total:</span>
                  <span className="font-poppins text-base">₹{grandTotalWithShipping}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
