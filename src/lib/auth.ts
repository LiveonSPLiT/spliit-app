import NextAuth from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
import { env } from '@/lib/env'
import { prisma } from '@/lib/prisma'
import { sendEmailLogin } from '@/lib/sendEmails'

export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth ({
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        try {
          const email = profile?.email as string
          const name = profile?.name as string
          const existingUser = await prisma.user.findUnique({
            where: { email: email },
          })
          if (!existingUser) {
            // If user doesn't exist, create a new user
            const newUser = await prisma.user.create({
                data: {
                  email,
                  name,
                },
              })
          }
          sendEmailLogin( name, email )
          return true
        } catch (error) {
          console.error('Error during sign-in:', error);
        }
      }
      return true;
    },
  },
  secret: process.env.AUTH_SECRET as string
})

