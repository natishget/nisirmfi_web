"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { authLoginSchema, type AuthLoginInput } from "@/lib/validators/auth";

type LoginFormValues = AuthLoginInput;

export default function AdminLoginForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(authLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const payload = (await response.json()) as {
      error?: string;
      message?: string;
    };

    if (!response.ok) {
      setSubmitError(payload.error ?? "Unable to sign in");
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="text-white pt-10 pb-10 md:px-18 px-4 border-2 border-gray-300 rounded-4xl md:w-[550px] md:h-[550px] w-[90%] h-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-sm"
    >
      <h3 className="font-semibold text-xl mb-3">Maker</h3>
      <h1 className="font-semibold text-3xl mb-5">Login</h1>

      <div className="flex flex-col gap-1 mb-3">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register("email")}
          placeholder="name@company.com"
          autoComplete="email"
          className="bg-white p-2 rounded-lg placeholder:text-gray-500 placeholder:italic text-gray-800"
        />
        {errors.email ? (
          <p className="text-red-300 text-sm">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register("password")}
          placeholder="********"
          autoComplete="current-password"
          className="bg-white p-2 rounded-lg placeholder:text-gray-500 placeholder:italic text-gray-800"
        />
        {errors.password ? (
          <p className="text-red-300 text-sm">{errors.password.message}</p>
        ) : null}
      </div>

      <button type="button" className="text-xs mt-3">
        Forget password?
      </button>
      <br />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-red-800 py-2 mt-10 flex items-center justify-center tracking-wide disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>

      {submitError ? (
        <p className="text-red-300 text-center mt-3 text-sm">{submitError}</p>
      ) : null}
    </form>
  );
}
