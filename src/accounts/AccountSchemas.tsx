import z from "zod";

export const accountSchema = z.object({
  account_id: z.string(),
  account_name: z.string(),
});
