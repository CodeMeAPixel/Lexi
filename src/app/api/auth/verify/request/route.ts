import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { emailTemplates, sendEmail } from "@/lib/email";
import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(_req: Request) {
  try {
    const session = await getServerSession(authOptions as NextAuthOptions);

    // ensure we have a session and a string user id
    if (
      !session?.user ||
      typeof (session.user as { id?: unknown }).id !== "string"
    ) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const id = (session.user as { id: string }).id;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || !user.email)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const email = user.email;

    // create a token
    const token = randomBytes(24).toString("hex");
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    // send verification email (best effort)
    try {
      const template = emailTemplates.verification(email, token);

      await sendEmail({
        to: email,
        from: {
          name: "Lexicon Accounts",
          address: "accounts@lexiapp.space",
        },
        subject: template.subject,
        text: template.text,
        html: template.html,
      });
    } catch (sendErr) {
      console.error("Failed to send verification email", sendErr);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
