import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCartSummary } from "@/lib/queries/cart";
import { CheckoutForm } from "@/components/store/checkout-form";

export const metadata = { title: "Thanh toán — Parfum" };

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/checkout");

  const { items, subtotal } = await getCartSummary(session.user.id);
  if (items.length === 0) redirect("/cart");

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl sm:text-5xl">Thanh toán</h1>
      <div className="mt-10">
        <CheckoutForm addresses={addresses} subtotal={subtotal} />
      </div>
    </div>
  );
}
