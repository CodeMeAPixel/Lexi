import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/hash";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.hashedPassword) return null;

        const isValid = await verifyPassword(
          credentials.password,
          user.hashedPassword,
        );
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name ?? null,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  debug: !!process.env.NEXTAUTH_DEBUG,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).id = (user as any).id;
        if ((user as any).role) (token as any).role = (user as any).role;
      }

      if (!(token as any).role && (token as any).id) {
        try {
          const u = await prisma.user.findUnique({
            where: { id: (token as any).id },
            select: { role: true },
          });
          if (u?.role) (token as any).role = u.role;
        } catch {
          // ignore db errors
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Fetch emailVerified from DB if not present in token
      let emailVerified = (token as any).emailVerified;
      if (!("emailVerified" in token) && (token as any).id) {
        try {
          const u = await prisma.user.findUnique({
            where: { id: (token as any).id },
            select: { emailVerified: true },
          });
          emailVerified = u?.emailVerified ?? null;
        } catch {
          emailVerified = null;
        }
      }
      return {
        ...session,
        user: {
          ...session.user,
          id: (token as any).id,
          role: (token as any).role ?? (session.user as any)?.role ?? "USER",
          emailVerified,
        },
      } as any;
    },
    async redirect({ url, baseUrl }) {
      // Use NextAuth's default redirect logic
      if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      try {
        const parsed = new URL(url);
        if (parsed.origin === baseUrl) return url;
      } catch {
        // ignore and fall through
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
