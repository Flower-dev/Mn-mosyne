import type { NextAuthConfig } from 'next-auth';
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "@/lib/validators/auth"
// This config is used by the middleware (Edge Runtime).
// Do NOT import Node.js-only modules (pg, bcrypt, etc.) here.
export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/',    
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
          const isLoggedIn = !!auth?.user;
          const isOnDashboard = nextUrl.pathname.startsWith('/app');
          if (isOnDashboard) {
            if (isLoggedIn) return true;
            return false;
          } else if (isLoggedIn) {
            return Response.redirect(new URL('/app', nextUrl));
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
        if (!parsedCredentials.success) return null

        const { email, password } = parsedCredentials.data

        const user = (email)
        if (!user || !user.password) return null

        if (password !== user.password) return null

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
    ],
} satisfies NextAuthConfig;