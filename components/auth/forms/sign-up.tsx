"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { signUpSchema, type SignUpInput } from "@/lib/validators/auth"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const SignUpForm = () => {
    const router = useRouter()
    const [authError, setAuthError] = useState<string | null>(null)

    const form = useForm<SignUpInput>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (values: SignUpInput) => {
        setAuthError(null)

        const { error } = await authClient.signUp.email({
            email: values.email,
            password: values.password,
            name: values.name,
            callbackURL: "/app",
        })

        if (error) {
            setAuthError(error.message ?? "Une erreur est survenue.")
            return
        }

        router.push("/app")
        router.refresh()
    }

    return (
        <div className="w-full">
            <div className="mb-5">
                <h2 className="text-xl font-semibold tracking-tight">Créer un compte</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Renseignez vos informations pour commencer.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <FormLabel className="text-xs font-medium">Nom complet</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        autoComplete="name"
                                        placeholder="Jean Dupont"
                                        className="h-10 bg-muted/30 transition-colors focus:bg-background"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <FormLabel className="text-xs font-medium">Adresse email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        autoComplete="email"
                                        placeholder="vous@exemple.com"
                                        className="h-10 bg-muted/30 transition-colors focus:bg-background"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <FormLabel className="text-xs font-medium">Mot de passe</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        className="h-10 bg-muted/30 transition-colors focus:bg-background"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <FormLabel className="text-xs font-medium">Confirmer le mot de passe</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        className="h-10 bg-muted/30 transition-colors focus:bg-background"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {authError ? (
                        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4 shrink-0">
                                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                            </svg>
                            {authError}
                        </div>
                    ) : null}

                    <Button
                        className="mt-2 w-full bg-linear-to-r from-amber-600 to-purple-900 text-white shadow-md shadow-amber-600/20 transition-all hover:shadow-lg hover:shadow-purple-900/30"
                        size="lg"
                        type="submit"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Création..." : "Créer un compte"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export { SignUpForm }
