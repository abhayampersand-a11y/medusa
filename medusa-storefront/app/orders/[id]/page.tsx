import Link from "next/link";
import { getOrder } from "@/lib/api/orders";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let order: any = null;

  try {
    order = await getOrder(id);
  } catch (e) {
    console.error("Failed to load order:", e);
  }

  if (!order) {
    return (
      <div className="page-section">
        <div className="container empty-state">
          <div className="icon">😕</div>
          <h3>Order Not Found</h3>
          <p>This order may not exist or you may not have access.</p>
          <Link href="/account" className="btn btn-primary">Go to Account →</Link>
        </div>
      </div>
    );
  }

  const formatPrice = (amount: number) => `$${(amount / 100).toFixed(2)}`;

  return (
    <div className="page-section">
      <div className="container" style={{ maxWidth: "800px" }}>
        <Link href="/account" style={{ color: "var(--text-muted)", fontSize: "0.875rem", display: "inline-block", marginBottom: "24px" }}>
          ← Back to Account
        </Link>

        {/* Order Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>
              Order #{order.display_id || order.id.slice(-8)}
            </h1>
            <span className="badge badge-success">{order.status || "Confirmed"}</span>
          </div>
          <p style={{ color: "var(--text-secondary)" }}>
            Placed on {new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>

        {/* Order Items */}
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "16px" }}>Items</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {order.items?.map((item: any) => (
              <div
                key={item.id}
                className="card"
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr auto",
                  gap: "16px",
                  alignItems: "center",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-secondary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    overflow: "hidden",
                  }}
                >
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : "📦"}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{item.product?.title || item.title}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {item.variant?.title || "Default"} × {item.quantity}
                  </div>
                </div>
                <div className="price">{formatPrice(item.total || item.unit_price * item.quantity)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        {order.shipping_address && (
          <div
            style={{
              padding: "24px",
              background: "var(--bg-glass)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              marginBottom: "24px",
            }}
          >
            <h3 style={{ fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", marginBottom: "12px" }}>
              Shipping Address
            </h3>
            <p>
              {order.shipping_address.first_name} {order.shipping_address.last_name}<br />
              {order.shipping_address.address_1}<br />
              {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}<br />
              {order.shipping_address.country_code?.toUpperCase()}
            </p>
          </div>
        )}

        {/* Order Summary */}
        <div
          style={{
            padding: "24px",
            background: "var(--bg-glass)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <h3 style={{ fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", marginBottom: "16px" }}>
            Summary
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
              <span>{order.subtotal ? formatPrice(order.subtotal) : "—"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Shipping</span>
              <span>{order.shipping_total ? formatPrice(order.shipping_total) : "Free"}</span>
            </div>
            <div className="divider" style={{ margin: "8px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: 700 }}>
              <span>Total</span>
              <span className="price">{order.total ? formatPrice(order.total) : "—"}</span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Link href="/products" className="btn btn-primary">Continue Shopping →</Link>
        </div>
      </div>
    </div>
  );
}
