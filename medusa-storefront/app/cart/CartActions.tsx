"use client";

import { useState } from "react";
import { updateLineItem, deleteLineItem } from "@/lib/api/cart";
import { useRouter } from "next/navigation";

export function CartActions({
  lineId,
  quantity,
}: {
  lineId: string;
  quantity: number;
}) {
  const [loading, setLoading] = useState(false);
  const [currentQty, setCurrentQty] = useState(quantity);
  const router = useRouter();

  const handleUpdate = async (newQty: number) => {
    if (newQty < 1) return;
    setLoading(true);
    try {
      setCurrentQty(newQty);
      await updateLineItem(lineId, newQty);
      router.refresh();
    } catch (err) {
      console.error("Failed to update:", err);
      setCurrentQty(quantity);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteLineItem(lineId);
      router.refresh();
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <button
        className="btn btn-sm btn-secondary"
        onClick={() => handleUpdate(currentQty - 1)}
        disabled={loading || currentQty <= 1}
        style={{ minWidth: "32px", padding: "6px" }}
      >
        −
      </button>
      <span style={{ fontWeight: 600, minWidth: "24px", textAlign: "center" }}>
        {loading ? "…" : currentQty}
      </span>
      <button
        className="btn btn-sm btn-secondary"
        onClick={() => handleUpdate(currentQty + 1)}
        disabled={loading}
        style={{ minWidth: "32px", padding: "6px" }}
      >
        +
      </button>
      <button
        className="btn btn-sm btn-danger"
        onClick={handleDelete}
        disabled={loading}
        style={{ marginLeft: "8px", padding: "6px 10px" }}
      >
        🗑
      </button>
    </div>
  );
}
