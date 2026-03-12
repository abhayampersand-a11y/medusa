"use server";

import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";
import { getAuthHeaders } from "@/lib/cookies";

export async function listPaymentProviders(
  regionId: string
): Promise<HttpTypes.StorePaymentProvider[] | null> {
  const headers = await getAuthHeaders();

  return sdk.client
    .fetch<HttpTypes.StorePaymentProviderListResponse>(
      `/store/payment-providers`,
      {
        method: "GET",
        query: { region_id: regionId },
        headers,
      }
    )
    .then(({ payment_providers }) =>
      payment_providers.sort((a, b) => (a.id > b.id ? 1 : -1))
    )
    .catch(() => null);
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: HttpTypes.StoreInitializePaymentSession
): Promise<HttpTypes.StorePaymentCollectionResponse | null> {
  const headers = await getAuthHeaders();

  return sdk.store.payment
    .initiatePaymentSession(cart, data, {}, headers)
    .catch((err) => {
      console.error("Payment session error:", err);
      return null;
    });
}
