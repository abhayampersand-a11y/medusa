"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCart, completeCart, addShippingMethod } from "@/lib/api/cart";
import { listShippingOptions } from "@/lib/api/shipping";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<"address" | "shipping" | "review">("address");
  const [loading, setLoading] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    address_1: "",
    city: "",
    province: "",
    postal_code: "",
    country_code: "us",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cart = await updateCart({
        email: form.email,
        shipping_address: {
          first_name: form.first_name,
          last_name: form.last_name,
          address_1: form.address_1,
          city: form.city,
          province: form.province,
          postal_code: form.postal_code,
          country_code: form.country_code,
          phone: form.phone,
        },
        billing_address: {
          first_name: form.first_name,
          last_name: form.last_name,
          address_1: form.address_1,
          city: form.city,
          province: form.province,
          postal_code: form.postal_code,
          country_code: form.country_code,
          phone: form.phone,
        },
      });

      // Fetch shipping options
      if (cart?.id) {
        const options = await listShippingOptions(cart.id);
        setShippingOptions(options || []);
      }
      setStep("shipping");
    } catch (err: any) {
      setError(err.message || "Failed to update address");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectShipping = async (optionId: string) => {
    setLoading(true);
    setError("");
    try {
      await addShippingMethod(optionId);
      setStep("review");
    } catch (err: any) {
      setError(err.message || "Failed to set shipping");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await completeCart();
      if (result?.type === "order") {
        router.push(`/orders/${result.order.id}`);
      } else {
        setError("Order could not be completed. Please check payment details.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to place order");
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
      <div className="container" style={{ maxWidth: "700px" }}>
        <Link href="/cart" style={{ color: "var(--text-muted)", fontSize: "0.875rem", display: "inline-block", marginBottom: "24px" }}>
          ← Back to Cart
        </Link>

        <div className="section-header">
          <h2>Checkout</h2>
          <p>Step {step === "address" ? "1" : step === "shipping" ? "2" : "3"} of 3 — {step === "address" ? "Shipping Address" : step === "shipping" ? "Shipping Method" : "Review & Pay"}</p>
        </div>

        {/* Progress Bar */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "40px" }}>
          {["address", "shipping", "review"].map((s, i) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: "4px",
                borderRadius: "2px",
                background: i <= ["address", "shipping", "review"].indexOf(step) ? "var(--accent-primary)" : "var(--border-color)",
                transition: "background 0.3s ease",
              }}
            />
          ))}
        </div>

        {error && (
          <div style={{ padding: "12px 16px", background: "rgba(225, 112, 85, 0.1)", border: "1px solid var(--danger)", borderRadius: "var(--radius-sm)", color: "var(--danger)", marginBottom: "24px", fontSize: "0.875rem" }}>
            {error}
          </div>
        )}

        {/* STEP 1: Address */}
        {step === "address" && (
          <form onSubmit={handleAddressSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input name="email" type="email" required value={form.email} onChange={handleInputChange} style={inputStyle} placeholder="your@email.com" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input name="first_name" required value={form.first_name} onChange={handleInputChange} style={inputStyle} placeholder="John" />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input name="last_name" required value={form.last_name} onChange={handleInputChange} style={inputStyle} placeholder="Doe" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Address</label>
              <input name="address_1" required value={form.address_1} onChange={handleInputChange} style={inputStyle} placeholder="123 Main St" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle}>City</label>
                <input name="city" required value={form.city} onChange={handleInputChange} style={inputStyle} placeholder="New York" />
              </div>
              <div>
                <label style={labelStyle}>Province / State</label>
                <input name="province" value={form.province} onChange={handleInputChange} style={inputStyle} placeholder="NY" />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Postal Code</label>
                <input name="postal_code" required value={form.postal_code} onChange={handleInputChange} style={inputStyle} placeholder="10001" />
              </div>
              <div>
                <label style={labelStyle}>Country Code</label>
                <input name="country_code" required value={form.country_code} onChange={handleInputChange} style={inputStyle} placeholder="us" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input name="phone" value={form.phone} onChange={handleInputChange} style={inputStyle} placeholder="+1 234 567 8900" />
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading} style={{ marginTop: "16px" }}>
              {loading ? "Saving..." : "Continue to Shipping →"}
            </button>
          </form>
        )}

        {/* STEP 2: Shipping */}
        {step === "shipping" && (
          <div>
            {shippingOptions.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {shippingOptions.map((option: any) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelectShipping(option.id)}
                    disabled={loading}
                    className="card"
                    style={{
                      padding: "20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      background: "var(--bg-card)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: "4px" }}>{option.name}</div>
                      <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                        Standard delivery
                      </div>
                    </div>
                    <div className="price">
                      {option.amount ? `$${(option.amount / 100).toFixed(2)}` : "Free"}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No Shipping Options</h3>
                <p>No shipping options are available for your address. Please check your address or contact support.</p>
              </div>
            )}
            <button onClick={() => setStep("address")} className="btn btn-secondary btn-block" style={{ marginTop: "16px" }}>
              ← Back to Address
            </button>
          </div>
        )}

        {/* STEP 3: Review */}
        {step === "review" && (
          <div>
            <div style={{ padding: "24px", background: "var(--bg-glass)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "16px" }}>Shipping To</h3>
              <p style={{ color: "var(--text-secondary)" }}>
                {form.first_name} {form.last_name}<br />
                {form.address_1}<br />
                {form.city}, {form.province} {form.postal_code}<br />
                {form.country_code.toUpperCase()}
              </p>
            </div>

            <button onClick={handlePlaceOrder} className="btn btn-primary btn-lg btn-block" disabled={loading}>
              {loading ? "Placing Order..." : "Place Order 🎉"}
            </button>

            <button onClick={() => setStep("shipping")} className="btn btn-secondary btn-block" style={{ marginTop: "12px" }}>
              ← Back to Shipping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
