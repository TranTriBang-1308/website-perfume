import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BannerForm } from "@/components/admin/banner-form";

export const metadata = { title: "Sửa banner — Admin" };

type PageProps = { params: Promise<{ id: string }> };

export default async function EditBannerPage({ params }: PageProps) {
  const { id } = await params;
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Sửa banner</h1>
      <BannerForm
        bannerId={banner.id}
        initialValues={{
          title: banner.title,
          subtitle: banner.subtitle ?? "",
          description: banner.description ?? "",
          imageUrl: banner.imageUrl,
          ctaLabel: banner.ctaLabel ?? "",
          ctaHref: banner.ctaHref ?? "",
          position: banner.position,
          isActive: banner.isActive,
        }}
      />
    </div>
  );
}
