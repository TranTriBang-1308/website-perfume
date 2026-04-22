import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { bannerUpsertSchema } from "@/lib/validations/banner";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  const parsed = bannerUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ", details: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const banner = await prisma.banner.create({
      data: {
        title: parsed.data.title,
        subtitle: parsed.data.subtitle || null,
        description: parsed.data.description || null,
        imageUrl: parsed.data.imageUrl,
        ctaLabel: parsed.data.ctaLabel || null,
        ctaHref: parsed.data.ctaHref || null,
        position: parsed.data.position,
        isActive: parsed.data.isActive,
      },
    });
    revalidateTag("banners", "max");
    return NextResponse.json(
      { data: banner, message: "Đã tạo banner" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Banner create error:", err);
    return NextResponse.json({ error: "Không thể tạo banner" }, { status: 500 });
  }
}
