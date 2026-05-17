import React from "react";
import { EmailTemplateProps } from "@/lib/email/template";
import EmailLayout from "@/components/EmailLayout";

type Props = EmailTemplateProps["verification"];

export default function VerificationEmail({ email, token }: Props) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

  return (
    <EmailLayout preview="Verify your Lexi email address">
      <h1 style={{ fontSize: 24, margin: "0 0 10px 0", color: "#111827" }}>
        Confirm your email address
      </h1>

      <section>
        <p style={{ color: "#374151", margin: "0 0 12px 0", lineHeight: 1.7 }}>
          Thanks for creating an account with Lexi. Please confirm your email
          address to finish setting up your account.
        </p>

        <p style={{ margin: "16px 0" }}>
          <a
            href={verifyUrl}
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
            Verify email address
          </a>
        </p>

        <p style={{ color: "#6B7280", fontSize: 13, margin: "0 0 8px 0" }}>
          If you didn\'t request this, you can safely ignore this email.
        </p>

        <hr
          style={{
            border: 0,
            borderTop: "1px solid #E5E7EB",
            margin: "18px 0",
          }}
        />

        <section>
          <p style={{ margin: "0 0 8px 0", color: "#374151", lineHeight: 1.7 }}>
            If the button above doesn\'t work in your email client, you can
            verify manually using the information below. Copy the full URL into
            your browser or paste the token and email into the verification form
            at:
          </p>

          <p style={{ margin: "8px 0" }}>
            <a
              href={`${process.env.NEXT_PUBLIC_APP_URL}/auth/verify`}
              style={{ color: "#111827", fontWeight: 600 }}
            >
              {process.env.NEXT_PUBLIC_APP_URL}/auth/verify
            </a>
          </p>

          <div
            style={{
              background: "#F3F4F6",
              padding: 12,
              borderRadius: 8,
              fontFamily: "monospace",
              fontSize: 13,
              color: "#111827",
              border: "1px solid #E5E7EB",
            }}
          >
            <div style={{ marginBottom: 6 }}>
              <strong>Raw verification URL</strong>
            </div>
            <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{verifyUrl}</pre>

            <div style={{ marginTop: 10 }}>
              <strong>Token</strong>
            </div>
            <div style={{ fontFamily: "monospace", wordBreak: "break-all" }}>
              {token}
            </div>

            <div style={{ marginTop: 10 }}>
              <strong>Email</strong>
            </div>
            <div style={{ fontFamily: "monospace" }}>{email}</div>
          </div>
        </section>
      </section>
    </EmailLayout>
  );
}
