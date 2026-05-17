import React from "react";
import { EmailTemplateProps } from "@/lib/email/template";
import EmailLayout from "@/components/EmailLayout";

type Props = EmailTemplateProps["resetPassword"];

export default function ResetPasswordEmail({ email, resetUrl }: Props) {
    return (
        <EmailLayout preview="Reset your Lexi password">
            <h1 style={{ fontSize: 24, margin: "0 0 10px 0", color: "#111827" }}>
                Reset your password
            </h1>

            <section>
                <p style={{ color: "#374151", margin: "0 0 12px 0", lineHeight: 1.7 }}>
                    We received a request to reset the password for{" "}
                    <strong>{email}</strong>.
                </p>

                <p style={{ color: "#374151", margin: "0 0 12px 0", lineHeight: 1.7 }}>
                    Use the button below to choose a new password. This link
                    should only be used by you and may expire for security
                    reasons.
                </p>

                <p style={{ margin: "16px 0" }}>
                    <a
                        href={resetUrl}
                        style={{
                            display: "inline-block",
                            background: "#111827",
                            color: "white",
                            padding: "11px 18px",
                            borderRadius: 8,
                            textDecoration: "none",
                            fontWeight: 600,
                        }}
                    >
                        Reset password
                    </a>
                </p>

                <p style={{ color: "#6B7280", fontSize: 13 }}>
                    If you didn&apos;t request a password reset, you can safely
                    ignore this email.
                </p>

                <p style={{ color: "#6B7280", fontSize: 13, marginTop: 8 }}>
                    If the button does not work, copy and paste this URL into
                    your browser:
                    <br />
                    <a href={resetUrl} style={{ color: "#111827", fontWeight: 600 }}>
                        {resetUrl}
                    </a>
                </p>
            </section>
        </EmailLayout>
    );
}
