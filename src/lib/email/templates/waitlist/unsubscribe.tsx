import React from "react";
import { EmailTemplateProps } from "@/lib/email/template";
import EmailLayout from "@/components/EmailLayout";

type Props = EmailTemplateProps["waitlistUnsubscribe"];

export default function WaitlistUnsubscribeEmail({ email }: Props) {
    const joinUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/signup`;

    return (
        <EmailLayout preview="You've been removed from the waitlist">
            <h1 style={{ fontSize: 24, margin: "0 0 10px 0", color: "#111827" }}>
                You have been unsubscribed
            </h1>

            <section style={{ marginBottom: 12 }}>
                <p style={{ color: "#374151", margin: "0 0 10px 0", lineHeight: 1.7 }}>
                    You have been successfully removed from the Lexi waitlist.
                </p>

                <p style={{ color: "#374151", margin: "12px 0 0 0", lineHeight: 1.7 }}>
                    We&apos;re sorry to see you go — if this was a mistake, you
                    can re-subscribe anytime on our site.
                </p>

                <p style={{ margin: "16px 0" }}>
                    <a
                        href={joinUrl}
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
                        Rejoin waitlist
                    </a>
                </p>

                <p style={{ color: "#6B7280", fontSize: 13, marginTop: 12 }}>
                    If you didn&apos;t request this change, please contact
                    support. Request received for <strong>{email}</strong>.
                </p>
            </section>
        </EmailLayout>
    );
}
