import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { emailTemplates, sendEmail } from '@/lib/email';
import { z } from 'zod';

const RequestSchema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = RequestSchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

        const { email } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return NextResponse.json({ ok: true }); // don't leak existence

        const token = randomBytes(24).toString('hex');
        // store as identifier 'password-reset:${email}'
        await prisma.verificationToken.create({ data: { identifier: `password-reset:${email}`, token, expires: new Date(Date.now() + 1000 * 60 * 60) } });

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
        const template = emailTemplates.resetPassword(email, resetUrl);
        try { await sendEmail({ to: email, subject: template.subject, text: template.text, html: template.html }); } catch (err) { console.error(err); }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
