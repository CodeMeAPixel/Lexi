import React from "react";
import { EmailTemplateProps } from "@/lib/email/template";
import EmailLayout from "@/components/EmailLayout";

type Props = EmailTemplateProps["verification"];

export default function VerificationEmail({ email, token }: Props) {
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

    return (
        <EmailLayout preview="Verify your Lexi email address">
            <h1 style={{ fontSize: 22, margin: "0 0 12px 0" }}>
                Confirm your email
            </h1>

            <section>
                <p style={{ color: "#374151", margin: "0 0 8px 0" }}>
                    Thanks for creating an account with Lexi. Please confirm
                    your email address to finish setting up your account.
                </p>

                <p style={{ margin: "14px 0" }}>
                    <a
                        href={verifyUrl}
                        style={{
                            display: "inline-block",
                            background: "#1D4ED8",
                            color: "white",
                            padding: "10px 16px",
                            borderRadius: 6,
                            textDecoration: "none",
                        }}
                    >
                        Verify email
                    </a>
                </p>

                <p style={{ color: "#9CA3AF", fontSize: 13 }}>
                    If you didn&apos;t request this, you can safely ignore this
                    email.
                </p>
            </section>
        </EmailLayout>
    );
}
