import z from "zod";

export const accountSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type AccountSchema = z.infer<typeof accountSchema>;

export const createAccountResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  balance: z.number(),
  createdAt: z.string(),
});

export type CreateAccountResponseSchema = z.infer<
  typeof createAccountResponseSchema
>;
