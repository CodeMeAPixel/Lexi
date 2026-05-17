import React, { ComponentType } from "react";

/**
 * Props for each email template type
 */
export type EmailTemplateProps = {
    verification: {
        email: string;
        token: string;
    };
    resetPassword: {
        email: string;
        resetUrl: string;
    };
    welcome: {
        name?: string;
        email: string;
    };
    waitlistConfirmation: {
        email: string;
    };
    waitlistUnsubscribe: {
        email: string;
    };
};

interface LoginFailedEmailProps {
    email: string;
    attempts: number;
    maxAttempts: number;
    cooldownMinutes: number;
}

/**
 * A mapping of template names to their corresponding React components
 * Each component is typed to accept the props defined in EmailTemplateProps
 */
import VerificationEmail from "@/lib/email/templates/accounts/verification";
import ResetPasswordEmail from "@/lib/email/templates/accounts/reset-password";
import WelcomeEmail from "@/lib/email/templates/accounts/welcome";
import WaitlistConfirmationEmail from "@/lib/email/templates/waitlist/confirmation";
import WaitlistUnsubscribeEmail from "@/lib/email/templates/waitlist/unsubscribe";

const templateComponents: {
    [K in keyof EmailTemplateProps]: ComponentType<EmailTemplateProps[K]>;
} = {
    verification: VerificationEmail,
    resetPassword: ResetPasswordEmail,
    welcome: WelcomeEmail,
    waitlistConfirmation: WaitlistConfirmationEmail,
    waitlistUnsubscribe: WaitlistUnsubscribeEmail,
};

/**
 * Valid email template names that can be used to create email elements
 * @type {string} - A union type of all available email template keys
 */
export type TemplateName = keyof typeof templateComponents;

/**
 * Creates a React element for an email template
 *
 * @template T - The email template name (must be a valid TemplateName)
 * @param {T} templateName - The name of the email template to create
 * @param {EmailTemplateProps[T]} props - The props to pass to the email template component
 * @returns {React.ReactElement} - A React element for the specified email template
 * @throws {Error} - Throws if the template name doesn't match any available templates
 */
export function createEmailElement<T extends TemplateName>(
    templateName: T,
    props: EmailTemplateProps[T]
) {
    const TemplateComponent = templateComponents[templateName];

    if (!TemplateComponent) {
        throw new Error(`Email template "${templateName}" not found`);
    }

    return React.createElement(TemplateComponent, props);
}
