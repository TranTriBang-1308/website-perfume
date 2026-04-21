"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

type Props = { googleEnabled?: boolean };

export function LoginForm({ googleEnabled }: Props = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setLoading(false);

    if (res?.error) {
      setServerError("Email hoặc mật khẩu không chính xác");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl">Đăng nhập</h1>
        <p className="text-sm text-ink-muted">Chào mừng bạn trở lại</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
        </FormField>

        <FormField label="Mật khẩu" htmlFor="password" error={errors.password?.message}>
          <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
        </FormField>

        {serverError && <p className="text-sm text-burgundy">{serverError}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </Button>
      </form>

      {googleEnabled && (
        <>
          <div className="relative text-center">
            <span className="absolute inset-x-0 top-1/2 h-px bg-[color:var(--color-border-soft)]" />
            <span className="relative bg-cream px-3 text-xs uppercase tracking-widest text-ink-muted">
              hoặc
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl })}
          >
            Đăng nhập với Google
          </Button>
        </>
      )}

      <p className="text-center text-sm text-ink-muted">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="text-ink underline underline-offset-4">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
