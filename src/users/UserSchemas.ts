import z from "zod";

export const investorLevelEnum = z.enum([
  "iniciante",
  "moderado",
  "avancado",
  "profissional",
]);

export const userSchema = z.object({
  name: z.string(),
  document: z.string(),
  phoneNumber: z.string(),
  birthDate: z.string(),
  email: z.email(),
  investorLevel: investorLevelEnum,
});

export type UserSchema = z.infer<typeof userSchema>;
