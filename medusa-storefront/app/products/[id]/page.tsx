import { getProduct } from "@/lib/api/products";
import { AddToCartButton } from "./AddToCartButton";
import Link from "next/link";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let product: any = null;

  try {
    product = await getProduct(id);
  } catch (e) {
    console.error("Failed to load product:", e);
  }

  if (!product) {
    return (
      <div className="page-section">
        <div className="container empty-state">
          <div className="icon">😕</div>
          <h3>Product Not Found</h3>
          <p>This product may have been removed or doesn't exist.</p>
          <Link href="/products" className="btn btn-primary">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const variant = product.variants?.[0];
  const price = variant?.calculated_price?.calculated_amount
    ? `$${(variant.calculated_price.calculated_amount / 100).toFixed(2)}`
    : "Price unavailable";

  return (
    <div className="page-section">
      <div className="container">
        <Link
          href="/products"
          style={{
            color: "var(--text-muted)",
            fontSize: "0.875rem",
            display: "inline-block",
            marginBottom: "24px",
          }}
        >
          ← Back to Products
        </Link>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "start",
          }}
        >
          {/* Product Image */}
          <div
            style={{
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              background: "linear-gradient(135deg, var(--bg-secondary), var(--bg-card))",
              border: "1px solid var(--border-color)",
              aspectRatio: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "6rem",
            }}
          >
            {product.thumbnail ? (
              <img
                src={product.thumbnail}
                alt={product.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              "📦"
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.collection && (
              <span className="badge badge-accent" style={{ marginBottom: "12px" }}>
                {product.collection.title}
              </span>
            )}

            <h1
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                lineHeight: 1.2,
                marginBottom: "16px",
              }}
            >
              {product.title}
            </h1>

            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: 700,
                color: "var(--accent-secondary)",
                marginBottom: "24px",
              }}
            >
              {price}
            </div>

            {product.description && (
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  marginBottom: "32px",
                }}
              >
                {product.description}
              </p>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 1 && (
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--text-secondary)",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Variants
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {product.variants.map((v: any, i: number) => (
                    <span
                      key={v.id}
                      className={`btn btn-sm ${i === 0 ? "btn-primary" : "btn-secondary"}`}
                    >
                      {v.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="divider" />

            {/* Add to Cart */}
            <AddToCartButton
              variantId={variant?.id}
              productTitle={product.title}
            />

            {/* Product Details */}
            <div
              style={{
                marginTop: "32px",
                padding: "24px",
                background: "var(--bg-glass)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
              }}
            >
              <h3
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--text-secondary)",
                  marginBottom: "16px",
                }}
              >
                Product Details
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                {product.material && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Material</span>
                    <span>{product.material}</span>
                  </div>
                )}
                {product.weight && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Weight</span>
                    <span>{product.weight}g</span>
                  </div>
                )}
                {product.type && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Type</span>
                    <span>{product.type.value}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Availability</span>
                  <span className="badge badge-success">In Stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
