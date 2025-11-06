import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { useAuthStore } from "../auth/authStore";

interface Asset {
  content: {
    id: string;
    name: string;
    symbol: string;
    asset_type: string;
    current_price: number;
  }[];
}

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
}

export function TransferModal({ isOpen, onClose, type }: TransferModalProps) {
  const [amount, setAmount] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const token = useAuthStore((state) => state.token);
  const currentAccount = useAuthStore((state) => state.currentAccount);
  const queryClient = useQueryClient();

  const { data: assets, isLoading: assetsLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      if (!token) throw new Error("Unauthorized");

      const response = await fetch("http://localhost:8080/assets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch assets");
      }

      return response.json() as Promise<Asset>;
    },
    enabled: type === "invest" && isOpen,
  });

  const [recipientAccount, setRecipientAccount] = useState("");

  const { mutate: performTransaction, isPending: loading } = useMutation({
    mutationFn: async () => {
      if (!token || !currentAccount) {
        throw new Error("Unauthorized");
      }

      const endpoint =
        type === "invest"
          ? `http://localhost:8080/accounts/${currentAccount.id}/investments`
          : `http://localhost:8080/accounts/${currentAccount.id}/wallet/transactions`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          type === "invest"
            ? {
                amount,
                asset_name: assets?.content.find((x) => x.id === selectedAsset)
                  ?.name,
                purchase_price: assets?.content.find(
                  (x) => x.id === selectedAsset
                )?.current_price,
              }
            : {
                amount,
                type,
              }
        ),
      });

      if (!response.ok) {
        throw new Error("Failed to process transaction");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wallet"],
      });
      if (type === "investments") {
        queryClient.invalidateQueries({
          queryKey: ["investments"],
        });
      }
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performTransaction();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100 mb-4"
                >
                  {type === "transfer"
                    ? "Nova transferência"
                    : type === "pay"
                    ? "Novo pagamento"
                    : type === "invest"
                    ? "Novo investimento"
                    : type === "withdraw"
                    ? "Novo saque"
                    : "Novo depósito"}
                </Dialog.Title>

                <form onSubmit={handleSubmit}>
                  {type === "invest" && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ativo
                      </label>
                      {assetsLoading ? (
                        <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                      ) : (
                        <select
                          value={selectedAsset}
                          onChange={(e) => setSelectedAsset(e.target.value)}
                          required
                          className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        >
                          <option value="">Selecione um ativo</option>
                          {assets?.content.map((asset) => (
                            <option key={asset.id} value={asset.id}>
                              {asset.name} - {asset.asset_type} - R${" "}
                              {asset.current_price.toFixed(2)}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                  {type === "transfer" && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Conta de destino
                      </label>
                      <input
                        type="text"
                        value={recipientAccount}
                        onChange={(e) => setRecipientAccount(e.target.value)}
                        required
                        placeholder="Digite o ID da conta de destino"
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  )}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Valor
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      required
                      min={1}
                      step={0.01}
                      placeholder="R$ 0,00"
                      className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
                    >
                      {loading ? "Processando..." : "Confirmar"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
