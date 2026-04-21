"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = { userId: string; currentRole: string };

export function UserRoleForm({ userId, currentRole }: Props) {
  const router = useRouter();
  const [role, setRole] = useState(currentRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === currentRole) return;
    setError(null);
    setLoading(true);
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    setLoading(false);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Không thể cập nhật");
      return;
    }
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="flex items-end gap-3">
      <div>
        <label className="block text-xs uppercase tracking-widest text-ink-muted mb-2">Vai trò</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-[color:var(--color-border-soft)] bg-white px-3 py-2 text-sm"
        >
          <option value="USER">Khách hàng</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
      <Button type="submit" disabled={loading || role === currentRole} size="sm">
        {loading ? "..." : "Lưu"}
      </Button>
      {error && <p className="text-xs text-burgundy">{error}</p>}
    </form>
  );
}
