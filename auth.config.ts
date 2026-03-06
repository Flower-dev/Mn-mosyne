import type { NextAuthConfig } from 'next-auth';
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "@/lib/validators/auth"

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/',    
    },
callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = signInSchema.safeParse(credentials)

        if (!parsedCredentials.success) {
          return null
        }

        const { email, password } = parsedCredentials.data
        const demoEmail = process.env.AUTH_DEMO_EMAIL
        const demoPassword = process.env.AUTH_DEMO_PASSWORD

        if (email === demoEmail && password === demoPassword) {
          return {
            id: "demo-user",
            email,
            name: "Demo User",
          }
        }

        return null
      },
    }),
],
} satisfies NextAuthConfig;