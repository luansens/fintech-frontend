import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useAuthStore } from "../auth/authStore";
import type { CreateAccountResponseSchema } from "./AccountSchemas";

const createAccountSchema = z.object({
  accountName: z
    .string()
    .min(3, "Nome da conta deve ter ao menos 3 caracteres"),
  accountType: z.enum(["personal", "business"]),
});

type CreateAccountFormData = z.infer<typeof createAccountSchema>;

export function CreateAccountPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      accountName: "",
      accountType: "personal",
    },
  });

  const accountType = watch("accountType");
  const navigate = useNavigate();
  const setUserAccounts = useAuthStore((state) => state.setUserAccounts);
  const userAccounts = useAuthStore((state) => state.userAccounts);
  const token = useAuthStore((state) => state.token);

  const { mutate: createAccount, isPending } = useMutation({
    mutationFn: async (data: CreateAccountFormData) => {
      const response = await fetch("http://localhost:8080/accounts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.accountName,
          accountType: data.accountType,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar conta");
      }

      return response.json() as Promise<CreateAccountResponseSchema>;
    },
    onSuccess: (data) => {
      setUserAccounts([
        ...userAccounts,
        {
          id: data.id,
          name: data.name,
        },
      ]);
      navigate("/");
    },
  });

  const onSubmit = (data: CreateAccountFormData) => {
    createAccount(data);
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
              Preencha os dados para criar sua conta
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Nome da conta
            </label>
            <input
              type="text"
              {...register("accountName")}
              className={`mt-2 w-full px-4 py-2 rounded-lg border ${
                errors.accountName
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-200 focus:ring-indigo-300"
              } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none`}
              placeholder="Ex: Conta Principal"
            />
            {errors.accountName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.accountName.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
              Tipo de conta
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  accountType === "personal"
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-gray-200 hover:border-indigo-300 dark:border-gray-700"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  value="personal"
                  {...register("accountType")}
                />
                <div className="text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-6 h-6 mx-auto mb-2 ${
                      accountType === "personal"
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-400"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                  <span
                    className={`font-medium ${
                      accountType === "personal"
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Conta Pessoal
                  </span>
                </div>
              </label>

              <label
                className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  accountType === "business"
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-gray-200 hover:border-indigo-300 dark:border-gray-700"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  value="business"
                  {...register("accountType")}
                />
                <div className="text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-6 h-6 mx-auto mb-2 ${
                      accountType === "business"
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-400"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                    />
                  </svg>
                  <span
                    className={`font-medium ${
                      accountType === "business"
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Conta Empresarial
                  </span>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-2.5 rounded-lg text-white font-medium transition ${
              isPending
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            } flex items-center justify-center gap-2`}
          >
            {isPending && (
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
            {isPending ? "Criando conta..." : "Criar conta"}
          </button>
        </form>
      </div>
    </div>
  );
}
