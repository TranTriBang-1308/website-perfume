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
  const [showPassword, setShowPassword] = useState(false);

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
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-champagne-dark">
          Welcome Back
        </p>
        <h1 className="font-display text-3xl font-light sm:text-4xl">Đăng nhập</h1>
        <p className="text-sm text-ink-muted">Chào mừng bạn trở lại với hành trình hương thơm</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
          <Input id="email" type="email" autoComplete="email" placeholder="email@example.com" {...register("email")} />
        </FormField>

        <FormField label="Mật khẩu" htmlFor="password" error={errors.password?.message} required>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-ink"
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 10.6a3 3 0 004 4M9.9 4.2a10 10 0 0111.6 7.8 10 10 0 01-3.7 5M6.7 6.7A10 10 0 002.5 12a10 10 0 0014.5 5.5" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </FormField>

        <div className="flex items-center justify-end text-xs">
          <Link href="/" className="text-ink-muted transition-colors hover:text-champagne-dark">
            Quên mật khẩu?
          </Link>
        </div>

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
          Đăng nhập
        </Button>
      </form>

      {googleEnabled && (
        <>
          <div className="relative flex items-center justify-center">
            <span className="h-px flex-1 bg-border-soft" />
            <span className="px-4 text-[11px] uppercase tracking-[0.25em] text-ink-faint">hoặc</span>
            <span className="h-px flex-1 bg-border-soft" />
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => signIn("google", { callbackUrl })}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0012 23z" />
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A10.99 10.99 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A10.99 10.99 0 002.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
            </svg>
            Đăng nhập với Google
          </Button>
        </>
      )}

      <p className="text-center text-sm text-ink-muted">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="font-medium text-ink underline-offset-4 transition-colors hover:text-champagne-dark hover:underline"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
