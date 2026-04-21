"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setServerError(json.error ?? "Đăng ký thất bại. Vui lòng thử lại.");
      setLoading(false);
      return;
    }

    const login = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setLoading(false);

    if (login?.error) {
      router.push("/login");
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl">Tạo tài khoản</h1>
        <p className="text-sm text-ink-muted">Khám phá thế giới nước hoa cùng Parfum</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField label="Họ và tên" htmlFor="name" error={errors.name?.message}>
          <Input id="name" autoComplete="name" {...register("name")} />
        </FormField>

        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
        </FormField>

        <FormField label="Mật khẩu" htmlFor="password" error={errors.password?.message}>
          <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
        </FormField>

        <FormField
          label="Nhập lại mật khẩu"
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

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </Button>
      </form>

      <p className="text-center text-sm text-ink-muted">
        Đã có tài khoản?{" "}
        <Link href="/login" className="text-ink underline underline-offset-4">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
