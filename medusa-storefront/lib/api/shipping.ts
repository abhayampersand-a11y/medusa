"use server";

import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";
import { getAuthHeaders } from "@/lib/cookies";

export async function listShippingOptions(
  cartId: string
): Promise<HttpTypes.StoreCartShippingOption[] | null> {
  const headers = await getAuthHeaders();

  return sdk.client
    .fetch<HttpTypes.StoreShippingOptionListResponse>(
      `/store/shipping-options`,
      {
        method: "GET",
        query: { cart_id: cartId },
        headers,
      }
    )
    .then(({ shipping_options }) => shipping_options)
    .catch(() => null);
}

export async function calculateShippingPrice(
  optionId: string,
  cartId: string,
  data?: Record<string, unknown>
): Promise<HttpTypes.StoreCartShippingOption | null> {
  const headers = await getAuthHeaders();

  const body: Record<string, unknown> = { cart_id: cartId };
  if (data) body.data = data;

  return sdk.client
    .fetch<{ shipping_option: HttpTypes.StoreCartShippingOption }>(
      `/store/shipping-options/${optionId}/calculate`,
      {
        method: "POST",
        body,
        headers,
      }
    )
    .then(({ shipping_option }) => shipping_option)
    .catch(() => null);
}
