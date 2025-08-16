import React from "react";
import { EmailTemplateProps } from "@/lib/email/template";
import EmailLayout from "@/components/EmailLayout";

type Props = EmailTemplateProps["welcome"];

export default function WelcomeEmail({ name, email }: Props) {
    return (
        <EmailLayout preview="Welcome to Lexi">
            <h1 style={{ fontSize: 22, margin: "0 0 12px 0" }}>
                Welcome{name ? `, ${name}` : ""}!
            </h1>

            <section>
                <p style={{ color: "#374151", margin: "0 0 8px 0" }}>
                    Your Lexi account is all set. Start rephrasing and
                    practicing to improve your writing.
                </p>

                <p style={{ color: "#374151", marginTop: 12 }}>
                    We&apos;re glad you&apos;re here.
                </p>

                <p style={{ color: "#9CA3AF", fontSize: 13, marginTop: 12 }}>
                    If you didn&apos;t create an account, please contact
                    support.
                </p>
            </section>
        </EmailLayout>
    );
}
