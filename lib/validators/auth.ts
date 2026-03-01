import { z } from "zod"

export const signInSchema = z.object({
  email: z.email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
})

export type SignInInput = z.infer<typeof signInSchema>