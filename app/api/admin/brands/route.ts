import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { brandUpsertSchema } from "@/lib/validations/brand";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  const parsed = brandUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ", details: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const brand = await prisma.brand.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        logo: parsed.data.logo || null,
        description: parsed.data.description || null,
      },
    });
    revalidateTag("brands", "max");
    return NextResponse.json({ data: brand, message: "Đã tạo thương hiệu" }, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json(
        { error: "Tên hoặc slug đã tồn tại" },
        { status: 409 }
      );
    }
    console.error("Brand create error:", err);
    return NextResponse.json({ error: "Không thể tạo thương hiệu" }, { status: 500 });
  }
}
