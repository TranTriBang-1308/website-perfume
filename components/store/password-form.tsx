"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  passwordChangeSchema,
  type PasswordChangeInput,
} from "@/lib/validations/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

export function PasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordChangeInput>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const onSubmit = async (data: PasswordChangeInput) => {
    setServerError(null);
    setSuccess(null);
    setLoading(true);

    const res = await fetch("/api/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setServerError(json.error ?? "Không thể đổi mật khẩu. Vui lòng thử lại.");
      return;
    }
    setSuccess("Đổi mật khẩu thành công");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md">
      <FormField
        label="Mật khẩu hiện tại"
        htmlFor="currentPassword"
        error={errors.currentPassword?.message}
      >
        <Input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          {...register("currentPassword")}
        />
      </FormField>

      <FormField
        label="Mật khẩu mới"
        htmlFor="newPassword"
        error={errors.newPassword?.message}
      >
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          {...register("newPassword")}
        />
      </FormField>

      <FormField
        label="Nhập lại mật khẩu mới"
        htmlFor="confirmPassword"
        error={errors.confirmPassword?.message}
      >
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
      </FormField>

      {serverError && <p className="text-sm text-burgundy">{serverError}</p>}
      {success && <p className="text-sm text-ink">{success}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
      </Button>
    </form>
  );
}
