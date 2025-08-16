import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/hash";

export const authOptions = {
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

                const user = await prisma.user.findUnique({ where: { email: credentials.email } });
                if (!user || !user.hashedPassword) return null;

                const isValid = await verifyPassword(credentials.password, user.hashedPassword);
                if (!isValid) return null;

                // return the user object expected by NextAuth
                return { id: user.id, name: user.name ?? null, email: user.email };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        // Persist user id to the JWT after signin
        async jwt({ token, user }) {
            if (user) token.id = (user as any).id;
            return token;
        },

        // Make the id available on the client session object
        async session({ session, token }) {
            return { ...session, user: { ...session.user, id: (token as any).id } };
        },
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error"
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };
