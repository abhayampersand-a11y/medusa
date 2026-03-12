import Link from "next/link";
import { getCustomer } from "@/lib/api/customer";
import { listOrders } from "@/lib/api/orders";
import { listAddresses } from "@/lib/api/addresses";
import { LogoutButton } from "./LogoutButton";

export const metadata = {
  title: "My Account — MedusaStore",
  description: "Manage your account, orders, and addresses",
};

export default async function AccountPage() {
  let customer: any = null;
  let orders: any[] = [];
  let addresses: any[] = [];

  try {
    customer = await getCustomer();
  } catch (e) {}

  if (!customer) {
    return (
      <div className="page-section">
        <div className="container empty-state">
          <div className="icon">🔐</div>
          <h3>Sign In Required</h3>
          <p>Please sign in to view your account.</p>
          <Link href="/account/login" className="btn btn-primary">Sign In →</Link>
        </div>
      </div>
    );
  }

  try {
    orders = await listOrders();
  } catch (e) {}

  try {
    addresses = await listAddresses();
  } catch (e) {}

  const formatPrice = (amount: number) => `$${(amount / 100).toFixed(2)}`;

  return (
    <div className="page-section">
      <div className="container" style={{ maxWidth: "900px" }}>
        {/* Profile Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "40px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "4px" }}>
              Hello, {customer.first_name || "Customer"} 👋
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>{customer.email}</p>
          </div>
          <LogoutButton />
        </div>

        {/* Profile Info */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              padding: "24px",
              background: "var(--bg-glass)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <h3 style={{ fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", marginBottom: "16px" }}>
              Profile
            </h3>
            <div style={{ display: "grid", gap: "8px" }}>
              <div><span style={{ color: "var(--text-muted)" }}>Name:</span> {customer.first_name} {customer.last_name}</div>
              <div><span style={{ color: "var(--text-muted)" }}>Email:</span> {customer.email}</div>
              <div><span style={{ color: "var(--text-muted)" }}>Phone:</span> {customer.phone || "Not set"}</div>
            </div>
          </div>

          <div
            style={{
              padding: "24px",
              background: "var(--bg-glass)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <h3 style={{ fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", marginBottom: "16px" }}>
              Addresses ({addresses.length})
            </h3>
            {addresses.length > 0 ? (
              addresses.slice(0, 2).map((addr: any) => (
                <div key={addr.id} style={{ marginBottom: "12px", fontSize: "0.9rem" }}>
                  <div>{addr.first_name} {addr.last_name}</div>
                  <div style={{ color: "var(--text-muted)" }}>{addr.address_1}, {addr.city} {addr.postal_code}</div>
                </div>
              ))
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No saved addresses</p>
            )}
          </div>
        </div>

        {/* Orders */}
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "24px" }}>
            Order History
          </h2>

          {orders.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {orders.map((order: any) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="card"
                  style={{
                    padding: "20px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr auto",
                    gap: "16px",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                      Order
                    </div>
                    <div style={{ fontWeight: 600 }}>#{order.display_id || order.id.slice(-8)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                      Date
                    </div>
                    <div>{new Date(order.created_at).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                      Total
                    </div>
                    <div className="price">{order.total ? formatPrice(order.total) : "—"}</div>
                  </div>
                  <span className="badge badge-success">
                    {order.status || "Completed"}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: "40px" }}>
              <div className="icon">📦</div>
              <h3>No Orders Yet</h3>
              <p>Your order history will appear here once you make a purchase.</p>
              <Link href="/products" className="btn btn-primary">Start Shopping →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
