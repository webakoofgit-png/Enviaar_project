import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Users,
  BarChart3,
  Package,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Eye,
  ShoppingBag,
  Percent,
  Download,
  Calendar,
  Search,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Filter,
  RefreshCw,
  MapPin,
  CreditCard,
  ChevronRight,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Megaphone,
  FileText,
  Layout,
  Globe,
  Check,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
} from "recharts";
import {
  getSavedOrders,
  updateOrderStatusInStorage,
  updateOrderPaymentStatusInStorage,
  type CustomerOrder,
} from "@/lib/orderStorage";
import {
  getCMSContent,
  saveCMSContent,
  type CMSContent,
  type HeroSlide,
} from "@/lib/cmsStorage";
import { toast } from "sonner";

export function AdminHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Store Overview</h1>
        <p className="text-xs text-slate-500 mt-1">Welcome back, ENVIAAR Admin! Here is what's happening across your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-slate-900">
            <Package className="h-6 w-6 text-slate-900" />
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">10 Items</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Manage Products</h3>
            <p className="text-xs text-slate-500 mt-1">View catalogue, pricing, stock and status pill badges matching your design.</p>
          </div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-amber-600 transition"
          >
            Go to Products <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-blue-600">
            <ShoppingCart className="h-6 w-6" />
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">142 Orders</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Orders Pipeline</h3>
            <p className="text-xs text-slate-500 mt-1">Track pending orders, customer details, and shipping fulfillment.</p>
          </div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
          >
            View Orders <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-emerald-600">
            <BarChart3 className="h-6 w-6" />
            <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">+12.5% Growth</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Store Analytics</h3>
            <p className="text-xs text-slate-500 mt-1">Sales performance, conversion rates, and revenue reports.</p>
          </div>
          <Link
            to="/admin/analytics"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition"
          >
            View Analytics <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Chart Data for Monthly Growth & Sales Breakdown
const monthlySalesData = [
  { month: "Jan", revenue: 42000, orders: 110, earrings: 18000, necklaces: 14000, rings: 10000 },
  { month: "Feb", revenue: 54000, orders: 135, earrings: 22000, necklaces: 18000, rings: 14000 },
  { month: "Mar", revenue: 48000, orders: 120, earrings: 20000, necklaces: 16000, rings: 12000 },
  { month: "Apr", revenue: 68000, orders: 165, earrings: 28000, necklaces: 22000, rings: 18000 },
  { month: "May", revenue: 62000, orders: 150, earrings: 25000, necklaces: 21000, rings: 16000 },
  { month: "Jun", revenue: 84320, orders: 198, earrings: 34000, necklaces: 28000, rings: 22320 },
  { month: "Jul", revenue: 96500, orders: 225, earrings: 38000, necklaces: 33000, rings: 25500 },
];

