import React from "react";
import { EmailTemplateProps } from "@/lib/email/template";
import EmailLayout from "@/components/EmailLayout";

type Props = EmailTemplateProps["waitlistConfirmation"];

export default function WaitlistConfirmationEmail({ email }: Props) {
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/waitlist/unsubscribe?email=${encodeURIComponent(email)}`;

    return (
        <EmailLayout preview="Welcome to the Lexi waitlist!">
            <h1 style={{ fontSize: 22, margin: "0 0 12px 0" }}>
                Welcome to Lexi!
            </h1>

            <section style={{ marginBottom: 12 }}>
                <p style={{ color: "#374151", margin: "0 0 8px 0" }}>
                    Thank you for joining our waitlist! We&apos;re excited to
                    have you as one of our early supporters.
                </p>

                <p style={{ color: "#374151", margin: "0 0 8px 0" }}>
                    You&apos;ve been added to our waitlist with the email:{" "}
                    <strong>{email}</strong>
                </p>

                <p style={{ color: "#374151", margin: "0 0 8px 0" }}>
                    We&apos;re working hard to build the next generation of
                    English writing tools. As a waitlist member, you&apos;ll be
                    among the first to know when we launch and get exclusive
                    early access.
                </p>

                <p style={{ color: "#374151", margin: "12px 0 0 0" }}>
                    Best regards,
                    <br />
                    The Lexi Team
                </p>

                <p style={{ color: "#9CA3AF", fontSize: 13, marginTop: 12 }}>
                    If you didn&apos;t sign up for the Lexi waitlist, you can
                    safely ignore this email.
                </p>

                <p style={{ color: "#9CA3AF", fontSize: 13 }}>
                    To unsubscribe from the waitlist, click{" "}
                    <a href={unsubscribeUrl} style={{ color: "#1D4ED8" }}>
                        here
                    </a>
                    .
                </p>
            </section>
        </EmailLayout>
    );
}
