"use server";

import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";
import { getAuthHeaders } from "@/lib/cookies";

export async function listProducts(
  params?: HttpTypes.FindParams & HttpTypes.StoreProductParams & { region_id?: string }
): Promise<{ products: HttpTypes.StoreProduct[]; count: number }> {
  const headers = await getAuthHeaders();

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit: 20,
          offset: 0,
          fields:
            "*variants.calculated_price,+variants.inventory_quantity",
          ...params,
        },
        headers,
      }
    )
    .then(({ products, count }) => ({ products, count }));
}

export async function getProduct(
  id: string,
  regionId?: string
): Promise<HttpTypes.StoreProduct> {
  const headers = await getAuthHeaders();

  return sdk.client
    .fetch<{ product: HttpTypes.StoreProduct }>(`/store/products/${id}`, {
      method: "GET",
      query: {
        fields:
          "*variants.calculated_price,+variants.inventory_quantity",
        ...(regionId ? { region_id: regionId } : {}),
      },
      headers,
    })
    .then(({ product }) => product);
}
