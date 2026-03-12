"use server";

import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";
import { getAuthHeaders } from "@/lib/cookies";

export async function listOrders(
  limit: number = 10,
  offset: number = 0
): Promise<HttpTypes.StoreOrder[]> {
  const headers = await getAuthHeaders();

  return sdk.client
    .fetch<HttpTypes.StoreOrderListResponse>(`/store/orders`, {
      method: "GET",
      query: {
        limit,
        offset,
        order: "-created_at",
        fields: "*items,+items.metadata,*items.variant,*items.product",
      },
      headers,
    })
    .then(({ orders }) => orders)
    .catch(() => []);
}

export async function getOrder(id: string): Promise<HttpTypes.StoreOrder> {
  const headers = await getAuthHeaders();

  return sdk.client
    .fetch<HttpTypes.StoreOrderResponse>(`/store/orders/${id}`, {
      method: "GET",
      query: {
        fields:
          "*payment_collections.payments,*items,*items.metadata,*items.variant,*items.product",
      },
      headers,
    })
    .then(({ order }) => order);
}
