import z from "zod";

export const investorLevelEnum = z.enum([
  "INICIANTE",
  "MODERADO",
  "AVANCADO",
  "PROFISSIONAL",
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
