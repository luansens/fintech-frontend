import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuthStore } from "../auth/authStore";
import type {
  InvestmentSchema,
  TransactionSchema,
  WalletSchema,
} from "./schemas";

export function LastTransactions() {
  const token = useAuthStore((st) => st.token);
  const currentAccount = useAuthStore((st) => st.currentAccount)!;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const { data: walletData, isLoading: isLoadingWallet } = useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:8080/accounts/${currentAccount.id}/wallet`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar conta");
      }

      return response.json() as Promise<WalletSchema>;
    },
  });

  const { data: investments, isLoading: isLoadingInvestments } = useQuery({
    queryKey: ["investments"],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:8080/accounts/${currentAccount.id}/investments`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar conta");
      }

      return response.json() as Promise<{ content: InvestmentSchema[] }>;
    },
  });

  const mergedOperations = useMemo(() => {
    return [
      ...(walletData?.operations ?? []),
      ...(investments?.content?.map(
        (x) =>
          ({
            amount: x.amount,
            created_at: x.created_at,
            operation_id: x.investment_id,
            type: "deposit",
          } as TransactionSchema)
      ) ?? []),
    ].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [investments?.content, walletData?.operations]);

  if (isLoadingWallet || isLoadingInvestments) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Últimas transações
        </h2>
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          Ver todas
        </button>
      </div>

      <div className="space-y-4">
        {mergedOperations.map((transaction) => (
          <div
            key={transaction.operation_id}
            className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === "deposit"
                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  {transaction.type === "deposit" ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m6-6H6"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 12H6"
                    />
                  )}
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(transaction.created_at)}
                </p>
              </div>
            </div>
            <span
              className={`text-sm font-medium ${
                transaction.type === "deposit"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {transaction.type === "deposit" ? "+" : "-"}
              {formatCurrency(Math.abs(transaction.amount))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
