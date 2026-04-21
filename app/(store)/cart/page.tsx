import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCartSummary } from "@/lib/queries/cart";
import { formatVND } from "@/lib/utils";
import { CartLine } from "@/components/store/cart-line";

export const metadata = { title: "Giỏ hàng — Parfum" };

export default async function CartPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/cart");

  const { items, subtotal } = await getCartSummary(session.user.id);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-4xl">Giỏ hàng trống</h1>
        <p className="mt-3 text-ink-muted">Khám phá sản phẩm và thêm vào giỏ của bạn.</p>
        <Link
          href="/products"
          className="mt-8 inline-flex h-11 items-center bg-ink px-8 text-sm font-medium text-white hover:bg-ink/90"
        >
          Khám phá ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl sm:text-5xl">Giỏ hàng</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          {items.map((item) => (
            <CartLine key={item.id} item={item} />
          ))}
        </div>

        <aside className="h-fit bg-white border border-[color:var(--color-border-soft)] p-6">
          <h2 className="font-display text-2xl">Tóm tắt đơn hàng</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Tạm tính</dt>
              <dd>{formatVND(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Phí vận chuyển</dt>
              <dd className="text-ink-muted">Tính ở bước thanh toán</dd>
            </div>
            <div className="flex justify-between border-t border-[color:var(--color-border-soft)] pt-3 font-medium">
              <dt>Tổng</dt>
              <dd className="font-display text-xl">{formatVND(subtotal)}</dd>
            </div>
          </dl>
          <Link
            href="/checkout"
            className="mt-6 inline-flex h-12 w-full items-center justify-center bg-ink text-sm font-medium text-white hover:bg-ink/90"
          >
            Tiến hành thanh toán
          </Link>
        </aside>
      </div>
    </div>
  );
}
