import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getActiveBanners = unstable_cache(
  async () =>
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    }),
  ["active-banners"],
  { tags: ["banners"], revalidate: 3600 }
);

export type ActiveBanner = Awaited<ReturnType<typeof getActiveBanners>>[number];
