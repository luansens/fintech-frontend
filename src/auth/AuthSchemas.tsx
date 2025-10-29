import z from "zod";
import { accountSchema } from "../accounts/AccountSchemas";
import { userSchema } from "../users/UserSchemas";

export const loginResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
  accounts: z.array(accountSchema),
});

export type LoginResponseSchema = z.infer<typeof loginResponseSchema>;
