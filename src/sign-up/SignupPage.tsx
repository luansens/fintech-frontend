import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

type SignUpFormValues = {
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  investorProfile: "conservador" | "moderado" | "arrojado";
  accountType: "pessoa_fisica" | "pessoa_juridica";
};

export function SignupPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      fullName: "",
      birthDate: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      investorProfile: "conservador",
      accountType: "pessoa_fisica",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");

  const onSubmit = async (data: SignUpFormValues) => {
    // Simula chamada de cadastro; substitua pela integração real
    await new Promise((r) => setTimeout(r, 800));
    console.log("Cadastro:", data);
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
                {...register("fullName", {
                  required: "Nome completo obrigatório",
                  minLength: {
                    value: 3,
                    message: "Nome deve ter ao menos 3 caracteres",
                  },
                })}
                className={`mt-2 w-full px-4 py-2 rounded-lg border ${
                  errors.fullName
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-200 focus:ring-indigo-300"
                } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none`}
                placeholder="João da Silva"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fullName.message}
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
                {...register("phone", {
                  required: "Telefone obrigatório",
                  pattern: {
                    value: /^\(\d{2}\) \d{5}-\d{4}$/,
                    message: "Formato: (99) 99999-9999",
                  },
                })}
                className={`mt-2 w-full px-4 py-2 rounded-lg border ${
                  errors.phone
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-200 focus:ring-indigo-300"
                } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none`}
                placeholder="(99) 99999-9999"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phone.message}
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
                {...register("investorProfile", {
                  required: "Perfil de investidor obrigatório",
                })}
                className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-300"
              >
                <option value="conservador">Conservador</option>
                <option value="moderado">Moderado</option>
                <option value="arrojado">Arrojado</option>
              </select>
              {errors.investorProfile && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.investorProfile.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Tipo de conta
              </label>
              <select
                {...register("accountType", {
                  required: "Tipo de conta obrigatório",
                })}
                className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-300"
              >
                <option value="pessoa_fisica">Pessoa Física</option>
                <option value="pessoa_juridica">Pessoa Jurídica</option>
              </select>
              {errors.accountType && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.accountType.message}
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
