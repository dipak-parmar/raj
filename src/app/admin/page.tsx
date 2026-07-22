"use client";

import { useEffect, useState } from "react";
import { 
  Lock, 
  TrendingUp, 
  Package, 
  PhoneCall, 
  CheckCircle, 
  Search, 
  Trash2, 
  ChevronRight,
  Mail,
  Truck
} from "lucide-react";
import confetti from "canvas-confetti";

interface ReceiptItem {
  id: string | number;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  orderId: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  amount: number;
  paymentMethod: string;
  status: "pending" | "confirmed";
  date: string;
  items?: ReceiptItem[];
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);  
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "inquiries">("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [emailModalOrder, setEmailModalOrder] = useState<Order | null>(null);

  // Load orders and inquiries from master list in localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem("raj_all_orders");
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (err) {
        console.error(err);
      }
    }
    const savedInquiries = localStorage.getItem("raj_all_inquiries");
    if (savedInquiries) {
      try {
        setInquiries(JSON.parse(savedInquiries));
      } catch (err) {
        console.error(err);
      }
    }
  }, [isAuthenticated, activeTab]);

    const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === "dipak2466" || password.trim() === "admin") {
      setIsAuthenticated(true);
      setPassError("");
    } else {
      setPassError("Invalid administrative password.");
    }
  };

  const handleConfirmOrder = (orderId: string) => {
    const updated = orders.map((o) => {
      if (o.orderId === orderId) {
        const confirmedOrder = { ...o, status: "confirmed" as const };
        // Trigger the Email notification preview popup
        setEmailModalOrder(confirmedOrder);
        return confirmedOrder;
      }
      return o;
    });

    setOrders(updated);
    localStorage.setItem("raj_all_orders", JSON.stringify(updated));

    // Blow victory confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm("Are you sure you want to delete this order record?")) {
      const updated = orders.filter((o) => o.orderId !== orderId);
      setOrders(updated);
      localStorage.setItem("raj_all_orders", JSON.stringify(updated));
      if (selectedOrder?.orderId === orderId) setSelectedOrder(null);
    }
  };

  const handleDeleteInquiry = (inquiryId: string) => {
    if (confirm("Are you sure you want to delete this message record?")) {
      const updated = inquiries.filter((i) => i.id !== inquiryId);
      setInquiries(updated);
      localStorage.setItem("raj_all_inquiries", JSON.stringify(updated));
      if (selectedInquiry?.id === inquiryId) setSelectedInquiry(null);
    }
  };

  // Filtered orders and inquiries
  const filteredOrders = orders.filter((o) =>
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.mobile.includes(searchQuery)
  );

  const filteredInquiries = inquiries.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats calculation
  const totalRevenue = orders
    .filter((o) => o.status === "confirmed")
    .reduce((sum, o) => sum + o.amount, 0);

  const pendingCalls = orders.filter((o) => o.status === "pending").length;
  const confirmedDispatches = orders.filter((o) => o.status === "confirmed").length;

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-backgroundCustom dark:bg-black/40">
        <div className="max-w-md w-full mx-auto px-6">
          <div className="bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 p-8 rounded-3xl space-y-6 shadow-2xl text-center">
            <div className="w-16 h-16 bg-primary/10 text-primary dark:text-accent rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="font-playfair text-xl font-bold text-primary dark:text-white">
                RAJ MARKETING Portal
              </h2>
              <p className="font-inter text-xs text-textCustom/60 dark:text-lightMint/60">
                Enter your administrative password to unlock owner dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] font-poppins font-bold uppercase tracking-wider text-textCustom/60 dark:text-lightMint/60">
                  Administrative Password:
                </label>
                <input
                  type="password"
                  placeholder="Enter Admin Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 text-sm rounded-xl focus:outline-none focus:border-primary dark:focus:border-accent"
                />
                {passError && (
                  <p className="text-[10px] font-poppins text-red-500 pl-1">{passError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary dark:bg-accent text-white dark:text-primary font-poppins font-semibold uppercase tracking-widest text-xs rounded-xl hover:opacity-90 cursor-pointer"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/5 dark:border-white/5 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-primary dark:text-white">
              Backoffice Owner Control
            </h1>
            <p className="text-xs font-poppins text-accent uppercase tracking-widest mt-1">
              Raj Marketing Database Control Desk
            </p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 border border-black/10 dark:border-white/10 text-xs font-poppins rounded-xl text-textCustom/60 hover:text-red-500 transition-colors"
          >
            Lock Terminal
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 select-none">
          <div className="p-6 bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl space-y-2">
            <span className="text-textCustom/40 dark:text-lightMint/40 uppercase font-poppins text-[10px] font-bold block">
              Total Revenue (Settled)
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-poppins font-bold text-primary dark:text-accent">
                ₹{totalRevenue}
              </span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-[10px] text-textCustom/50 dark:text-lightMint/50 font-inter">
              From confirmed dispatched orders
            </p>
          </div>

          <div className="p-6 bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl space-y-2">
            <span className="text-textCustom/40 dark:text-lightMint/40 uppercase font-poppins text-[10px] font-bold block">
              Total Orders Logged
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-poppins font-bold text-textCustom dark:text-white">
                {orders.length}
              </span>
              <Package className="w-4 h-4 text-primary dark:text-accent" />
            </div>
            <p className="text-[10px] text-textCustom/50 dark:text-lightMint/50 font-inter">
              All transactions in localStorage db
            </p>
          </div>

          <div className="p-6 bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl space-y-2">
            <span className="text-textCustom/40 dark:text-lightMint/40 uppercase font-poppins text-[10px] font-bold block">
              Pending Call Checks
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-poppins font-bold text-yellow-600 dark:text-yellow-400">
                {pendingCalls}
              </span>
              <PhoneCall className="w-4 h-4 text-yellow-500 animate-bounce" />
            </div>
            <p className="text-[10px] text-textCustom/50 dark:text-lightMint/50 font-inter">
              Morning confirmation scheduled
            </p>
          </div>

          <div className="p-6 bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl space-y-2">
            <span className="text-textCustom/40 dark:text-lightMint/40 uppercase font-poppins text-[10px] font-bold block">
              Confirmed & Dispatched
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-poppins font-bold text-green-600 dark:text-green-400">
                {confirmedDispatches}
              </span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-[10px] text-textCustom/50 dark:text-lightMint/50 font-inter">
              Notifications successfully triggered
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-black/5 dark:border-white/5 mb-8">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 px-6 font-poppins text-xs font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              activeTab === "orders"
                ? "border-primary text-primary dark:border-accent dark:text-accent font-bold"
                : "border-transparent text-textCustom/40 hover:text-textCustom/60 dark:text-lightMint/40 dark:hover:text-lightMint/60"
            }`}
          >
            💼 Orders Registry ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`pb-4 px-6 font-poppins text-xs font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              activeTab === "inquiries"
                ? "border-primary text-primary dark:border-accent dark:text-accent font-bold"
                : "border-transparent text-textCustom/40 hover:text-textCustom/60 dark:text-lightMint/40 dark:hover:text-lightMint/60"
            }`}
          >
            ✉️ Inquiries & Messages ({inquiries.length})
          </button>
        </div>

        {/* Database Search & List Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {activeTab === "orders" ? (
            <>
              {/* Left panel: Orders list */}
              <div className="lg:col-span-7 bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 p-6 rounded-3xl space-y-6">
                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
                  <h3 className="font-playfair text-lg font-bold text-primary dark:text-white">
                    Orders Registry
                  </h3>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl max-w-xs w-48 sm:w-60">
                    <Search className="w-3.5 h-3.5 text-textCustom/50" />
                    <input
                      type="text"
                      placeholder="Search order/customer"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent text-xs w-full focus:outline-none"
                    />
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="text-center py-10 font-inter text-xs text-textCustom/40">
                    No matching order records found in the database.
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {filteredOrders.map((o) => (
                      <div
                        key={o.orderId}
                        onClick={() => setSelectedOrder(o)}
                        className={`p-4 border rounded-2xl cursor-pointer hover:border-primary/50 transition-all ${
                          selectedOrder?.orderId === o.orderId
                            ? "bg-primary/[0.03] border-primary dark:border-accent"
                            : "bg-white/20 dark:bg-black/10 border-black/5 dark:border-white/5"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-poppins text-xs font-bold text-textCustom dark:text-white">
                            {o.orderId}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-poppins font-bold uppercase tracking-wider ${
                              o.status === "confirmed"
                                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                            }`}
                          >
                            {o.status === "confirmed" ? "Confirmed + Mail Sent" : "Pending call verification"}
                          </span>
                        </div>

                        <div className="flex justify-between items-end mt-3">
                          <div>
                            <p className="font-inter text-xs font-bold text-textCustom dark:text-white">
                              {o.name}
                            </p>
                            <p className="font-inter text-[10px] text-textCustom/60 dark:text-lightMint/60">
                              {o.mobile} | {o.email}
                            </p>
                            <p className="font-inter text-[9px] text-textCustom/40 dark:text-lightMint/40 mt-0.5">
                              Date: {o.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-poppins text-sm font-bold text-primary dark:text-accent">
                              ₹{o.amount}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right panel: Order details review */}
              <div className="lg:col-span-5">
                {selectedOrder ? (
                  <div className="bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 p-6 rounded-3xl space-y-6">
                    <div className="border-b border-black/5 dark:border-white/5 pb-4 flex justify-between items-center">
                      <h3 className="font-playfair text-lg font-bold text-primary dark:text-white">
                        Order Details Panel
                      </h3>
                      <button
                        onClick={() => handleDeleteOrder(selectedOrder.orderId)}
                        className="p-1 px-1.5 text-textCustom/40 hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-xs font-inter text-textCustom/80 dark:text-lightMint/80">
                        <div>
                          <span className="text-[10px] font-poppins text-textCustom/40 uppercase font-bold dark:text-lightMint/30">
                            Recipient Name
                          </span>
                          <p className="font-bold text-textCustom dark:text-white">{selectedOrder.name}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-poppins text-textCustom/40 uppercase font-bold dark:text-lightMint/30">
                            Contact Phone
                          </span>
                          <p className="font-bold text-textCustom dark:text-white">{selectedOrder.mobile}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[10px] font-poppins text-textCustom/40 uppercase font-bold dark:text-lightMint/30">
                            Email Address
                          </span>
                          <p className="font-mono text-xs text-textCustom dark:text-white">{selectedOrder.email}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[10px] font-poppins text-textCustom/40 uppercase font-bold dark:text-lightMint/30 flex items-center space-x-1">
                            <Truck className="w-3.5 h-3.5 text-accent" />
                            <span>Shipping Address</span>
                          </span>
                          <p className="leading-relaxed bg-black/5 dark:bg-black/20 p-2.5 rounded-xl text-[11px] font-mono mt-1 text-textCustom dark:text-white">
                            {selectedOrder.address}
                          </p>
                        </div>
                      </div>

                      {/* Items list */}
                      <div className="space-y-1.5 border-t border-black/5 dark:border-white/5 pt-4">
                        <span className="text-[10px] font-poppins text-textCustom/40 uppercase font-bold dark:text-lightMint/30">
                          Purchased Items
                        </span>
                        <div className="space-y-2 bg-black/5 dark:bg-black/20 p-3 rounded-2xl">
                          {selectedOrder.items?.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-xs font-inter">
                              <span className="text-textCustom dark:text-white truncate max-w-[200px]">
                                {item.name} <strong className="text-[10px] opacity-60">x{item.quantity}</strong>
                              </span>
                              <span className="font-poppins font-bold text-textCustom dark:text-white">
                                ₹{item.subtotal}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total and actions */}
                      <div className="border-t border-black/5 dark:border-white/5 pt-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[10px] font-poppins text-textCustom/40 uppercase font-bold dark:text-lightMint/30 block">
                              Due Amount ({selectedOrder.paymentMethod})
                            </span>
                            <strong className="text-lg font-poppins text-primary dark:text-accent font-bold">
                              ₹{selectedOrder.amount}
                            </strong>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-poppins font-bold uppercase tracking-wider ${
                              selectedOrder.status === "confirmed"
                                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                            }`}
                          >
                            {selectedOrder.status === "confirmed" ? "Dispatched" : "Awaiting Verification"}
                          </span>
                        </div>

                        {selectedOrder.status === "pending" ? (
                          <button
                            onClick={() => handleConfirmOrder(selectedOrder.orderId)}
                            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-poppins font-bold uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
                          >
                            <PhoneCall className="w-4 h-4 shrink-0 animate-pulse" />
                            <span>Confirm Call & Dispatch Order</span>
                          </button>
                        ) : (
                          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-center text-xs font-inter text-green-600 dark:text-green-400 flex items-center justify-center space-x-2">
                            <CheckCircle className="w-4 h-4 shrink-0" />
                            <span>Address Verified & Confirmed!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/20 dark:bg-white/5 border border-dotted border-black/10 dark:border-white/10 p-12 text-center rounded-3xl text-xs text-textCustom/55 font-inter">
                    Select an order record from the directory registry on the left to show full customer details, invoice breakdowns, and dispatch controls.
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Left panel: Inquiries list */}
              <div className="lg:col-span-7 bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 p-6 rounded-3xl space-y-6">
                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
                  <h3 className="font-playfair text-lg font-bold text-primary dark:text-white">
                    Inquiries Registry
                  </h3>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl max-w-xs w-48 sm:w-60">
                    <Search className="w-3.5 h-3.5 text-textCustom/50" />
                    <input
                      type="text"
                      placeholder="Search inquiries/messages"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent text-xs w-full focus:outline-none"
                    />
                  </div>
                </div>

                {filteredInquiries.length === 0 ? (
                  <div className="text-center py-10 font-inter text-xs text-textCustom/40">
                    No matching inquiry records found in the database.
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {filteredInquiries.map((i) => (
                      <div
                        key={i.id}
                        onClick={() => setSelectedInquiry(i)}
                        className={`p-4 border rounded-2xl cursor-pointer hover:border-primary/50 transition-all ${
                          selectedInquiry?.id === i.id
                            ? "bg-primary/[0.03] border-primary dark:border-accent"
                            : "bg-white/20 dark:bg-black/10 border-black/5 dark:border-white/5"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-poppins text-xs font-bold text-textCustom dark:text-white">
                            {i.id}
                          </span>
                          <span className="text-[10px] text-textCustom/40 dark:text-lightMint/40 font-inter">
                            {i.date}
                          </span>
                        </div>

                        <div className="mt-3">
                          <p className="font-inter text-xs font-bold text-textCustom dark:text-white font-semibold">
                            {i.name}
                          </p>
                          <p className="font-inter text-[10px] text-textCustom/60 dark:text-lightMint/60 truncate">
                            {i.subject}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right panel: Inquiry detail */}
              <div className="lg:col-span-5">
                {selectedInquiry ? (
                  <div className="bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 p-6 rounded-3xl space-y-6">
                    <div className="border-b border-black/5 dark:border-white/5 pb-4 flex justify-between items-center">
                      <h3 className="font-playfair text-lg font-bold text-primary dark:text-white">
                        Inquiry Message Panel
                      </h3>
                      <button
                        onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                        className="p-1 px-1.5 text-textCustom/40 hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete inquiry"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-xs font-inter text-textCustom/80 dark:text-lightMint/80">
                        <div>
                          <span className="text-[10px] font-poppins text-textCustom/40 uppercase font-bold dark:text-lightMint/30 text-start block">
                            Sender FullName
                          </span>
                          <p className="font-bold text-textCustom dark:text-white text-start">{selectedInquiry.name}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-poppins text-textCustom/40 uppercase font-bold dark:text-lightMint/30 text-start block">
                            Date Submitted
                          </span>
                          <p className="font-bold text-textCustom dark:text-white text-start">{selectedInquiry.date}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[10px] font-poppins text-textCustom/40 uppercase font-bold dark:text-lightMint/30 text-start block">
                            Email Address
                          </span>
                          <p className="font-mono text-xs text-textCustom dark:text-white text-start">{selectedInquiry.email}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[10px] font-poppins text-textCustom/40 uppercase font-bold dark:text-lightMint/30 text-start block">
                            Subject Topic
                          </span>
                          <p className="font-inter text-xs text-textCustom dark:text-white font-bold text-start">{selectedInquiry.subject}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[10px] font-poppins text-textCustom/40 uppercase font-bold dark:text-lightMint/30 text-start block">
                            Message Content
                          </span>
                          <p className="leading-relaxed bg-black/5 dark:bg-black/20 p-4 rounded-xl text-xs font-inter text-textCustom/90 dark:text-lightMint/90 mt-1 whitespace-pre-wrap text-start">
                            {selectedInquiry.message}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-black/5 dark:border-white/5 pt-4">
                        <button
                          onClick={() => {
                            window.location.href = `mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject)}`;
                          }}
                          className="w-full py-3 bg-primary dark:bg-accent text-white dark:text-primary font-poppins font-bold uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
                        >
                          <Mail className="w-4 h-4 cursor-pointer" />
                          <span>Reply to Customer Email</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/20 dark:bg-white/5 border border-dotted border-black/10 dark:border-white/10 p-12 text-center rounded-3xl text-xs text-textCustom/55 font-inter">
                    Select an inquiry record from the directory registry on the left to read full customer message details and reply.
                  </div>
                )}
              </div>
            </>
          )}

        </div>

      </div>

      {/* Dispatch Mail Confirmation Preview modal/popup */}
      {emailModalOrder && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-primary-dark max-w-2xl w-full border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 space-y-6 animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
              <div className="flex items-center space-x-2 text-green-600">
                <Mail className="w-5 h-5" />
                <h3 className="font-playfair text-lg font-bold">Mail Trigger Dispatched Successfully!</h3>
              </div>
              <button 
                onClick={() => setEmailModalOrder(null)}
                className="text-xs font-poppins font-bold bg-primary text-white dark:bg-accent dark:text-primary px-3 py-1.5 rounded-lg cursor-pointer"
              >
                Close Preview
              </button>
            </div>

            <p className="font-inter text-xs text-textCustom/60 dark:text-lightMint/60">
              An email auto-notification was triggered to <strong>{emailModalOrder.email}</strong> indicating confirmation call success. Below is the dispatch copy sent:
            </p>

            {/* Email UI Box mockup */}
            <div className="bg-gray-100 dark:bg-black/30 p-5 rounded-2xl border border-black/[0.03] space-y-3 font-mono text-[11px] text-textCustom dark:text-white leading-relaxed">
              <div>
                <span className="text-[10px] text-textCustom/40 uppercase">From:</span> dispatch@rajmarketing.com
              </div>
              <div>
                <span className="text-[10px] text-textCustom/40 uppercase">To:</span> {emailModalOrder.email}
              </div>
              <div className="border-b border-black/5 dark:border-white/5 pb-2">
                <span className="text-[10px] text-textCustom/40 uppercase">Subject:</span> Order Confirmed & Shipped - RAJ MARKETING (Order #{emailModalOrder.orderId})
              </div>
              <div className="space-y-2 font-inter text-xs py-2">
                <p>Dear <strong>{emailModalOrder.name}</strong>,</p>
                <p>
                  Thank you for confirming your order during our morning verification call! Your organic luxury formulations are packed securely and handed off to our shipping carrier.
                </p>
                <div className="p-3 bg-white/60 dark:bg-black/20 rounded-xl space-y-1 block">
                  <div className="font-bold text-accent">🚚 Tracking Summary:</div>
                  <div>Delivery Address: {emailModalOrder.address}</div>
                  <div>Transit Timeline: 6-7 business days</div>
                  <div>Total Settled: ₹{emailModalOrder.amount}</div>
                </div>
                <p className="text-[11px] opacity-80">
                  We look forward to your premium self-care experience. Standard tracking updates will be refreshed on your Track My Orders panel.
                </p>
                <p className="pt-2">
                  Warm regards,<br />
                  <strong>The Raj Marketing Team 🌿</strong>
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
