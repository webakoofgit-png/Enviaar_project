import React from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { toast } from "sonner";
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  FileText,
  CreditCard,
  BarChart3,
  Megaphone,
  Percent,
  Store,
  Monitor,
  ShoppingBag,
  Search,
  Bell,
  ChevronDown,
  Sidebar as SidebarIcon,
  LogOut,
} from "lucide-react";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminUser, logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/admin/login", { replace: true });
  };

  const mainNavItems = [
    { label: "Home", path: "/admin", icon: Home },
    { label: "Orders", path: "/admin/orders", icon: ShoppingCart, badge: "1" },
    { label: "Products", path: "/admin/products", icon: Package },
    { label: "Customers", path: "/admin/customers", icon: Users },
    { label: "Content", path: "/admin/content", icon: FileText },
    { label: "Finances", path: "/admin/finances", icon: CreditCard },
    { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    { label: "Marketing", path: "/admin/marketing", icon: Megaphone, hasSub: true },
    { label: "Discounts", path: "/admin/discounts", icon: Percent },
  ];

  const salesChannels = [
    { label: "Online Store", path: "/", icon: Store, external: true },
    { label: "Point of Sale", path: "#", icon: Monitor },
    { label: "Shop", path: "#", icon: ShoppingBag },
  ];

  return (
    <div className="flex min-h-screen bg-[#F6F7F9] font-sans text-slate-800 antialiased selection:bg-amber-100 selection:text-amber-900">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 shrink-0 border-r border-slate-200/80 bg-white flex flex-col justify-between select-none">
        <div>
          {/* Brand Header */}
          <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100">
            <Link to="/admin" className="flex items-center gap-2.5 hover:opacity-85 transition">
              <img
                src="/image-copy.png"
                alt="ENVIAAR Logo"
                className="h-7 w-auto object-contain"
              />
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </Link>
            <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-50 transition">
              <SidebarIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Nav Section: MAIN */}
          <div className="px-3 py-4">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Main
            </div>
            <nav className="space-y-0.5">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== "/admin" && location.pathname.startsWith(item.path));

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`group flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all duration-150 ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm font-semibold"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 px-1">
                        {item.badge}
                      </span>
                    )}
                    {item.hasSub && (
                      <ChevronDown className={`h-3.5 w-3.5 ${isActive ? "text-slate-300" : "text-slate-400"}`} />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Nav Section: SALES CHANNELS */}
          <div className="px-3 py-2 border-t border-slate-100">
            <div className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Sales Channels
            </div>
            <nav className="space-y-0.5">
              {salesChannels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <Link
                    key={channel.label}
                    to={channel.path}
                    target={channel.external ? "_blank" : undefined}
                    className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 rounded-xl transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-slate-400" />
                      <span>{channel.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Profile Footer + Logout Button */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center border border-slate-700 shadow-xs shrink-0">
                EA
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 truncate">
                  {adminUser?.name || "ENVIAAR Admin"}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {adminUser?.role || "Store Administrator"}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP HEADER */}
        <header className="h-16 border-b border-slate-200/80 bg-white px-6 flex items-center justify-between gap-4 shrink-0">
          {/* Global Search Bar */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products, orders or customers"
              className="w-full h-9 pl-9 pr-4 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/5 transition"
            />
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
            </button>

            <div className="h-4 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full bg-slate-900 text-amber-300 font-bold text-[11px] flex items-center justify-center">
                  EA
                </div>
                <div className="text-xs text-slate-700 font-medium hidden sm:block">
                  {adminUser?.name || "ENVIAAR Admin"}
                  <span className="block text-[10px] text-slate-400 font-normal">
                    {adminUser?.role || "Store Administrator"}
                  </span>
                </div>
              </div>

              {/* Top Bar Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
