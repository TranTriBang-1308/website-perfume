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
        <span className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-cream-warm text-champagne-dark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l2.4 12.3a2 2 0 002 1.7h8.2a2 2 0 002-1.6L22 7H6" />
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="17" cy="20" r="1.5" />
          </svg>
        </span>
        <h1 className="font-display text-4xl font-light sm:text-5xl">Giỏ hàng trống</h1>
        <p className="mt-4 text-ink-muted">
          Khám phá những hương thơm tuyệt vời và thêm vào giỏ của bạn.
        </p>
        <Link
          href="/products"
          className="mt-10 inline-flex h-12 items-center gap-2 bg-ink px-8 text-sm font-medium tracking-wide text-white transition-all duration-300 ease-luxe hover:bg-ink-soft hover:shadow-luxe"
        >
          Khám phá ngay
          <span aria-hidden>→</span>
        </Link>
      </div>
    );
  }

  // Tính phí vận chuyển ước lượng (free từ 1.5tr)
  const FREE_SHIP_THRESHOLD = 1_500_000;
  const remainingForFreeShip = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const freeShipProgress = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="border-b border-border-soft pb-6">
        <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.3em] text-champagne-dark">
          <span aria-hidden className="h-px w-10 bg-champagne" />
          Giỏ hàng
        </p>
        <h1 className="mt-3 font-display text-4xl font-light leading-tight sm:text-5xl">
          {items.length} sản phẩm trong giỏ
        </h1>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-2">
          {items.map((item) => (
            <CartLine key={item.id} item={item} />
          ))}
        </div>

        <aside className="h-fit space-y-6 lg:sticky lg:top-32">
          {/* Free shipping progress */}
          <div className="border border-border-soft bg-white p-5 shadow-soft">
            {remainingForFreeShip > 0 ? (
              <p className="text-sm text-ink-muted">
                Mua thêm <span className="font-medium text-ink">{formatVND(remainingForFreeShip)}</span> để được{" "}
                <span className="font-medium text-champagne-dark">miễn phí giao hàng</span>
              </p>
            ) : (
              <p className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-6" />
                </svg>
                Bạn được miễn phí giao hàng!
              </p>
            )}
            <div className="mt-3 h-1 w-full overflow-hidden bg-border-soft">
              <div
                className="h-full bg-linear-to-r from-champagne-dark to-champagne transition-all duration-700 ease-luxe"
                style={{ width: `${freeShipProgress}%` }}
              />
            </div>
          </div>

          {/* Order summary */}
          <div className="border border-border-soft bg-white shadow-luxe">
            <header className="border-b border-border-soft bg-cream-warm/50 px-6 py-4">
              <h2 className="font-display text-xl">Tóm tắt đơn hàng</h2>
            </header>
            <dl className="space-y-3.5 p-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Tạm tính</dt>
                <dd className="font-medium">{formatVND(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Phí vận chuyển</dt>
                <dd className="text-ink-faint">Tính ở bước thanh toán</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Mã giảm giá</dt>
                <dd className="text-ink-faint">Áp dụng ở thanh toán</dd>
              </div>
              <div className="border-t border-border-soft pt-4">
                <div className="flex items-baseline justify-between">
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-ink-muted">Tổng cộng</dt>
                  <dd className="font-display text-2xl text-ink">{formatVND(subtotal)}</dd>
                </div>
              </div>
            </dl>
            <div className="border-t border-border-soft p-6">
              <Link
                href="/checkout"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 bg-ink text-sm font-medium tracking-wide text-white transition-all duration-300 ease-luxe hover:bg-ink-soft hover:shadow-luxe"
              >
                Tiến hành thanh toán
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/products"
                className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 border border-border-soft text-sm text-ink-muted transition-colors hover:border-ink hover:text-ink"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-3 text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            {[
              { d: "M9 12l2 2 4-4M12 22a10 10 0 100-20 10 10 0 000 20z", label: "Chính hãng" },
              { d: "M12 15v2m0-10V3m-9 9h2m14 0h2", label: "Bảo mật" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2 border border-border-soft bg-white px-3 py-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5 text-champagne-dark">
                  <path strokeLinecap="round" strokeLinejoin="round" d={b.d} />
                </svg>
                {b.label}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
