"use server";

import { cookies } from "next/headers";

const AUTH_TOKEN_KEY = "_medusa_jwt";
const CART_ID_KEY = "_medusa_cart_id";
const CACHE_REVALIDATION_INTERVAL = 0; // 0 = no cache

// ----- Auth Token -----
export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN_KEY)?.value;
}

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_TOKEN_KEY, token, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function removeAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_TOKEN_KEY);
}

// ----- Cart ID -----
export async function getCartId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_ID_KEY)?.value;
}

export async function setCartId(cartId: string) {
  const cookieStore = await cookies();
  cookieStore.set(CART_ID_KEY, cartId, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function removeCartId() {
  const cookieStore = await cookies();
  cookieStore.delete(CART_ID_KEY);
}

// ----- Auth Headers -----
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

// ----- Cache Options -----
export async function getCacheOptions(tag: string) {
  return {
    revalidate: CACHE_REVALIDATION_INTERVAL,
    tags: [tag],
  };
}
