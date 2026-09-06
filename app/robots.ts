import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  // No approved public content exists yet. Do not advertise scaffold URLs.
  return { rules: { userAgent: "*", disallow: "/" } };
}
