import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const VerifySchema = z.object({ token: z.string().min(1), email: z.string().email() });

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = VerifySchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

        const { token, email } = parsed.data;

        const record = await prisma.verificationToken.findUnique({ where: { token } });
        if (!record || record.identifier !== email) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
        }

        if (record.expires < new Date()) {
            return NextResponse.json({ error: 'Token expired' }, { status: 400 });
        }

        // mark user verified
        await prisma.user.update({ where: { email }, data: { emailVerified: new Date() } });

        // delete token
        await prisma.verificationToken.delete({ where: { token } });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
