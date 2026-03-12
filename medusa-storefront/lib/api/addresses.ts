"use server";

import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";
import { getAuthHeaders } from "@/lib/cookies";

export async function listAddresses(): Promise<HttpTypes.StoreCustomerAddress[]> {
  const headers = await getAuthHeaders();

  return sdk.client
    .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
      method: "GET",
      query: { fields: "+addresses" },
      headers,
    })
    .then(({ customer }) => customer.addresses || [])
    .catch(() => []);
}

export async function addAddress(
  address: HttpTypes.StoreCreateCustomerAddress
): Promise<void> {
  const headers = await getAuthHeaders();
  await sdk.store.customer.createAddress(address, {}, headers);
}

export async function updateAddress(
  addressId: string,
  data: HttpTypes.StoreUpdateCustomerAddress
): Promise<void> {
  const headers = await getAuthHeaders();
  await sdk.store.customer.updateAddress(addressId, data, {}, headers);
}

export async function deleteAddress(addressId: string): Promise<void> {
  const headers = await getAuthHeaders();
  await sdk.store.customer.deleteAddress(addressId, headers);
}
