import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/hash";

/**
 * Normalize a string into a bare hostname (lowercased).
 * Accepts inputs like:
 *   - "https://beta.lexiapp.space"
 *   - "beta.lexiapp.space"
 *   - "http://foo.com:3000"
 */
function normalizeHost(input: string): string | null {
  try {
    return new URL(input).hostname.toLowerCase();
  } catch {
    return input
      .replace(/^https?:\/\//, "")
      .split(":")[0]
      .toLowerCase();
  }
}

/** Build the allow-list */
const ALLOWED_AUTH_HOSTS = (() => {
  const hosts = new Set<string>();

  // Add from env (comma-separated)
  const fromEnv = (process.env.ALLOWED_AUTH_DOMAINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(normalizeHost)
    .filter(Boolean) as string[];
  fromEnv.forEach((h) => hosts.add(h));

  // Add default public app URL
  if (process.env.NEXT_PUBLIC_APP_URL) {
    const host = normalizeHost(process.env.NEXT_PUBLIC_APP_URL);
    if (host) hosts.add(host);
  }

  return hosts;
})();

/** Check if a hostname is allowed (supports wildcards like *.lexiapp.space) */
function isAllowedHost(hostname: string): boolean {
  const host = hostname.toLowerCase();

  if (ALLOWED_AUTH_HOSTS.has(host)) return true;

  for (const allowed of ALLOWED_AUTH_HOSTS) {
    if (allowed.startsWith("*.")) {
      const suffix = allowed.slice(1); // ".lexiapp.space"
      if (host.endsWith(suffix)) return true;
    }
  }

  return false;
}

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
      return {
        ...session,
        user: {
          ...session.user,
          id: (token as any).id,
          role: (token as any).role ?? (session.user as any)?.role ?? "USER",
        },
      } as any;
    },
    async redirect({ url, baseUrl }) {
      try {
        if (url.startsWith("/")) {
          return new URL(url, baseUrl).toString();
        }

        const parsed = new URL(url);
        if (isAllowedHost(parsed.hostname)) return parsed.toString();
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
