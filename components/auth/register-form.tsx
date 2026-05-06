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
      <div className="space-y-2 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-champagne-dark">
          Join Us
        </p>
        <h1 className="font-display text-3xl font-light sm:text-4xl">Tạo tài khoản</h1>
        <p className="text-sm text-ink-muted">Khám phá thế giới nước hoa cùng Whisper of Scent</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField label="Họ và tên" htmlFor="name" error={errors.name?.message} required>
          <Input id="name" autoComplete="name" placeholder="Nguyễn Văn A" {...register("name")} />
        </FormField>

        <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
          <Input id="email" type="email" autoComplete="email" placeholder="email@example.com" {...register("email")} />
        </FormField>

        <FormField
          label="Mật khẩu"
          htmlFor="password"
          error={errors.password?.message}
          hint="Tối thiểu 8 ký tự"
          required
        >
          <Input id="password" type="password" autoComplete="new-password" placeholder="••••••••" {...register("password")} />
        </FormField>

        <FormField
          label="Nhập lại mật khẩu"
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
          required
        >
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            {...register("confirmPassword")}
          />
        </FormField>

        {serverError && (
          <p className="flex items-center gap-2 border border-burgundy/30 bg-burgundy/5 p-3 text-sm text-burgundy">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
            </svg>
            {serverError}
          </p>
        )}

        <Button type="submit" className="w-full" loading={loading} size="lg">
          Đăng ký
        </Button>

        <p className="text-center text-[11px] text-ink-faint">
          Bằng việc đăng ký, bạn đồng ý với{" "}
          <Link href="/policies/terms" className="underline-offset-2 hover:text-ink hover:underline">
            Điều khoản
          </Link>{" "}
          và{" "}
          <Link href="/policies/privacy" className="underline-offset-2 hover:text-ink hover:underline">
            Chính sách bảo mật
          </Link>
          .
        </p>
      </form>

      <p className="text-center text-sm text-ink-muted">
        Đã có tài khoản?{" "}
        <Link
          href="/login"
          className="font-medium text-ink underline-offset-4 transition-colors hover:text-champagne-dark hover:underline"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
