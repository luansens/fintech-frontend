import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import type { LoginResponseSchema } from "../auth/AuthSchemas";
import { useAuthStore } from "../auth/authStore";
import { investorLevelEnum, type UserSchema } from "../users/UserSchemas";

type SignUpFormValues = {
  name: string;
  document: string;
  birthDate: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  investorLevel: "iniciante" | "moderado" | "avancado" | "profissional";
};

const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
    birthDate: z.string().min(1, "Data de nascimento obrigatória"),
    document: z.string().min(1, "Documento obrigatório"),
    phoneNumber: z
      .string()
      .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato: (99) 99999-9999"),
    email: z.email("Formato de e-mail inválido"),
    password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
    confirmPassword: z.string(),
    investorLevel: investorLevelEnum,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

type SignUpFormSchema = z.infer<typeof signUpFormSchema>;

export function SignupPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      document: "",
      birthDate: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      investorLevel: "iniciante",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setAuth } = useAuthStore((st) => ({
    setAuth: st.setAuth,
  }));

  const password = watch("password");
  const navigate = useNavigate();

  const { mutate: login } = useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      userInfo: UserSchema;
    }) => {
      const response = await fetch("/auth/login", {
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
      navigate("/access-account");
    },
  });

  const { mutate: signUp } = useMutation({
    mutationFn: async (data: SignUpFormValues) => {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar conta");
      }

      return response.json() as Promise<UserSchema>;
    },
    onSuccess: (data, formValues) => {
      login({
        email: formValues.email,
        password: formValues.password,
        userInfo: data,
      });
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    signUp(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
            FI
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Criar nova conta
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Preencha seus dados para começar
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Nome completo
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "Nome completo obrigatório",
                  minLength: {
                    value: 3,
                    message: "Nome deve ter ao menos 3 caracteres",
                  },
                })}
                className={`mt-2 w-full px-4 py-2 rounded-lg border ${
                  errors.name
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-200 focus:ring-indigo-300"
                } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none`}
                placeholder="João da Silva"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Data de nascimento
              </label>
              <input
                type="date"
                {...register("birthDate", {
                  required: "Data de nascimento obrigatória",
                })}
                className={`mt-2 w-full px-4 py-2 rounded-lg border ${
                  errors.birthDate
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-200 focus:ring-indigo-300"
                } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none`}
              />
              {errors.birthDate && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.birthDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Telefone
              </label>
              <input
                type="tel"
                {...register("phoneNumber", {
                  required: "Telefone obrigatório",
                  pattern: {
                    value: /^\(\d{2}\) \d{5}-\d{4}$/,
                    message: "Formato: (99) 99999-9999",
                  },
                })}
                className={`mt-2 w-full px-4 py-2 rounded-lg border ${
                  errors.phoneNumber
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-200 focus:ring-indigo-300"
                } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none`}
                placeholder="(99) 99999-9999"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

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
                Documento
              </label>
              <input
                type="text"
                {...register("document", {
                  required: "Documento obrigatório",
                })}
                className={`mt-2 w-full px-4 py-2 rounded-lg border ${
                  errors.document
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-200 focus:ring-indigo-300"
                } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none`}
                placeholder="Número do documento"
              />
              {errors.document && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.document.message}
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

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Confirmar senha
              </label>
              <div className="mt-2 relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Confirmação de senha obrigatória",
                    validate: (value) =>
                      value === password || "As senhas não conferem",
                  })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.confirmPassword
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-200 focus:ring-indigo-300"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none pr-12`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  {showConfirmPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Perfil de investidor
              </label>
              <select
                {...register("investorLevel", {
                  required: "Perfil de investidor obrigatório",
                })}
                className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-300"
              >
                <option value="iniciante">Iniciante</option>
                <option value="moderado">Moderado</option>
                <option value="avancado">Avançado</option>
                <option value="profissional">Profissional</option>
              </select>
              {errors.investorLevel && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.investorLevel.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2.5 rounded-lg text-white font-medium transition ${
              isSubmitting
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            } flex items-center justify-center gap-2`}
          >
            {isSubmitting && (
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
            {isSubmitting ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-medium hover:underline"
          >
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}
