"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerCustomer } from "@/lib/api/customer";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerCustomer(form.email, form.password, form.first_name, form.last_name);
      router.push("/account");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: "12px 16px",
    background: "var(--bg-glass)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-primary)",
    fontSize: "0.95rem",
    width: "100%",
    outline: "none",
  };

  const labelStyle = {
    fontSize: "0.8rem",
    fontWeight: 600 as const,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    color: "var(--text-secondary)",
    display: "block",
    marginBottom: "6px",
  };

  return (
    <div className="page-section">
      <div className="container" style={{ maxWidth: "440px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>Create Account</h1>
          <p style={{ color: "var(--text-secondary)" }}>Join MedusaStore today</p>
        </div>

        <div
          style={{
            padding: "32px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          {error && (
            <div style={{ padding: "12px", background: "rgba(225, 112, 85, 0.1)", border: "1px solid var(--danger)", borderRadius: "var(--radius-sm)", color: "var(--danger)", marginBottom: "20px", fontSize: "0.875rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} style={inputStyle} placeholder="John" />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input required value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} style={inputStyle} placeholder="Doe" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} placeholder="your@email.com" />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={inputStyle} placeholder="Min. 8 characters" />
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading} style={{ marginTop: "8px" }}>
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
          </form>

          <div className="divider" />

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link href="/account/login" style={{ color: "var(--accent-secondary)", fontWeight: 600 }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
