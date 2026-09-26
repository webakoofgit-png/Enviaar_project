import React, { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  User,
  Package,
  MapPin,
  Heart,
  CreditCard,
  Settings,
  LogOut,
  Edit3,
  CheckCircle2,
  Clock,
  Truck,
  Plus,
  Trash2,
  Check,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/store/ProductCard";
import { useStore } from "@/context/StoreContext";
import { money } from "@/data/store";
import { toast } from "sonner";
import { getSavedOrders, type CustomerOrder } from "@/lib/orderStorage";

type Address = {
  id: string;
  name: string;
  phone: string;
  pincode: string;
  house: string;
  area: string;
  city: string;
  state: string;
  type: "Home" | "Work" | "Other";
  isDefault?: boolean;
};

export function CustomerProfilePage() {
  const { isLoggedIn, user, logout, setAccountOpen, wishlist, products, updateUserProfile } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = searchParams.get("tab") || "orders";
  const [activeTab, setActiveTab] = useState(activeTabParam);

  useEffect(() => {
    if (activeTabParam !== activeTab) {
      setActiveTab(activeTabParam);
    }
  }, [activeTabParam]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Editable Profile Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Female");
  const [birthday, setBirthday] = useState("");
  const [anniversary, setAnniversary] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      const parts = (user.name || "").split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setGender(user.gender || "Female");
      setBirthday(user.birthday || "1996-08-15");
      setAnniversary(user.anniversary || "");
    }
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${firstName} ${lastName}`.trim();
    updateUserProfile({
      name: fullName,
      email,
      phone,
      gender,
      birthday,
      anniversary,
    });
    setIsEditingProfile(false);
    toast.success("Profile updated successfully!");
  };

  // Real-Time Syncing User Orders State
  const [userOrders, setUserOrders] = useState<CustomerOrder[]>(() => getSavedOrders());

  const refreshCustomerOrders = async () => {
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
              customerEmail: apiO.customerEmail || match?.customerEmail || user?.email || "customer@enviaar.com",
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

          const apiOrderNums = new Set(merged.map((o) => o.orderNumber));
          const extraLocal = localOrders.filter((o) => !apiOrderNums.has(o.orderNumber));
          setUserOrders([...extraLocal, ...merged]);
          return;
        }
      }
    } catch (err) {
      // Backend offline fallback
    }
    setUserOrders(localOrders);
  };

  useEffect(() => {
    refreshCustomerOrders();
    const interval = setInterval(refreshCustomerOrders, 2000);
    window.addEventListener("storage", refreshCustomerOrders);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", refreshCustomerOrders);
    };
  }, []);

  // Address Manager State
  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      const stored = localStorage.getItem("enviaar_user_addresses");
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      {
        id: "addr-1",
        name: user?.name || "Ananya Sharma",
        phone: user?.phone || "+91 98765 43210",
        pincode: "400050",
        house: "Flat 402, Opal Heights",
        area: "Bandra West, Near Hill Road",
        city: "Mumbai",
        state: "Maharashtra",
        type: "Home",
        isDefault: true,
      },
    ];
  });

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<Address, "id">>({
    name: "",
    phone: "",
    pincode: "",
    house: "",
    area: "",
    city: "",
    state: "",
    type: "Home",
    isDefault: false,
  });

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Address = {
      ...newAddr,
      id: `addr-${Date.now()}`,
    };
    const updated = [created, ...addresses];
    setAddresses(updated);
    localStorage.setItem("enviaar_user_addresses", JSON.stringify(updated));
    setShowAddAddress(false);
    setNewAddr({
      name: "",
      phone: "",
      pincode: "",
      house: "",
      area: "",
      city: "",
      state: "",
      type: "Home",
      isDefault: false,
    });
    toast.success("New address added!");
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    localStorage.setItem("enviaar_user_addresses", JSON.stringify(updated));
    toast.success("Address removed");
  };

  const handleSetDefaultAddress = (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setAddresses(updated);
    localStorage.setItem("enviaar_user_addresses", JSON.stringify(updated));
    toast.success("Default address updated");
  };

  // Saved Favourites
  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [products, wishlist]);

  // If Not Logged In
  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
          <User className="size-8" />
        </div>
        <h1 className="text-4xl font-display">Sign In to View Profile</h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
          Access your order history, manage addresses, track shipments, and view your saved jewellery wishlist.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button variant="luxury" size="lg" onClick={() => setAccountOpen(true)}>
            Sign In / Create Account
          </Button>
        </div>
      </div>
    );
  }

  const initials = (user?.name || "Customer")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-secondary/15 pb-20">
      {/* Header Profile Hero */}
      <section className="relative bg-gradient-to-b from-secondary/60 via-secondary/30 to-background border-b pt-10 pb-12 px-4 sm:px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="flex size-16 sm:size-20 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-2xl sm:text-3xl shadow-lg ring-4 ring-primary/10">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-4xl font-display">{user?.name || "ENVIAAR Member"}</h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-0.5 text-[11px] font-semibold text-primary border border-primary/20">
                    <Sparkles className="size-3" /> VIP Circle
                  </span>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  {user?.email || "customer@enviaar.com"} • {user?.phone || "+91 98765 43210"}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground/80">
                  Member since 2026 • 200 ENVIAAR Rewards Points
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs gap-2 border-border/80"
                onClick={() => handleTabChange("settings")}
              >
                <Edit3 className="size-3.5" /> Edit Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 text-xs gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={logout}
              >
                <LogOut className="size-3.5" /> Logout
              </Button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t pt-6 text-center">
            <button
              onClick={() => handleTabChange("orders")}
              className="p-3 rounded-lg hover:bg-secondary/40 transition text-left sm:text-center"
            >
              <p className="text-2xl font-bold font-display text-foreground">{userOrders.length}</p>
              <p className="text-xs text-muted-foreground flex items-center sm:justify-center gap-1 mt-0.5">
                <Package className="size-3.5" /> Active Orders
              </p>
            </button>
            <button
              onClick={() => handleTabChange("wishlist")}
              className="p-3 rounded-lg hover:bg-secondary/40 transition text-left sm:text-center"
            >
              <p className="text-2xl font-bold font-display text-foreground">{wishlist.length}</p>
              <p className="text-xs text-muted-foreground flex items-center sm:justify-center gap-1 mt-0.5">
                <Heart className="size-3.5" /> Saved Wishlist
              </p>
            </button>
            <button
              onClick={() => handleTabChange("addresses")}
              className="p-3 rounded-lg hover:bg-secondary/40 transition text-left sm:text-center"
            >
              <p className="text-2xl font-bold font-display text-foreground">{addresses.length}</p>
              <p className="text-xs text-muted-foreground flex items-center sm:justify-center gap-1 mt-0.5">
                <MapPin className="size-3.5" /> Saved Addresses
              </p>
            </button>
            <div className="p-3 rounded-lg text-left sm:text-center">
              <p className="text-2xl font-bold font-display text-primary">₹500</p>
              <p className="text-xs text-muted-foreground flex items-center sm:justify-center gap-1 mt-0.5">
                <Gift className="size-3.5 text-primary" /> Store Wallet
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tabbed Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10 mt-8">
        {/* Navigation Tabs */}
        <div className="flex border-b overflow-x-auto gap-2 sm:gap-6 no-scrollbar pb-1">
          {[
            { id: "orders", label: "My Orders", icon: Package },
            { id: "addresses", label: "Saved Addresses", icon: MapPin },
            { id: "wishlist", label: "Wishlist", icon: Heart },
            { id: "payments", label: "Cards & Wallet", icon: CreditCard },
            { id: "settings", label: "Account Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === "orders" && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display">Recent Orders & Shipments</h2>
              <span className="text-xs text-muted-foreground">Showing {userOrders.length} orders</span>
            </div>

            {userOrders.length === 0 ? (
              <div className="bg-background border rounded-lg p-12 text-center text-muted-foreground">
                <Package className="size-10 mx-auto text-muted-foreground/60 mb-3" />
                <p className="font-display text-lg">No orders placed yet.</p>
                <Button asChild variant="luxury" size="sm" className="mt-4">
                  <Link to="/shop">Explore Jewellery Catalogue</Link>
                </Button>
              </div>
            ) : (
              userOrders.map((order) => {
                const isDelivered = order.status === "Delivered";
                const isShipped = order.status === "Shipped" || isDelivered;
                const isProcessing = order.status === "Processing" || isShipped;

                return (
                  <div key={order.id} className="bg-background border rounded-lg p-5 sm:p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-sm">Order #{order.orderNumber}</span>
                          <span
                            className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                              order.status === "Delivered"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : order.status === "Shipped"
                                  ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                  : order.status === "Processing"
                                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                    : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            <Clock className="size-3" /> {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Placed on {order.createdAt} • {order.items?.length || 1} Item(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-semibold">{money(order.totalAmount)}</p>
                        <p className="text-xs text-emerald-600 font-medium">{order.paymentMethod}</p>
                      </div>
                    </div>

                    {/* Delivery Progress Bar */}
                    <div className="my-6 bg-secondary/40 p-4 rounded-lg border">
                      <p className="text-xs font-semibold flex items-center gap-2 text-foreground">
                        <Truck className="size-4 text-primary" /> Delivery Status: {order.status}
                      </p>
                      <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[10px] font-medium text-muted-foreground">
                        <div className="text-primary font-semibold">1. Placed</div>
                        <div className={isProcessing ? "text-primary font-semibold" : ""}>2. Packed</div>
                        <div className={isShipped ? "text-primary font-semibold" : ""}>3. Shipped</div>
                        <div className={isDelivered ? "text-primary font-semibold" : ""}>4. Delivered</div>
                      </div>
                      <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{
                            width: isDelivered
                              ? "100%"
                              : isShipped
                                ? "75%"
                                : isProcessing
                                  ? "50%"
                                  : "25%",
                          }}
                        />
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="space-y-4">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-4">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="size-16 object-cover rounded border"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="text-sm font-medium">{item.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {item.finish ? `Finish: ${item.finish} • ` : ""}Qty: {item.quantity}
                              </p>
                              <p className="text-xs font-semibold mt-1">{money(item.price * item.quantity)}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground">ENVIAAR Fine Jewellery Product</p>
                      )}
                    </div>

                    <div className="mt-6 border-t pt-4 flex flex-wrap justify-between items-center gap-3">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <ShieldCheck className="size-3.5 text-emerald-600" /> 1-Year Guarantee Included
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => toast.success(`Invoice for ${order.orderNumber} downloading...`)}
                        >
                          Download Invoice
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: ADDRESSES */}
        {activeTab === "addresses" && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display">Saved Delivery Addresses</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Manage your shipping destinations</p>
              </div>
              <Button size="sm" variant="luxury" className="gap-2 text-xs" onClick={() => setShowAddAddress(true)}>
                <Plus className="size-4" /> Add New Address
              </Button>
            </div>

            {/* Add Address Modal / Form */}
            {showAddAddress && (
              <form onSubmit={handleAddAddress} className="bg-background border p-6 rounded-lg shadow-md space-y-4">
                <h3 className="text-base font-semibold">Add New Delivery Address</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    required
                    placeholder="Full Name"
                    value={newAddr.name}
                    onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                  />
                  <Input
                    required
                    placeholder="10-digit Mobile Number"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Input
                    required
                    placeholder="Pincode (e.g. 400050)"
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                  />
                  <Input
                    required
                    placeholder="Flat / House / Building"
                    value={newAddr.house}
                    onChange={(e) => setNewAddr({ ...newAddr, house: e.target.value })}
                  />
                  <Input
                    required
                    placeholder="Street / Area / Landmark"
                    value={newAddr.area}
                    onChange={(e) => setNewAddr({ ...newAddr, area: e.target.value })}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    required
                    placeholder="City"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  />
                  <Input
                    required
                    placeholder="State"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" variant="luxury" size="sm">
                    Save Address
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowAddAddress(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Address Cards Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`bg-background border rounded-lg p-5 flex flex-col justify-between relative ${
                    addr.isDefault ? "border-primary ring-2 ring-primary/10" : ""
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded bg-secondary text-foreground">
                        {addr.type}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[11px] text-primary font-semibold flex items-center gap-1">
                          <CheckCircle2 className="size-3" /> Default Address
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold">{addr.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {addr.house}, {addr.area}
                      <br />
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">Mobile: {addr.phone}</p>
                  </div>

                  <div className="mt-5 border-t pt-3 flex items-center justify-between text-xs">
                    {!addr.isDefault ? (
                      <button
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="text-primary hover:underline font-medium"
                      >
                        Set as Default
                      </button>
                    ) : (
                      <span className="text-muted-foreground">Primary Delivery</span>
                    )}
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-destructive hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="size-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: WISHLIST */}
        {activeTab === "wishlist" && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display">My Wishlist & Favourites</h2>
              <span className="text-xs text-muted-foreground">{wishlistProducts.length} saved pieces</span>
            </div>

            {wishlistProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
                {wishlistProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-background border rounded-lg py-16 text-center">
                <Heart className="mx-auto size-12 text-muted-foreground/40 mb-3" />
                <h3 className="text-lg font-display">Your wishlist is waiting</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Save your favourite jewellery pieces while you browse to return to them anytime.
                </p>
                <Button asChild variant="luxury" size="sm" className="mt-6">
                  <Link to="/collections/shop">Explore Catalogue</Link>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PAYMENTS & WALLET */}
        {activeTab === "payments" && (
          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-display">Saved Payment Methods & Store Credit</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Wallet Card */}
              <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/30 border border-primary/20 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">ENVIAAR Wallet</span>
                  <Sparkles className="size-5 text-primary" />
                </div>
                <p className="text-3xl font-display text-foreground">{money(500)}</p>
                <p className="text-xs text-muted-foreground mt-1">Available Store Credit for your next order</p>
                <Button variant="luxury-outline" size="sm" className="mt-5 text-xs">
                  Redeem Gift Card
                </Button>
              </div>

              {/* Saved UPI / Card */}
              <div className="bg-background border rounded-lg p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-foreground uppercase">Primary Payment</span>
                    <ShieldCheck className="size-4 text-emerald-600" />
                  </div>
                  <p className="text-sm font-medium">Google Pay / UPI ID</p>
                  <p className="text-xs text-muted-foreground mt-1">ananya@okaxis</p>
                </div>
                <p className="text-[11px] text-muted-foreground mt-4">
                  100% Encrypted & PCI-DSS Compliant Security
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS & PROFILE */}
        {activeTab === "settings" && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display">Personal Details & Preferences</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Manage your personal information</p>
              </div>
              {!isEditingProfile && (
                <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={() => setIsEditingProfile(true)}>
                  <Edit3 className="size-3.5" /> Edit Details
                </Button>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="bg-background border p-6 rounded-lg space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">First Name</label>
                  <Input
                    disabled={!isEditingProfile}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Last Name</label>
                  <Input
                    disabled={!isEditingProfile}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email Address</label>
                  <Input
                    disabled={!isEditingProfile}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Mobile Number</label>
                  <Input
                    disabled={!isEditingProfile}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 border-t pt-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Gender</label>
                  <select
                    disabled={!isEditingProfile}
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full h-10 border rounded-md px-3 bg-background text-sm outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Birthday (For Perks)</label>
                  <Input
                    disabled={!isEditingProfile}
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Anniversary (Special Offer)</label>
                  <Input
                    disabled={!isEditingProfile}
                    type="date"
                    value={anniversary}
                    onChange={(e) => setAnniversary(e.target.value)}
                  />
                </div>
              </div>

              {isEditingProfile && (
                <div className="flex gap-3 pt-2">
                  <Button type="submit" variant="luxury" size="sm">
                    Save Changes
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsEditingProfile(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
