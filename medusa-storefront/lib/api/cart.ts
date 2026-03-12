"use server";

import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";
import {
  getAuthHeaders,
  getCartId,
  setCartId,
  removeCartId,
} from "@/lib/cookies";
import { getRegionByCountry } from "./regions";

export async function createCart(
  regionId: string
): Promise<HttpTypes.StoreCart> {
  const headers = await getAuthHeaders();
  const { cart } = await sdk.store.cart.create(
    { region_id: regionId },
    {},
    headers
  );
  await setCartId(cart.id);
  return cart;
}

export async function retrieveCart(
  cartId?: string
): Promise<HttpTypes.StoreCart | null> {
  const id = cartId || (await getCartId());
  if (!id) return null;

  const headers = await getAuthHeaders();

  return sdk.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
      method: "GET",
      query: {
        fields:
          "*items,*region,*items.product,*items.variant,*items.thumbnail,*items.metadata,+items.total,*promotions,+shipping_methods.name",
      },
      headers,
    })
    .then(({ cart }) => cart)
    .catch(() => null);
}

export async function getOrCreateCart(
  countryCode: string = "us"
): Promise<HttpTypes.StoreCart> {
  const cart = await retrieveCart();
  if (cart) return cart;

  const region = await getRegionByCountry(countryCode);
  if (!region) throw new Error("No region found for country: " + countryCode);

  return createCart(region.id);
}

export async function updateCart(
  data: HttpTypes.StoreUpdateCart
): Promise<HttpTypes.StoreCart> {
  const cartId = await getCartId();
  if (!cartId) throw new Error("No cart found");

  const headers = await getAuthHeaders();
  const { cart } = await sdk.store.cart.update(cartId, data, {}, headers);
  return cart;
}

export async function addToCart(
  variantId: string,
  quantity: number,
  countryCode: string = "us"
): Promise<void> {
  const cart = await getOrCreateCart(countryCode);
  const headers = await getAuthHeaders();

  await sdk.store.cart.createLineItem(
    cart.id,
    { variant_id: variantId, quantity },
    {},
    headers
  );
}

export async function updateLineItem(
  lineId: string,
  quantity: number
): Promise<void> {
  const cartId = await getCartId();
  if (!cartId) throw new Error("No cart found");
  const headers = await getAuthHeaders();

  await sdk.store.cart.updateLineItem(cartId, lineId, { quantity }, {}, headers);
}

export async function deleteLineItem(lineId: string): Promise<void> {
  const cartId = await getCartId();
  if (!cartId) throw new Error("No cart found");
  const headers = await getAuthHeaders();

  await sdk.store.cart.deleteLineItem(cartId, lineId, {}, headers);
}

export async function addShippingMethod(
  shippingOptionId: string
): Promise<void> {
  const cartId = await getCartId();
  if (!cartId) throw new Error("No cart found");
  const headers = await getAuthHeaders();

  await sdk.store.cart.addShippingMethod(
    cartId,
    { option_id: shippingOptionId },
    {},
    headers
  );
}

export async function applyPromoCode(code: string): Promise<void> {
  const cartId = await getCartId();
  if (!cartId) throw new Error("No cart found");
  const headers = await getAuthHeaders();

  await sdk.store.cart.update(cartId, { promo_codes: [code] }, {}, headers);
}

export async function completeCart(): Promise<HttpTypes.StoreCompleteCartResponse> {
  const cartId = await getCartId();
  if (!cartId) throw new Error("No cart found");
  const headers = await getAuthHeaders();

  const result = await sdk.store.cart.complete(cartId, {}, headers);

  if (result?.type === "order") {
    await removeCartId();
  }

  return result;
}
