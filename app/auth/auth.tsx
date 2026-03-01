import { SignInForm } from "@/components/auth/forms/sign-in"
import Socials from "@/components/auth/socials"

const Auth = () => {
    return (
        <section className="w-full max-w-[420px] shrink-0">
            <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/80 shadow-xl shadow-primary/[.04] ring-1 ring-white/10 backdrop-blur-xl">
                {/* Gradient accent top bar */}
                <div className="h-1 w-full bg-linear-to-r from-amber-600 via-amber-500 to-purple-900" />

                <div className="space-y-5 p-6">
                    <SignInForm />

                    {/* Divider */}
                    <div className="relative">
                        <div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />
                        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                            ou
                        </span>
                    </div>

                    <Socials />
                </div>
            </div>
        </section>
    )
}

export { Auth }