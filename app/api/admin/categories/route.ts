import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { categoryUpsertSchema } from "@/lib/validations/category";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  const parsed = categoryUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ", details: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
      },
    });
    revalidateTag("categories", "max");
    return NextResponse.json({ data: category, message: "Đã tạo danh mục" }, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "Tên hoặc slug đã tồn tại" }, { status: 409 });
    }
    console.error("Category create error:", err);
    return NextResponse.json({ error: "Không thể tạo danh mục" }, { status: 500 });
  }
}
