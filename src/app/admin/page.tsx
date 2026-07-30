"use client";

import { useEffect, useState } from "react";
import { 
  Lock, 
  TrendingUp, 
  Package, 
  Search, 
  Trash2, 
  Mail,
  Loader2,
  Filter
} from "lucide-react";
import confetti from "canvas-confetti";

interface ReceiptItem { 
  id: string | number;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

interface Order {
  orderId: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  amount: number;
  paymentMethod: string;
  status: OrderStatus;
  date: string;
  items?: ReceiptItem[];
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Load orders from API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const ordersRes = await fetch('/api/orders');
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        // Ensure newest first (though API already unshifts)
        const sortedData = data.sort((a: Order, b: Order) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setOrders(sortedData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === "dipak2466" || password.trim() === "admin") {
      setIsAuthenticated(true);
      setPassError("");
    } else {
      setPassError("Invalid administrative password.");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setActionLoading(orderId);
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      });
      
      if (res.ok) {
        setOrders(orders.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
        if (newStatus === "confirmed" || newStatus === "delivered") {
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } });
        }
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error("Failed to update order status", err);
      alert("Error updating status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm("Are you sure you want to delete this order record? This cannot be undone.")) {
      setActionLoading(orderId);
      try {
        const res = await fetch(`/api/orders?orderId=${orderId}`, { method: 'DELETE' });
        if (res.ok) {
          setOrders(orders.filter((o) => o.orderId !== orderId));
        } else {
          alert("Failed to delete order");
        }
      } catch (err) {
        console.error("Failed to delete order", err);
      } finally {
        setActionLoading(null);
      }
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.mobile.includes(searchQuery);
    
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats calculation
  const totalRevenue = orders
    .filter((o) => ["confirmed", "shipped", "delivered"].includes(o.status))
    .reduce((sum, o) => sum + o.amount, 0);

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
            </div>
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <input
                type="password"
                placeholder="Enter Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 text-sm rounded-xl focus:outline-none focus:border-primary"
              />
              {passError && <p className="text-[10px] text-red-500 pl-1">{passError}</p>}
              <button
                type="submit"
                className="w-full py-3 bg-primary dark:bg-accent text-white dark:text-primary font-poppins font-semibold uppercase text-xs rounded-xl hover:opacity-90 cursor-pointer"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/5 dark:border-white/5 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-primary dark:text-white">
              Order Management
            </h1>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 border border-black/10 dark:border-white/10 text-xs rounded-xl hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl space-y-2">
            <span className="text-xs uppercase font-bold">Total Revenue</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-primary">₹{totalRevenue}</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <div className="p-6 bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl space-y-2">
            <span className="text-xs uppercase font-bold">Total Orders</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold">{orders.length}</span>
              <Package className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex items-center px-4 py-2 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl">
            <Search className="w-4 h-4 text-textCustom/50 mr-2" />
            <input
              type="text"
              placeholder="Search by Order ID, Name, or Mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm w-full focus:outline-none"
            />
          </div>
          <div className="flex items-center px-4 py-2 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl w-full sm:w-auto">
            <Filter className="w-4 h-4 text-textCustom/50 mr-2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
              className="bg-transparent text-sm w-full focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-20 text-center text-sm text-textCustom/50">
              No orders found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-black/5 dark:bg-white/5 font-poppins text-xs uppercase tracking-wider text-textCustom/60 dark:text-lightMint/60">
                  <tr>
                    <th className="px-6 py-4 font-bold">Order ID & Date</th>
                    <th className="px-6 py-4 font-bold">Customer Details</th>
                    <th className="px-6 py-4 font-bold">Product Summary</th>
                    <th className="px-6 py-4 font-bold">Amount & Payment</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5 font-inter">
                  {filteredOrders.map((o) => (
                    <tr key={o.orderId} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-primary dark:text-accent">{o.orderId}</div>
                        <div className="text-[10px] text-textCustom/50">{o.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold">{o.name}</div>
                        <div className="text-[11px] text-textCustom/60 flex items-center space-x-1 mt-0.5">
                          <a href={`tel:${o.mobile}`} className="hover:text-primary hover:underline">{o.mobile}</a>
                        </div>
                        {o.email && <div className="text-[11px] text-textCustom/60">{o.email}</div>}
                        <div className="text-[10px] text-textCustom/40 mt-1 max-w-[200px] truncate" title={o.address}>
                          {o.address}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {o.items?.map(item => (
                          <div key={item.id} className="text-xs">
                            <span className="font-bold max-w-[150px] truncate inline-block align-bottom" title={item.name}>{item.name}</span> 
                            <span className="text-textCustom/50 ml-1">x{item.quantity}</span>
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-lg">₹{o.amount}</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-textCustom/60">
                          {o.paymentMethod}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.orderId, e.target.value as OrderStatus)}
                          disabled={actionLoading === o.orderId}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border cursor-pointer focus:outline-none appearance-none ${getStatusColor(o.status)} ${actionLoading === o.orderId ? 'opacity-50' : ''}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteOrder(o.orderId)}
                          disabled={actionLoading === o.orderId}
                          className="p-2 text-textCustom/40 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete Order"
                        >
                          {actionLoading === o.orderId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
