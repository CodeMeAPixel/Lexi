import React from "react";
import { EmailTemplateProps } from "@/lib/email/template";
import EmailLayout from "@/components/EmailLayout";

type Props = EmailTemplateProps["welcome"];

export default function WelcomeEmail({ name, email }: Props) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

  return (
    <EmailLayout preview="Welcome to Lexi">
      <h1 style={{ fontSize: 24, margin: "0 0 10px 0", color: "#111827" }}>
        Welcome{name ? `, ${name}` : ""}!
      </h1>

      <section>
        <p style={{ color: "#374151", margin: "0 0 12px 0", lineHeight: 1.7 }}>
          Your Lexi account is all set. Start rephrasing and practicing to
          improve your writing.
        </p>

        <p style={{ color: "#92400E", margin: "0 0 12px 0", lineHeight: 1.7 }}>
          Before you can start using all of Lexi's features, you will need to
          verify your email address. You can do this when visiting the dashboard
          for the first time!
        </p>

        <p style={{ margin: "16px 0" }}>
          <a
            href={dashboardUrl}
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
            Open dashboard
          </a>
        </p>

        <p style={{ color: "#6B7280", fontSize: 13, marginTop: 12 }}>
          If you didn&apos;t create an account, please contact support.
        </p>
      </section>
    </EmailLayout>
  );
}
