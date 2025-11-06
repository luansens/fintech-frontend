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

export const investmentSchema = z.object({
  amount: z.number(),
  investment_id: z.guid(),
  asset_name: z.string(),
  asset_type: z.string(),
  created_at: z.date(),
});

export type InvestmentSchema = z.infer<typeof investmentSchema>;
