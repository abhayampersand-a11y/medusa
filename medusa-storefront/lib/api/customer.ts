"use server";

import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";
import {
  getAuthHeaders,
  setAuthToken,
  removeAuthToken,
  removeCartId,
  getCartId,
} from "@/lib/cookies";

export async function registerCustomer(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<HttpTypes.StoreCustomer> {
  // Step 1: Register auth identity
  const token = await sdk.auth.register("customer", "emailpass", {
    email,
    password,
  });

  await setAuthToken(token as string);

  const headers = await getAuthHeaders();

  // Step 2: Create customer profile
  const { customer } = await sdk.store.customer.create(
    {
      email,
      first_name: firstName,
      last_name: lastName,
    },
    {},
    headers
  );

  // Step 3: Login to get proper token
  const loginToken = await sdk.auth.login("customer", "emailpass", {
    email,
    password,
  });

  await setAuthToken(loginToken as string);

  // Step 4: Transfer any existing cart
  await transferCart();

  return customer;
}

export async function loginCustomer(
  email: string,
  password: string
): Promise<void> {
  const token = await sdk.auth.login("customer", "emailpass", {
    email,
    password,
  });

  await setAuthToken(token as string);
  await transferCart();
}

export async function logoutCustomer(): Promise<void> {
  await sdk.auth.logout();
  await removeAuthToken();
  await removeCartId();
}

export async function getCustomer(): Promise<HttpTypes.StoreCustomer | null> {
  const headers = await getAuthHeaders();
  if (!headers.Authorization) return null;

  return sdk.client
    .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
      method: "GET",
      query: { fields: "*orders" },
      headers,
    })
    .then(({ customer }) => customer)
    .catch(() => null);
}

export async function updateCustomer(
  data: HttpTypes.StoreUpdateCustomer
): Promise<HttpTypes.StoreCustomer> {
  const headers = await getAuthHeaders();
  const { customer } = await sdk.store.customer.update(data, {}, headers);
  return customer;
}

async function transferCart(): Promise<void> {
  const cartId = await getCartId();
  if (!cartId) return;

  const headers = await getAuthHeaders();
  try {
    await sdk.store.cart.transferCart(cartId, {}, headers);
  } catch {
    // Cart transfer may fail if cart doesn't exist, that's okay
  }
}
