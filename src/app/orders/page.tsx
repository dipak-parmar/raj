"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { 
  ChevronRight, 
  Package, 
  PhoneCall, 
  Clock, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  LogOut, 
  Lock,
  ShoppingBag,
  MapPin,
  Calendar,
  DollarSign,
  Search,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

interface ReceiptItem {
  id: string | number;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Receipt {
  orderId: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  amount: number;
  paymentMethod: string;
  deliveryCharge?: number;
  subtotal?: number;
  items?: ReceiptItem[];
  status: string; // 'pending' or 'confirmed'
  date: string;
}

export default function MyOrdersPage() {
  const { user, loginCustomer, logoutCustomer } = useApp();
  const router = useRouter();

  // Login Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginError, setLoginError] = useState("");

  // Customer orders state
  const [customerOrders, setCustomerOrders] = useState<Receipt[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Receipt | null>(null);

  // Sync / fetch orders from raj_all_orders once logged in
  useEffect(() => {
    if (user) {
      const allOrdersStr = localStorage.getItem("raj_all_orders");
      if (allOrdersStr) {
        try {
          const parsed: Receipt[] = JSON.parse(allOrdersStr);
          // Filter by email or phone matches (case-insensitive)
          const filtered = parsed.filter(
            (o) =>
              (o.email && o.email.toLowerCase() === user.email.toLowerCase()) ||
              (o.mobile && o.mobile.trim() === user.phone.trim())
          );
          setCustomerOrders(filtered);
          if (filtered.length > 0) {
            setSelectedOrder(filtered[0]);
          } else {
            setSelectedOrder(null);
          }
        } catch (err) {
          console.error(err);
          setCustomerOrders([]);
          setSelectedOrder(null);
        }
      } else {
        setCustomerOrders([]);
        setSelectedOrder(null);
      }
    } else {
      setCustomerOrders([]);
      setSelectedOrder(null);
    }
  }, [user]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const email = loginEmail.trim();
    const phone = loginPhone.trim();
    const name = loginName.trim() || "Valued Customer";

    if (!email || !phone) {
      setLoginError("Email and Mobile number are required to track orders.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setLoginError("Provide a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setLoginError("Provide a valid 10-digit mobile number.");
      return;
    }

    // Call state login
    loginCustomer(email, phone, name);
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Route trace navigation */}
        <div className="flex items-center space-x-2 text-xs font-poppins text-textCustom/50 mb-6">
          <span className="cursor-pointer hover:text-primary" onClick={() => router.push("/")}>Home</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-textCustom font-medium">My Orders</span>
        </div>

        {/* Not Logged In Scene */}
        {!user ? (
          <div className="max-w-md mx-auto bg-white border border-black/5 p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="font-playfair text-2xl font-bold text-primary">
                Customer Sign In
              </h2>
              <p className="font-inter text-xs text-textCustom/50 max-w-[280px] mx-auto">
                Sign in with your email & phone number to track shipment progress, verify COD limits, and print order receipts.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-poppins font-medium rounded-xl text-center">
                  {loginError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-poppins font-bold uppercase tracking-wider text-textCustom/50">
                  Full Name (Optional)
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-textCustom/30" />
                  <input
                    type="text"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    placeholder="e.g. William Reed"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-black/10 text-xs rounded-xl focus:outline-none focus:border-primary text-textCustom"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-poppins font-bold uppercase tracking-wider text-textCustom/50">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-textCustom/30" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. customer@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-black/10 text-xs rounded-xl focus:outline-none focus:border-primary text-textCustom"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-poppins font-bold uppercase tracking-wider text-textCustom/50">
                  Mobile Number (10 Digits) *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-textCustom/30" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-black/10 text-xs rounded-xl focus:outline-none focus:border-primary text-textCustom"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-poppins text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center space-x-2 shadow-md pt-3.5"
              >
                <span>Access Active Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        ) : (
          /* Active Customer Dashboard Scene */
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header info bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-black/5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                  <h2 className="font-playfair text-xl font-bold text-primary">
                    Welcome back, {user.name}!
                  </h2>
                </div>
                <p className="font-inter text-xs text-textCustom/55">
                  Private Account: {user.email} | {user.phone}
                </p>
              </div>

              <button
                onClick={logoutCustomer}
                className="px-4 py-2 border border-red-500/20 hover:bg-red-500/5 text-red-500 font-poppins text-[10px] font-bold uppercase tracking-widest rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>

            {/* Morning confirmation note card */}
            <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 shadow-xs">
              <div className="p-4 bg-primary text-white rounded-2xl shrink-0 flex items-center justify-center animate-pulse">
                <PhoneCall className="w-5 h-5 min-w-5 shrink-0" />
              </div>
              <div className="space-y-1.5 flex-grow text-center md:text-left">
                <h3 className="font-playfair text-base font-bold text-primary">
                  Order Dispatch Call Policy
                </h3>
                <p className="font-inter text-xs text-textCustom/75 leading-relaxed">
                  For confirmation & fast dispatch verification, a representative will call you in the morning.
                </p>
                <p className="font-inter text-xs font-semibold text-primary italic leading-relaxed">
                  (ऑर्डर सबमिट करने के बाद सुबह आर्डर की पुष्टि करने के लिए आपके पास कॉल आएगा।)
                </p>
              </div>
            </div>

            {customerOrders.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: orders search & history list */}
                <div className="lg:col-span-5 bg-white border border-black/5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-black/5 pb-4">
                    <span className="font-playfair text-base font-bold text-primary flex items-center space-x-1.5">
                      <ShoppingBag className="w-4 h-4 text-accent" />
                      <span>Order History ({customerOrders.length})</span>
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                    {customerOrders.map((itm) => (
                      <div
                        key={itm.orderId}
                        onClick={() => setSelectedOrder(itm)}
                        className={`p-4 border rounded-2xl cursor-pointer hover:border-primary/40 transition-all text-start ${
                          selectedOrder?.orderId === itm.orderId
                            ? "bg-primary/[0.02] border-primary"
                            : "bg-gray-50/50 border-black/5"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-poppins text-xs font-bold text-textCustom">
                            {itm.orderId}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-poppins font-bold uppercase tracking-wider ${
                            itm.status === "confirmed" 
                              ? "bg-green-500/10 text-green-600" 
                              : "bg-yellow-500/10 text-yellow-600"
                          }`}>
                            {itm.status === "confirmed" ? "Verified" : "Pending call"}
                          </span>
                        </div>

                        <div className="flex justify-between items-end mt-4">
                          <div className="space-y-0.5">
                            <p className="font-inter text-[10px] text-textCustom/40 flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{itm.date ? itm.date.split(",")[0] : "Recent"}</span>
                            </p>
                            <p className="font-inter text-xs font-bold text-textCustom">
                              {itm.items ? `${itm.items.length} items` : "Products list"}
                            </p>
                          </div>
                          <span className="font-poppins text-xs font-bold text-primary">
                            ₹{itm.amount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: selected order details screen */}
                <div className="lg:col-span-7">
                  {selectedOrder ? (
                    <div className="bg-white border border-black/5 p-4 sm:p-8 rounded-2xl sm:rounded-3xl space-y-6 shadow-sm">
                      <div className="border-b border-black/5 pb-4 flex justify-between items-center">
                        <span className="font-poppins text-xs font-bold uppercase tracking-wider text-textCustom/40">
                          Invoice ID: {selectedOrder.orderId}
                        </span>
                        <span className="text-[10px] font-inter text-textCustom/50">
                          Date: {selectedOrder.date}
                        </span>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-start">
                        <div className="space-y-1">
                          <span className="text-[10px] font-poppins font-bold text-textCustom/40 uppercase block">Recipient Client</span>
                          <p className="font-bold text-textCustom">{selectedOrder.name}</p>
                          <p className="opacity-75">Mobile: {selectedOrder.mobile}</p>
                          <p className="opacity-75">Email: {selectedOrder.email}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-poppins font-bold text-textCustom/40 uppercase block">Shipment Depot</span>
                          <p className="leading-relaxed text-textCustom/80 flex items-start space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                            <span>{selectedOrder.address}</span>
                          </p>
                        </div>
                      </div>

                      {/* Items list */}
                      {selectedOrder.items && selectedOrder.items.length > 0 && (
                        <div className="border-t border-black/5 pt-4 space-y-3">
                          <span className="text-[10px] font-poppins font-bold text-textCustom/40 uppercase block text-start">Ordered Items</span>
                          <div className="divide-y divide-black/5 bg-gray-50/50 p-4 rounded-2xl border border-black/5">
                            {selectedOrder.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center py-2 text-xs font-inter text-start">
                                <div className="text-textCustom">
                                  {item.name} <span className="text-textCustom/55 text-[10px] ml-1.5 font-bold">x{item.quantity}</span>
                                </div>
                                <span className="font-poppins font-bold text-textCustom">₹{item.subtotal}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Breakdown calculation */}
                      <div className="border-t border-black/5 pt-4 text-xs font-inter space-y-2 text-start">
                        <div className="flex justify-between text-textCustom/60">
                          <span>Subtotal:</span>
                          <span className="font-poppins">₹{selectedOrder.subtotal || selectedOrder.amount}</span>
                        </div>
                        <div className="flex justify-between text-textCustom/60">
                          <span>Delivery Fee:</span>
                          <span className="font-poppins">{selectedOrder.deliveryCharge === 0 || !selectedOrder.deliveryCharge ? "Free Shipping" : `₹${selectedOrder.deliveryCharge}`}</span>
                        </div>
                        <div className="flex justify-between text-textCustom/60 font-semibold pt-1 border-t border-black/5">
                          <span>Payment Method:</span>
                          <span>{selectedOrder.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-primary pt-2 border-t border-black/5">
                          <span>Grand Total Pay:</span>
                          <span className="font-poppins text-lg">₹{selectedOrder.amount}</span>
                        </div>
                      </div>

                      {/* Live verification tracker */}
                      <div className="pt-4 border-t border-black/5 text-start">
                        <span className="text-[10px] font-poppins font-bold text-textCustom/40 uppercase block mb-3">Live Dispatch Tracker</span>
                        <div className="relative pl-6 space-y-6 border-l border-gray-200">
                          
                          {/* Step 1 */}
                          <div className="relative">
                            <span className="absolute -left-[30px] top-0 w-4.5 h-4.5 rounded-full bg-green-500 flex items-center justify-center text-white text-[9px] font-bold">
                              ✓
                            </span>
                            <div className="space-y-0.5">
                              <h4 className="text-xs font-bold text-textCustom font-poppins uppercase">Order Submitted</h4>
                              <p className="text-[10px] text-textCustom/55">Awaiting address and invoice checklist verification.</p>
                            </div>
                          </div>

                          {/* Step 2 */}
                          <div className="relative">
                            <span className={`absolute -left-[30px] top-0 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                              selectedOrder.status === "confirmed" 
                                ? "bg-green-500 text-white" 
                                : "bg-yellow-500 text-white animate-pulse"
                            }`}>
                              {selectedOrder.status === "confirmed" ? "✓" : "2"}
                            </span>
                            <div className="space-y-0.5">
                              <h4 className="text-xs font-bold text-textCustom font-poppins uppercase">
                                Morning call verification
                              </h4>
                              <p className="text-[10px] text-textCustom/55">
                                {selectedOrder.status === "confirmed" 
                                  ? "Address confirmed by user representative call. Verification completed!"
                                  : "Verification call scheduled. A representative will reach you between 9:00 AM - 11:30 AM."}
                              </p>
                            </div>
                          </div>

                          {/* Step 3 */}
                          <div className="relative">
                            <span className={`absolute -left-[30px] top-0 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                              selectedOrder.status === "confirmed" 
                                ? "bg-blue-500 text-white animate-pulse" 
                                : "bg-gray-200 text-textCustom/40"
                            }`}>
                              3
                            </span>
                            <div className="space-y-0.5">
                              <h4 className="text-xs font-bold text-textCustom font-poppins uppercase">Dispatched & Logistics Handover</h4>
                              <p className="text-[10px] text-textCustom/55">
                                {selectedOrder.status === "confirmed" 
                                  ? "Parcel packaged and dispatched! Delivery in transit." 
                                  : "Awaiting morning call verification clearance."}
                              </p>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  ) : null}
                </div>

              </div>
            ) : (
              /* Logged in but zero orders */
              <div className="bg-white border border-black/5 p-12 rounded-3xl text-center space-y-4 shadow-sm">
                <span className="text-4xl block">🍃</span>
                <div className="space-y-1">
                  <h3 className="font-playfair text-lg font-bold text-textCustom">
                    No orders under this account
                  </h3>
                  <p className="font-inter text-xs text-textCustom/50 max-w-sm mx-auto leading-relaxed">
                    We didn't locate any records matching your email/phone. Go browse our premium skincare collections!
                  </p>
                </div>
                <Link
                  href="/"
                  className="inline-block mt-2 px-6 py-2.5 bg-primary text-white font-poppins text-[10px] font-bold uppercase tracking-widest rounded-xl hover:opacity-90 shadow-md"
                >
                  Explore Collections
                </Link>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
