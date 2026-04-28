import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/utils";

type PageProps = { params: Promise<{ id: string }> };

export const metadata = { title: "Đặt hàng thành công — Parfum" };

export default async function OrderSuccessPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      address: true,
    },
  });

  if (!order) notFound();
  if (order.userId !== session.user.id) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-champagne">Thành công</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Cảm ơn bạn đã đặt hàng</h1>
        <p className="mt-4 text-ink-muted">
          Đơn hàng <span className="font-medium text-ink">{order.orderNumber}</span> đã được ghi nhận.
          Chúng tôi sẽ liên hệ bạn sớm để xác nhận.
        </p>
      </div>

      <div className="mt-12 bg-white border border-[color:var(--color-border-soft)] p-6">
        <h2 className="font-display text-2xl">Chi tiết đơn hàng</h2>
        <ul className="mt-6 space-y-4">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between border-b border-[color:var(--color-border-soft)] pb-3 text-sm">
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-ink-muted">
                  {item.volumeMl}ml · Số lượng: {item.quantity}
                </p>
              </div>
              <p>{formatVND(Number(item.price) * item.quantity)}</p>
            </li>
          ))}
        </ul>

        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-muted">Tạm tính</dt>
            <dd>{formatVND(Number(order.subtotal))}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Vận chuyển</dt>
            <dd>{Number(order.shippingFee) === 0 ? "Miễn phí" : formatVND(Number(order.shippingFee))}</dd>
          </div>
          <div className="flex justify-between border-t border-[color:var(--color-border-soft)] pt-2 font-medium">
            <dt>Tổng cộng</dt>
            <dd className="font-display text-lg">{formatVND(Number(order.total))}</dd>
          </div>
        </dl>

        <div className="mt-6 border-t border-[color:var(--color-border-soft)] pt-6 text-sm">
          <h3 className="text-xs uppercase tracking-widest text-ink-muted">Giao đến</h3>
          <p className="mt-2 font-medium">
            {order.address.fullName} · {order.address.phone}
          </p>
          <p className="text-ink-muted">
            {order.address.street}, {order.address.ward}, {order.address.district}, {order.address.province}
          </p>
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-4">
        <Link
          href="/account/orders"
          className="inline-flex h-11 items-center border border-ink px-6 text-sm font-medium hover:bg-ink hover:text-white"
        >
          Xem đơn hàng của tôi
        </Link>
        <Link
          href="/products"
          className="inline-flex h-11 items-center bg-ink px-6 text-sm font-medium text-white hover:bg-ink/90"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
}
