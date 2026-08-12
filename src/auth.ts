import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        usuario: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.usuario || !credentials?.password) return null;

        const admin = await prisma.admin.findUnique({
          where: { usuario: credentials.usuario as string },
        });

        if (!admin) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          admin.password
        );

        if (!valid) return null;

        return { id: admin.id, name: admin.usuario };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar.events",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        const autorizado = await prisma.correoAutorizado.findUnique({
          where: { email: user.email.toLowerCase() },
        });
        return Boolean(autorizado);
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account?.provider === "google") {
        token.googleAccessToken = account.access_token;
        token.googleRefreshToken = account.refresh_token;
        if (account.refresh_token) {
          await prisma.configuracion.upsert({
            where: { clave: "google_refresh_token" },
            update: { valor: account.refresh_token },
            create: { clave: "google_refresh_token", valor: account.refresh_token },
          });
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.googleAccessToken) {
        (session as typeof session & { googleAccessToken?: string }).googleAccessToken =
          token.googleAccessToken as string;
      }
      return session;
    },
  },
});
