import React from "react";
import { EmailTemplateProps } from "@/lib/email/template";
import EmailLayout from "@/components/EmailLayout";

type Props = EmailTemplateProps["waitlistUnsubscribe"];

export default function WaitlistUnsubscribeEmail({ email }: Props) {
    return (
        <EmailLayout preview="You've been removed from the waitlist">
            <h1 style={{ fontSize: 22, margin: "0 0 12px 0" }}>
                You have been unsubscribed
            </h1>

            <section style={{ marginBottom: 12 }}>
                <p style={{ color: "#374151", margin: "0 0 8px 0" }}>
                    You have been successfully removed from the Lexi waitlist.
                </p>

                <p style={{ color: "#374151", margin: "12px 0 0 0" }}>
                    We&apos;re sorry to see you go — if this was a mistake, you
                    can re-subscribe anytime on our site.
                </p>

                <p style={{ color: "#9CA3AF", fontSize: 13, marginTop: 12 }}>
                    If you didn&apos;t request this change, please contact
                    support.
                </p>
            </section>
        </EmailLayout>
    );
}
