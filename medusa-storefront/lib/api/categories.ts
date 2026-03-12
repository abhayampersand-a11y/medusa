"use server";

import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";

export async function listCategories(
  query?: Record<string, unknown>
): Promise<HttpTypes.StoreProductCategory[]> {
  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields: "*category_children,*products",
          limit: 100,
          ...query,
        },
      }
    )
    .then(({ product_categories }) => product_categories);
}

export async function getCategory(
  id: string
): Promise<HttpTypes.StoreProductCategory> {
  return sdk.client
    .fetch<{ product_category: HttpTypes.StoreProductCategory }>(
      `/store/product-categories/${id}`,
      {
        query: {
          fields: "*category_children,*products",
        },
      }
    )
    .then(({ product_category }) => product_category);
}
