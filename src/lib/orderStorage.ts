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

const STORAGE_KEY = "enviaar_custom_orders";

const initialSampleOrders: CustomerOrder[] = [
  {
    id: "ord_1001",
    orderNumber: "ENV-2026-1042",
    customerName: "Aarav Sharma",
    customerEmail: "aarav.sharma@example.com",
    customerPhone: "+91 98765 43210",
    shippingAddress: "Flat 402, Royal Palms, Bandra West, Mumbai, Maharashtra - 400050",
    paymentMethod: "UPI (Google Pay)",
    paymentStatus: "Paid",
    status: "Processing",
    totalAmount: 7980,
    items: [
      {
        id: "1",
        name: "Aurelia Drop Earrings",
        price: 3490,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&q=80",
        finish: "Gold",
      },
      {
        id: "5",
        name: "Solène Tennis Bracelet",
        price: 4490,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1611591475874-b8e45fd430e3?w=300&q=80",
        finish: "Silver",
      },
    ],
    createdAt: "2026-09-24 14:30:00",
  },
  {
    id: "ord_1002",
    orderNumber: "ENV-2026-1041",
    customerName: "Priya Kapoor",
    customerEmail: "priya.k@example.com",
    customerPhone: "+91 98123 45678",
    shippingAddress: "Villa 12, Jubilee Hills, Hyderabad, Telangana - 500033",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    status: "Shipped",
    totalAmount: 11980,
    items: [
      {
        id: "3",
        name: "Elara Necklace Set",
        price: 7490,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=300&q=80",
        finish: "Rose Gold",
      },
    ],
    createdAt: "2026-09-22 10:15:00",
  },
];

export function getSavedOrders(): CustomerOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSampleOrders));
      return initialSampleOrders;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : initialSampleOrders;
  } catch (err) {
    console.error("Error reading saved orders from localStorage", err);
    return initialSampleOrders;
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
