"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  onUploaded: (url: string) => void;
};

type SignResponse = {
  timestamp: number;
  signature: string;
  folder: string;
  apiKey: string;
  cloudName: string;
};

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function CloudinaryUpload({ onUploaded }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Chỉ hỗ trợ JPG, PNG, WEBP");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("Ảnh vượt quá 5 MB");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const signRes = await fetch("/api/admin/upload/sign", { method: "POST" });
      if (!signRes.ok) throw new Error("Không lấy được chữ ký upload");
      const sign: SignResponse = await signRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sign.apiKey);
      formData.append("timestamp", String(sign.timestamp));
      formData.append("signature", sign.signature);
      formData.append("folder", sign.folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      if (!uploadRes.ok) {
        const json = await uploadRes.json().catch(() => ({}));
        throw new Error(json?.error?.message ?? "Upload thất bại");
      }
      const json = await uploadRes.json();
      onUploaded(json.secure_url as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label
        className={cn(
          "inline-flex h-9 cursor-pointer items-center justify-center border border-ink bg-transparent px-4 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-white",
          loading && "pointer-events-none opacity-50"
        )}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFile}
          disabled={loading}
        />
        {loading ? "Đang tải..." : "Tải ảnh lên"}
      </label>
      {error && <p className="text-xs text-burgundy">{error}</p>}
    </div>
  );
}
