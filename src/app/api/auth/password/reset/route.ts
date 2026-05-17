import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/hash";
import { z } from "zod";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const TokenResetSchema = z.object({
  token: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});
const AuthResetSchema = z.object({
  currentPassword: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // If token is present, use token-based reset
    if (body?.token) {
      const parsed = TokenResetSchema.safeParse(body);
      if (!parsed.success)
        return NextResponse.json(
          { error: parsed.error.errors[0].message },
          { status: 400 },
        );

      const { token, email, password } = parsed.data;

      const record = await prisma.verificationToken.findUnique({
        where: { token },
      });
      if (!record || record.identifier !== `password-reset:${email}`) {
        return NextResponse.json({ error: "Invalid token" }, { status: 400 });
      }

      if (record.expires < new Date()) {
        return NextResponse.json({ error: "Token expired" }, { status: 400 });
      }

      const hashed = await hashPassword(password);
      await prisma.user.update({
        where: { email },
        data: { hashedPassword: hashed },
      });

      await prisma.verificationToken.delete({ where: { token } });

      return NextResponse.json({ ok: true });
    }

    // Otherwise, try authenticated reset (user must be signed in and provide current password)
    // cast Request to NextRequest for next-auth helper which expects NextRequest/NextApiRequest
    const token = await getToken({
      req: req as unknown as NextRequest,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const parsed = AuthResetSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 },
      );

    const { currentPassword, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { id: token.sub as string },
    });
    if (!user || !user.hashedPassword)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const ok = await verifyPassword(currentPassword, user.hashedPassword);
    if (!ok)
      return NextResponse.json(
        { error: "Current password incorrect" },
        { status: 400 },
      );

    const hashed = await hashPassword(password);
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword: hashed },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
