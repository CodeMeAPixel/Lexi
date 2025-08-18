import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/hash";

// Allow-list of production hostnames (comma-separated in env) that may be
// used as valid callback/redirect targets. If the env var is not set we
// include the current NEXT_PUBLIC_APP_URL hostname (if available) so the
// running host is always allowed.
const rawAllowed = process.env.ALLOWED_AUTH_DOMAINS || "";
const allowedFromEnv = rawAllowed
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)
  .map((u) => {
    try {
      // Accept values like https://beta.lexiapp.space or just beta.lexiapp.space
      return new URL(u).hostname;
    } catch (err) {
      return u.replace(/^https?:\/\//, "");
    }
  });

const defaultPublic = process.env.NEXT_PUBLIC_APP_URL
  ? (() => {
      try {
        return new URL(process.env.NEXT_PUBLIC_APP_URL).hostname;
      } catch {
        return process.env.NEXT_PUBLIC_APP_URL;
      }
    })()
  : undefined;

const ALLOWED_AUTH_HOSTS = new Set<string>([
  ...allowedFromEnv,
  ...(defaultPublic ? [defaultPublic] : []),
]);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
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
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) (token as any).id = (user as any).id;
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: (token as any).id,
        },
      } as any;
    },
    // Ensure redirect targets are allowed. NextAuth calls this with a `url`
    // which may be absolute (after OAuth) or relative. We allow relative
    // URLs (internal navigation) and absolute URLs that resolve to an
    // allowed hostname from the ALLOWED_AUTH_DOMAINS list. Otherwise we
    // fall back to the baseUrl which is provided by NextAuth and is safe.
    async redirect({ url, baseUrl }) {
      try {
        // Relative url -> safe
        if (url.startsWith("/")) return new URL(url, baseUrl).toString();

        const parsed = new URL(url);
        if (ALLOWED_AUTH_HOSTS.has(parsed.hostname)) return parsed.toString();
      } catch (err) {
        // ignore and fall back to baseUrl
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
