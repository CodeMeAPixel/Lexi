import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";
import { z } from "zod";
import { sendEmail, emailTemplates } from "@/lib/email";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "password must be at least 8 characters"),
  name: z.string().min(1, "name is required"),
  handle: z
    .string()
    .min(3, "handle must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_\-]+$/,
      "handle can only contain letters, numbers, underscores and dashes",
    ),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      const first = parsed.error.errors[0];
      return NextResponse.json({ error: first.message }, { status: 400 });
    }

    const { email, password, name, handle } = parsed.data;

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 },
      );
    }

    const existingHandle = await prisma.user.findUnique({
      where: { username: handle },
    });
    if (existingHandle) {
      return NextResponse.json(
        { error: "Handle already in use" },
        { status: 409 },
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { email, name, username: handle, hashedPassword },
    });

    // send welcome email (best-effort)
    try {
      const template = emailTemplates.welcome(name, email);

      await sendEmail({
        to: email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });
    } catch (sendErr) {
      console.error("Failed to send welcome email", sendErr);
    }

    // Do not return the hashed password
    return NextResponse.json(
      { id: user.id, email: user.email, name: user.name },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
