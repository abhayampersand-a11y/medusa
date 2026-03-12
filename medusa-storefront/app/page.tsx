import Link from "next/link";
import styles from "./page.module.css";
import { listProducts } from "@/lib/api/products";
import { listCollections } from "@/lib/api/collections";
import { HttpTypes } from "@medusajs/types";

export default async function HomePage() {
  let products: HttpTypes.StoreProduct[] = [];
  let collections: HttpTypes.StoreCollection[] = [];

  try {
    const result = await listProducts({ limit: 8 });
    products = result.products;
  } catch (e) {
    console.error("Failed to load products:", e);
  }

  try {
    const result = await listCollections();
    collections = result.collections;
  } catch (e) {
    console.error("Failed to load collections:", e);
  }

  return (
    <>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroTag}>✨ New Arrivals Available</span>
          <h1 className={styles.heroTitle}>
            Discover <span className={styles.heroGradient}>Premium</span>{" "}
            Products
          </h1>
          <p className={styles.heroDesc}>
            Explore our curated collection of premium products. Fast shipping,
            secure payments, and exceptional quality — all powered by Medusa.
          </p>
          <div className={styles.heroActions}>
            <Link href="/products" className="btn btn-primary btn-lg">
              Shop Now →
            </Link>
            <Link href="/collections" className="btn btn-secondary btn-lg">
              View Collections
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className={styles.productsSection}>
        <div className={styles.sectionInner}>
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Our most popular items, handpicked for you</p>
          </div>

          {products.length > 0 ? (
            <div className="grid-products">
              {products.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className={styles.productCard}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.productImage}>
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                      />
                    ) : (
                      "📦"
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    {product.collection && (
                      <div className={styles.productCategory}>
                        {product.collection.title}
                      </div>
                    )}
                    <div className={styles.productTitle}>{product.title}</div>
                    <div className={styles.productPrice}>
                      {product.variants?.[0]?.calculated_price
                        ?.calculated_amount
                        ? `$${(
                          product.variants[0].calculated_price
                            .calculated_amount / 100
                        ).toFixed(2)}`
                        : "View Price"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="icon">📦</div>
              <h3>No Products Yet</h3>
              <p>
                Add products in your Medusa admin dashboard to see them here.
              </p>
            </div>
          )}

          {products.length > 0 && (
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <Link href="/products" className="btn btn-secondary">
                View All Products →
              </Link>
            </div>
          )}

          {/* STATS */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{products.length}+</div>
              <div className={styles.statLabel}>Products</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{collections.length}+</div>
              <div className={styles.statLabel}>Collections</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>Support</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
