import React from "react";
import { EmailTemplateProps } from "@/lib/email/template";
import EmailLayout from "@/components/EmailLayout";

type Props = EmailTemplateProps["resetPassword"];

export default function ResetPasswordEmail({ email, resetUrl }: Props) {
    return (
        <EmailLayout preview="Reset your Lexi password">
            <h1 style={{ fontSize: 22, margin: "0 0 12px 0" }}>
                Reset your password
            </h1>

            <section>
                <p style={{ color: "#374151", margin: "0 0 8px 0" }}>
                    We received a request to reset the password for{" "}
                    <strong>{email}</strong>.
                </p>

                <p style={{ margin: "14px 0" }}>
                    <a
                        href={resetUrl}
                        style={{
                            display: "inline-block",
                            background: "#1D4ED8",
                            color: "white",
                            padding: "10px 16px",
                            borderRadius: 6,
                            textDecoration: "none",
                        }}
                    >
                        Reset password
                    </a>
                </p>

                <p style={{ color: "#9CA3AF", fontSize: 13 }}>
                    If you didn&apos;t request a password reset, you can safely
                    ignore this email.
                </p>
            </section>
        </EmailLayout>
    );
}
