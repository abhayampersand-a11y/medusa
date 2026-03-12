import type { Metadata } from "next";
import "./globals.css";
import styles from "./layout.module.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Medusa Store — Premium E-Commerce",
  description:
    "Discover premium products at Medusa Store. Shop the latest collections with fast shipping and secure checkout.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* NAVBAR */}
        <nav className={styles.navbar}>
          <div className={styles.navbarInner}>
            <Link href="/" className={styles.navbarLogo}>
              MedusaStore
            </Link>

            <div className={styles.navbarLinks}>
              <Link href="/">Home</Link>
              <Link href="/products">Products</Link>
              <Link href="/collections">Collections</Link>
              <Link href="/account">Account</Link>
            </div>

            <div className={styles.navbarActions}>
              <Link href="/cart" className={styles.cartIcon}>
                🛒
              </Link>
              <Link href="/account/login" className="btn btn-sm btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main style={{ minHeight: "calc(100vh - 64px - 300px)" }}>
          {children}
        </main>

        {/* FOOTER */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerGrid}>
              <div className={styles.footerBrand}>
                <h3>MedusaStore</h3>
                <p>
                  Premium e-commerce powered by Medusa. Discover curated
                  collections, fast checkout, and secure payments.
                </p>
              </div>
              <div className={styles.footerSection}>
                <h4>Shop</h4>
                <ul>
                  <li>
                    <Link href="/products">All Products</Link>
                  </li>
                  <li>
                    <Link href="/collections">Collections</Link>
                  </li>
                </ul>
              </div>
              <div className={styles.footerSection}>
                <h4>Account</h4>
                <ul>
                  <li>
                    <Link href="/account">My Account</Link>
                  </li>
                  <li>
                    <Link href="/cart">Cart</Link>
                  </li>
                </ul>
              </div>
              <div className={styles.footerSection}>
                <h4>Help</h4>
                <ul>
                  <li>
                    <Link href="#">FAQ</Link>
                  </li>
                  <li>
                    <Link href="#">Contact</Link>
                  </li>
                  <li>
                    <Link href="#">Shipping</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.footerBottom}>
              © {new Date().getFullYear()} MedusaStore. All rights reserved. Powered by Medusa.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
