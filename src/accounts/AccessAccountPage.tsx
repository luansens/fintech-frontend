import { Button } from "@headlessui/react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../auth/authStore";
import type { AccountSchema } from "./AccountSchemas";

export function AccessAccountPage() {
  const { isAuthenticated, userAccounts, setCurrentAccount } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  function selectAccount(account: AccountSchema) {
    setCurrentAccount(account);
    navigate("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
            FI
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Minhas Contas
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Selecione uma conta para acessar
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userAccounts.map((account) => (
            <Button
              key={account.id}
              onClick={() => selectAccount(account)}
              className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {account.name}
                    </p>
                  </div>
                  <div className="text-indigo-600 dark:text-indigo-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>

        {userAccounts.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 mx-auto text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Você ainda não possui contas cadastradas
            </p>
            <Link
              to="/accounts/new"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Criar sua primeira conta
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
