"use server";

import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";

export async function listCollections(
  query?: Record<string, string>
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> {
  return sdk.client
    .fetch<{ collections: HttpTypes.StoreCollection[]; count: number }>(
      "/store/collections",
      {
        query: {
          limit: "100",
          offset: "0",
          ...query,
        },
      }
    )
    .then(({ collections }) => ({ collections, count: collections.length }));
}

export async function getCollection(
  id: string
): Promise<HttpTypes.StoreCollection> {
  return sdk.client
    .fetch<{ collection: HttpTypes.StoreCollection }>(
      `/store/collections/${id}`,
      {
        query: { fields: "*products" },
      }
    )
    .then(({ collection }) => collection);
}
