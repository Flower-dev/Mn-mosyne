"use server"

import { signUpSchema, type SignUpInput } from "@/lib/validators/auth"


type RegisterResult =
  | { success: true }
  | { success: false; error: string }

export async function register(data: SignUpInput): Promise<RegisterResult> {
  const parsed = signUpSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Données invalides." }
  }

  const { name, email, password } = parsed.data

  const existing = await (email)
  if (existing) {
    return { success: false, error: "Un compte existe déjà avec cet email." }
  }


  await (name, email, password)

  return { success: true }
}
