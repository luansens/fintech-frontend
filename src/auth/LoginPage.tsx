import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import type { LoginResponseSchema } from "./AuthSchemas";
import { useAuthStore } from "./authStore";

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "", remember: false },
  });

  const [showPassword, setShowPassword] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const setUserAccounts = useAuthStore((state) => state.setUserAccounts);
  const navigate = useNavigate();

  const { mutate: login, isPending: loginIsPending } = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer login");
      }

      return response.json() as Promise<LoginResponseSchema>;
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      setUserAccounts(data.accounts);
      navigate("/access-account");
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
            FI
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Entrar na sua conta
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Use seu e-mail e senha para acessar
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              E-mail
            </label>
            <input
              type="email"
              {...register("email", {
                required: "E-mail obrigatório",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Formato de e-mail inválido",
                },
              })}
              aria-invalid={!!errors.email}
              className={`mt-2 w-full px-4 py-2 rounded-lg border ${
                errors.email
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-200 focus:ring-indigo-300"
              } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none`}
              placeholder="voce@exemplo.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Senha
            </label>
            <div className="mt-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Senha obrigatória",
                  minLength: {
                    value: 6,
                    message: "A senha deve ter ao menos 6 caracteres",
                  },
                })}
                aria-invalid={!!errors.password}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.password
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-200 focus:ring-indigo-300"
                } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none pr-12`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-indigo-600 hover:text-indigo-800"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <a
              href="#"
              className="text-sm text-indigo-600 hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            disabled={loginIsPending}
            className={`w-full py-2.5 rounded-lg text-white font-medium transition ${
              loginIsPending
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            } flex items-center justify-center gap-2`}
          >
            {loginIsPending && (
              <svg
                className="w-5 h-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {loginIsPending ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Não tem conta?{" "}
          <Link
            to="/sign-up"
            className="text-indigo-600 font-medium hover:underline"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}
