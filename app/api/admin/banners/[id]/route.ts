import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { bannerUpsertSchema } from "@/lib/validations/banner";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  const body = await req.json().catch(() => null);
  const parsed = bannerUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ", details: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const banner = await prisma.banner.update({
      where: { id },
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
    return NextResponse.json({ data: banner, message: "Đã cập nhật" });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json({ error: "Banner không tồn tại" }, { status: 404 });
    }
    console.error("Banner update error:", err);
    return NextResponse.json({ error: "Không thể cập nhật" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;

  try {
    await prisma.banner.delete({ where: { id } });
    revalidateTag("banners", "max");
    return NextResponse.json({ message: "Đã xóa" });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json({ error: "Banner không tồn tại" }, { status: 404 });
    }
    console.error("Banner delete error:", err);
    return NextResponse.json({ error: "Không thể xóa" }, { status: 500 });
  }
}
