"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Address } from "@prisma/client";
import { AddressForm } from "@/components/store/address-form";
import { Button } from "@/components/ui/button";

type Props = { addresses: Address[] };

export function AddressesManager({ addresses }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<{ type: "list" } | { type: "create" } | { type: "edit"; address: Address }>({
    type: "list",
  });

  const remove = async (id: string) => {
    if (!confirm("Xóa địa chỉ này?")) return;
    const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };

  if (mode.type === "create") {
    return (
      <div className="bg-white border border-[color:var(--color-border-soft)] p-6">
        <h2 className="font-display text-2xl">Thêm địa chỉ mới</h2>
        <div className="mt-6">
          <AddressForm
            onSaved={() => {
              setMode({ type: "list" });
              router.refresh();
            }}
            onCancel={() => setMode({ type: "list" })}
          />
        </div>
      </div>
    );
  }

  if (mode.type === "edit") {
    return (
      <div className="bg-white border border-[color:var(--color-border-soft)] p-6">
        <h2 className="font-display text-2xl">Sửa địa chỉ</h2>
        <div className="mt-6">
          <AddressForm
            addressId={mode.address.id}
            defaultValues={{
              fullName: mode.address.fullName,
              phone: mode.address.phone,
              province: mode.address.province,
              district: mode.address.district,
              ward: mode.address.ward,
              street: mode.address.street,
              isDefault: mode.address.isDefault,
            }}
            submitLabel="Cập nhật"
            onSaved={() => {
              setMode({ type: "list" });
              router.refresh();
            }}
            onCancel={() => setMode({ type: "list" })}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Địa chỉ giao hàng</h2>
        <Button onClick={() => setMode({ type: "create" })}>+ Thêm địa chỉ</Button>
      </div>

      {addresses.length === 0 ? (
        <div className="mt-6 bg-white border border-[color:var(--color-border-soft)] p-10 text-center">
          <p className="text-ink-muted">Bạn chưa có địa chỉ nào.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {addresses.map((addr) => (
            <li key={addr.id} className="bg-white border border-[color:var(--color-border-soft)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="text-sm">
                  <p className="font-medium">
                    {addr.fullName} · {addr.phone}
                    {addr.isDefault && (
                      <span className="ml-2 text-xs text-champagne">(Mặc định)</span>
                    )}
                  </p>
                  <p className="mt-1 text-ink-muted">
                    {addr.street}, {addr.ward}, {addr.district}, {addr.province}
                  </p>
                </div>
                <div className="flex gap-3 text-xs uppercase tracking-widest">
                  <button onClick={() => setMode({ type: "edit", address: addr })} className="text-ink-muted hover:text-ink">
                    Sửa
                  </button>
                  <button onClick={() => remove(addr.id)} className="text-burgundy hover:underline">
                    Xóa
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
