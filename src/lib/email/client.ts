import { renderEmailToHtml } from "./renderHtml";
import nodemailer, { Transporter } from "nodemailer";
import { EmailTemplateProps } from "./template";

import {
    EmailClient,
    EmailSender,
    EmailRecipient,
    EmailTemplate,
    SendEmailOptions,
    SendEmailResult,
} from "@/types/email";

/**
 * Implementation of the EmailClient interface using SMTP
 *
 * @class EmailClientImpl
 * @implements {EmailClient}
 * @description
 * This class provides email sending capabilities using an SMTP server.
 * It implements the singleton pattern to ensure only one instance exists.
 *
 * @example
 * // Get the email client instance
 * const client = EmailClientImpl.getInstance();
 *
 * // Send an email
 * await client.sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Hello',
 *   text: 'Plain text content',
 *   html: '<p>HTML content</p>'
 * });
 */
class EmailClientImpl implements EmailClient {
    /**
     * Singleton instance of the email client
     * @private
     * @static
     * @type {EmailClientImpl}
     */
    private static instance: EmailClientImpl;

    private transporter: Transporter;

    /**
     * Default sender configuration
     * @private
     * @type {EmailSender}
     */
    private defaultFrom: EmailSender;

    /**
     * Creates an instance of EmailClientImpl.
     * @private
     * @constructor
     * @description
     * Initializes the SMTP client with credentials from environment variables
     * and sets up the default sender information.
     */
    private constructor() {
        const smtpHost = process.env.SMTP_HOST;
        if (!smtpHost) {
            throw new Error("Missing required SMTP_HOST environment variable");
        }

        const smtpPort = Number(process.env.SMTP_PORT || "587");
        if (!Number.isFinite(smtpPort) || smtpPort <= 0) {
            throw new Error("SMTP_PORT must be a valid positive number");
        }

        const smtpSecure = this.parseBoolean(
            process.env.SMTP_SECURE,
            smtpPort === 465
        );
        const smtpIgnoreTLS = this.parseBoolean(
            process.env.SMTP_IGNORE_TLS,
            false
        );
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;

        if ((smtpUser && !smtpPass) || (!smtpUser && smtpPass)) {
            throw new Error(
                "SMTP_USER and SMTP_PASS must either both be set or both be omitted"
            );
        }

        this.transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure,
            ignoreTLS: smtpIgnoreTLS,
            auth:
                smtpUser && smtpPass
                    ? {
                        user: smtpUser,
                        pass: smtpPass,
                    }
                    : undefined,
        });

        // Set default sender
        this.defaultFrom = {
            address: process.env.DEFAULT_FROM_EMAIL || "noreply@lexiapp.space",
            name: process.env.DEFAULT_FROM_NAME || "Lexicon",
        };
    }

    /**
     * Gets the singleton instance of EmailClientImpl
     * @public
     * @static
     * @returns {EmailClientImpl} The singleton instance
     */
    public static getInstance(): EmailClientImpl {
        if (!EmailClientImpl.instance) {
            EmailClientImpl.instance = new EmailClientImpl();
        }
        return EmailClientImpl.instance;
    }

    /**
     * Collection of email template generators
     * @public
     * @type {Object}
     */
    emailTemplates = {
        // account-related templates
        verification: (email: string, token: string): EmailTemplate => {
            const props: EmailTemplateProps["verification"] = { email, token };
            const text = `Please verify your email: ${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
            return {
                name: "verification",
                subject: "Verify your email",
                text,
                html: renderEmailToHtml("verification", props),
            };
        },
        resetPassword: (email: string, resetUrl: string): EmailTemplate => {
            const props: EmailTemplateProps["resetPassword"] = {
                email,
                resetUrl,
            };
            const text = `Reset your password: ${resetUrl}`;
            return {
                name: "resetPassword",
                subject: "Reset your password",
                text,
                html: renderEmailToHtml("resetPassword", props),
            };
        },
        welcome: (name: string | undefined, email: string): EmailTemplate => {
            const props: EmailTemplateProps["welcome"] = { name, email };
            const text = `Welcome to Lexi${name ? `, ${name}` : ""}!`;
            return {
                name: "welcome",
                subject: "Welcome to Lexi",
                text,
                html: renderEmailToHtml("welcome", props),
            };
        },
        // waitlist-related templates
        waitlistConfirmation: (email: string): EmailTemplate => {
            const props: EmailTemplateProps["waitlistConfirmation"] = { email };
            const text = `Welcome to the Lexi waitlist! You've been added with the email: ${email}`;
            return {
                name: "waitlistConfirmation",
                subject: "Welcome to the Lexi waitlist!",
                text,
                html: renderEmailToHtml("waitlistConfirmation", props),
            };
        },
        waitlistUnsubscribe: (email: string): EmailTemplate => {
            const props: EmailTemplateProps["waitlistUnsubscribe"] = { email };
            const text = `You have been successfully removed from the Lexi waitlist.`;
            return {
                name: "waitlistUnsubscribe",
                subject: "You have been unsubscribed",
                text,
                html: renderEmailToHtml("waitlistUnsubscribe", props),
            };
        },
    };

    /**
    * Sends an email using SMTP
     *
     * @public
     * @async
     * @param {SendEmailOptions} options - The email sending options
     * @returns {Promise<SendEmailResult>} Result of the email sending operation
     *
     * @example
     * // Send a simple email
     * const result = await emailClient.sendEmail({
     *   to: 'user@example.com',
     *   subject: 'Hello',
     *   text: 'Plain text version',
     *   html: '<p>HTML version</p>'
     * });
     *
     * @example
     * // Send an email to multiple recipients with a custom sender
     * const result = await emailClient.sendEmail({
     *   to: ['user1@example.com', 'user2@example.com'],
     *   subject: 'Team Update',
     *   text: 'Plain text version',
     *   html: '<p>HTML version</p>',
     *   from: {
     *     address: 'team@octohub.dev',
     *     name: 'OctoHub Team'
     *   }
     * });
     */
    async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
        try {
            const sender = options.from || this.defaultFrom;

            const toRecipients = Array.isArray(options.to)
                ? options.to.map((recipient: string | EmailRecipient) =>
                    this.normalizeRecipient(recipient)
                )
                : [this.normalizeRecipient(options.to)];

            const sendResult = await this.transporter.sendMail({
                from: this.formatAddress(sender),
                to: toRecipients.map((recipient) => this.formatAddress(recipient)),
                subject: options.subject,
                text: options.text,
                html: options.html,
            });

            if (
                sendResult.accepted.length === 0 &&
                sendResult.rejected.length > 0
            ) {
                throw new Error(
                    `Email rejected by SMTP server for recipients: ${sendResult.rejected.join(", ")}`
                );
            }

            return { success: true };
        } catch (error) {
            console.error("Error sending email:", error);
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new Error("Failed to send email"),
            };
        }
    }

    /**
    * Normalizes recipient format
     *
     * @private
     * @param {string | EmailRecipient} recipient - The recipient email or object
     * @returns {EmailRecipient} Normalized recipient object
     */
    private normalizeRecipient(recipient: string | EmailRecipient): EmailRecipient {
        if (typeof recipient === "string") {
            return {
                address: recipient,
            };
        }
        return recipient;
    }

    private formatAddress(recipient: EmailRecipient): string {
        return recipient.name
            ? `\"${recipient.name}\" <${recipient.address}>`
            : recipient.address;
    }

    private parseBoolean(value: string | undefined, fallback: boolean): boolean {
        if (value === undefined) {
            return fallback;
        }

        const normalized = value.trim().toLowerCase();
        if (["1", "true", "yes", "on"].includes(normalized)) {
            return true;
        }
        if (["0", "false", "no", "off"].includes(normalized)) {
            return false;
        }
        return fallback;
    }
}

/**
 * Singleton instance of the email client
 * @type {EmailClientImpl}
 */
export const emailClient = EmailClientImpl.getInstance();

/**
 * Exported email functions for convenience
 * Note: bind sendEmail so `this` inside the method refers to the client instance.
 */
export const sendEmail = emailClient.sendEmail.bind(emailClient);
export const emailTemplates = emailClient.emailTemplates;
