import Link from "next/link";
import { listProducts } from "@/lib/api/products";
import { listCategories } from "@/lib/api/categories";

export const metadata = {
  title: "Products — MedusaStore",
  description: "Browse our complete catalog of premium products",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  let products: any[] = [];
  let categories: any[] = [];
  let totalCount = 0;
  const page = parseInt(params?.page || "1");
  const limit = 12;

  try {
    const query: any = { limit, offset: (page - 1) * limit };
    if (params?.category) {
      query.category_id = params.category;
    }
    const result = await listProducts(query);
    products = result.products;
    totalCount = result.count;
  } catch (e) {
    console.error("Failed to load products:", e);
  }

  try {
    categories = await listCategories();
  } catch (e) {
    console.error("Failed to load categories:", e);
  }

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="page-section">
      <div className="container">
        <div className="section-header">
          <h2>All Products</h2>
          <p>Showing {products.length} of {totalCount} products</p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "32px" }}>
            <Link
              href="/products"
              className={`btn btn-sm ${!params?.category ? "btn-primary" : "btn-secondary"}`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className={`btn btn-sm ${params?.category === cat.id ? "btn-primary" : "btn-secondary"}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid-products">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="card"
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    height: "240px",
                    background: "linear-gradient(135deg, var(--bg-secondary), var(--bg-card))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3rem",
                    overflow: "hidden",
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
                <div style={{ padding: "16px" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                    {product.collection?.title || "Product"}
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: "6px" }}>{product.title}</div>
                  <div className="price">
                    {product.variants?.[0]?.calculated_price?.calculated_amount
                      ? `$${(product.variants[0].calculated_price.calculated_amount / 100).toFixed(2)}`
                      : "View Price"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>No Products Found</h3>
            <p>Try a different category or check back later.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "40px" }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <Link
                key={i + 1}
                href={`/products?page=${i + 1}${params?.category ? `&category=${params.category}` : ""}`}
                className={`btn btn-sm ${page === i + 1 ? "btn-primary" : "btn-secondary"}`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
