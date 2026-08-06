import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
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
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
