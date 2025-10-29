import { Link } from "react-router";
import { useAuthStore } from "../auth/authStore";

export function AccountsPage() {
  const { isAuthenticated, userAccounts } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 dark:text-gray-400">
          Você precisa estar logado para ver suas contas.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Minhas Contas
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gerencie suas contas e visualize seus saldos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userAccounts.map((account) => (
          <Link
            key={account.account_id}
            to={`/accounts/${account.account_id}`}
            className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Conta
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {account.account_name}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {userAccounts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Você ainda não possui contas cadastradas.
          </p>
        </div>
      )}
    </div>
  );
}
