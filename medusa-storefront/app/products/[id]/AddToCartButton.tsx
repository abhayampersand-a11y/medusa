"use client";

import { useState } from "react";
import { addToCart } from "@/lib/api/cart";

export function AddToCartButton({
  variantId,
  productTitle,
}: {
  variantId?: string;
  productTitle: string;
}) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    if (!variantId) return;
    setLoading(true);
    try {
      await addToCart(variantId, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <label
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--text-secondary)",
          }}
        >
          Qty
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            style={{ borderRadius: "var(--radius-sm) 0 0 var(--radius-sm)" }}
          >
            −
          </button>
          <span
            style={{
              padding: "8px 20px",
              background: "var(--bg-glass)",
              border: "1px solid var(--border-color)",
              borderLeft: "none",
              borderRight: "none",
              fontWeight: 600,
              minWidth: "48px",
              textAlign: "center",
            }}
          >
            {quantity}
          </span>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setQuantity(quantity + 1)}
            style={{ borderRadius: "0 var(--radius-sm) var(--radius-sm) 0" }}
          >
            +
          </button>
        </div>
      </div>

      <button
        className="btn btn-primary btn-lg btn-block"
        onClick={handleAddToCart}
        disabled={loading || !variantId}
        style={{
          opacity: loading || !variantId ? 0.6 : 1,
          cursor: loading || !variantId ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Adding..." : added ? "✓ Added to Cart!" : "Add to Cart 🛒"}
      </button>

      {added && (
        <div
          className="notification success"
          style={{ bottom: "24px", right: "24px" }}
        >
          ✓ <strong>{productTitle}</strong> added to your cart!
        </div>
      )}
    </div>
  );
}