export function AdminAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics & Growth Reports</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time monthly revenue trajectory, category share, and growth metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-xs">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            2024 YTD Growth
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition shadow-sm">
            <Download className="h-3.5 w-3.5 text-amber-300" />
            Download Report
          </button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Total Sales Revenue</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">₹84,320.00</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+12.5% vs last month</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Store Visitors</span>
            <Eye className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">24,580</div>
          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+18.2% new visitors</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Conversion Rate</span>
            <Percent className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">3.84%</div>
          <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+0.6% improvement</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Avg Order Value (AOV)</span>
            <ShoppingBag className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">₹3,480.00</div>
          <div className="flex items-center gap-1.5 text-xs text-purple-600 font-semibold">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+5.1% per order</span>
          </div>
        </div>
      </div>

      {/* REVENUE GROWTH AREA CHART (Interactive Recharts Curve) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Sales & Revenue Trajectory</h2>
            <p className="text-xs text-slate-400">Monthly gross sales growth trajectory across 2024 YTD</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-slate-900 inline-block"></span>
              <span>Total Revenue (₹)</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
              +129.7% Growth YTD
            </span>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlySalesData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              />
              <RechartsTooltip
                formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
                labelStyle={{ fontWeight: "bold", color: "#0f172a" }}
                contentStyle={{
                  borderRadius: "12px",
                  borderColor: "#e2e8f0",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0f172a"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#revenueGradient)"
                activeDot={{ r: 6, fill: "#f59e0b", stroke: "#0f172a", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CATEGORY REVENUE BREAKDOWN BAR CHART */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Category Revenue Breakdown</h2>
            <p className="text-xs text-slate-400">Monthly sales performance across Earrings, Necklaces & Rings</p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">2024 Category Shares</span>
        </div>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlySalesData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              />
              <RechartsTooltip
                formatter={(value: any, name: any) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                  String(name).charAt(0).toUpperCase() + String(name).slice(1),
                ]}
                contentStyle={{
                  borderRadius: "12px",
                  borderColor: "#e2e8f0",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="earrings" stackId="a" fill="#0f172a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="necklaces" stackId="a" fill="#334155" radius={[0, 0, 0, 0]} />
              <Bar dataKey="rings" stackId="a" fill="#d97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-900 inline-block"></span>
              <span className="font-medium text-slate-600">Earrings & Studs</span>
            </div>
            <span className="font-bold text-slate-900">38% Share</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-700 inline-block"></span>
              <span className="font-medium text-slate-600">Necklace Sets</span>
            </div>
            <span className="font-bold text-slate-900">32% Share</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-600 inline-block"></span>
              <span className="font-medium text-slate-600">Rings & Bracelets</span>
            </div>
            <span className="font-bold text-slate-900">30% Share</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminOrders() {
  const [orders, setOrders] = useState<CustomerOrder[]>(() => getSavedOrders());
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const localOrders = getSavedOrders();
    try {
      const res = await fetch("http://localhost:5000/api/orders");
      if (res.ok) {
        const apiOrders = await res.json();
        if (Array.isArray(apiOrders) && apiOrders.length > 0) {
          const localMap = new Map(localOrders.map((o) => [o.orderNumber, o]));
          const merged: CustomerOrder[] = apiOrders.map((apiO: any) => {
            const match = localMap.get(apiO.orderNumber);
            const method = apiO.paymentMethod || match?.paymentMethod || "UPI";
            const isCOD = method === "Cash on Delivery" || method.toLowerCase().includes("cod") || method.toLowerCase().includes("cash");
            const status = apiO.status || match?.status || "Processing";
            
            let pStatus: CustomerOrder['paymentStatus'] = apiO.paymentStatus || match?.paymentStatus;
            if (!pStatus || (isCOD && status !== "Delivered" && pStatus === "Paid" && match?.paymentStatus !== "Paid")) {
              pStatus = isCOD && status !== "Delivered" ? "Unpaid" : "Paid";
            }

            return {
              id: String(apiO.id || match?.id || Date.now()),
              orderNumber: apiO.orderNumber || match?.orderNumber || `ENV-2026-1042`,
              customerName: apiO.customerName || match?.customerName || "Valued Customer",
              customerEmail: apiO.customerEmail || match?.customerEmail || "customer@enviaar.com",
              customerPhone: apiO.customerPhone || match?.customerPhone || "",
              shippingAddress: apiO.shippingAddress || match?.shippingAddress || "Address on file",
              paymentMethod: method,
              paymentStatus: pStatus,
              status: status,
              totalAmount: Number(apiO.totalAmount || match?.totalAmount || 0),
              items: match?.items || [
                {
                  id: "1",
                  name: "Aurelia Drop Earrings",
                  price: 3490,
                  quantity: 1,
                  image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&q=80",
                },
              ],
              createdAt: apiO.createdAt || match?.createdAt || "Just now",
            };
          });

          // Add any local orders not present in API response
          const apiOrderNums = new Set(merged.map((o) => o.orderNumber));
          const extraLocal = localOrders.filter((o) => !apiOrderNums.has(o.orderNumber));
          setOrders([...extraLocal, ...merged]);
        } else {
          setOrders(localOrders);
        }
      } else {
        setOrders(localOrders);
      }
    } catch (err) {
      console.warn("Backend API offline, using saved local orders");
      setOrders(localOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: CustomerOrder["status"]) => {
    const isDelivered = newStatus === "Delivered";
    // 1. Local state update
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId || o.orderNumber === orderId) {
          return {
            ...o,
            status: newStatus,
            paymentStatus: isDelivered ? "Paid" : o.paymentStatus,
          };
        }
        return o;
      })
    );

    // 2. Storage update
    updateOrderStatusInStorage(orderId, newStatus);

    // 3. API update
    try {
      await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          ...(isDelivered ? { paymentStatus: "Paid" } : {}),
        }),
      });
    } catch (err) {
      console.warn("Backend API offline during status update");
    }

    toast.success(`Order ${orderId} status updated to ${newStatus}${isDelivered ? " & Marked as Paid" : ""}`);
  };

  const handleTogglePaymentStatus = async (orderId: string, currentPStatus: CustomerOrder["paymentStatus"]) => {
    const nextPStatus: CustomerOrder["paymentStatus"] = currentPStatus === "Paid" ? "Unpaid" : "Paid";

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, paymentStatus: nextPStatus } : o))
    );

    updateOrderPaymentStatusInStorage(orderId, nextPStatus);

    try {
      await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: nextPStatus }),
      });
    } catch (err) {
      console.warn("Backend API offline during payment status toggle");
    }

    toast.info(`Order ${orderId} payment status updated to ${nextPStatus}`);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = statusFilter === "All" || o.status.toLowerCase() === statusFilter.toLowerCase();
      const matchQuery =
        !searchQuery ||
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchQuery;
    });
  }, [orders, statusFilter, searchQuery]);

  // Metrics calculation
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.totalAmount, 0), [orders]);
  const processingCount = useMemo(
    () => orders.filter((o) => o.status === "Processing" || o.status === "Pending").length,
    [orders],
  );
  const shippedCount = useMemo(
    () => orders.filter((o) => o.status === "Shipped" || o.status === "Delivered").length,
    [orders],
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track live storefront orders, update fulfillment statuses, and inspect buyer details
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-400 ${loading ? "animate-spin" : ""}`} />
            Refresh Orders
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Total Orders</span>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{orders.length}</div>
          <p className="text-[11px] text-slate-400 font-medium">Recorded in database & store</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Orders Revenue</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">₹{totalRevenue.toLocaleString("en-IN")}</div>
          <p className="text-[11px] text-emerald-600 font-medium">Cumulative gross value</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Pending / Processing</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{processingCount}</div>
          <p className="text-[11px] text-amber-600 font-medium">Requires fulfillment</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Shipped & Delivered</span>
            <Truck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">{shippedCount}</div>
          <p className="text-[11px] text-emerald-600 font-medium">Completed orders</p>
        </div>
      </div>

      {/* Search & Status Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  statusFilter === tab
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Order #, customer, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Order Details</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items & Summary</th>
                <th className="py-3.5 px-4">Total Price</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    No orders found matching your search or filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition">
                    {/* Order Details */}
                    <td className="py-4 px-4 align-top">
                      <div className="font-extrabold text-slate-900 text-sm">{order.orderNumber}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{order.createdAt}</div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4 align-top">
                      <div className="font-bold text-slate-800">{order.customerName}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{order.customerEmail}</div>
                      {order.customerPhone && (
                        <div className="text-[10px] text-slate-400 mt-0.5">{order.customerPhone}</div>
                      )}
                    </td>

                    {/* Items & Summary */}
                    <td className="py-4 px-4 align-top">
                      <div className="space-y-1">
                        {order.items && order.items.length > 0 ? (
                          order.items.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="size-7 object-cover rounded-md border border-slate-200"
                                />
                              )}
                              <span className="font-medium text-slate-700 truncate max-w-[150px]">
                                {item.name} ({item.quantity}x)
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-400">1 item</span>
                        )}
                        {order.items && order.items.length > 2 && (
                          <div className="text-[10px] text-slate-400 font-medium">
                            +{order.items.length - 2} more item(s)
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Total Price */}
                    <td className="py-4 px-4 align-top">
                      <div className="font-extrabold text-slate-900 text-sm">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </div>
                    </td>

                    {/* Payment */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex flex-col gap-1">
                        {order.paymentStatus === "Unpaid" ||
                        ((order.paymentMethod.toLowerCase().includes("cash") || order.paymentMethod.toLowerCase().includes("cod")) &&
                          order.status !== "Delivered") ? (
                          <button
                            onClick={() => handleTogglePaymentStatus(order.id, "Unpaid")}
                            title="Click to toggle payment status"
                            className="inline-flex items-center gap-1 font-bold text-[11px] text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-md border border-amber-200/80 w-fit transition cursor-pointer"
                          >
                            <Clock className="h-3 w-3 text-amber-600" />
                            Unpaid
                          </button>
                        ) : (
                          <button
                            onClick={() => handleTogglePaymentStatus(order.id, "Paid")}
                            title="Click to toggle payment status"
                            className="inline-flex items-center gap-1 font-bold text-[11px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200/60 w-fit transition cursor-pointer"
                          >
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            Paid
                          </button>
                        )}
                        <span className="text-[10px] text-slate-400 font-medium truncate max-w-[130px]">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </td>

                    {/* Status Select Dropdown */}
                    <td className="py-4 px-4 align-top">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value as CustomerOrder["status"])}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border focus:outline-none transition cursor-pointer ${
                          order.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : order.status === "Shipped"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : order.status === "Processing"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : order.status === "Cancelled"
                                  ? "bg-rose-50 text-rose-700 border-rose-200"
                                  : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 align-top text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition"
                      >
                        Details
                        <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-2"
            >
              <XCircle className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-900 text-white rounded-xl">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedOrder.orderNumber}</h3>
                <p className="text-xs text-slate-500">Placed on {selectedOrder.createdAt}</p>
              </div>
            </div>

            {/* Status Selector in Modal */}
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Status</div>
                <div className="text-sm font-extrabold text-slate-900">{selectedOrder.status}</div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-600">Update Status:</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as CustomerOrder["status"];
                    handleUpdateStatus(selectedOrder.id, newStatus);
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                  }}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 bg-white focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Customer & Shipping info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <Users className="h-3.5 w-3.5 text-slate-600" /> Customer Information
                </div>
                <div className="font-bold text-slate-900 text-sm">{selectedOrder.customerName}</div>
                <div className="text-xs text-slate-600">{selectedOrder.customerEmail}</div>
                <div className="text-xs text-slate-500">{selectedOrder.customerPhone || "No phone provided"}</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-600" /> Shipping Address
                </div>
                <div className="text-xs text-slate-700 leading-relaxed">{selectedOrder.shippingAddress}</div>
              </div>
            </div>

            {/* Itemized Order Products */}
            <div className="mt-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Order Items</h4>
              <div className="space-y-3">
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b pb-3 text-xs">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="size-12 object-cover rounded-lg border border-slate-200"
                          />
                        )}
                        <div>
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="text-[11px] text-slate-500">
                            Qty: {item.quantity} {item.finish ? `· ${item.finish}` : ""}
                          </div>
                        </div>
                      </div>
                      <div className="font-extrabold text-slate-900 text-sm">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500">Standard ENVIAAR Jewellery Item</div>
                )}
              </div>
            </div>

            {/* Total Footer */}
            <div className="mt-6 pt-4 border-t flex justify-between items-center text-slate-900">
              <span className="font-bold text-sm">Total Paid</span>
              <span className="font-extrabold text-xl">₹{selectedOrder.totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [segmentFilter, setSegmentFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    const savedOrders = getSavedOrders();

    // Map order counts & total spent per customer email
    const customerOrderStats = new Map<string, { count: number; spent: number; orders: CustomerOrder[] }>();
    savedOrders.forEach((o) => {
      const emailKey = (o.customerEmail || "").toLowerCase();
      const existing = customerOrderStats.get(emailKey) || { count: 0, spent: 0, orders: [] };
      existing.count += 1;
      existing.spent += o.totalAmount;
      existing.orders.push(o);
      customerOrderStats.set(emailKey, existing);
    });

    try {
      const res = await fetch("http://localhost:5000/api/customers");
      if (res.ok) {
        const apiCustomers = await res.json();
        if (Array.isArray(apiCustomers) && apiCustomers.length > 0) {
          const merged = apiCustomers.map((c: any) => {
            const stats = customerOrderStats.get((c.email || "").toLowerCase());
            const totalOrders = Math.max(c.totalOrders || 0, stats?.count || 0);
            const totalSpent = Math.max(c.totalSpent || 0, stats?.spent || 0);
            return {
              ...c,
              totalOrders,
              totalSpent,
              tier: totalSpent >= 10000 ? "VIP Circle" : totalOrders > 1 ? "Repeat Buyer" : "Member",
              orders: stats?.orders || [],
            };
          });

          // Check if there are any orders with customer emails not in apiCustomers
          const existingEmails = new Set(merged.map((c: any) => (c.email || "").toLowerCase()));
          customerOrderStats.forEach((stats, email) => {
            if (!existingEmails.has(email) && email) {
              const firstOrder = stats.orders[0];
              merged.unshift({
                id: `cust_${Date.now()}_${Math.floor(Math.random() * 100)}`,
                name: firstOrder?.customerName || email.split("@")[0] || "Customer",
                email: email,
                phone: firstOrder?.customerPhone || "+91 98765 43210",
                totalOrders: stats.count,
                totalSpent: stats.spent,
                tier: stats.spent >= 10000 ? "VIP Circle" : stats.count > 1 ? "Repeat Buyer" : "Member",
                createdAt: firstOrder?.createdAt ? firstOrder.createdAt.split(" ")[0] : "2026-09-26",
                orders: stats.orders,
              });
            }
          });

          setCustomers(merged);
          return;
        }
      }
    } catch (err) {
      console.warn("Backend API offline for customers, using fallback customer directory");
    }

    // Default Fallback Initial Customers
    const fallbackList = [
      {
        id: "cust_1",
        name: "vipul.m3011",
        email: "vipul.m3011@gmail.com",
        phone: "+91 98765 43210",
        totalOrders: 1,
        totalSpent: 2790,
        tier: "VIP Circle",
        createdAt: "2026-09-26",
        orders: savedOrders.filter((o) => o.customerEmail?.toLowerCase().includes("vipul")),
      },
      {
        id: "cust_2",
        name: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        phone: "+91 98765 12345",
        totalOrders: 4,
        totalSpent: 18450,
        tier: "VIP Circle",
        createdAt: "2024-01-15",
        orders: savedOrders.filter((o) => o.customerEmail?.toLowerCase().includes("aarav")),
      },
      {
        id: "cust_3",
        name: "Priya Kapoor",
        email: "priya.k@example.com",
        phone: "+91 98123 45678",
        totalOrders: 2,
        totalSpent: 9280,
        tier: "Repeat Buyer",
        createdAt: "2024-02-10",
        orders: savedOrders.filter((o) => o.customerEmail?.toLowerCase().includes("priya")),
      },
      {
        id: "cust_4",
        name: "Rohan Verma",
        email: "rohan.v@example.com",
        phone: "+91 99887 66554",
        totalOrders: 5,
        totalSpent: 24900,
        tier: "VIP Circle",
        createdAt: "2024-03-01",
        orders: [],
      },
      {
        id: "cust_5",
        name: "Ananya Roy",
        email: "ananya.roy@example.com",
        phone: "+91 97766 55443",
        totalOrders: 1,
        totalSpent: 3490,
        tier: "Member",
        createdAt: "2024-04-12",
        orders: [],
      },
    ];

    setCustomers(fallbackList);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchSegment =
        segmentFilter === "All" ||
        (segmentFilter === "VIP Circle" && c.tier === "VIP Circle") ||
        (segmentFilter === "Repeat Buyers" && (c.totalOrders > 1 || c.tier === "Repeat Buyer")) ||
        (segmentFilter === "New Members" && c.totalOrders <= 1);

      const matchQuery =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.phone && c.phone.includes(searchQuery));

      return matchSegment && matchQuery;
    });
  }, [customers, segmentFilter, searchQuery]);

  const totalSpentAll = useMemo(() => customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0), [customers]);
  const vipCount = useMemo(() => customers.filter((c) => c.tier === "VIP Circle" || c.totalSpent >= 10000).length, [customers]);
  const avgCLV = useMemo(() => (customers.length ? Math.round(totalSpentAll / customers.length) : 0), [customers, totalSpentAll]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Database</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage buyer profiles, lifetime order metrics, VIP tiers, and customer history
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCustomers}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-400 ${loading ? "animate-spin" : ""}`} />
            Sync Database
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Total Registered Customers</span>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{customers.length} Accounts</div>
          <p className="text-[11px] text-slate-400 font-medium">Verified customer accounts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>VIP Circle Members</span>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{vipCount} Members</div>
          <p className="text-[11px] text-amber-600 font-medium">Lifetime spent ≥ ₹10,000</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Customer Lifetime Value</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">₹{totalSpentAll.toLocaleString("en-IN")}</div>
          <p className="text-[11px] text-emerald-600 font-medium">Total sales generated</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Avg Spending / Buyer</span>
            <ShoppingBag className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">₹{avgCLV.toLocaleString("en-IN")}</div>
          <p className="text-[11px] text-purple-600 font-medium">Average revenue per customer</p>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Segment Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {["All", "VIP Circle", "Repeat Buyers", "New Members"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSegmentFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  segmentFilter === tab
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search customer name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Total Spent (CLV)</th>
                <th className="py-3.5 px-4">VIP Tier</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    No customers found matching your filter or query.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const initials = (cust.name || "Customer")
                    .split(" ")
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/70 transition">
                      {/* Customer Avatar & Name */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-slate-900 text-amber-300 font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                            {initials}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 text-sm">{cust.name}</div>
                            <div className="text-[10px] text-slate-400 font-medium">ID #{cust.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-semibold text-slate-800">{cust.email}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{cust.phone || "No phone registered"}</div>
                      </td>

                      {/* Orders Placed */}
                      <td className="py-4 px-4 align-top">
                        <span className="inline-flex items-center gap-1 font-bold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <ShoppingCart className="h-3 w-3 text-slate-600" />
                          {cust.totalOrders} order(s)
                        </span>
                      </td>

                      {/* Total Spent */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-extrabold text-slate-900 text-sm">
                          ₹{Number(cust.totalSpent || 0).toLocaleString("en-IN")}
                        </div>
                      </td>

                      {/* Tier Badge */}
                      <td className="py-4 px-4 align-top">
                        <span
                          className={`inline-flex items-center gap-1 font-bold text-[11px] px-2.5 py-1 rounded-xl border ${
                            cust.tier === "VIP Circle"
                              ? "bg-amber-500/10 text-amber-700 border-amber-300"
                              : cust.tier === "Repeat Buyer"
                                ? "bg-blue-500/10 text-blue-700 border-blue-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          <Sparkles className="h-3 w-3 text-amber-600" />
                          {cust.tier}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-4 align-top text-slate-600 font-medium">
                        {cust.createdAt || "2024-01-01"}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 align-top text-right">
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition"
                        >
                          View Profile
                          <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-2"
            >
              <XCircle className="h-6 w-6" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 border-b pb-5">
              <div className="size-14 rounded-2xl bg-slate-900 text-amber-300 font-bold flex items-center justify-center text-xl shadow-md">
                {(selectedCustomer.name || "C")
                  .split(" ")
                  .map((n: string) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-slate-900">{selectedCustomer.name}</h3>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-amber-300">
                    {selectedCustomer.tier}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{selectedCustomer.email}</p>
              </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Orders</div>
                <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                  {selectedCustomer.totalOrders} Order(s)
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Lifetime Spent</div>
                <div className="text-lg font-extrabold text-emerald-600 mt-0.5">
                  ₹{Number(selectedCustomer.totalSpent || 0).toLocaleString("en-IN")}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Member Since</div>
                <div className="text-sm font-bold text-slate-900 mt-1">{selectedCustomer.createdAt || "2024-01-01"}</div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact & Address Info</h4>
              <div className="p-4 rounded-xl border border-slate-200/80 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Full Name:</span>
                  <span className="font-bold text-slate-900">{selectedCustomer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email Address:</span>
                  <span className="font-bold text-slate-900">{selectedCustomer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone Number:</span>
                  <span className="font-bold text-slate-900">{selectedCustomer.phone || "Not provided"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Delivery Address:</span>
                  <span className="font-bold text-slate-900 text-right max-w-[280px]">
                    {selectedCustomer.orders?.[0]?.shippingAddress || "Flat 402, Royal Palms, Bandra West, Mumbai"}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Orders History */}
            <div className="mt-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Customer Order History</h4>
              {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                <div className="space-y-3">
                  {selectedCustomer.orders.map((ord: CustomerOrder) => (
                    <div key={ord.id} className="p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-extrabold text-slate-900">{ord.orderNumber}</div>
                        <div className="text-slate-500 text-[11px]">{ord.createdAt} • {ord.items?.length || 1} Item(s)</div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-slate-900">₹{ord.totalAmount.toLocaleString("en-IN")}</div>
                        <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 text-xs border rounded-xl">
                  No previous order records found for this user account.
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-8 pt-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminContent() {
  const [cms, setCms] = useState<CMSContent>(() => getCMSContent());
  const [activeTab, setActiveTab] = useState<"slides" | "announcement" | "policies">("slides");
  const [activePolicy, setActivePolicy] = useState<"shipping" | "returns" | "privacy" | "care">("shipping");

  // Announcement state
  const [announcementText, setAnnouncementText] = useState(cms.announcementText);
  const [promoPopupEnabled, setPromoPopupEnabled] = useState(cms.promoPopupEnabled);
  const [promoDiscountCode, setPromoDiscountCode] = useState(cms.promoDiscountCode);

  // Policy text state
  const [policyContent, setPolicyContent] = useState(cms.policies[activePolicy]);

  // Modal for Slide Add/Edit
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [slideForm, setSlideForm] = useState<Omit<HeroSlide, "id">>({
    title: "",
    subtitle: "",
    ctaText: "SHOP NOW",
    ctaLink: "/shop",
    image: "",
    status: "Active",
  });

  useEffect(() => {
    setPolicyContent(cms.policies[activePolicy]);
  }, [activePolicy, cms.policies]);

  // Save Announcement Settings
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveCMSContent({
      announcementText,
      promoPopupEnabled,
      promoDiscountCode,
    });
    setCms(updated);
    toast.success("Announcement bar & popup settings saved!");
  };

  // Save Policy Settings
  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPolicies = {
      ...cms.policies,
      [activePolicy]: policyContent,
    };
    const updated = saveCMSContent({ policies: updatedPolicies });
    setCms(updated);
    toast.success(`${activePolicy.toUpperCase()} policy content saved successfully!`);
  };

  // Open Slide Add Modal
  const handleOpenAddSlide = () => {
    setEditingSlideId(null);
    setSlideForm({
      title: "",
      subtitle: "",
      ctaText: "SHOP NOW",
      ctaLink: "/shop",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&q=80",
      status: "Active",
    });
    setShowSlideModal(true);
  };

  // Open Slide Edit Modal
  const handleOpenEditSlide = (slide: HeroSlide) => {
    setEditingSlideId(slide.id);
    setSlideForm({
      title: slide.title,
      subtitle: slide.subtitle,
      ctaText: slide.ctaText,
      ctaLink: slide.ctaLink,
      image: slide.image,
      status: slide.status,
    });
    setShowSlideModal(true);
  };

  // Save Hero Slide
  const handleSaveSlideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedSlides: HeroSlide[];
    if (editingSlideId) {
      updatedSlides = cms.heroSlides.map((s) => (s.id === editingSlideId ? { ...slideForm, id: editingSlideId } : s));
      toast.success("Hero slide updated!");
    } else {
      const newSlide: HeroSlide = {
        ...slideForm,
        id: `slide_${Date.now()}`,
      };
      updatedSlides = [newSlide, ...cms.heroSlides];
      toast.success("New hero slide published!");
    }

    const updated = saveCMSContent({ heroSlides: updatedSlides });
    setCms(updated);
    setShowSlideModal(false);
  };

  // Toggle Slide Status
  const handleToggleSlideStatus = (id: string) => {
    const updatedSlides = cms.heroSlides.map((s) =>
      s.id === id ? { ...s, status: (s.status === "Active" ? "Draft" : "Active") as HeroSlide["status"] } : s,
    );
    const updated = saveCMSContent({ heroSlides: updatedSlides });
    setCms(updated);
    toast.success("Slide visibility updated!");
  };

  // Delete Slide
  const handleDeleteSlide = (id: string) => {
    const updatedSlides = cms.heroSlides.filter((s) => s.id !== id);
    const updated = saveCMSContent({ heroSlides: updatedSlides });
    setCms(updated);
    toast.success("Slide removed");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Store Content CMS</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage home page hero sliders, top ticker announcements, welcome popups, and policy copy
          </p>
        </div>

        {activeTab === "slides" && (
          <button
            onClick={handleOpenAddSlide}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition shadow-sm w-fit"
          >
            <Plus className="h-4 w-4 text-amber-300" />
            Add New Hero Slide
          </button>
        )}
      </div>

      {/* Main CMS Navigation Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none border-b border-slate-100 pb-3">
          {[
            { id: "slides", label: "Hero Banner Sliders", icon: Layout },
            { id: "announcement", label: "Announcement & Popup", icon: Megaphone },
            { id: "policies", label: "Store Policies CMS", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* SECTION 1: HERO SLIDES CMS */}
        {activeTab === "slides" && (
          <div className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Active Home Page Hero Banners</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing {cms.heroSlides.length} banner slides rendered on the website storefront
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cms.heroSlides.map((slide) => (
                <div
                  key={slide.id}
                  className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div className="relative h-44 w-full bg-slate-900">
                    <img src={slide.image} alt={slide.title} className="h-full w-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full w-fit mb-1 ${
                          slide.status === "Active"
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-600 text-slate-200"
                        }`}
                      >
                        {slide.status}
                      </span>
                      <h4 className="text-base font-extrabold text-white line-clamp-1">{slide.title}</h4>
                      <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{slide.subtitle}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white border-t border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="font-semibold text-slate-500">CTA Button:</span>
                      <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                        {slide.ctaText} ➔ {slide.ctaLink}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleToggleSlideStatus(slide.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                          slide.status === "Active"
                            ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        }`}
                      >
                        Set to {slide.status === "Active" ? "Draft" : "Active"}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditSlide(slide)}
                          className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                          title="Edit Slide"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSlide(slide.id)}
                          className="p-2 text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl transition"
                          title="Delete Slide"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: ANNOUNCEMENT BAR & POPUP CMS */}
        {activeTab === "announcement" && (
          <form onSubmit={handleSaveAnnouncement} className="pt-6 space-y-6 max-w-3xl">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Header Ticker Announcement</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                The top announcement message displayed across all storefront pages
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Top Announcement Bar Text</label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
              />
              <p className="text-[11px] text-slate-400">
                Example: COMPLIMENTARY SHIPPING | EASY SHOPPING | PREMIUM JEWELLERY
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">10% Welcome Subscriber Popup</h3>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900 text-xs">Enable 10% Discount Welcome Modal</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Automatically opens for new visitors after 4 seconds
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={promoPopupEnabled}
                  onChange={(e) => setPromoPopupEnabled(e.target.checked)}
                  className="size-5 accent-slate-900 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Promo Discount Coupon Code</label>
                <input
                  type="text"
                  value={promoDiscountCode}
                  onChange={(e) => setPromoDiscountCode(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition font-mono uppercase"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition shadow-sm"
            >
              <Check className="h-4 w-4 text-emerald-400" />
              Save Announcement Settings
            </button>
          </form>
        )}

        {/* SECTION 3: STORE POLICIES CMS */}
        {activeTab === "policies" && (
          <form onSubmit={handleSavePolicy} className="pt-6 space-y-6 max-w-3xl">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Store Policy Copy & Content CMS</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Edit legal policy declarations rendered on customer policy pages
              </p>
            </div>

            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              {[
                { id: "shipping", label: "Shipping Policy" },
                { id: "returns", label: "Returns & Exchange" },
                { id: "privacy", label: "Privacy Policy" },
                { id: "care", label: "Jewellery Care Guide" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePolicy(p.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    activePolicy === p.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {activePolicy} Content Body
              </label>
              <textarea
                rows={7}
                value={policyContent}
                onChange={(e) => setPolicyContent(e.target.value)}
                required
                className="w-full p-4 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition leading-relaxed font-sans"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition shadow-sm"
            >
              <Check className="h-4 w-4 text-emerald-400" />
              Save {activePolicy.toUpperCase()} Content
            </button>
          </form>
        )}
      </div>

      {/* Add / Edit Hero Slide Modal */}
      {showSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <form
            onSubmit={handleSaveSlideSubmit}
            className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 relative space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingSlideId ? "Edit Hero Banner Slide" : "Add New Hero Banner Slide"}
              </h3>
              <button
                type="button"
                onClick={() => setShowSlideModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Slide Title / Main Headline</label>
              <input
                type="text"
                value={slideForm.title}
                onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                required
                placeholder="Jewellery, Made to Stay With You."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Subtitle Description</label>
              <input
                type="text"
                value={slideForm.subtitle}
                onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                placeholder="Contemporary jewellery designed for everyday elegance..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Button Text</label>
                <input
                  type="text"
                  value={slideForm.ctaText}
                  onChange={(e) => setSlideForm({ ...slideForm, ctaText: e.target.value })}
                  required
                  placeholder="SHOP NEW ARRIVALS"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Target Link URL</label>
                <input
                  type="text"
                  value={slideForm.ctaLink}
                  onChange={(e) => setSlideForm({ ...slideForm, ctaLink: e.target.value })}
                  required
                  placeholder="/shop"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Banner Background Image URL</label>
              <input
                type="text"
                value={slideForm.image}
                onChange={(e) => setSlideForm({ ...slideForm, image: e.target.value })}
                required
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Status</label>
              <select
                value={slideForm.status}
                onChange={(e) => setSlideForm({ ...slideForm, status: e.target.value as any })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
              >
                <option value="Active">Active (Live on Website)</option>
                <option value="Draft">Draft (Hidden)</option>
              </select>
            </div>

            <div className="pt-4 border-t flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSlideModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition shadow-xs"
              >
                Publish Slide
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export function AdminFinances() {
  const [filterGateway, setFilterGateway] = useState<string>("All");

  const transactions = [
    { id: "TXN-994821", orderId: "ENV-2026-8941", customer: "Priya Sharma", gateway: "Razorpay (UPI)", gross: 6999, fee: 140, net: 6859, status: "Settled", date: "2026-09-26" },
    { id: "TXN-994820", orderId: "ENV-2026-7832", customer: "Rahul Verma", gateway: "Stripe (Credit Card)", gross: 12499, fee: 250, net: 12249, status: "Settled", date: "2026-09-25" },
    { id: "TXN-994819", orderId: "ENV-2026-6120", customer: "Ananya Roy", gateway: "Cash on Delivery", gross: 3499, fee: 0, net: 3499, status: "Pending Payout", date: "2026-09-24" },
    { id: "TXN-994818", orderId: "ENV-2026-5501", customer: "Vikram Malhotra", gateway: "Razorpay (NetBanking)", gross: 18999, fee: 380, net: 18619, status: "Settled", date: "2026-09-24" },
    { id: "TXN-994817", orderId: "ENV-2026-4432", customer: "Neha Kapoor", gateway: "Stripe (Apple Pay)", gross: 8999, fee: 180, net: 8819, status: "Processing", date: "2026-09-23" },
  ];

  const filtered = transactions.filter(t => filterGateway === "All" || t.gateway.includes(filterGateway));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Finances & Payouts</h1>
          <p className="text-xs text-slate-500 mt-1">Overview of revenue settlements, tax statements, gateway fees & net earnings</p>
        </div>

        <button
          onClick={() => toast.success("Downloading Tax & Payout Report (PDF)...")}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition shadow-xs self-start sm:self-auto"
        >
          <Download className="h-3.5 w-3.5" />
          Export Financial Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales Revenue</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><DollarSign className="h-4 w-4" /></div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">₹4,87,250</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <TrendingUp className="h-3.5 w-3.5" /> +18.4% vs last month
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Profit Margin</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><BarChart3 className="h-4 w-4" /></div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">₹3,41,075</p>
          <p className="text-xs text-slate-500 font-medium">70.0% estimated net margin</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Payouts</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Clock className="h-4 w-4" /></div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">₹48,200</p>
          <p className="text-xs text-amber-700 font-medium">Scheduled for Sept 28, 2026</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Taxes / GST Collected</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><CreditCard className="h-4 w-4" /></div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">₹87,705</p>
          <p className="text-xs text-slate-500 font-medium">18% GST slab accounting</p>
        </div>
      </div>

      {/* Gateway Settlement Schedule */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">Automated Payout Schedule</span>
          <h3 className="text-lg font-bold mt-1">Next Settlement Batch: ₹32,400</h3>
          <p className="text-xs text-slate-300 mt-0.5">Razorpay & Stripe direct deposit into ENVIAAR HDFC Operating Account (Ending in *8941)</p>
        </div>
        <button
          onClick={() => toast.success("Payout payout sync refreshed successfully!")}
          className="px-4 py-2 text-xs font-bold bg-white text-slate-900 rounded-xl hover:bg-slate-100 transition shadow-xs"
        >
          Instant Payout Sync
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900">Recent Gateway Transactions</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Gateway:</span>
            <select
              value={filterGateway}
              onChange={(e) => setFilterGateway(e.target.value)}
              className="text-xs font-bold border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="All">All Payment Methods</option>
              <option value="Razorpay">Razorpay</option>
              <option value="Stripe">Stripe</option>
              <option value="Cash">Cash on Delivery</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Gateway</th>
                <th className="py-3 px-4 text-right">Gross</th>
                <th className="py-3 px-4 text-right">Fee</th>
                <th className="py-3 px-4 text-right">Net Payout</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{t.id}</td>
                  <td className="py-3 px-4 text-blue-600 font-semibold">{t.orderId}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{t.customer}</td>
                  <td className="py-3 px-4">{t.gateway}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">₹{t.gross.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-rose-600">₹{t.fee}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-700">₹{t.net.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        t.status === "Settled"
                          ? "bg-emerald-100 text-emerald-800"
                          : t.status === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toast.info(`Downloading Tax Invoice for ${t.id}`)}
                      className="text-xs font-bold text-slate-700 hover:text-amber-600 underline"
                    >
                      Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AdminMarketing() {
  const [campaigns, setCampaigns] = useState([
    { id: "1", name: "Diwali Fest Royal Collection Showcase", type: "Email Newsletter", audience: "VIP Circle", sent: "4,500", openRate: "48.2%", ctr: "14.1%", status: "Active" },
    { id: "2", name: "New Customer 10% Welcome Series", type: "Automated Email", audience: "New Members", sent: "1,200", openRate: "52.0%", ctr: "18.5%", status: "Active" },
    { id: "3", name: "Festive Season Flash Offer SMS", type: "SMS Alert", audience: "All Customers", sent: "8,900", openRate: "92.0%", ctr: "8.4%", status: "Scheduled" },
    { id: "4", name: "Abandoned Cart Luxury Reminder", type: "Automated Trigger", audience: "Cart Abandoners", sent: "410", openRate: "61.3%", ctr: "22.0%", status: "Active" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", type: "Email Newsletter", audience: "All Customers" });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setCampaigns([
      {
        id: Date.now().toString(),
        name: form.name,
        type: form.type,
        audience: form.audience,
        sent: "0",
        openRate: "0.0%",
        ctr: "0.0%",
        status: "Active",
      },
      ...campaigns,
    ]);
    setShowModal(false);
    setForm({ name: "", type: "Email Newsletter", audience: "All Customers" });
    toast.success("Marketing Campaign created and queued!");
  };

  const toggleStatus = (id: string) => {
    setCampaigns(
      campaigns.map(c =>
        c.id === id ? { ...c, status: c.status === "Active" ? "Paused" : "Active" } : c
      )
    );
    toast.info("Campaign status updated.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Marketing & Campaigns</h1>
          <p className="text-xs text-slate-500 mt-1">Promotional email blasts, automated SMS triggers & customer acquisition hub</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Create New Campaign
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Campaigns</span>
          <p className="text-2xl font-extrabold text-slate-900">{campaigns.filter(c => c.status === "Active").length} Live</p>
          <p className="text-xs text-emerald-600 font-semibold">Running multi-channel</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Impressions</span>
          <p className="text-2xl font-extrabold text-slate-900">45,010</p>
          <p className="text-xs text-slate-500 font-medium">Emails & SMS delivered</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Campaign Revenue</span>
          <p className="text-2xl font-extrabold text-slate-900">₹1,24,500</p>
          <p className="text-xs text-emerald-600 font-semibold">+24.5% conversion rate</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Open Rate</span>
          <p className="text-2xl font-extrabold text-slate-900">51.4%</p>
          <p className="text-xs text-blue-600 font-semibold">Industry benchmark 22%</p>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">All Marketing Campaigns</h2>
          <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{campaigns.length} Campaigns</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Audience</th>
                <th className="py-3 px-4 text-center">Delivered</th>
                <th className="py-3 px-4 text-center">Open Rate</th>
                <th className="py-3 px-4 text-center">CTR</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{c.type}</td>
                  <td className="py-3.5 px-4"><span className="bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-md">{c.audience}</span></td>
                  <td className="py-3.5 px-4 text-center font-bold">{c.sent}</td>
                  <td className="py-3.5 px-4 text-center text-emerald-600 font-bold">{c.openRate}</td>
                  <td className="py-3.5 px-4 text-center text-blue-600 font-bold">{c.ctr}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        c.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : c.status === "Scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => toggleStatus(c.id)}
                      className="text-xs font-bold text-slate-700 hover:text-amber-600 border border-slate-200 rounded-lg px-2.5 py-1 hover:bg-slate-100 transition"
                    >
                      {c.status === "Active" ? "Pause" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <form onSubmit={handleCreate} className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-3">Create Marketing Campaign</h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Campaign Title</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="e.g. Exclusive Solitaire Diamond Showcase"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Marketing Channel</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
              >
                <option value="Email Newsletter">Email Newsletter</option>
                <option value="Automated Email">Automated Email Series</option>
                <option value="SMS Alert">SMS Instant Broadcast</option>
                <option value="Push Notification">Web Push Notification</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Audience Segment</label>
              <select
                value={form.audience}
                onChange={(e) => setForm({ ...form, audience: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
              >
                <option value="All Customers">All Store Customers</option>
                <option value="VIP Circle">VIP Circle (High Value)</option>
                <option value="New Members">New Registered Members</option>
                <option value="Cart Abandoners">Cart Abandoners</option>
              </select>
            </div>

            <div className="pt-3 border-t flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs"
              >
                Launch Campaign
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export function AdminDiscounts() {
  const [coupons, setCoupons] = useState([
    { id: "1", code: "ENVIAAR10", type: "Percentage", value: "10% OFF", minSpend: "₹1,999", usage: "142 / 500", status: "Active" },
    { id: "2", code: "WELCOME15", type: "Percentage", value: "15% OFF", minSpend: "₹2,499", usage: "89 / 200", status: "Active" },
    { id: "3", code: "ROYALFEST", type: "Fixed Amount", value: "₹1,000 OFF", minSpend: "₹8,000", usage: "45 / 100", status: "Active" },
    { id: "4", code: "FREESHIP", type: "Free Shipping", value: "100% Free Express Delivery", minSpend: "₹999", usage: "310 / 1000", status: "Active" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: "", type: "Percentage", value: "", minSpend: "" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code) return;
    setCoupons([
      {
        id: Date.now().toString(),
        code: form.code.toUpperCase(),
        type: form.type,
        value: form.value || "10% OFF",
        minSpend: form.minSpend ? `₹${form.minSpend}` : "₹0",
        usage: "0 / 500",
        status: "Active",
      },
      ...coupons,
    ]);
    setShowModal(false);
    setForm({ code: "", type: "Percentage", value: "", minSpend: "" });
    toast.success(`Promo Coupon ${form.code.toUpperCase()} created successfully!`);
  };

  const deleteCoupon = (id: string) => {
    setCoupons(coupons.filter(c => c.id !== id));
    toast.error("Coupon deleted.");
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied code "${code}" to clipboard!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Discounts & Coupon Vouchers</h1>
          <p className="text-xs text-slate-500 mt-1">Manage store promo codes, minimum spend rules, cart vouchers & checkout discounts</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Create Promo Code
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Coupons</span>
          <p className="text-2xl font-extrabold text-slate-900">{coupons.filter(c => c.status === "Active").length} Live Codes</p>
          <p className="text-xs text-emerald-600 font-semibold">Ready at checkout</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Redemptions</span>
          <p className="text-2xl font-extrabold text-slate-900">586 Uses</p>
          <p className="text-xs text-slate-500 font-medium">Across all orders</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Discount Value Granted</span>
          <p className="text-2xl font-extrabold text-slate-900">₹84,500</p>
          <p className="text-xs text-purple-600 font-semibold">Customer savings</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Order Lift</span>
          <p className="text-2xl font-extrabold text-slate-900">+34.8%</p>
          <p className="text-xs text-blue-600 font-semibold">Higher cart total</p>
        </div>
      </div>

      {/* Coupon List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Active Discount Voucher Registry</h2>
          <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{coupons.length} Active Vouchers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount Type</th>
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Min Spend</th>
                <th className="py-3 px-4 text-center">Usage Count</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 flex items-center gap-2">
                    <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg tracking-wider text-amber-700 font-extrabold">{c.code}</span>
                    <button onClick={() => copyCode(c.code)} className="text-slate-400 hover:text-slate-800 text-[10px]">Copy</button>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{c.type}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">{c.value}</td>
                  <td className="py-3.5 px-4 font-semibold">{c.minSpend}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-900">{c.usage}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => deleteCoupon(c.id)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 border border-rose-100 rounded-lg px-2.5 py-1 hover:bg-rose-50 transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <form onSubmit={handleAdd} className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-3">Create New Promo Voucher</h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Coupon Code (Uppercase)</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                required
                placeholder="e.g. LUXURY20"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 uppercase font-mono font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Discount Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
                >
                  <option value="Percentage">Percentage %</option>
                  <option value="Fixed Amount">Fixed Amount ₹</option>
                  <option value="Free Shipping">Free Shipping</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Value (e.g. 20% OFF)</label>
                <input
                  type="text"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  required
                  placeholder="e.g. 20% OFF or ₹500 OFF"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Minimum Order Value (₹)</label>
              <input
                type="number"
                value={form.minSpend}
                onChange={(e) => setForm({ ...form, minSpend: e.target.value })}
                placeholder="2499"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="pt-3 border-t flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs"
              >
                Save Coupon
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

