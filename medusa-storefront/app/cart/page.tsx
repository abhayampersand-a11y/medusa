import Link from "next/link";
import { retrieveCart } from "@/lib/api/cart";
import { CartActions } from "./CartActions";

export const metadata = {
  title: "Cart — MedusaStore",
  description: "Review your shopping cart",
};

export default async function CartPage() {
  let cart: any = null;

  try {
    cart = await retrieveCart();
  } catch (e) {
    console.error("Failed to load cart:", e);
  }

  const items = cart?.items || [];
  const hasItems = items.length > 0;

  const formatPrice = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  return (
    <div className="page-section">
      <div className="container" style={{ maxWidth: "900px" }}>
        <div className="section-header">
          <h2>Shopping Cart</h2>
          <p>{hasItems ? `${items.length} item(s) in your cart` : "Your cart is empty"}</p>
        </div>

        {hasItems ? (
          <div>
            {/* Cart Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="card"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr auto auto",
                    gap: "20px",
                    alignItems: "center",
                    padding: "20px",
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      background: "var(--bg-secondary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                    }}
                  >
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.product?.title || "Product"}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      "📦"
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                      {item.product?.title || item.title}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {item.variant?.title || "Default"}
                    </div>
                  </div>

                  {/* Quantity */}
                  <CartActions lineId={item.id} quantity={item.quantity} />

                  {/* Price */}
                  <div style={{ textAlign: "right" }}>
                    <div className="price" style={{ fontSize: "1.1rem" }}>
                      {formatPrice(item.total || item.unit_price * item.quantity)}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {formatPrice(item.unit_price)} ea
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="divider" />

            {/* Cart Summary */}
            <div
              style={{
                background: "var(--bg-glass)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "24px",
              }}
            >
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "16px" }}>
                Order Summary
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                  <span>{cart.subtotal ? formatPrice(cart.subtotal) : "—"}</span>
                </div>
                {cart.discount_total > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--success)" }}>Discount</span>
                    <span style={{ color: "var(--success)" }}>-{formatPrice(cart.discount_total)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Shipping</span>
                  <span>{cart.shipping_total ? formatPrice(cart.shipping_total) : "Calculated at checkout"}</span>
                </div>
                <div className="divider" style={{ margin: "8px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: 700 }}>
                  <span>Total</span>
                  <span className="price">{cart.total ? formatPrice(cart.total) : "—"}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="btn btn-primary btn-lg btn-block"
                style={{ marginTop: "24px" }}
              >
                Proceed to Checkout →
              </Link>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="icon">🛒</div>
            <h3>Your Cart is Empty</h3>
            <p>Add some products to your cart to get started.</p>
            <Link href="/products" className="btn btn-primary">
              Browse Products →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
