import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminUser: { name: string; email: string; role: string } | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("enviaar_admin_auth") === "true";
  });

  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    const saved = localStorage.getItem("enviaar_admin_user");
    return saved ? JSON.parse(saved) : { name: "ENVIAAR Admin", email: "admin@enviaar.com", role: "Store Administrator" };
  });

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      // Try Express backend API first
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        setAdminUser(data.user);
        localStorage.setItem("enviaar_admin_auth", "true");
        localStorage.setItem("enviaar_admin_user", JSON.stringify(data.user));
        return true;
      }
    } catch (err) {
      console.warn("Backend API offline, evaluating local admin credentials");
    }

    // Default admin check fallback
    if ((email === "admin@enviaar.com" || email === "admin") && (pass === "admin123" || pass === "admin")) {
      const user = { name: "ENVIAAR Admin", email: "admin@enviaar.com", role: "Store Administrator" };
      setIsAuthenticated(true);
      setAdminUser(user);
      localStorage.setItem("enviaar_admin_auth", "true");
      localStorage.setItem("enviaar_admin_user", JSON.stringify(user));
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem("enviaar_admin_auth");
    localStorage.removeItem("enviaar_admin_user");
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, adminUser, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
