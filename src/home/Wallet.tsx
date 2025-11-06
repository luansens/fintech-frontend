import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../auth/authStore";
import type { WalletSchema } from "./schemas";
import { TransferModal } from "./TransferModal";

const quickActions = [
  {
    id: "withdraw",
    label: "Sacar",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 19.5c-2.485 0-4.5-4.03-4.5-9S9.515 1.5 12 1.5s4.5 4.03 4.5 9-2.015 9-4.5 9zm0 0V21m0-19.5V0m-9 13.5h18"
      />
    ),
  },
  {
    id: "deposit",
    label: "Depositar",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    id: "invest",
    label: "Investir",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
      />
    ),
  },
];

export function Wallet() {
  const [showBalance, setShowBalance] = useState(true);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>("");
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const currentAccount = useAuthStore((st) => st.currentAccount)!;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const { data: walletData, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Saldo disponível
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {showBalance
                ? formatCurrency(walletData?.balance ?? 0)
                : "R$ ••••••"}
            </span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-indigo-600 hover:text-indigo-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                {showBalance ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        <button
          onClick={() => navigate("/accounts")}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Ver todas as contas
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => {
              setSelectedAction(action.id);
              setIsTransferModalOpen(true);
            }}
            className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                {action.icon}
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {action.label}
            </span>
          </button>
        ))}
      </div>

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => {
          setIsTransferModalOpen(false);
          setSelectedAction("");
        }}
        type={selectedAction}
      />
    </div>
  );
}
