"use server";

import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";

export async function listRegions(): Promise<HttpTypes.StoreRegion[]> {
  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
    })
    .then(({ regions }) => regions);
}

export async function getRegion(
  id: string
): Promise<HttpTypes.StoreRegion> {
  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
    })
    .then(({ region }) => region);
}

export async function getRegionByCountry(
  countryCode: string
): Promise<HttpTypes.StoreRegion | null> {
  const regions = await listRegions();
  for (const region of regions) {
    const match = region.countries?.find(
      (c) => c.iso_2 === countryCode.toLowerCase()
    );
    if (match) return region;
  }
  return regions[0] || null;
}
