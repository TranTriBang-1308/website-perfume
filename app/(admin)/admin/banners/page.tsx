import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata = { title: "Banner — Admin" };

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Banner Hero</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {banners.length} banner · sắp xếp theo thứ tự xuất hiện
          </p>
        </div>
        <Link href="/admin/banners/new">
          <Button>+ Thêm banner</Button>
        </Link>
      </header>

      <div className="border border-[color:var(--color-border-soft)] bg-white">
        {banners.length === 0 ? (
          <p className="p-6 text-sm text-ink-muted">
            Chưa có banner nào. Hãy tạo banner đầu tiên để hiển thị trên trang chủ.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-ink-muted">
                <th className="px-6 py-3">Ảnh</th>
                <th className="px-6 py-3">Tiêu đề</th>
                <th className="px-6 py-3 text-center">Thứ tự</th>
                <th className="px-6 py-3 text-center">Trạng thái</th>
                <th className="px-6 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-[color:var(--color-border-soft)]"
                >
                  <td className="px-6 py-3">
                    <div className="relative h-14 w-24 overflow-hidden bg-cream">
                      <Image
                        src={b.imageUrl}
                        alt={b.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <p className="font-medium">{b.title}</p>
                    {b.subtitle && (
                      <p className="text-xs text-ink-muted">{b.subtitle}</p>
                    )}
                  </td>
                  <td className="px-6 py-3 text-center text-ink-muted">
                    {b.position}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {b.isActive ? (
                      <span className="inline-flex bg-ink px-2 py-0.5 text-[10px] uppercase tracking-widest text-white">
                        Hiển thị
                      </span>
                    ) : (
                      <span className="inline-flex border border-[color:var(--color-border-soft)] px-2 py-0.5 text-[10px] uppercase tracking-widest text-ink-muted">
                        Ẩn
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/banners/${b.id}`}
                        className="text-xs uppercase tracking-widest text-ink-muted hover:text-ink"
                      >
                        Sửa
                      </Link>
                      <DeleteButton
                        endpoint={`/api/admin/banners/${b.id}`}
                        confirmMessage={`Xóa banner "${b.title}"?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
