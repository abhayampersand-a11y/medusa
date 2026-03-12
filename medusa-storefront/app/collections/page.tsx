import Link from "next/link";
import { listCollections } from "@/lib/api/collections";

export const metadata = {
  title: "Collections — MedusaStore",
  description: "Browse our curated product collections",
};

export default async function CollectionsPage() {
  let collections: any[] = [];

  try {
    const result = await listCollections();
    collections = result.collections;
  } catch (e) {
    console.error("Failed to load collections:", e);
  }

  return (
    <div className="page-section">
      <div className="container">
        <div className="section-header">
          <h2>Collections</h2>
          <p>Browse our curated product collections</p>
        </div>

        {collections.length > 0 ? (
          <div className="grid-products">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/products?collection_id=${collection.id}`}
                className="card"
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    height: "200px",
                    background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3rem",
                  }}
                >
                  🏷️
                </div>
                <div style={{ padding: "20px" }}>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "4px" }}>
                    {collection.title}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                    {collection.products?.length || 0} products
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="icon">🏷️</div>
            <h3>No Collections Yet</h3>
            <p>Collections will appear here once created in the admin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
