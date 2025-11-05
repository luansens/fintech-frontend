import z from "zod";

export const transactionEnum = z.enum(["withdraw", "deposit"]);

export const transactionSchema = z.object({
  operation_id: z.guid(),
  type: transactionEnum,
  amount: z.number(),
  created_at: z.date(),
});

export type TransactionSchema = z.infer<typeof transactionSchema>;

export const walletSchema = z.object({
  balance: z.number(),
  operations: z.array(transactionSchema),
});

export type WalletSchema = z.infer<typeof walletSchema>;
