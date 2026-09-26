import { Routes, Route, useParams } from "react-router-dom";
import { StoreProvider } from "@/context/StoreContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { AdminProtectedRoute } from "@/components/admin/AdminProtectedRoute";
import { SiteShell } from "@/components/store/SiteShell";
import { HomePage } from "@/pages/HomePage";
import { CollectionPage } from "@/pages/CollectionPage";
import {
  Collections,
  ProductPage,
  CartPage,
  CheckoutPage,
  WishlistPage,
  SearchPage,
  AboutPage,
  ContactPage,
  AccountPage,
  OrdersPage,
  OrderPage,
  PolicyPage,
  NotFound,
  policies,
} from "@/pages/AppPages";

// Admin Imports
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { AdminProductsPage } from "@/pages/admin/AdminProductsPage";
import {
  AdminHome,
  AdminOrders,
  AdminCustomers,
  AdminContent,
  AdminFinances,
  AdminAnalytics,
  AdminMarketing,
  AdminDiscounts,
} from "@/pages/admin/AdminPages";

function ProductRoute() {
  const { slug } = useParams<{ slug: string }>();
  return <ProductPage slug={slug || ""} />;
}

function CollectionRoute() {
  const { collection } = useParams<{ collection: string }>();
  return <CollectionPage collection={collection || "shop"} />;
}

function OrderRoute() {
  const { id } = useParams<{ id: string }>();
  return <OrderPage id={id || ""} />;
}

export default function App() {
  return (
    <StoreProvider>
      <AdminAuthProvider>
        <Routes>
          {/* ADMIN LOGIN ROUTE */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* PROTECTED ADMIN ROUTES */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="finances" element={<AdminFinances />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="marketing" element={<AdminMarketing />} />
            <Route path="discounts" element={<AdminDiscounts />} />
            <Route path="*" element={<AdminHome />} />
          </Route>

          {/* STOREFRONT ROUTES */}
          <Route
            path="/*"
            element={
              <SiteShell>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<CollectionPage collection="shop" />} />
                  <Route path="/new-arrivals" element={<CollectionPage collection="new-arrivals" />} />
                  <Route path="/bestsellers" element={<CollectionPage collection="bestsellers" />} />
                  <Route path="/festive" element={<CollectionPage collection="festive" />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/collections/:collection" element={<CollectionRoute />} />
                  <Route path="/product/:slug" element={<ProductRoute />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/order/:id" element={<OrderRoute />} />

                  <Route
                    path="/privacy"
                    element={
                      <PolicyPage
                        title={policies.privacy.title}
                        sections={policies.privacy.sections}
                      />
                    }
                  />
                  <Route
                    path="/terms"
                    element={
                      <PolicyPage
                        title={policies.terms.title}
                        sections={policies.terms.sections}
                      />
                    }
                  />
                  <Route
                    path="/shipping-policy"
                    element={
                      <PolicyPage
                        title={policies["shipping-policy"].title}
                        sections={policies["shipping-policy"].sections}
                      />
                    }
                  />
                  <Route
                    path="/returns"
                    element={
                      <PolicyPage
                        title={policies.returns.title}
                        sections={policies.returns.sections}
                      />
                    }
                  />
                  <Route
                    path="/care-guide"
                    element={
                      <PolicyPage
                        title={policies["care-guide"].title}
                        sections={policies["care-guide"].sections}
                      />
                    }
                  />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </SiteShell>
            }
          />
        </Routes>
      </AdminAuthProvider>
    </StoreProvider>
  );
}
