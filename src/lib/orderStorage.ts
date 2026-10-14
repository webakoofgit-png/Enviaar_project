export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  finish?: string;
  size?: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Unpaid' | 'Refunded';
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

const STORAGE_KEY = "enviaar_live_orders_v2";

const initialSampleOrders: CustomerOrder[] = [];

export function getSavedOrders(): CustomerOrder[] {
  try {
    if (typeof window !== "undefined") {
      // Purge legacy demo orders storage key
      try {
        localStorage.removeItem("enviaar_custom_orders");
      } catch (_) {}
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Ensure no demo orders persist
    const clean = parsed.filter(
      (o: any) =>
        o.id !== "ord_1001" &&
        o.id !== "ord_1002" &&
        o.orderNumber !== "ENV-2026-1042" &&
        o.orderNumber !== "ENV-2026-1041" &&
        !String(o.customerEmail || "").toLowerCase().includes("aarav.sharma") &&
        !String(o.customerEmail || "").toLowerCase().includes("priya.k@example.com")
    );
    if (clean.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    }
    return clean;
  } catch (err) {
    console.error("Error reading saved orders from localStorage", err);
    return [];
  }
}

export function clearAllStoredOrders(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("enviaar_custom_orders");
  } catch (err) {
    console.error("Error clearing orders from localStorage", err);
  }
}

export function saveOrder(order: CustomerOrder): CustomerOrder[] {
  try {
    const current = getSavedOrders();
    const existingIndex = current.findIndex((o) => o.id === order.id || o.orderNumber === order.orderNumber);
    let updated: CustomerOrder[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = order;
    } else {
      updated = [order, ...current];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Error saving order to localStorage", err);
    return getSavedOrders();
  }
}

export function updateOrderStatusInStorage(orderId: string, status: CustomerOrder['status']): CustomerOrder[] {
  try {
    const current = getSavedOrders();
    const updated = current.map((o) => {
      if (o.id === orderId || o.orderNumber === orderId) {
        const isDelivered = status === "Delivered";
        return {
          ...o,
          status,
          paymentStatus: isDelivered ? "Paid" : o.paymentStatus,
        };
      }
      return o;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Error updating order status in localStorage", err);
    return getSavedOrders();
  }
}

export function updateOrderPaymentStatusInStorage(orderId: string, paymentStatus: CustomerOrder['paymentStatus']): CustomerOrder[] {
  try {
    const current = getSavedOrders();
    const updated = current.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, paymentStatus } : o));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Error updating order payment status in localStorage", err);
    return getSavedOrders();
  }
}

export function deleteOrderFromStorage(orderId: string): CustomerOrder[] {
  try {
    const current = getSavedOrders();
    const updated = current.filter((o) => o.id !== orderId && o.orderNumber !== orderId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Error deleting order from localStorage", err);
    return getSavedOrders();
  }
}
